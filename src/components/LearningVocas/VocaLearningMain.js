import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ClassWrapper from '../essentials/ClassWrapper';
import HeaderMenu from '../../AltridUI/HeaderMenu/HeaderMenu';
import GroupBox from '../../AltridUI/GroupBox/GroupBox';
import Button from '../../AltridUI/Button/Button';
import { FormControl, Grid, Input, InputAdornment, InputLabel, LinearProgress, MenuItem, Select, TextField } from '@material-ui/core';
import { withRouter } from 'react-router';
import Axios from 'axios';
import { apiUrl } from '../../configs/configs';
import { makeStyles } from '@material-ui/styles';
import PlayIcon from '@material-ui/icons/PlayCircleOutline';
import CompletedListItem from './components/CompletedListItem';
import SearchIcon from '@material-ui/icons/Search';
import { useDispatch } from 'react-redux';
import { fetchVocaDatas } from '../../redux_modules/vocaLearnings';
import CheckCircle from '@material-ui/icons/CheckCircle';
import ProgressIndicator from '../../AltridUI/Icons/ProgressIndicator';

/**
 * 구현해야 할 것...
 * 1. 단어 묶음 카드
 * 2. 몇개씩 묶을 것인지
 */
const LearningRoot = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 32px;
    max-width: 960px;
    height: 100%;
    @media (max-width: 640px) {
        margin-top: 30px;
    }
`;
const Contents = styled.div`
    margin-top: 54px;
    width: 100%;
`;
const LearningSection = styled.div`
    align-items: start;
    background-color: #ffffff;
    border: 1px solid #e9edef;
    border-radius: 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 48px 56px;
    @media all and (max-width: 799px) {
        padding: 30px 32px;
    }
    @media all and (max-width: 799px) {
        padding: 30px 32px;
    }
`;
const GotoLearningContainer = styled.div`
    align-items: center;
    display: flex;
    margin-top: 8px;
    width: 100%;
    @media all and (max-width: 799px) {
        align-items: flex-start;
        flex-direction: column;
    }
`;
const SelectNumbersGroup = styled.div`
    align-items: center;
    display: flex;
    width: 100%;
    max-width: 328px;
    min-width: 160px;
    @media all and (max-width: 799px) {
        max-width: initial;
    }
`;
const WordCountsSelect = styled.select`
    cursor: pointer;
    background: url(/bg_images/Vector.png) no-repeat 92% 50%;
    background-color: #f6f8f9;
    min-height: 40px;
    padding: 12px 16px;
    font-family: inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji',
        'Segoe UI Emoji', 'Segoe UI Symbol';
    font-size: 1.125rem;
    font-weight: 500;
    border: none;
    border-radius: 16px;
    color: #77818b;
    line-height: 1.375rem;
    -webkit-appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    outline: none;

    &.small {
        width: 120px;
    }

    &.tiny {
        width: 90px;
        height: 32px;
        min-height: initial;
    }
`;
const CustomNumberField = styled.input`
    background-color: #f6f8f9;
    padding: 12px 16px;
    font-family: inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji',
        'Segoe UI Emoji', 'Segoe UI Symbol';
    font-size: 1.125rem;
    font-weight: 500;
    border: none;
    border-radius: 16px;
    color: #77818b;
    line-height: 1.375rem;
    max-width: 64px;
    margin-left: 8px;
`;
const LearningProgressContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 1.125rem;
    font-weight: 400;
    line-height: 1.375rem;
    width: 100%;
`;
const LearningProgressPercentage = styled.div`
    font-style: normal;
    font-weight: bold;
    font-size: 3rem;
    line-height: 3.25rem;
    letter-spacing: -0.03em;
    color: #276ef1;
    margin-top: 8px;
    @media all and (max-width: 799px) {
        font-size: 1.75rem;
        line-height: 2rem;
    }
`;
const CompletedListDivider = styled.div`
    border-top: 2px solid #cbcbcb;
    margin: 12px auto;
    max-width: 128px;
`;
const useStyles = makeStyles((theme) => ({
    selectBox: {
        width: '100%',
    },
    customNumbersTextfield: {
        backgroundColor: '#f6f8f9',
        borderRadius: 16,
        maxWidth: 64,
        marginLeft: 8,
        minHeight: 40,
        padding: '12px 16px',
    },
    learningStartButton: {
        fontSize: '1rem',
        marginLeft: 8,
        minHeight: 56,
        background: '#3B1689',
        color: '#ffffff',
        borderRadius: 104,
    },
    totalProgress: {
        height: 16,
        marginTop: 8,
    },
    startButton: {
        marginLeft: 8,
        '@media all and (max-width: 799px)': {
            marginLeft: 0,
            marginTop: 8,
        },
    },
}));

