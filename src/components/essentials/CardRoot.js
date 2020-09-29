import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import classNames from 'classnames';
import * as $ from 'jquery';

function CardRoot({ wider, children }) {
    return (
        <Grid item className={classNames('card-root-grid', wider ? 'wider' : '')}>
            <div className={classNames('card-root', wider ? 'wider' : '')}>{children}</div>
        </Grid>
    );
}

CardRoot.defaultProps = {
    wider: false,
};

export default CardRoot;
