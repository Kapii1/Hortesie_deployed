import React from "react";
import "./A-propos.css";
import { Helmet } from "react-helmet-async";
import {CANONICAL_BASE} from "../../url";

export const Apropos = (props) => {
    return (
        <div className="container-page">
            <Helmet>
                <title>{"Hortésie : À propos"}</title>
                <link rel="canonical" href={`${CANONICAL_BASE}/a-propos`} />
            </Helmet>

            <section className="intro-section">
                <p className="intro-text">
                    L'Agence Hortésie développe depuis trente ans des projets de paysage.s : conception, maîtrise d'œuvre, études et conseils pour l'aménagement des espaces publics et des territoires.
                    L'agence allie la conception, l'expertise technique, l'économie de l'aménagement et la direction de chantier.
                </p>
            </section>

            <section className="expertise-section">
                <h2 className="section-title">Notre expertise</h2>
                <p className="section-content">
                    Elle intervient aussi bien au niveau des études préalables, des études de planification, des prestations de conseil, des montages de dossiers de financements, des études opérationnelles, mais aussi de l'évaluation des politiques publiques.
                    L'agence positionne sa démarche de projet de paysage en synergie avec les engagements nationaux pour la biodiversité et la nature en ville. Elle conçoit le projet en intégrant la nature comme une ressource à valoriser et une inspiration à l'intelligence de la ville.
                </p>
            </section>

            <section className="approach-section">
                <h2 className="section-title">Approche environnementale</h2>
                <p className="section-content">
                    L'approche de l'urbanisme de l'agence a pour but de favoriser et de faciliter la prise en compte des enjeux environnementaux dans l'aménagement, en contribuant à l'élaboration des politiques urbaines locales,
                    à la planification, ou aux projets d'aménagement, notamment lorsque sont décidés les choix stratégiques.
                </p>
            </section>

            <section className="intervention-section">
                <h2 className="section-title">Domaines d'intervention</h2>
                <p className="section-content">
                    L'agence intervient aussi bien dans les contextes urbains, périurbains, dans les contextes ruraux mais aussi d'activités économiques, les environnements routiers, ou dans des situations de milieux naturels.
                    Elle associe la préoccupation environnementale à celle de la qualité du cadre de vie pour tous.
                </p>
            </section>

            <section className="methodology-section">
                <h2 className="section-title">Méthodologie de projet</h2>
                <p className="section-content">
                    Un projet ou de planification se conçoit en agissant sur l'ensemble des composantes de l'environnement : les dimensions patrimoniales naturelles ou culturelles, architecturales et paysagères. Il se situe toujours dans le contexte plus large de développement durable du territoire urbain, rural ou naturel dans lequel il se situe.
                </p>
                <p className="section-content">
                    L'agence explore toutes les dimensions qualitatives, fonctionnelles, réglementaires et techniques de l'espace ou des territoires existants à partir desquelles les idées fortes d'un projet sont développées, à l'écoute des usagers et des sites analysées.
                </p>
            </section>

            <section className="competences-section">
                <h2 className="section-title">Nos compétences</h2>
                
                <div className="competence-item">
                    <h3 className="subsection-title">Qualité esthétique des espaces et qualité des paysages</h3>
                    <p className="subsection-content">
                        Intégrer et proposer des critères de qualité et de conception environnementale et paysagère dans la continuité de la mise en oeuvre des ouvrages conçus par une ingénierie paysagère : implantation, topographie, nivellement et dimensionnement des composants du projet, utilisation des ressources naturelles (eau, végétation, matériaux), valorisation de la biodiversité et des milieux, génie écologique mais aussi sols, matériaux et mobiliers, lumières.
                    </p>
                </div>

                <div className="competence-item">
                    <h3 className="subsection-title">Technicité</h3>
                    <p className="subsection-content">
                        Assurer la conception technique et la gestion durable des ouvrages de voiries, d'assainissement et de réseaux divers ; adapter nos concepts d'aménagement de l'espace et d'intégration de l'environnement au programme d'aménagement du maître d'ouvrage.
                    </p>
                </div>

                <div className="competence-item">
                    <h3 className="subsection-title">Économie de projet</h3>
                    <p className="subsection-content">
                        Valorisation des ressources, maîtrise et gestion des projets et des chantiers. Le groupement des deux agences permet d'offrir aux clients des prestations complètes en matière d'aménagement des espaces extérieurs.
                    </p>
                </div>
            </section>
        </div>
    )
}