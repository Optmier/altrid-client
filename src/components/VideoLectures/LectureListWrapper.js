import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import * as $ from 'jquery';

const StyleWrapper = styled.div`
    padding: 0 16px;
    margin: 0 auto;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: ${(props) => (props.col ? 'column' : 'none')};

    ${(props) =>
        props.type === 'main_page'
            ? css`
                  @media (min-width: 992px) and (max-width: 1231px) {
                      max-width: 960px;
                  }
                  @media (min-width: 663px) and (max-width: 991px) {
                      max-width: 632px;
                  }
              `
            : css`
                  /* @media (min-width: 0px) and (max-width: 1231px) {
                      max-width: 632px;
                  } */
              `}
`;

$.fn.changeSize = function (handleFunction) {
    let element = this;
    let lastWidth = element.width();

    setInterval(function () {
        if (lastWidth === element.width()) return;
        if (typeof handleFunction == 'function') {
            handleFunction({ width: element.width() });
            lastWidth = element.width();
        }
    }, 50);

    return element;
};

const cardSizer = (dt) => {
    if (!dt.width) return;
    if (dt.width >= 992) {
        $('#vid-lecture-wrapper').css({ width: '960px' });
        $('#vid-lecture-wrapper').removeAttr('id', 'responsive-tablet');
        $('#vid-lecture-wrapper').removeAttr('id', 'responsive-mobile');
    } else if (dt.width >= 663 && dt.width < 992) {
        $('#vid-lecture-wrapper').css({ width: '632px' });
        $('.class-report-root').removeAttr('id', 'responsive-mobile');
        $('.class-report-root').attr('id', 'responsive-tablet');
        $('.student-report-root').removeAttr('id', 'responsive-mobile');
        $('.student-report-root').attr('id', 'responsive-tablet');
    } else {
        $('#vid-lecture-wrapper').css({ width: 'initial' });
        $('.class-report-root').removeAttr('id', 'responsive-tablet');
        $('.class-report-root').attr('id', 'responsive-mobile');
        $('.student-report-root').removeAttr('id', 'responsive-tablet');
        $('.student-report-root').attr('id', 'responsive-mobile');
    }
};

function LectureListWrapper({ children, col, type }) {
    useEffect(() => {
        let $wrapperParent = $('#vid-lecture-wrapper').parent();

        cardSizer({ width: $wrapperParent.width() });
        setTimeout(() => {
            $wrapperParent.changeSize((dt) => {
                cardSizer(dt);
            });
        }, 250);
    }, []);

    return (
        <StyleWrapper col={col} type={type} id="vid-lecture-wrapper">
            {children}
        </StyleWrapper>
    );
}

LectureListWrapper.defaultProps = {
    col: false,
};

export default LectureListWrapper;
