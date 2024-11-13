import React, { useEffect, useState } from "react";
import "./Details.css";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { Detail } from "./Detail";
import { API_URL } from "../../url";
function Details() {
  const [item, setItem] = useState();
  let { id } = useParams();

  async function fetchData() {
    const res = await fetch(API_URL + `/projects/${id}/` , { 
      method: "GET",
    });
    res.json().then((res) => {
      setItem(res);
    })

  }
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div
      className="Details-container"
    >
      {item && <Detail item={item} />}
    </div>
  );
}

export default Details;
