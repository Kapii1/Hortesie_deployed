const express = require("express");
const path = require("path");
const app = express();
const hostname = "127.0.0.1";

require("dotenv").config();
const cors = require("cors");
const PORT = 3001;
const sqlite3 = require("sqlite3").verbose();
const multer = require("multer");
const fs = require("fs");
const helmet = require("helmet");
app.use(helmet());
const db = new sqlite3.Database("base.db");
const s4 = () => {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
process.env.NODE_ENV = "production";
const URL_DEST = require("./url_back").URL_DEST;
const dir_vignette = URL_DEST + "images/vignettes/";
console.log(URL_DEST);
const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, decoded) {
        if (err) {
          console.log("expired");
          return "expired";
        }
      }
    );
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

const Log = async (req, res) => {
  db.all(
    "SELECT * from mdp where username=?",
    [req.body.username],
    async function (err, rows) {
      console.log(rows);

      if (rows.length == 0) {
        return res.status(400).json({ msg: "Wrong Password" });
      }
      if (rows.length > 0) {
        const saltRounds = 10;
        const pw = req.body.password;
        const bcryptPassword = await bcrypt.hashSync(pw, 10);
        const match = await bcrypt.compare(req.body.password, rows[0].mdp);

        if (!match) return res.status(400).json({ msg: "Wrong Password" });

        const name = rows[0].username;
        const mdp = rows[0].mdp;
        const token = jwt.sign({ name }, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "2h",
        });

        res.cookie("token", token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).json({ name: name, token: token });
      }
    }
  );
};

const storage_vignette = multer.diskStorage({
  destination: URL_DEST + "images/vignettes/",
  filename: (req, file, cb) => {
    console.log("enter file");
    const files = fs.readdirSync(dir_vignette);
    for (i in files) {
      if (files[i].includes(req.body.idProjet)) {
        console.log("in del file", dir_vignette, files[i]);
        fs.unlinkSync(dir_vignette + files[i]);
      }
    }
    db.all(`UPDATE projets_corrected SET vignette = ? WHERE id= ?  `, [
      "images/vignettes/" + req.body.idProjet + "_" + file.originalname,
      req.body.idProjet,
    ]);
    cb(null, req.body.idProjet + "_" + file.originalname);
  },
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, URL_DEST + "images/projets/" + req.body.idProjet);
  },
  filename: (req, file, cb) => {
    let id = file.originalname;
    let name = file.originalname;
    let path = "images/projets/" + req.body.idProjet + "/" + name;

    db.all(`INSERT INTO photos VALUES (?,?,?)`, [id, req.body.idProjet, path]);
    cb(null, name);
  },
});

const uploads = multer({ storage: storage }).array("file");

