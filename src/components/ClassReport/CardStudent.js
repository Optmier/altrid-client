/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import '../../styles/class_card.scss';
import styled from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
import moment from 'moment-timezone';
import { useEffect } from 'react';
import ProblemCategories from '../TOFELEditor/ProblemCategories';
import TooltipCard from '../essentials/TooltipCard';
import Typography from '../../AltridUI/Typography/Typography';
import { getColorSets } from '../../AltridUI/ThemeColors/ColorSets';

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

const CardRoot = styled.div`
    background-color: white;
    border: 1px solid #e9edef;
    border-radius: 32px;
    cursor: ${({ cursorEnabled }) => (cursorEnabled ? 'pointer' : null)};
    display: flex;
    flex-direction: column;
    padding: 32px;
    &:hover {
        border-color: #bfc6cd;
        outline: 1px solid #bfc6cd;
    }
    @media (max-width: 640px) {
        padding: 16px;
    }
`;
const TopTagContainer = styled.div`
    display: flex;
`;
const NameContainer = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
`;
const InfosContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 16px;
`;
const InfoItem = styled.div`
    display: flex;
    justify-content: space-between;
    & + & {
        margin-top: 4px;
    }
`;
const ItemWrapper = styled.div``;

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
    return score === '' ? (
        <div className="card-content-p">{score}</div>
    ) : (
        <Typography type="label" size="l" bold>
            {score}문제 / {total}문제 <span style={{ color: getColorSets(400, 'green') }}>({percent.toFixed(1)}%)</span>
        </Typography>
    );
};

ScoreItems.defaultProps = {
    percent: 0,
};
const CompareItems = ({ contents, enabled, children }) => {
    return (
        <Typography Typography type="label" size="l" bold>
            {enabled ? (
                contents < 0 ? (
                    <span style={{ color: getColorSets(500, 'orange') }}>{contents.toFixed(1)}%</span>
                ) : contents === 0 ? (
                    <span style={{ color: getColorSets(500, 'gray') }}></span>
                ) : (
                    <span style={{ color: getColorSets(500, 'blue') }}>+ {contents.toFixed(1)}%</span>
                )
            ) : (
                <span style={{ color: getColorSets(500, 'gray') }}></span>
            )}
        </Typography>
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
        <CardRoot
            cursorEnabled={data.submitted && data.tries}
            onClick={() => {
                if (data.submitted && data.tries) history.push(`${path}/details?user=${id}`);
                else return;
            }}
        >
            <TopTagContainer>
                <StyleState complete={data.submitted && data.tries}>
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
                            <Typography type="label" size="s" bold>
                                제출완료
                            </Typography>
                        </>
                    ) : (
                        <Typography type="label" size="s" bold>
                            미제출
                        </Typography>
                    )}
                </StyleState>
            </TopTagContainer>
            <NameContainer>
                <Typography type="label" size="xxl" bold>
                    {data.name}
                </Typography>
                <span className="card-option">
                    {data.submitted && data.tries ? (
                        <Link to={`${path}/details?user=${id}`}>
                            <p>상세 리포트</p>
                        </Link>
                    ) : null}
                </span>
            </NameContainer>
            <InfosContainer>
                <InfoItem>
                    <Typography type="label" size="l">
                        제출 날짜
                    </Typography>
                    <ItemWrapper>
                        <Typography type="label" size="l" bold>
                            {!data.updated || !data.tries ? '' : moment(data.updated).format('YY.MM.DD HH:mm')}
                        </Typography>
                    </ItemWrapper>
                </InfoItem>
                <InfoItem>
                    <Typography type="label" size="l">
                        점수
                    </Typography>
                    <ItemWrapper>
                        {/* <Typography type="label" size="l" bold></Typography> */}
                        <ScoreItems
                            title={'점수'}
                            score={!data.user_data ? '' : data.user_data.selections.filter((s) => s.correct === true).length}
                            total={totalProblems}
                            percent={data.score_percentage}
                        ></ScoreItems>
                    </ItemWrapper>
                </InfoItem>
                <InfoItem>
                    <Typography type="label" size="l">
                        소요 시간
                    </Typography>
                    <ItemWrapper>
                        <Typography type="label" size="l" bold>
                            {!data.time ? '' : timeValueToTimer(data.time)}
                        </Typography>
                    </ItemWrapper>
                </InfoItem>
                {achieveRates >= 100 ? (
                    <InfoItem>
                        <Typography type="label" size="l">
                            취약 영역
                        </Typography>
                        <ItemWrapper>
                            <Typography type="label" size="l" bold>
                                {data.submitted && data.tries
                                    ? top3Weaks.length && top3Weaks[0]
                                        ? ProblemCategories.filter((p) => p.id == top3Weaks[0].category)[0].name
                                        : 'null'
                                    : ''}
                            </Typography>
                        </ItemWrapper>
                    </InfoItem>
                ) : null}
                <InfoItem>
                    <Typography type="label" size="l">
                        비교 성취도
                    </Typography>
                    <ItemWrapper>
                        {/* <Typography type="label" size="l" bold></Typography> */}
                        <CompareItems
                            title={'비교 성취도'}
                            enabled={data.updated && data.tries}
                            contents={data.score_percentage - (!prevData || !prevData.score_percentage ? 0 : prevData.score_percentage)}
                        ></CompareItems>
                    </ItemWrapper>
                </InfoItem>
            </InfosContainer>
        </CardRoot>
    );
}

export default withRouter(React.memo(CardStudent));
