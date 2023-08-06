// src/Loader.js
import React from 'react';
import './Loader.css';

const Loader = ({ loading }) => {
    return (
        <div className={`loader-container ${loading ? '' : 'done'}`}>
            <div className={`loader ${loading ? '' : 'done'}`}></div>
        </div>
    );
};

export default Loader;