const upload_vignette = multer({ storage: storage_vignette });
app.use("/static", express.static(path.join(__dirname, "/static")));
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.get("/", function (req, res, next) {
  console.log(req.originalUrl);

  res.send("API is working properly");
});
app.all("/secret", (req, res, next) => {
  console.log("Accessing the secret section ...");
  next(); // pass control to the next handler
});
app.get("/projets", (req, res) => {
  console.log("nice");
  db.all("SELECT * FROM projets_corrected", function (err, rows) {
    var output = [];
    if (err) {
      console.log(err);
    } else {
      if (rows.length === 0) {
        res.send("Empty database");
      } else {
        rows.forEach(function (row) {
          output.push({
            id: row.id,
            nom: row.titre,
            catergorie: row.catergorie,
            date: row.date,
            type: row.type,
            vignette: row.vignette,
            description: row.description_fr,
            ville: row.ville,
          });
        });
        res.send(output);
      }
    }
  });
});
app.get("/projets/:id", (req, res) => {
  var output = [];
  console.log("id is " + req.params.id);
  db.all(
    "SELECT * from projets_corrected WHERE id ='" + req.params.id + "'",
    function (err, rows) {
      if (err) {
        console.log(err);
      } else {
        if (rows.length === 0) {
        } else {
          rows.forEach(function (row) {
            output.push({
              id: row.id,
              nom: row.titre,
              catergorie: row.catergorie,
              date: row.date,
              type: row.type,
              vignette: row.vignette,
              description: row.description_fr,
              ville: row.ville,
              annee: row.date,
            });
          });
        }
      }
    }
  );
  db.all(
    "SELECT nom FROM photos WHERE idProjet='" + req.params.id + "'",
    function (err, rows) {
      if (err) {
        console.log(err);
      } else {
        if (rows.length === 0) {
          console.log("bug", req.params.id);
          output.push({ nom: "" });
        } else {
          rows.forEach(function (row) {
            output.push({
              nom: row.nom,
            });
          });
        }
      }
      res.send(output);
    }
  );
});
app.post("/save_modif_project", (req, res) => {
  const id = req.body.id;
  const nom = req.body.nom;
  const ville = req.body.ville;
  const images = req.body.images;
  const date = req.body.annee;
  var description = req.body.description;
  const vignette = req.body.vignette;

  let s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };

  console.log(id, nom, ville, images, vignette);
  db.all("DELETE FROM projets_corrected WHERE id='" + id + "'");
  // db.all(`INSERT INTO projets_corrected VALUES ('${id}','${nom}','','${date}','projet','${vignette}','','','${description}','','','${nom}','','','${description}','','','${nom}','${ville}','France')`)
  db.all(
    `INSERT INTO projets_corrected VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      id,
      nom,
      "",
      date,
      "projet",
      vignette,
      "",
      "",
      description,
      "",
      "",
      nom,
      "",
      "",
      description,
      "",
      nom,
      ville,
      "France",
    ]
  );

  console.log("done add");
  db.all(`DELETE FROM photos WHERE idProjet='${id}'`);

  images.forEach((img, i) => {
    img_id = s4() + s4() + s4();
    db.all(`INSERT INTO photos VALUES (?,?,?)`, [img_id, id, img]);
  });
  res.send({ msg: "done" });
});

app.use("/login", Log);
app.post("/add_image", (req, res) => {
  var list_of_ids = [];
  uploads(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log("b", req.files);
      // A Multer error occurred when uploading.
    } else if (err) {
      console.log(err);
      // An unknown error occurred when uploading.
    }

    req.files.forEach((file) => {
      list_of_ids.push(file.path.replace(URL_DEST, ""));
    });

    res.send(JSON.stringify(list_of_ids));
    // Everything went fine.
  });
});

app.post(
  "/add_vignette",
  upload_vignette.array("file_vignette"),
  async (req, res) => {
    if (req.files.length > 0) {
      res.send(req.files[0].path.replace(URL_DEST, ""));
    }
  }
);

app.post("/set_vignette", async (req, res) => {
  console.log("enter", req.body);
  db.all(`UPDATE projets_corrected SET vignette = ? WHERE id= ?  `, [
    req.body.path_vignette,
    req.body.idProjet,
  ]);
  res.send({ msg: "Worked!" });
});

app.post("/welcome_admin", verifyToken, (req, res) => {
  if (req.user == "expired") {
    console.log("expired welcome");
    res.status(401).send("not good");
    return;
  }
  res.status(200).send("Welcome 🙌 ");
});

app.post("/del_image", (req, res) => {
  fs.unlinkSync(URL_DEST + req.body.img);
  db.all("DELETE FROM photos WHERE id=?", [req.body.id]);
  console.log("le body", req.body);
  res.sendStatus(200);
});

app.post("/add_project", (req, res) => {
  console.log("Adding project " + req.body.id);
  db.all(
    "SELECT * FROM projets_corrected WHERE id=?",
    [req.body.id],
    (err, rows) => {
      if (rows.length == 0) {
        console.log("creation");
        db.all(
          "INSERT INTO projets_corrected VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            req.body.id,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ],
          (err, rows) => {
            console.log("ici" + err);
          }
        );
        const folderName = URL_DEST + "images/projets/" + req.body.id;
        if (!fs.existsSync(folderName)) {
          console.log("Creating folder : ", folderName);
          fs.mkdirSync(folderName);
        }
        console.log("created");
        res.send({ msg: "creation" });
      }
    }
  );
});

app.post("/del_projet", (req, res) => {
  console.log("before req body");
  console.log("idd to del is ", req.body);
  if (req.body.id === null) return;
  db.all(`DELETE FROM photos WHERE idProjet=?`, [req.body.id]);
  db.all(`DELETE FROM projets_corrected WHERE id=?`, [req.body.id]);

  const dir = URL_DEST + "images/projets/" + req.body.id;
  console.log(dir);
  fs.rm(dir, { recursive: true }, (err) => {
    if (err) {
      throw err;
    }

    console.log(`${dir} is deleted!`);
    const files = fs.readdirSync(dir_vignette);
    for (i in files) {
      if (files[i].includes(req.body.id)) {
        fs.unlinkSync(dir_vignette + files[i]);
      }
    }
  });
  console.log("sending");
  res.send({ msg: "deleted" });
});
app.listen(PORT, console.log(`Server started on port ${PORT}`));
