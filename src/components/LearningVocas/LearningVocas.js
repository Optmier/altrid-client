import { Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import BackdropComponent from '../../components/essentials/BackdropComponent';
import { updateVocaDatas } from '../../redux_modules/vocaLearnings';

/** https://codingbroker.tistory.com/86 */
Array.prototype.shuffle = function () {
    let arr = this;
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

function LearningVocas({ history, children }) {
    const { vocaDatasOriginal, isPending, error } = useSelector((state) => state.RdxVocaLearnings);
    const sessions = useSelector((state) => state.RdxSessions);
    const [learningDatas, setLearningDatas] = useState([]);
    window.learningDatas = learningDatas;
    const [currentIdx, setCurrentIdx] = useState(0);
    const [rotation, setRotation] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [currentMeans, setCurrentMeans] = useState('여기에 단어 뜻이 보여집니다.');
    const [finished, setFinished] = useState(false);

    const dispatch = useDispatch();

    // 단어 섞고 우선순위 구분
    const makeLearningData = (flag, rt) => {
        const shuffleVocaData = rt
            ? learningDatas
                  .map((d, idx) => (idx === currentIdx ? { ...d, counts: d.counts + 1, dist: flag } : d))
                  .filter(({ dist }) => dist !== 2)
                  .shuffle()
            : vocaDatasOriginal.filter(({ dist }) => dist !== 2).shuffle();
        const part0 = shuffleVocaData.filter(({ dist }) => dist === 0);
        const part1 = shuffleVocaData.filter(({ dist }) => dist === 1);
        const merged = [...part1, ...part0];
        if (merged.length < 1) setFinished(true);
        setLearningDatas(merged);
    };

    // 카드 클릭 시 뒤집기 이벤트
    const actionFlipCard = () => {
        setFlipped(!flipped);
        // 단어 뜻 불러오기 API
        setCurrentMeans(`여기에 단어 ${learningDatas[currentIdx].word} 에 대한 뜻이 보여집니다.`);
    };

    // 다음으로 또는 로테이션
    const nextAndRotation = (flag) => {
        const { idx, counts, completed } = learningDatas[currentIdx];
        dispatch(updateVocaDatas(idx, { means: flag === 2 ? currentMeans : null, dist: flag, counts: counts + 1, completed: completed }));
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
    };

    // 좀 더 학습이 필요하다고 답한 경우
    const actionClickReplyLearnMore = () => {
        setFlipped(false);
        nextAndRotation(1);
    };

    // 모르는 단어였다고 답한 경우
    const actionClickReplyNegative = () => {
        setFlipped(false);
        nextAndRotation(0);
    };

    useEffect(() => {
        if (!isPending && !vocaDatasOriginal) {
            alert('잘못된 접근 또는 학습 데이터가 없습니다!');
            history.goBack();
        }
        const unblock = history.block((location, action) => {
            if ((!isPending && !vocaDatasOriginal) || !learningDatas.length) return true;
            return window.confirm('정말로 학습을 종료하시겠습니까?');
        });
        return () => {
            // console.log('학습을 끝냅니다...');
            // 단어 데이터 비우기?
            unblock();
        };
    }, [history, learningDatas, isPending, vocaDatasOriginal]);

    useEffect(() => {
        if (finished) {
            alert('학습이 완료되었습니다.');
        }
    }, [finished]);

    useEffect(() => {
        if (!vocaDatasOriginal) return;
        makeLearningData();
    }, [vocaDatasOriginal]);

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
                                        <CardMeans>{currentMeans}</CardMeans>
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
                    <h1>학습이 종료되었습니다 :)</h1>
                )}
            </ScriptRoot>
        </>
    );
}

LearningVocas.defaultProps = {};

export default LearningVocas;