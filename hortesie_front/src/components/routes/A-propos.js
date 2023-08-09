import React from "react";
import "./A-propos.css";
import { Helmet } from "react-helmet-async";
export const Apropos = (props) => {
    return (
        <div className="container-page">
            <Helmet>
                <title>{"Hortésie : Projets"}</title>
                <link rel="canonical" href={"https://hortesie.fr/a-propos"} />
            </Helmet>
            <div className="a-propos-container">
                L’Agence Hortésie développe depuis trente ans des projets de paysage.s : conception, maîtrise d’œuvre, études et conseils pour l’aménagement des espaces publics et des territoires.
                L’agence allie la conception, l’expertise technique, l’économie de l’aménagement et la direction de chantier.

            </div>
            <div className="a-propos-container">Elle intervient aussi bien au niveau des études préalables, des études de planification, des prestations de conseil, des montages de dossiers de financements, des études opérationnelles, mais aussi de l’évaluation des politiques publiques.
                L’agence positionne sa démarche de projet de paysage en synergie avec les engagements nationaux pour la biodiversité et la nature en ville. Elle conçoit le projet en intégrant la nature comme une ressource à valoriser et une inspiration à l’intelligence de la ville.

            </div>
            <div className="a-propos-container">L’approche de l’urbanisme de l’agence a pour but de favoriser et de faciliter la prise en compte des enjeux environnementaux dans l’aménagement, en contribuant à l’élaboration des politiques urbaines locales,
                à la planification, ou aux projets d’aménagement, notamment lorsque sont décidés les choix stratégiques.
            </div>
            <div className="a-propos-container">  L’agence intervient aussi bien dans les contextes urbains, périurbains, dans les contextes ruraux mais aussi d’activités économiques, les environnements routiers, ou dans des situations de milieux naturels.
                Elle associe la préoccupation environnementale à celle de la qualité du cadre de vie pour tous.
            </div>
            <div className="a-propos-container"> Un projet ou de planification se conçoit en agissant sur l’ensemble des composantes de l’environnement : les dimensions patrimoniales naturelles ou culturelles, architecturales et paysagères. Il se situe toujours dans le contexte plus large de développement durable du territoire urbain, rural ou naturel dans lequel il se situe.

            </div>
            <div className="a-propos-container">L’agence explore toutes les dimensions qualitatives, fonctionnelles, réglementaires et techniques de l’espace ou des territoires existants à partir desquelles les idées fortes d’un projet sont développées, à l’écoute des usagers et des sites analysées.

            </div>
            <div className="a-propos-container">Qualité esthétique des espaces et qualité des paysages : Intégrer et proposer des critères de qualité et de conception environnementale et paysagère dans la continuité de la mise en oeuvre des ouvrages conçus par une ingénierie paysagère : implantation, topographie, nivellement et dimensionnement des composants du projet, utilisation des ressources naturelles (eau, végétation, matériaux), valorisation de la biodiversité et des milieux, génie écologique mais aussi sols, matériaux et mobiliers, lumières.

                Technicité : assurer la conception technique et la gestion durable des ouvrages de voiries, d’assainissement et de réseaux divers ; adapter nos concepts d’aménagement de l’espace et d’intégration de l’environnement au programme d’aménagement du maître d’ouvrage.

                Economie de projet : valorisation des ressources, maîtrise et gestion des projets et des chantiers. Le groupement des deux agences permet d’offrir aux clients des prestations complètes en matière d’aménagement des espaces extérieurs.
            </div>
        </div>
    )
}
