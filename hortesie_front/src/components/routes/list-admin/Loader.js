// src/Loader.js
import React from 'react';
import './Loader.css';

const Loader = ({ loading, compact = false }) => {
    return (
        <div className={`loader-container ${loading ? '' : 'done'} ${compact ? 'compact' : ''}`}>
            <div className={`loader ${loading ? '' : 'done'}`}></div>
        </div>
    );
};

export default Loader;
