import React from 'react';
import '../../styles/test_report.scss';
import shareDummy from '../../datas/shareDummy.json';

function TestReport({ match }) {
    let { classNum } = match.params;

    console.log(shareDummy[classNum]);
    return (
        <>
            <div>{classNum}번째 과제 페이지입니다.</div>
            <div>{shareDummy[classNum]['title']}</div>
            <div>{shareDummy[classNum]['desc']}</div>
            <div>{shareDummy[classNum]['age']}</div>
        </>
    );
}

export default TestReport;
