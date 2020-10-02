import React from 'react';
import Search from '../../images/search.png';

const styleWrapper = {
    display: 'flex',
    alignItems: 'center',
    height: '28px',
};
const styleImg = {
    width: '24px',
    height: '24px',
};
const styleInput = {
    border: 'none',
    marginLeft: '16px',
    fontSize: '16.1px',
    fontWeight: '400',
};

function SearchInput() {
    return (
        <div style={styleWrapper}>
            <img style={styleImg} src={Search} alt="search" />
            <input style={styleInput} placeholder="search" />
        </div>
    );
}

export default SearchInput;
