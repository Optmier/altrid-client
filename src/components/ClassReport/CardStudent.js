import React from 'react';
import '../../styles/class_card.scss';
import studentDummy from '../../datas/studentDummy.json';
import classNames from 'classnames';
import styled from 'styled-components';
import { Link, withRouter } from 'react-router-dom';

const StyleState = styled.div`
    width: 52px;
    height: 22px;
    font-size: 8px;
    color: white;
    border-radius: 11px;
    display: flex;
    align-items: center;
    justify-content: center;

    background-color: ${(props) => (props.complete ? '#28BC8E' : '#C4C4C4')};
`;

const InfoItems = ({ title, contents, children }) => {
    return (
        <div className="card-item-student">
            {children}
            <div className="card-content-title-p">{title}</div>
            <div className="card-content-p">{contents}</div>
        </div>
    );
};
const ScoreItems = ({ title, score, total, children }) => {
    let percent = (score / total) * 100;
    return (
        <div className="card-item-student">
            {children}
            <div className="card-content-title-p">{title}</div>
            {score === '-' ? (
                <div className="card-content-p">{score}</div>
            ) : (
                <>
                    <div className="card-content-p">
                        {score}문제 / {total}문제
                    </div>
                    <div className="card-content-p" style={{ color: '#13e2a1', paddingLeft: '5px' }}>
                        ({percent}%)
                    </div>
                </>
            )}
        </div>
    );
};
const CompareItems = ({ title, contents, children }) => {
    return (
        <div className="card-item-student">
            {children}
            <div className="card-content-title-p">{title}</div>
            {contents[0] === '-' ? (
                <div style={{ fontSize: '30px', color: '#F57C7C', fontWeight: '400' }}>- {contents[1]} %</div>
            ) : contents[0] === '0' ? (
                <div style={{ fontSize: '30px', color: '#C4C4C4', fontWeight: '400' }}>0 %</div>
            ) : (
                <div style={{ fontSize: '30px', color: '#7C88F5', fontWeight: '400' }}>+ {contents[1]} %</div>
            )}
        </div>
    );
};

function CardStudent({ num, history }) {
    let path = history.location.pathname;

    return (
        <>
            <div className="class-card-root">
                <div
                    className={classNames(
                        { 'class-card-header': !studentDummy[num]['complete'] },
                        { 'class-card-header-on': studentDummy[num]['complete'] },
                        'class-card-wrapper',
                    )}
                >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div className="card-title-p card-title-name"> {studentDummy[num]['name']}</div>
                        <StyleState complete={studentDummy[num]['complete']}>
                            {studentDummy[num]['complete'] ? '제출완료' : '미제출'}
                        </StyleState>
                    </div>

                    <span className="card-option">
                        <Link to={`${path}/${num}`}>
                            <p>상세 리포트</p>
                        </Link>
                    </span>
                </div>
                <div></div>
                <div className="class-card-contents class-card-wrapper-student">
                    <div className="contents-block">
                        <InfoItems title={'제출 날짜'} contents={studentDummy[num]['submit_date']}>
                            <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M5.33333 8H3.55556V9.77778H5.33333V8ZM8.88889 8H7.11111V9.77778H8.88889V8ZM12.4444 8H10.6667V9.77778H12.4444V8ZM14.2222 1.77778H13.3333V0H11.5556V1.77778H4.44444V0H2.66667V1.77778H1.77778C0.791111 1.77778 0.00888888 2.57778 0.00888888 3.55556L0 16C0 16.9778 0.791111 17.7778 1.77778 17.7778H14.2222C15.2 17.7778 16 16.9778 16 16V3.55556C16 2.57778 15.2 1.77778 14.2222 1.77778ZM14.2222 16H1.77778V6.22222H14.2222V16Z"
                                    fill="#706D6D"
                                />
                            </svg>
                        </InfoItems>
                        <ScoreItems title={'점수'} score={studentDummy[num]['score']} total={studentDummy[num]['total']}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M14.2222 0H1.77778C0.8 0 0 0.8 0 1.77778V14.2222C0 15.2 0.8 16 1.77778 16H14.2222C15.2 16 16 15.2 16 14.2222V1.77778C16 0.8 15.2 0 14.2222 0ZM5.33333 12.4444H3.55556V6.22222H5.33333V12.4444ZM8.88889 12.4444H7.11111V3.55556H8.88889V12.4444ZM12.4444 12.4444H10.6667V8.88889H12.4444V12.4444Z"
                                    fill="#706D6D"
                                />
                            </svg>
                        </ScoreItems>
                        <InfoItems title={'소요 시간'} contents={studentDummy[num]['test_time']}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M11.392 4.608C10.456 3.672 9.232 3.2 8 3.2V8L4.608 11.392C6.48 13.264 9.52 13.264 11.4 11.392C13.272 9.52 13.272 6.48 11.392 4.608ZM8 0C3.584 0 0 3.584 0 8C0 12.416 3.584 16 8 16C12.416 16 16 12.416 16 8C16 3.584 12.416 0 8 0ZM8 14.4C4.464 14.4 1.6 11.536 1.6 8C1.6 4.464 4.464 1.6 8 1.6C11.536 1.6 14.4 4.464 14.4 8C14.4 11.536 11.536 14.4 8 14.4Z"
                                    fill="#706D6D"
                                />
                            </svg>
                        </InfoItems>
                        <InfoItems title={'취약 영역'} contents={studentDummy[num]['weak']}>
                            <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M10.1818 0H3.63636C3.03273 0 2.51636 0.363636 2.29818 0.887273L0.101818 6.01455C0.0363636 6.18182 0 6.35636 0 6.54545V8C0 8.8 0.654545 9.45455 1.45455 9.45455H6.04364L5.35273 12.7782L5.33091 13.0109C5.33091 13.3091 5.45455 13.5855 5.65091 13.7818L6.42182 14.5455L11.2145 9.75273C11.4764 9.49091 11.6364 9.12727 11.6364 8.72727V1.45455C11.6364 0.654545 10.9818 0 10.1818 0ZM13.0909 0V8.72727H16V0H13.0909Z"
                                    fill="#706D6D"
                                />
                            </svg>
                        </InfoItems>
                        <CompareItems title={'비교 성취도'} contents={studentDummy[num]['compare']}>
                            <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 14.01V7H9V14.01H6L10 18L14 14.01H11ZM4 0L0 3.99H3V11H5V3.99H8L4 0Z" fill="#706D6D" />
                            </svg>
                        </CompareItems>
                    </div>
                </div>
            </div>
        </>
    );
}

export default withRouter(CardStudent);