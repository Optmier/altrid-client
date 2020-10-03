import React, { useEffect } from 'react';
import * as $ from 'jquery';
import { Grid } from '@material-ui/core';
import classNames from 'classnames';
import '../../styles/cards.scss';

window.$ = $;

$.fn.changeSize = function (handleFunction) {
    let element = this;
    let lastWidth = element.width();
    let lastHeight = element.height();

    setInterval(function () {
        if (lastWidth === element.width() && lastHeight === element.height()) return;
        if (typeof handleFunction == 'function') {
            handleFunction({ width: element.width(), height: element.height() });
            lastWidth = element.width();
            lastHeight = element.height();
        }
    }, 50);

    return element;
};

function CardLists({ upperDeck, maxColumn, children }) {
    useEffect(() => {
        $('.cards-contents-root')
            .parent()
            .changeSize((dt) => {
                if (dt.width >= 992) {
                    $('.cards-contents-root').css({ width: '960px' });
                    $('.card-lists').removeClass('phase-1').removeClass('phase-2');
                } else if (dt.width >= 663 && dt.width < 992) {
                    $('.cards-contents-root').css({ width: '632px' });
                    $('.card-lists').addClass('phase-1').removeClass('phase-2');
                } else {
                    $('.cards-contents-root').css({ width: 'initial' });
                    $('.card-lists').addClass('phase-2').removeClass('phase-1');
                }
            });
    }, []);

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
