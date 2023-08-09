import React from "react";
import './Contact.css';
import { Helmet } from "react-helmet-async";

export function Contact(props) {
    return (

        <div className="contact-container">
            <Helmet>
                <title>{"Hortésie : Projets"}</title>
                <link rel="canonical" href={"https://hortesie.fr/contact"} />
            </Helmet>
            <div className="grid-container">
                <div className="titre">
                    Téléphone :
                </div>
                <div className="contact-data">
                    01 30 39 24 88
                </div>
                <div className="titre">
                    Mail :
                </div>
                <div className="contact-data">
                    hortesie[at]hortesie.biz
                </div>
                <div className="titre">
                    Adresse :
                </div>
                <div className="contact-data">
                    11 rue des Saules,
                    95450 Vigny France
                </div>
                <div className="titre">
                    LinkedIn :
                </div>
                <div className="contact-data">
                    <a href="https://www.linkedin.com/company/hort%C3%A9sie/" className="linkdin" target="_blank">
                        <img src={require("./icons8-linkedin-48.png")} />
                        Hortesie</a>
                </div>
            </div>
        </div>
    )
}