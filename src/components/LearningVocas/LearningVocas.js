import { Button } from '@material-ui/core';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import BackdropComponent from '../../components/essentials/BackdropComponent';
import { updateVocaDatas } from '../../redux_modules/vocaLearnings';
import finish from '../../images/finish.png';

/** https://codingbroker.tistory.com/86 */
const arrShuffle = function (arr) {
    for (let i = 0; i < arr.length; i++) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

const ScriptRoot = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: calc(100vh - 192px);
    position: relative;
    margin: 0 auto;
    max-width: 560px;
    width: 100%;
`;
const ProgressCount = styled.div`
    display: flex;
    justify-content: flex-end;
    width: 100%;
`;
const VocaCardContainer = styled.div`
    display: flex;
    justify-content: center;
    margin: 36px 0;
    width: 100%;
`;
const VocaCard = styled.div`
    align-items: center;
    background-color: #ffffff;
    border: 1px solid #e2e2e2;
    border-radius: 11px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    min-height: 320px;
    padding: 32px;
    width: 100%;
`;
const CardWord = styled.div`
    font-size: 1.8rem;
    font-weight: 700;
`;
const CardMeans = styled.div`
    font-size: 1.6rem;
`;
const ActionButtonsContainer = styled.div`
    bottom: calc(50% - 300px);
    display: flex;
    justify-content: space-evenly;
    position: absolute;
    width: 100%;
`;

function LearningVocas({ history, match, children }) {
    const classNum = match.params.num;
    const { vocaDatasOriginal, isPending, error } = useSelector((state) => state.RdxVocaLearnings);
    const optimerModule = useSelector((state) => state.RdxOpTimerHelper.optimer);
    const sessions = useSelector((state) => state.RdxSessions);
    const [learningDatas, setLearningDatas] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [rotation, setRotation] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [currentMeans, setCurrentMeans] = useState('');
    const [finished, setFinished] = useState(false);
    const [korean, setkorean] = useState('');
    const dispatch = useDispatch();

    // 단어 섞고 우선순위 구분
    const makeLearningData = (flag, rt) => {
        const shuffleVocaData = rt
            ? arrShuffle(
                  learningDatas
                      .map((d, idx) => (idx === currentIdx ? { ...d, counts: d.counts + 1, dist: flag } : d))
                      .filter(({ dist }) => dist !== 2),
              )
            : arrShuffle(vocaDatasOriginal.filter(({ dist }) => dist !== 2));
        const part0 = shuffleVocaData.filter(({ dist }) => dist === 0);
        const part1 = shuffleVocaData.filter(({ dist }) => dist === 1);
        const merged = [...part1, ...part0];
        if (merged.length < 1) setFinished(true);
        setLearningDatas(merged);
    };

    // 카드 클릭 시 뒤집기 이벤트
    const actionFlipCard = () => {
        if (!flipped) {
            Axios({
                url: `https://dapi.kakao.com/v2/translation/translate?src_lang=en&target_lang=kr&query=${learningDatas[currentIdx].word}`,
                type: 'GET',
                headers: { Authorization: 'KakaoAK deff2bf52bcadf12b544be630be9846b' },
            })
                .then((result) => setCurrentMeans(result.data.translated_text[0]))
                .catch((error) => console.log(error));
            Axios({
                url: `https://owlbot.info/api/v4/dictionary/${learningDatas[currentIdx].word}`,
                type: 'GET',
                headers: { Authorization: 'Token cc26601e11efc16083caf4e28a9eca286783ea8a' },
            })
                .then((result) => setkorean(result.data.definitions[0].example))
                .catch((error) => console.log(error));
        }
        setFlipped(!flipped);
    };

    // 다음으로 또는 로테이션
    const nextAndRotation = (flag) => {
        const { idx, counts, completed } = learningDatas[currentIdx];
        console.log(currentMeans);
        dispatch(
            updateVocaDatas(idx, classNum, {
                means: flag === 2 ? currentMeans : null,
                dist: flag,
                counts: counts + 1,
                completed: completed,
            }),
        );

        // Rotate
        if (learningDatas.length - 1 <= currentIdx) {
            setCurrentIdx(0);
            setRotation((rt) => {
                const added = rt + 1;
                makeLearningData(flag, added);
                return added;
            });
        }
        // Only to next
        else {
            setCurrentIdx(currentIdx + 1);
            setLearningDatas(learningDatas.map((d, idx) => (idx === currentIdx ? { ...d, counts: d.counts + 1, dist: flag } : d)));
        }
    };

    // 아는 단어라고 답했을 경우
    const actionClickReplyConfirm = () => {
        setFlipped(false);
        nextAndRotation(2);
        setCurrentMeans('');
        setkorean('');
    };

    // 좀 더 학습이 필요하다고 답한 경우
    const actionClickReplyLearnMore = () => {
        setFlipped(false);
        nextAndRotation(1);
        setCurrentMeans('');
        setkorean('');
    };

    // 모르는 단어였다고 답한 경우
    const actionClickReplyNegative = () => {
        setFlipped(false);
        nextAndRotation(0);
        setCurrentMeans('');
        setkorean('');
    };

    useEffect(() => {
        if (!isPending && !vocaDatasOriginal) {
            alert('잘못된 접근 또는 학습 데이터가 없습니다!');
            history.goBack();
            return;
        }
        const unblock = history.block((location, action) => {
            if ((!isPending && !vocaDatasOriginal) || !learningDatas.length) return true;
            return window.confirm('정말로 학습을 종료하시겠습니까?');
        });
        if (!optimerModule || !optimerModule.classNum) return;
        if (!optimerModule.isStarted) {
            console.warn('옵타이머를 시작합니다.');
            optimerModule.start();
        }
        return () => {
            // console.log('학습을 끝냅니다...');
            // 단어 데이터 비우기?
            unblock();
        };
    }, [history, learningDatas, isPending, vocaDatasOriginal, optimerModule]);

    useEffect(() => {
        if (finished) {
            alert('학습이 완료되었습니다.');
        }
        return () => {
            if (finished) return;
            optimerModule.stopAndSave();
        };
    }, [finished]);

    useEffect(() => {
        if (!vocaDatasOriginal) return;
        makeLearningData();
    }, [vocaDatasOriginal]);

    // useEffect(() => {
    //     Axios({
    //         url: 'https://owlbot.info/api/v4/dictionary/sweet',
    //         type: 'GET',
    //         headers: { Authorization: 'Token cc26601e11efc16083caf4e28a9eca286783ea8a' },
    //     })
    //         .then((result) => console.log(result.data.definitions[0].example))
    //         .catch((error) => console.log(error));
    // }, []);
    return (
        <>
            <BackdropComponent open={isPending} blind={true} />
            <ScriptRoot>
                {!finished ? (
                    learningDatas && learningDatas.length ? (
                        <>
                            <ProgressCount>
                                {currentIdx + 1}/{learningDatas.length}
                            </ProgressCount>
                            <VocaCardContainer>
                                <VocaCard onClick={actionFlipCard}>
                                    {!flipped ? (
                                        <CardWord>{learningDatas[currentIdx].word}</CardWord>
                                    ) : (
                                        <CardMeans>
                                            {currentMeans}
                                            <br />
                                            {!korean ? <p> ··· </p> : <p>exmaple : {korean} </p>}
                                        </CardMeans>
                                    )}
                                </VocaCard>
                            </VocaCardContainer>
                            {flipped ? (
                                <ActionButtonsContainer>
                                    <Button color="primary" variant="outlined" onClick={actionClickReplyConfirm}>
                                        {rotation > 0 || learningDatas[currentIdx].dist === 1
                                            ? '이제 확실히 알겠습니다!'
                                            : '아는 단어입니다.'}
                                    </Button>
                                    <Button color="default" variant="outlined" onClick={actionClickReplyLearnMore}>
                                        좀 더 학습이 필요합니다.
                                    </Button>
                                    {rotation === 0 && learningDatas[currentIdx].dist === 0 ? (
                                        <Button color="secondary" variant="outlined" onClick={actionClickReplyNegative}>
                                            모르는 단어입니다.
                                        </Button>
                                    ) : null}
                                </ActionButtonsContainer>
                            ) : null}
                        </>
                    ) : null
                ) : (
                    <>
                        <img width="250px" height="250px" src={finish} alt="finish learn" />
                        <h1 style={{ marginTop: '52px' }}>학습이 종료되었습니다. </h1>
                    </>
                )}
            </ScriptRoot>
        </>
    );
}

LearningVocas.defaultProps = {};

export default LearningVocas;
