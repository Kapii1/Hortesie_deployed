import React, { useEffect, useState } from "react";
import "./Details.css";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { Detail } from "./Detail";
import { API_URL } from "../../url";
function Details() {
  const [items, updateItems] = useState({});
  let { id } = useParams();

  async function fetchData() {
    const res = await fetch(API_URL + "/projets/" + id, {
      method: "GET",
    });
    res.json().then((res) => {
      updateItems(res);
    })

  }


  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div
      className="Details-container"
    >
      {items[0] && <Detail item={items} />}
    </div>
  );
}

export default Details;
