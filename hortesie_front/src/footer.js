import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';


export default function Footer() {
    return (
        <MDBFooter bgColor='light' className='text-center text-lg-start text-muted'>


            <section className=''>
                <MDBContainer className='text-center text-md-start mt-5'>
                    <MDBRow className='mt-3'>
                        <MDBCol md="3" lg="4" xl="3" className='mx-auto mb-4'>

                            <img className="logo-footer" src={require('./logo.png')}></img>

                        </MDBCol>

                        <MDBCol md="2" lg="2" xl="2" className='mx-auto mb-4'>
                            <h6 className='text-uppercase fw-bold mb-4'>Articles</h6>
                            <p>
                                <a href='/doc/apce15ans.pdf' target="_blank" className='text-reset'>
                                    Paysagistes conseil te
                                </a>
                            </p>
                            <p>
                                <a href='/doc/guidaction130319_cle13f738.pdf' target="_blank" className='text-reset'>
                                    Guide action pour la publicité dans les paysages des Yvelines
                                </a>
                            </p>
                        </MDBCol>

                        <MDBCol md="3" lg="2" xl="2" className='mx-auto mb-4'>
                            <h6 className='text-uppercase fw-bold mb-4'>Liens utiles</h6>
                            <p>
                                <a href='/a-propos' className='text-reset'>
                                    A propos
                                </a>
                            </p>
                            <p>
                                <a href='/projets' className='text-reset'>
                                    Projets
                                </a>
                            </p>
                            <p>
                                <a href='/contact' className='text-reset'>
                                    Contact
                                </a>
                            </p>
                        </MDBCol>

                        <MDBCol md="4" lg="3" xl="3" className='mx-auto mb-md-0 mb-4'>
                            <h6 className='text-uppercase fw-bold mb-4'>Contact</h6>
                            <p>
                                <MDBIcon icon="home" className="me-2" />
                                11 rue des Saules, 95450 Vigny
                            </p>
                            <p>
                                <MDBIcon icon="envelope" className="me-3" />
                                hortesie[at]hortesie.biz
                            </p>
                            <p>
                                <MDBIcon icon="phone" className="me-3" /> 01 30 39 24 88
                            </p>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </section>

        </MDBFooter>
    );
}