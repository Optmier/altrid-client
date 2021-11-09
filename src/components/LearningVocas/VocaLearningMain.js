import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ClassWrapper from '../essentials/ClassWrapper';
import HeaderMenu from '../../AltridUI/HeaderMenu/HeaderMenu';
import Groupbox from '../../_tempComponents/Groupbox';
import {
    Button,
    FormControl,
    Grid,
    Input,
    InputAdornment,
    InputLabel,
    LinearProgress,
    MenuItem,
    Select,
    TextField,
} from '@material-ui/core';
import { withRouter } from 'react-router';
import Axios from 'axios';
import { apiUrl } from '../../configs/configs';
import { makeStyles } from '@material-ui/styles';
import PlayIcon from '@material-ui/icons/PlayCircleOutline';
import CompletedListItem from './components/CompletedListItem';
import SearchIcon from '@material-ui/icons/Search';
import { useDispatch } from 'react-redux';
import { fetchVocaDatas } from '../../redux_modules/vocaLearnings';

/**
 * 구현해야 할 것...
 * 1. 단어 묶음 카드
 * 2. 몇개씩 묶을 것인지
 */
const LearningRoot = styled.div``;
const Contents = styled.div`
    margin-top: 54px;
    width: 100%;
`;
const LearningSection = styled.div`
    align-items: center;
    background-color: #ffffff;
    border-radius: 11px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 32px;
`;
const GotoLearningContainer = styled.div``;
const LearningProgressContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 1.1rem;
    margin-top: 32px;
    text-align: center;
    width: 100%;
`;
const LearningProgressPercentage = styled.div`
    font-weight: 700;
    font-size: 1.8rem;
    margin: 8px 0;
`;
const CompletedListDivider = styled.div`
    border-top: 2px solid #cbcbcb;
    margin: 12px auto;
    max-width: 128px;
`;
const useStyles = makeStyles((theme) => ({
    selectBox: {
        minWidth: 240,
    },
    customNumbersTextfield: {
        maxWidth: 64,
        marginLeft: 8,
    },
    learningStartButton: {
        fontSize: '1rem',
        marginLeft: 8,
        minHeight: 56,
    },
    totalProgress: {
        height: 16,
        marginTop: 8,
    },
}));

const CompletedListSearchbox = ({ onSearchboxChange }) => {
    return (
        <FormControl>
            <Input
                id="searchbox-completed-list"
                placeholder="단어 찾기"
                startAdornment={
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                }
                onChange={onSearchboxChange}
            />
        </FormControl>
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
    const [learningNumbers, setLearningNumbers] = useState(10);
    const [learningNumbersSelectValue, setLearningNumbersSelectValue] = useState(10);
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
            <ClassWrapper col="col">
                <HeaderMenu title="단어 학습" menuDatas={headerMenus} selectedMenuId={menuStatus} onItemClick={actionClickHeaderMenuItem} />
                <Contents>
                    <Groupbox title="학습하기">
                        <LearningSection>
                            <GotoLearningContainer>
                                <FormControl className={classes.selectBox} variant="outlined">
                                    <InputLabel id="select-learning-numbers-label">학습할 단어 수 선택</InputLabel>
                                    <Select
                                        labelId="select-learning-numbers-label"
                                        label="학습할 단어 수 선택"
                                        value={learningNumbersSelectValue}
                                        onChange={actionOnChangeNumbersSelect}
                                    >
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={20}>20</MenuItem>
                                        <MenuItem value={30}>30</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value="custom">
                                            <em>직접 입력하기</em>
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                                {learningNumbersSelectValue === 'custom' ? (
                                    <FormControl className={classes.customNumbersTextfield}>
                                        <TextField
                                            variant="outlined"
                                            type="number"
                                            defaultValue={customNumbers}
                                            onChange={actionChangeCustomNumbersField}
                                        />
                                    </FormControl>
                                ) : null}
                                <Button
                                    className={classes.learningStartButton}
                                    variant="outlined"
                                    color="default"
                                    endIcon={<PlayIcon />}
                                    onClick={actionClickLearningStart}
                                >
                                    학습하기!
                                </Button>
                            </GotoLearningContainer>
                            <LearningProgressContainer>
                                나의 단어 학습 진행률
                                <LearningProgressPercentage>{totalProgress}%</LearningProgressPercentage>
                                <LinearProgress className={classes.totalProgress} variant="determinate" value={totalProgress} />
                            </LearningProgressContainer>
                        </LearningSection>
                    </Groupbox>
                    <Groupbox
                        title="완료된 단어"
                        rightComponent={<CompletedListSearchbox onSearchboxChange={actionChangeCompletedSearchbox} />}
                        limited
                        maxHeightCss="calc(100vh - 720px)"
                        onScrollBottomEdge={actionScrollBottomEdge}
                    >
                        {completedList.map((d, i) => (
                            <React.Fragment key={d.idx + '_F'}>
                                {i >= 10 && i % 10 === 0 ? <CompletedListDivider key={d.idx + '_hr'} /> : null}
                                <CompletedListItem
                                    key={d.idx}
                                    word={d.word}
                                    means={d.means}
                                    notes={d.assignment_title}
                                    label={d.counts}
                                    verified={d.completed}
                                />
                            </React.Fragment>
                        ))}
                    </Groupbox>
                </Contents>
            </ClassWrapper>
        </LearningRoot>
    );
}

export default withRouter(VocaLearningMain);
