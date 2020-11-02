import React from 'react';
import styled from 'styled-components';

const StyleTestSquareList = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    & .square {
        min-width: 30px;
        width: -webkit-fill-available;
        height: 30px;
        border-radius: 5px;
    }

    & .square + .square {
        margin-left: 5px;
    }

    & + & {
        margin-top: 5px;
    }
`;

function Progress({ test }) {
    let testArr = new Array();

    test.map((i) => {
        i *= 1;
        testArr.push(i);
    });

    return (
        <StyleTestSquareList>
            {testArr.map((i, idx) =>
                i === 1 ? (
                    <div key={idx} className="square" style={{ backgroundColor: '#13E2A1' }}></div>
                ) : i === 0 ? (
                    <div key={idx} className="square" style={{ backgroundColor: '#FFA552' }}></div>
                ) : i === -1 ? (
                    <div key={idx} className="square" style={{ backgroundColor: '#E5E5E5' }}></div>
                ) : (
                    <div key={idx} className="square" style={{ backgroundColor: '#f7f9f8' }}></div>
                ),
            )}
        </StyleTestSquareList>
    );
}

export default Progress;
