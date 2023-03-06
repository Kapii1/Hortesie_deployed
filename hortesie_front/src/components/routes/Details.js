import React, { useEffect, useState } from "react";
import "./Details.css";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { Detail } from "./Detail";
import { API_URL } from "../../url";
function Details() {
  // We can use the `useParams` hook here to access
  // the dynamic pieces of the URL.
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
    <motion.div
      className="Details-container"
      initial={{ y: "100%" }}
      animate={{ y: 1 }}
      transition={{ duration: 0.7 }}
      exit={{ y: "100%" }}
    >
      {items[0] && <Detail item={items} />}
    </motion.div>
  );
}

export default Details;
