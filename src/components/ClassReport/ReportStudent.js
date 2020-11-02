import React from 'react';
import { withRouter } from 'react-router-dom';
import BranchNav from '../essentials/BranchNav';
import ClassWrapper from '../essentials/ClassWrapper';
import studentDummy from '../../datas/studentDummy.json';
import Progress from './Progress';
import styled from 'styled-components';
import StudentTypeScore from './StudentTypeScore';
import MoreBox from '../essentials/MoreBox';
import EyeTrackBox from './EyeTrackBox';
import { Tooltip } from '@material-ui/core';
import TimeTrackBox from './TimeTrackBox';

const StyleItems = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;

    font-size: 1rem;
    color: #706d6d;
    font-weight: 400;

    & + & {
        margin-top: 1.25rem;
    }
    & .header-title {
        font-weight: 600;
        width: 100px;
        margin-left: 10px;
    }
`;

const StyleArrowButton = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;

    & > p {
        margin: 0 1rem 0 0;
        font-size: 1rem;
        color: black;
        font-weight: 500;
    }
`;

const InfoItems = ({ title, contents, children }) => {
    return (
        <StyleItems>
            {children}
            <div className="header-title">{title}</div>
            <div>{contents}</div>
        </StyleItems>
    );
};
const ScoreItems = ({ title, score, total, children }) => {
    let percent = (score / total) * 100;
    return (
        <StyleItems>
            {children}
            <div className="header-title">{title}</div>
            {score === '-' ? (
                <div>{score}</div>
            ) : (
                <>
                    <div>
                        {score}문제 / {total}문제
                    </div>
                    <div style={{ color: '#13e2a1', paddingLeft: '5px' }}>({percent}%)</div>
                </>
            )}
        </StyleItems>
    );
};
const CompareItems = ({ title, contents, children }) => {
    return (
        <StyleItems>
            {children}
            <div className="header-title">{title}</div>
            {contents[0] === '-' ? (
                <div style={{ fontSize: '30px', color: '#F57C7C', fontWeight: '400' }}>- {contents[1]} %</div>
            ) : contents[0] === '0' ? (
                <div style={{ fontSize: '30px', color: '#C4C4C4', fontWeight: '400' }}>0 %</div>
            ) : (
                <div style={{ fontSize: '30px', color: '#7C88F5', fontWeight: '400' }}>+ {contents[1]} %</div>
            )}
        </StyleItems>
    );
};

