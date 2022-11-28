import React from "react";
import './Contact.css';
export function Contact(props){
    return(
        
        <div className="contact-container">
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
            </div>
        </div>
    )
}