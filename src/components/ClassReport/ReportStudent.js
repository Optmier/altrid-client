import React from 'react';
import { withRouter } from 'react-router-dom';
import BranchNav from '../essentials/BranchNav';
import ClassWrapper from '../essentials/ClassWrapper';
import studentDummy from '../../datas/studentDummy.json';
import Progress from './Progress';

function ReportStudent({ match }) {
    let { studentNum } = match.params;

    return (
        <ClassWrapper>
            <div className="student-report-root">
                <BranchNav deps="3" />

                <section className="student-report-header">
                    <div className="student-report-left">
                        <div className="ment-ai left-top">
                            <b>{studentDummy[studentNum]['name']}</b> 학생의 취약 영역은 <br />
                            <b className="underline">{studentDummy[studentNum]['weak']}</b> 영역입니다.
                        </div>

                        <div className="left-bottom">
                            <b>2번째 취약 영역</b>
                            지시 대상 찾기
                        </div>
                        <div className="left-bottom">
                            <b>3번째 취약 영역</b>
                            지시 대상 찾기
                        </div>
                    </div>

                    <div className="student-report-right">
                        <Progress test={studentDummy[studentNum]['test']} />
                    </div>
                </section>
            </div>
        </ClassWrapper>
    );
}

export default withRouter(ReportStudent);
