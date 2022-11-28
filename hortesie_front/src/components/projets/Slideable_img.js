import React, { Component } from "react";
import { MenuItem } from "../Navbar/MenuItem";
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import './projets.css'
import axios from 'axios'
const slideImages = [
  {
    url: "images/a12.png",
    caption: 'Slide 1'
  },
];
class Projet extends Component{
  
    constructor() {
      super();
      this.slideRef = React.createRef();
      this.back = this.back.bind(this);
      this.next = this.next.bind(this);
      this.state = {
        current: 0
      };
      
    }
    
    back() {
      this.slideRef.current.goBack();
    }
  
    next() {
      this.slideRef.current.goNext();
    }
    
    

    render() {
      const properties = {
        duration: 5000,
        autoplay: false,
        transitionDuration: 500,
        arrows: true,
        infinite: true,
        easing: "ease",

      }
      ;
      const slideImages = ["/images/arbrr.jpg"];
    
      return (
        <div className="Projet">
          <div className="slide-container">
            <Slide ref={this.slideRef} {...properties}>
              {slideImages.map((each, index) => (
                <div key={index} className="each-slide">
                  <img className="lazy" src={each} alt="sample" />
                </div>
              ))}
            </Slide>
          </div>
  
        </div>
      );
    }
  }

  export default Projet