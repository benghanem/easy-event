import React from 'react';

import './LoadingSpinner.css';

const LoadingSpinner = props => {
    return (
        <div className={`${props.overlay && 'loading-spinner__overlay'}`}>
            <div className="lds-dual-ring" />
        </div>
    );
};

export default LoadingSpinner;