const CompletedSearchBox = styled.div`
    align-items: center;
    background-color: #ffffff;
    border-radius: 16px;
    color: #77818b;
    display: flex;
    padding: 8px 16px;
`;
const CompletedSearchBoxIcon = styled.div`
    align-items: center;
    display: flex;
`;
const CompletedSearchBoxInput = styled.input`
    padding: 0;
    font-family: inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji',
        'Segoe UI Emoji', 'Segoe UI Symbol';
    font-size: 1rem;
    font-weight: 400;
    border: none;
    color: #77818b;
    line-height: 1.25rem;
    margin-left: 4px;
`;

const CompletedListSearchbox = ({ onSearchboxChange }) => {
    return (
        <CompletedSearchBox>
            <CompletedSearchBoxIcon>
                <SearchIcon color="inherit" fontSize="small" />
            </CompletedSearchBoxIcon>
            <CompletedSearchBoxInput id="searchbox-completed-list" placeholder="단어 찾기" onChange={onSearchboxChange} />
        </CompletedSearchBox>
    );
};

function VocaLearningMain({ history, match }) {
    const classes = useStyles();
    const headerMenus = [
        {
            mId: 0,
            mName: '나의 단어',
        },
        {
            mId: 1,
            mName: '시험',
        },
    ];
    const classNum = match.params.num;
    const [menuStatus, setMenuStatus] = useState(0);
    const [learningNumbers, setLearningNumbers] = useState(0);
    const [learningNumbersSelectValue, setLearningNumbersSelectValue] = useState(0);
    const [customNumbers, setCustomNumbers] = useState(10);
    const [totalProgress, setTotalProgress] = useState(0);
    const [completedList, setCompletedList] = useState([]);
    const [completedListOrig, setCompletedListOrig] = useState([]);
    const [completedListPage, setCompletedListPage] = useState(0);
    const [completedListLimit, setCompletedListLimit] = useState(20);
    const [totalCompletedList, setTotalCompletedList] = useState(0);
    const [isCompletedListSearching, setIsCompletedListSearching] = useState(false);

    const dispatch = useDispatch();

    const actionClickHeaderMenuItem = (menuId) => {
        if (menuId === 1) return alert('서비스 준비중 입니다.');
        setMenuStatus(menuId);
    };

    const actionOnChangeNumbersSelect = ({ target }) => {
        setLearningNumbersSelectValue(target.value);
        if (target.value !== 'custom') {
            setLearningNumbers(parseInt(target.value));
        } else {
            setLearningNumbers(customNumbers);
        }
    };

    const actionChangeCustomNumbersField = ({ target }) => {
        const toInt = parseInt(target.value);
        if (!toInt || toInt < 5) setCustomNumbers(5);
        else setCustomNumbers(toInt);
    };

    const actionClickLearningStart = () => {
        dispatch(fetchVocaDatas(learningNumbers, classNum));
        history.push(match.url + '/learning');
    };

    const actionChangeCompletedSearchbox = ({ target }) => {
        setIsCompletedListSearching(Boolean(target.value));
        if (Boolean(target.value)) {
            Axios.get(`${apiUrl}/vocas/completed/search`, { params: { q: target.value, classNum: classNum }, withCredentials: true })
                .then((res) => {
                    if (res.data) {
                        setCompletedList(res.data);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        } else {
            setCompletedList(completedListOrig);
        }
        // setCompletedList(completedListOrig.filter((d) => d.word.includes(target.value)));
    };

    const actionScrollBottomEdge = () => {
        if (!isCompletedListSearching) {
            Axios.get(`${apiUrl}/vocas/completed`, {
                params: {
                    limit: completedListLimit,
                    page: completedListPage,
                    classNum: classNum,
                },
                withCredentials: true,
            }).then((res) => {
                if (res.data && res.data.length > 0) {
                    setCompletedList([...completedList, ...res.data]);
                    setCompletedListOrig([...completedListOrig, ...res.data]);
                    setCompletedListPage((page) => page + 1);
                }
            });
        }
    };

    useEffect(() => {
        setLearningNumbers(customNumbers);
    }, [customNumbers]);

    useEffect(() => {
        // 전체 진행도 가져오기
        Axios.get(`${apiUrl}/vocas/progress`, { params: { classNum: classNum }, withCredentials: true })
            .then((res) => {
                const { total, progress } = res.data;
                if (total < 1) return;
                setTotalProgress(Math.floor((progress / total) * 100));
            })
            .catch((err) => {
                console.error(err);
            });

        // 완료된 목록 가져오기 (초기 구성)
        Axios.get(`${apiUrl}/vocas/completed`, {
            params: {
                limit: completedListLimit,
                page: completedListPage,
                classNum: classNum,
            },
            withCredentials: true,
        }).then((res) => {
            if (res.data && res.data.length > 0) {
                setCompletedList(res.data);
                setCompletedListOrig(res.data);
                setCompletedListPage((page) => page + 1);
            }
        });
    }, []);

    return (
        <LearningRoot>
            <HeaderMenu
                title="단어 학습"
                menuDatas={headerMenus}
                selectedMenuId={menuStatus}
                fixed
                backgroundColor="#f6f8f9"
                onItemClick={actionClickHeaderMenuItem}
            />
            <Contents>
                <GroupBox title="학습하기">
                    <LearningSection>
                        <LearningProgressContainer>
                            나의 단어 학습 진행률
                            <LearningProgressPercentage>{totalProgress}%</LearningProgressPercentage>
                        </LearningProgressContainer>
                        <GotoLearningContainer>
                            <SelectNumbersGroup>
                                <FormControl className={classes.selectBox} variant="outlined">
                                    {/* <InputLabel id="select-learning-numbers-label">학습할 단어 수 선택</InputLabel> */}
                                    <WordCountsSelect
                                        labelId="select-learning-numbers-label"
                                        // label="학습할 단어 수 선택"
                                        value={learningNumbersSelectValue}
                                        onChange={actionOnChangeNumbersSelect}
                                    >
                                        <option value={0}>학습할 단어 수 선택</option>
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={30}>30</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                        <option value="custom">직접 입력하기</option>
                                    </WordCountsSelect>
                                </FormControl>
                                {learningNumbersSelectValue === 'custom' ? (
                                    // <FormControl className={classes.customNumbersTextfield}>
                                    <CustomNumberField
                                        variant="outlined"
                                        type="number"
                                        defaultValue={customNumbers}
                                        onChange={actionChangeCustomNumbersField}
                                    />
                                ) : // </FormControl>
                                null}
                            </SelectNumbersGroup>
                            <Button
                                className={classes.startButton}
                                colors="purple"
                                onClick={actionClickLearningStart}
                                disabled={learningNumbersSelectValue == 0}
                            >
                                학습하기!
                            </Button>
                        </GotoLearningContainer>
                    </LearningSection>
                </GroupBox>
                <GroupBox
                    title="완료된 단어"
                    rightComponent={<CompletedListSearchbox onSearchboxChange={actionChangeCompletedSearchbox} />}
                    limited
                    maxHeightCss="calc(100vh - 660px)"
                    breakPoint={640}
                    breakPointMaxHeightCss="calc(100vh - 600px)"
                    onScrollBottomEdge={actionScrollBottomEdge}
                    limitedMinHeight={240}
                >
                    {completedList.map((d, i) => (
                        <React.Fragment key={d.idx + '_F'}>
                            {i >= 10 && i % 10 === 0 ? <CompletedListDivider key={d.idx + '_hr'} /> : null}
                            <CompletedListItem
                                idx={i}
                                key={d.idx}
                                word={d.word}
                                means={d.means}
                                notes={d.assignment_title}
                                label={d.counts}
                                verified={d.completed}
                            />
                        </React.Fragment>
                    ))}
                </GroupBox>
            </Contents>
        </LearningRoot>
    );
}

export default withRouter(VocaLearningMain);
