import React from 'react';
import styled from 'styled-components';
import studentDummy from '../../datas/studentDummy.json';

const StyleTotalProgress = styled.div`
    background-color: white;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 11px;
    padding: 40px 32px;
    height: 250px;
    overflow: auto;
`;

const StyleTestSquareList = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;

    & + & {
        margin-top: 14px;
    }
    & .name {
        font-size: 1rem;
        font-weight: 500;
        margin-right: 2rem;
    }
    & .square {
        min-width: 30px;
        width: -webkit-fill-available;
        height: 30px;
        border-radius: 5px;
    }

    & .square + .square {
        margin-left: 5px;
    }
`;

const ProgressList = ({ name, test }) => {
    let testArr = new Array();

    test.split(',').map((i) => {
        i *= 1;
        testArr.push(i);
    });

    return (
        <StyleTestSquareList>
            <div className="name">{name}</div>

            {testArr.map((i, idx) =>
                i === 1 ? (
                    <div key={idx} className="square" style={{ backgroundColor: '#13E2A1' }}></div>
                ) : i ? (
                    <div key={idx} className="square" style={{ backgroundColor: '#E5E5E5' }}></div>
                ) : (
                    <div key={idx} className="square" style={{ backgroundColor: '#FFA552' }}></div>
                ),
            )}
        </StyleTestSquareList>
    );
};
function TotalProgress({ studentList }) {
    return (
        <StyleTotalProgress>
            {Object.keys(studentList).map((num) => (
                <ProgressList key={num} name={studentList[num]['name']} test={studentDummy[num]['test']} />
            ))}
        </StyleTotalProgress>
    );
}

export default TotalProgress;
