import React from 'react';
import { Grid } from '@material-ui/core';
import classNames from 'classnames';
import '../../styles/cards.scss';

function CardLists({ upperDeck, maxColumn, children }) {
    return (
        <>
            <section className={classNames('cards-contents-root', `m-c-${maxColumn}`)}>
                {upperDeck}
                <div className="card-lists">
                    <Grid container spacing={3}>
                        {children}
                    </Grid>
                </div>
            </section>
        </>
    );
}

CardLists.defaultProps = {
    upperDeck: <></>,
    maxColumn: 3,
};

export default CardLists;
