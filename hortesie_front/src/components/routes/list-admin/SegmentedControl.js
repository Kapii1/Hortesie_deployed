import React, { useState } from 'react';
import './SegmentedControl.scss'; // Create this CSS file for styling

const SegmentedControl = ({ options, selectedOption, onSelect }) => {
    return (
        <div className="segmented-control">
            {options.map(option => (
                <label key={option} className={`segmented-control-option ${selectedOption === option ? 'active' : ''}`}>
                    <input
                        type="radio"
                        name="segmented-control"
                        value={option}
                        checked={selectedOption === option}
                        onChange={() => onSelect(option)}
                    />
                    {option}
                </label>
            ))}
        </div>
    );
};

export default SegmentedControl;
