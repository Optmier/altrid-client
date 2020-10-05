import React from 'react';

const styleWrapper = {
    maxWidth: '980px',
    padding: '0 24px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: 'calc( 100% - 240px )',
};

function ClassWrapper({ children }) {
    return <div style={styleWrapper}>{children}</div>;
}

export default ClassWrapper;
