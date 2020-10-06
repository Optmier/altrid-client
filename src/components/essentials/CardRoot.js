import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import classNames from 'classnames';

function CardRoot({ wider, children, cardHeight }) {
    return (
        <Grid item className={classNames('card-root-grid', wider ? 'wider' : '')}>
            <div style={{ height: cardHeight }} className={classNames('card-root', wider ? 'wider' : '')}>
                {children}
            </div>
        </Grid>
    );
}

CardRoot.defaultProps = {
    wider: false,
    cardHeight: '240px',
};

export default CardRoot;
