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
      if (rows.length == 0) {
        return res.status(400).json({ msg: "Wrong Password" });
      }
      if (rows.length > 0) {
        const match = await bcrypt.compare(req.body.password, rows[0].mdp);

        if (!match) return res.status(400).json({ msg: "Wrong Password" });

        const name = rows[0].username;
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


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, URL_DEST + "images/projets/" + req.body.idProjet);
  },
  filename: (req, file, cb) => {
    var id = s4() + s4() + s4();
    db.all(
      `SELECT * from photos WHERE id= ?`,
      [id],
      (err, rows) => {
        if (rows.length !== 0) {
          id = s4() + s4() + s4();
        }
      }
    )
    let name = file.originalname;
    let path = "images/projets/" + req.body.idProjet + "/" + name;
    console.log("Update in project ", req.body.idProjet, " new photo : ", name, " stored : ", path);
    db.all(
      `INSERT INTO photos VALUES (?,?,?)`,
      [id, req.body.idProjet, path],
      (err, rows) => {
        if (err) {
          console.log("Error in database adding image : ", err);
        } else {
          console.log("All photos added successfully ", [id, req.body.idProjet, path]);
        }
      }
    );
    cb(null, name);
  },
});
const doc_file_storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the destination folder where uploaded files will be stored
    cb(null, "/var/tmp/hortesie.fr/hortesie_djangoapp/hortesie_django/files");
  },
  filename: (req, file, cb) => {
    // Set the filename for the uploaded file
    cb(null, "TEMPLATE_WORD_CCTP.docx");
  }
});

const uploads = multer({ storage: storage }).array("file");
const upload_docfile = multer({ storage: doc_file_storage })

app.use("/static", express.static(path.join(__dirname, "/static")));
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.get("/", function (req, res, next) {
  res.send("API is working properly");
});
app.all("/secret", (req, res, next) => {
  console.log("Accessing the secret section ...");
  next();
});

app.get("/projets", (req, res) => {
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
            ordre: row.position,
          });
        });
        res.status(200).send(
          output.sort(function (first, second) {
            return first.ordre - second.ordre;
          })
        );
      }
    }
  });
});

app.get("/projets/:id", (req, res) => {
  var output = [];
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
              ordre: row.position,
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
          output.push({ nom: "" });
        } else {
          rows.forEach(function (row) {
            console.log("row nom", row.nom);
            output.push({
              nom: row.nom,
            });
          });
        }
      }
      res.setHeader('X-Robots-Tag', 'noindex')
      res.status(200).send(output)
    }
  );
});

app.post("/set_new_index", async (req, res) => {
  const old_index = req.body.from_index;
  const new_index = req.body.to_index;
  let id_new = [], id_old = []
  function done_new(row) {
    id_new.push(row[0].id)
  }
  await db.all(`SELECT id, position FROM projets_corrected WHERE position= ? OR position = ?  `, [
    new_index,
    old_index,
  ], (err, rows) => {
    res.status(200).send(JSON.stringify(rows))
  })
})

app.post("/replace_index", async (req, res) => {
  const new_index = req.body.to_index;
  const id = req.body.id
  console.log("Replacing...")
  await db.all(`UPDATE projets_corrected SET position = ? WHERE id= ?`, [
    new_index,
    id,
  ], (err, rows) => {
    res.status(200).send({ msg: "Changed" })
    console.log(err)
  })
})


app.post("/save_modif_project", (req, res) => {
  const id = req.body.id;
  const nom = req.body.nom;
  const ville = req.body.ville;
  const images = req.body.images;
  const date = req.body.annee;
  var description = req.body.description;
  const vignette = req.body.vignette;
  const ordre = req.body.ordre;

  let s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  db.all(`UPDATE projets_corrected 
	  SET titre = ?,
	  date = ?,
	  ville = ?,
	  description_fr = ?,
	  vignette = ?,
	  position = ?
	  WHERE id = ?`, [nom, date, ville, description, vignette, ordre, id]
  )
  res.status(200).send({ msg: "done" });
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
      list_of_ids.push(
        file.path
          .replace(URL_DEST, "")
          .replace("..\\hortesie_front\\public\\", "")
      );
    });

    res.status(200).send(JSON.stringify(list_of_ids));
    // Everything went fine.
  });
});



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
    res.status(401).send("not good");
    return;
  }
  res.status(200).send("Welcome 🙌 ");
});

app.post("/del_image", (req, res) => {
  if (req.body.id === null) { return }

  db.all("DELETE FROM photos WHERE nom=?", [req.body.img]);
  try {
    fs.unlinkSync(URL_DEST + req.body.img);
  }
  catch {

  }
  res.sendStatus(200);
});

app.post("/add_project", (req, res) => {
  console.log("Adding project " + req.body.id);
  db.all(
    "SELECT * FROM projets_corrected WHERE id=?",
    [req.body.id],
    (err, rows) => {
      if (rows.length == 0) {
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
          }
        );
        const folderName = URL_DEST + "images/projets/" + req.body.id;
        if (!fs.existsSync(folderName)) {
          fs.mkdirSync(folderName);
        }
        res.status(200).send({ msg: "creation" });
      }
    }
  );
});

app.post("/del_projet", (req, res) => {
  if (req.body.id === null) return;
  db.all(`DELETE FROM photos WHERE idProjet=?`, [req.body.id]);
  db.all(`DELETE FROM projets_corrected WHERE id=?`, [req.body.id]);

  const dir = URL_DEST + "images/projets/" + req.body.id;
  fs.rm(dir, { recursive: true }, (err) => {
    if (err) {
      throw err;
    }


    const files = fs.readdirSync(dir_vignette);
    for (i in files) {
      if (files[i].includes(req.body.id)) {
        fs.unlinkSync(dir_vignette + files[i]);
      }
    }
  });
  console.log("Deleted project : ", req.body.id)
  res.send({ msg: "deleted" });
});

app.post("/replace_template", upload_docfile.single('file'), (req, res) => {
  const imageName = req.file
  console.log(imageName)
  res.send({ imageName })

})

app.listen(PORT, console.log(`Server started on port ${PORT}`));
