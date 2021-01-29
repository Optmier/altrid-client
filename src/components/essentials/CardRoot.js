import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import classNames from 'classnames';
import styled from 'styled-components';

const StyleDiv = styled.div`
    height: ${(props) => (props.wider ? 'auto' : props.cardHeight)};
`;

function CardRoot({ wider, children, cardHeight }) {
    return (
        <Grid item className={classNames('card-root-grid', wider ? 'wider' : '')}>
            <StyleDiv cardHeight={cardHeight} wider={wider} className={classNames('card-root', wider ? 'wider' : '')}>
                {children}
            </StyleDiv>
        </Grid>
    );
}

CardRoot.defaultProps = {
    wider: false,
    cardHeight: '240px',
};

export default CardRoot;