//배열 원하는 길이만큼 2차원 배열로 만들기
const division = (arr, n) => {
    let len = arr.length;
    let cnt = Math.floor(len / n) + (Math.floor(len % n) > 0 ? 1 : 0);
    let tmp = [];
    let last_tmp = [];

    for (let i = 0; i < cnt; i++) {
        if (arr.length >= n) {
            tmp.push(arr.splice(0, n));
        } else {
            for (let j = 0; j < arr.length; j++) {
                last_tmp.push(arr[j]);
            }
            for (let k = arr.length; k < n; k++) {
                last_tmp.push('-2');
            }
        }
    }

    tmp.push(last_tmp);
    console.log(tmp);
    return tmp;
};
function ReportStudent({ match }) {
    let { studentNum } = match.params;
    let testSquareArr = division(studentDummy[studentNum]['test'].split(','), 16);

    //console.log(testSquareArr.map((i) => console.log(i)));

    return (
        <ClassWrapper col={true}>
            <BranchNav deps="3" />
            <div className="student-report-root">
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
                        {testSquareArr.map((arr, idx) => (
                            <Progress key={idx} test={arr} />
                        ))}

                        <div className="right-bottom">
                            <div className="right-bottom-col">
                                <InfoItems title={'제출 날짜'} contents={studentDummy[studentNum]['submit_date']}>
                                    <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M5.33333 8H3.55556V9.77778H5.33333V8ZM8.88889 8H7.11111V9.77778H8.88889V8ZM12.4444 8H10.6667V9.77778H12.4444V8ZM14.2222 1.77778H13.3333V0H11.5556V1.77778H4.44444V0H2.66667V1.77778H1.77778C0.791111 1.77778 0.00888888 2.57778 0.00888888 3.55556L0 16C0 16.9778 0.791111 17.7778 1.77778 17.7778H14.2222C15.2 17.7778 16 16.9778 16 16V3.55556C16 2.57778 15.2 1.77778 14.2222 1.77778ZM14.2222 16H1.77778V6.22222H14.2222V16Z"
                                            fill="#706D6D"
                                        />
                                    </svg>
                                </InfoItems>
                                <InfoItems title={'소요 시간'} contents={studentDummy[studentNum]['test_time']}>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M11.392 4.608C10.456 3.672 9.232 3.2 8 3.2V8L4.608 11.392C6.48 13.264 9.52 13.264 11.4 11.392C13.272 9.52 13.272 6.48 11.392 4.608ZM8 0C3.584 0 0 3.584 0 8C0 12.416 3.584 16 8 16C12.416 16 16 12.416 16 8C16 3.584 12.416 0 8 0ZM8 14.4C4.464 14.4 1.6 11.536 1.6 8C1.6 4.464 4.464 1.6 8 1.6C11.536 1.6 14.4 4.464 14.4 8C14.4 11.536 11.536 14.4 8 14.4Z"
                                            fill="#706D6D"
                                        />
                                    </svg>
                                </InfoItems>
                            </div>
                            <div className="right-bottom-col">
                                <ScoreItems
                                    title={'점수'}
                                    score={studentDummy[studentNum]['score']}
                                    total={studentDummy[studentNum]['total']}
                                >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M14.2222 0H1.77778C0.8 0 0 0.8 0 1.77778V14.2222C0 15.2 0.8 16 1.77778 16H14.2222C15.2 16 16 15.2 16 14.2222V1.77778C16 0.8 15.2 0 14.2222 0ZM5.33333 12.4444H3.55556V6.22222H5.33333V12.4444ZM8.88889 12.4444H7.11111V3.55556H8.88889V12.4444ZM12.4444 12.4444H10.6667V8.88889H12.4444V12.4444Z"
                                            fill="#706D6D"
                                        />
                                    </svg>
                                </ScoreItems>
                                <CompareItems title={'비교 성취도'} contents={studentDummy[studentNum]['compare']}>
                                    <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11 14.01V7H9V14.01H6L10 18L14 14.01H11ZM4 0L0 3.99H3V11H5V3.99H8L4 0Z" fill="#706D6D" />
                                    </svg>
                                </CompareItems>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="class-report-title">유형별 정답률</div>
                <section>
                    <StudentTypeScore />

                    <StyleArrowButton>
                        <p>관찰데이터 확인하기</p>
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M1.41 0.589844L6 5.16984L10.59 0.589844L12 1.99984L6 7.99984L0 1.99984L1.41 0.589844Z"
                                fill="#2E2C2C"
                            />
                        </svg>
                    </StyleArrowButton>
                </section>

                <section className="student-report-observe">
                    <div className="ment-ai observe-ment">
                        <b>최준영</b> 학생은 풀이 중 <br />
                        <b className="underline">총 9문제</b>에서 답 변경을 한 후, <br />그 중 <b className="underline">4문제</b>가 오답
                        처리되었습니다.
                    </div>
                    <div className="observe-box">
                        <MoreBox />
                    </div>
                </section>

                <div className="class-report-title">
                    <div>시선 흐름 분석</div>
                    <Tooltip title="설명 설명 설명 설명">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M8 16C12.416 16 16 12.416 16 8C16 3.584 12.416 0 8 0C3.584 0 0 3.584 0 8C0 12.416 3.584 16 8 16ZM7.2 4L8.8 4L8.8 8.8H7.2L7.2 4ZM7.2 10.4H8.8V12H7.2V10.4Z"
                                fill="#A9ACAF"
                            />
                        </svg>
                    </Tooltip>
                </div>
                <section className="student-report-eyetrack">
                    <EyeTrackBox />
                </section>

                <div className="class-report-title">
                    <div>문제별 시간 분석</div>
                    <Tooltip title="설명 설명 설명 설명">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M8 16C12.416 16 16 12.416 16 8C16 3.584 12.416 0 8 0C3.584 0 0 3.584 0 8C0 12.416 3.584 16 8 16ZM7.2 4L8.8 4L8.8 8.8H7.2L7.2 4ZM7.2 10.4H8.8V12H7.2V10.4Z"
                                fill="#A9ACAF"
                            />
                        </svg>
                    </Tooltip>
                </div>
                <section className="student-report-timetrack">
                    <TimeTrackBox />
                </section>
            </div>
        </ClassWrapper>
    );
}

export default withRouter(ReportStudent);
