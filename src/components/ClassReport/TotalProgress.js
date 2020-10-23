import React from 'react';
import styled from 'styled-components';
import studentDummy from '../../datas/studentDummy.json';

const StyleTotalProgress = styled.div`
    background-color: white;
    border-radius: 11px;
    padding: 40px 32px;
`;

const ProgressList = (name, test) => {
    return (
        <div className="list">
            <div className="name">{name}</div>
            <div className="test">{test}</div>
        </div>
    );
};
function TotalProgress({ studentList }) {
    return (
        <StyleTotalProgress>
            {Object.keys(studentList).map((num) =>
                // <ProgressList key={num} name={studentDummy[num]['name']} test={studentDummy[num]['test']} />
                console.log(studentList[num]['name']),
            )}
        </StyleTotalProgress>
    );
}

export default TotalProgress;
