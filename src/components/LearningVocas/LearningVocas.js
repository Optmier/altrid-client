import Button from '../../AltridUI/Button/Button';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import BackdropComponent from '../../components/essentials/BackdropComponent';
import { updateVocaDatas } from '../../redux_modules/vocaLearnings';
import finish from '../../images/finish.png';
import ProgressIndicator from '../../AltridUI/Icons/ProgressIndicator';

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
    color: #11171c;
    display: flex;
    font-family: inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji',
        'Segoe UI Emoji', 'Segoe UI Symbol';
    flex-direction: column;
    justify-content: center;
    height: calc(100vh - 192px);
    padding: 16px;
    position: relative;
    margin: 0 auto;
    max-width: 560px;
    width: calc(100% - 32px);
`;
const ProgressCount = styled.div`
    display: flex;
    font-size: 12px;
    font-weight: 700;
    justify-content: flex-end;
    letter-spacing: -0.01em;
    line-height: 16px;
    max-width: 500px;
    width: 100%;
`;
const VocaCardContainer = styled.div`
    display: flex;
    justify-content: center;
    margin: 16px 0;
    padding: 0 16px;
    max-width: 500px;
    width: 100%;
`;
const VocaCard = styled.div`
    align-items: center;
    background-color: #ffffff;
    border: 1px solid #e9edef;
    border-radius: 32px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    min-height: 240px;
    padding: 32px;
    width: 100%;

    @media (min-width: 0) and (max-width: 767px) {
        & {
            padding: 16px;
        }
    }
`;
const CardWord = styled.div`
    font-size: 2.625rem;
    font-weight: 700;
`;
const CardMeans = styled.div`
    font-size: 2rem;
    font-weight: 500;
    text-align: center;
`;
const ActionButtonsContainer = styled.div`
    bottom: calc(50% - 220px);
    display: flex;
    justify-content: space-evenly;
    position: absolute;
    width: 100%;

    @media (min-width: 0) and (max-width: 767px) {
        & {
            flex-direction: column;
            justify-content: flex-start;
            margin-bottom: -72px;
            max-width: 500px;
            height: 128px;
            width: calc(100% - 32px);
            & button + button {
                margin-top: 4px;
            }
        }
    }
`;
const TopProgressBar = styled.div`
    background: #e9edef;
    border: none;
    display: flex;
    font-family: inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji',
        'Segoe UI Emoji', 'Segoe UI Symbol';
    position: absolute;
    top: 48px;
    height: 8px;
    width: 100%;
    z-index: 900;
`;
const Bar = styled.div`
    flex-basis: ${({ progress }) => progress + '%'};
    background: #0cb573;
    border-radius: 0px 16px 16px 0px;
    height: 8px;
    transition: flex-basis 0.3s;
`;
const Indicator = styled.div`
    align-items: center;
    color: #ffffff;
    display: flex;
    justify-content: center;
    font-weight: 700;
    font-size: 1rem;
    line-height: 1.25rem;
    text-align: center;
    letter-spacing: -0.02em;
    top: 9px;
    left: ${({ progress }) => `calc(${progress}% - 16px)`};
    position: absolute;
    transition: left 0.3s;
    z-index: 901;
    & span {
        margin-top: 2px;
        position: absolute;
        z-index: 902;
    }
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
    const [completedCount, setCompletedCount] = useState(0);
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
        setCompletedCount(completedCount + 1);
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
            {!finished ? (
                learningDatas && learningDatas.length ? (
                    <TopProgressBar>
                        <Bar progress={(completedCount / vocaDatasOriginal.length) * 100} />
                        <Indicator progress={(completedCount / vocaDatasOriginal.length) * 100}>
                            <span>{completedCount}</span>
                            <ProgressIndicator />
                        </Indicator>
                    </TopProgressBar>
                ) : null
            ) : null}
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
                                    <Button sizes="medium" colors="purple" variant="light" onClick={actionClickReplyConfirm}>
                                        {rotation > 0 || learningDatas[currentIdx].dist === 1
                                            ? '이제 확실히 알겠습니다!'
                                            : '아는 단어입니다.'}
                                    </Button>
                                    <Button sizes="medium" colors="default" variant="mono" onClick={actionClickReplyLearnMore}>
                                        좀 더 학습이 필요합니다.
                                    </Button>
                                    {rotation === 0 && learningDatas[currentIdx].dist === 0 ? (
                                        <Button sizes="medium" colors="red" variant="outlined" onClick={actionClickReplyNegative}>
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
