import React from 'react';
import '../../styles/test_report.scss';
import shareDummy from '../../datas/shareDummy.json';
import BranchNav from '../essentials/BranchNav';
import ClassWrapper from '../essentials/ClassWrapper';
import CardContentBottom from '../essentials/CardContentBottom';

function TestReport({ match }) {
    let { classNum } = match.params;
    return (
        <ClassWrapper>
            <div className="class-report-root">
                <BranchNav deps="2" />

                <div className="class-report-info">
                    <div className="report-box">
                        <div className="report-col">
                            <CardContentBottom type="eye" able={shareDummy[classNum]['age']} align="left" />
                        </div>
                        <div className="report-col">
                            <h3>{shareDummy[classNum]['title']}</h3>
                        </div>
                        <div className="report-col">
                            <p>{shareDummy[classNum]['desc']}</p>
                        </div>
                        <div className="report-col">
                            <p>{shareDummy[classNum]['age']}</p>
                        </div>
                    </div>
                    <div className="report-box">
                        <h3>{shareDummy[classNum]['title']}</h3>
                        <div>{shareDummy[classNum]['desc']}</div>
                        <div>{shareDummy[classNum]['age']}</div>
                    </div>
                    <div className="report-smallbox">
                        <h3>{shareDummy[classNum]['title']}</h3>
                        <div>{shareDummy[classNum]['desc']}</div>
                        <div>{shareDummy[classNum]['age']}</div>
                    </div>
                </div>
            </div>
        </ClassWrapper>
    );
}

export default TestReport;
