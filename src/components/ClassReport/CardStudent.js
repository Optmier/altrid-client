import React, { useState } from 'react';
import '../../styles/class_card.scss';
import classNames from 'classnames';
import styled from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
import moment from 'moment-timezone';
import { useEffect } from 'react';
import ProblemCategories from '../TOFELEditor/ProblemCategories';
import TooltipCard from '../essentials/TooltipCard';

const StyleState = styled.div`
    width: 60px;
    padding: 0 6px;
    height: 22px;
    font-size: 8px;
    color: white;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;

    background-color: ${(props) => (props.complete ? '#FFF2D9' : '#707070')};
    color: ${(props) => (props.complete ? '#3B1689' : '#fff')};
`;

const pad = (n, width) => {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
};

const timeValueToTimer = (seconds) => {
    const secs = seconds < 0 ? 0 : seconds;
    if (seconds === -2) return '제한 없음';
    else return `${pad(parseInt(secs / 60), 1)}분 ${pad(Math.floor(secs % 60), 1)}초`;
};

const InfoItems = ({ title, contents, children }) => {
    return (
        <div className="card-item-student">
            {children}
            <div className="card-content-title-p">{title}</div>
            <TooltipCard title={contents}>
                <div className="card-content-p">{contents}</div>
            </TooltipCard>
        </div>
    );
};
const ScoreItems = ({ title, score, total, percent, children }) => {
    // let percent = ((score / total) * 100).toFixed(1);
    return (
        <div className="card-item-student">
            {children}
            <div className="card-content-title-p">{title}</div>
            {score === '' ? (
                <div className="card-content-p">{score}</div>
            ) : (
                <TooltipCard title={score + '문제 / ' + total + '문제 / ' + percent.toFixed(1) + '%'}>
                    <div className="card-content-score">
                        <div className="card-content-p">
                            {score}문제 / {total}문제
                        </div>
                        <div className="card-content-p" style={{ color: '#13e2a1', paddingLeft: '5px' }}>
                            ({percent.toFixed(1)}%)
                        </div>
                    </div>
                </TooltipCard>
            )}
        </div>
    );
};

ScoreItems.defaultProps = {
    percent: 0,
};
const CompareItems = ({ title, contents, enabled, children }) => {
    return (
        <div className="card-item-student">
            {children}
            <div className="card-content-title-p">{title}</div>
            <TooltipCard title={contents.toFixed(1)}>
                {enabled ? (
                    contents < 0 ? (
                        <div style={{ color: '#F57C7C', fontWeight: '500' }}>{contents.toFixed(1)}%</div>
                    ) : contents === 0 ? (
                        <div style={{ color: '#C4C4C4', fontWeight: '500' }}></div>
                    ) : (
                        <div style={{ color: '#7C88F5', fontWeight: '500' }}>+ {contents.toFixed(1)}%</div>
                    )
                ) : (
                    <div style={{ color: '#C4C4C4', fontWeight: '500' }}></div>
                )}
            </TooltipCard>
        </div>
    );
};

function CardStudent({ id, data, prevData, totalProblems, achieveRates, existsCategories, history }) {
    let path = history.location.pathname;
    /** 현재 학생 영역별 점수 데이터 */
    const [currentScoresPerType, setCurrentScoresPerType] = useState({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 });
    /** 취약 영역 Top 3 */
    const [top3Weaks, setTop3Weaks] = useState([]);

    useEffect(() => {
        if (!data || !data.category_score) return;
        const currentCategoryScores = data.category_score;
        const _currentObjs = {};
        Object.keys(currentCategoryScores).map((c) => {
            const sum = currentCategoryScores[c].sum;
            const count = currentCategoryScores[c].count;
            !_currentObjs[c] && (_currentObjs[c] = 0);
            _currentObjs[c] = (sum / count) * 1.0;
        });
        setCurrentScoresPerType({ ...currentScoresPerType, ..._currentObjs });
    }, [data.category_score]);

    useEffect(() => {
        const toArray = Object.keys(currentScoresPerType)
            .filter((f) => f !== '0')
            .map((c) => ({ category: c, scores: currentScoresPerType[c] }));
        // toArray.push({ category: '0', scores: currentScoresPerType['0'] });
        toArray.sort((a, b) => a.scores - b.scores);
        setTop3Weaks(
            toArray.filter(({ category }) => existsCategories.map((d) => d.category + '').includes(category)).filter((d, i) => i < 3),
        );
    }, [currentScoresPerType]);

    return (
        <>
            <div className="class-card-root" style={{ padding: '12px 0' }}>
                <StyleState style={{ marginLeft: '20px' }} complete={data.submitted && data.tries}>
                    {data.submitted && data.tries ? (
                        <>
                            <svg
                                style={{ marginRight: '7px' }}
                                width="12"
                                height="7"
                                viewBox="0 0 12 7"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M5.801 4.87976L6.507 5.58576L10.74 1.35276L11.447 2.05976L6.507 6.99976L3.325 3.81776L4.032 3.11076L5.0945 4.17326L5.801 4.87926V4.87976ZM5.802 3.46576L8.278 0.989258L8.983 1.69426L6.507 4.17076L5.802 3.46576ZM4.3885 6.29326L3.682 6.99976L0.5 3.81776L1.207 3.11076L1.9135 3.81726L1.913 3.81776L4.3885 6.29326Z"
                                    fill="#3B1689"
                                />
                            </svg>
                            제출완료
                        </>
                    ) : (
                        '미제출'
                    )}
                </StyleState>
                <div className="class-card-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TooltipCard title={data.name}>
                            <div style={{ fontWeight: 'bold', fontSize: '24px' }}>{data.name}</div>
                        </TooltipCard>
                    </div>

                    <span className="card-option">
                        {data.submitted && data.tries ? (
                            <Link to={`${path}/details?user=${id}`}>
                                <p>상세 리포트</p>
                            </Link>
                        ) : null}
                    </span>
                </div>
                <div></div>
                <div className="class-card-contents class-card-wrapper">
                    <div className="contents-block">
                        <InfoItems
                            title={'제출 날짜'}
                            contents={!data.updated || !data.tries ? '' : moment(data.updated).format('YY.MM.DD HH:mm')}
                        ></InfoItems>
                        <ScoreItems
                            title={'점수'}
                            score={!data.user_data ? '' : data.user_data.selections.filter((s) => s.correct === true).length}
                            total={totalProblems}
                            percent={data.score_percentage}
                        ></ScoreItems>
                        <InfoItems title={'소요 시간'} contents={!data.time ? '' : timeValueToTimer(data.time)}></InfoItems>
                        {achieveRates >= 100 ? (
                            <InfoItems
                                title={'취약 영역'}
                                contents={
                                    data.submitted && data.tries
                                        ? top3Weaks.length && top3Weaks[0]
                                            ? ProblemCategories.filter((p) => p.id == top3Weaks[0].category)[0].name
                                            : 'null'
                                        : ''
                                }
                            ></InfoItems>
                        ) : null}
                        <CompareItems
                            title={'비교 성취도'}
                            enabled={data.updated && data.tries}
                            contents={data.score_percentage - (!prevData || !prevData.score_percentage ? 0 : prevData.score_percentage)}
                        ></CompareItems>
                    </div>
                </div>
            </div>
        </>
    );
}

export default withRouter(React.memo(CardStudent));
