import { Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import BackdropComponent from '../../components/essentials/BackdropComponent';

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
    const { vocaDatasOriginal, isLoading, error } = useSelector((state) => state.RdxVocaLearnings);
    const sessions = useSelector((state) => state.RdxSessions);
    const [learningDatas, setLearningDatas] = useState(null);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [currentMeans, setCurrentMeans] = useState('여기에 단어 뜻이 보여집니다.');
    const [finished, setFinished] = useState(false);

    // 단어 섞고 우선순위 구분
    const makeLearningData = (flag) => {
        const shuffleVocaData = learningDatas
            ? learningDatas
                  .map((d, idx) => (idx === currentIdx ? { ...d, dist: flag } : d))
                  .filter(({ dist }) => dist !== 2)
                  .shuffle()
            : vocaDatasOriginal.filter(({ dist }) => dist !== 2).shuffle();
        const part0 = shuffleVocaData.filter(({ dist }) => dist === 0);
        const part1 = shuffleVocaData.filter(({ dist }) => dist === 1);
        const merged = [...part1, ...part0];
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
        if (learningDatas.length - 1 <= currentIdx) {
            makeLearningData(flag);
            setCurrentIdx(0);
        } else {
            setCurrentIdx(currentIdx + 1);
            setLearningDatas(learningDatas.map((d, idx) => (idx === currentIdx ? { ...d, dist: flag } : d)));
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
        console.log(learningDatas);
        if (!isLoading && !vocaDatasOriginal) {
            alert('잘못된 접근 또는 학습 데이터가 없습니다!');
            history.goBack();
        }
        if (learningDatas && !learningDatas.length) {
            alert('학습이 완료되었습니다.');
            setFinished(true);
            // history.goBack();
        }
        const unblock = history.block((location, action) => {
            if ((!isLoading && !vocaDatasOriginal) || !learningDatas.length) return true;
            return window.confirm('정말로 학습을 종료하시겠습니까?');
        });
        return () => {
            // console.log('학습을 끝냅니다...');
            // 단어 데이터 비우기?
            unblock();
        };
    }, [history, learningDatas]);

    useEffect(() => {
        if (!vocaDatasOriginal) return;
        makeLearningData();
    }, [vocaDatasOriginal]);

    return (
        <>
            <BackdropComponent open={isLoading} blind={true} />
            {learningDatas && learningDatas.length ? (
                <ScriptRoot>
                    <ProgressCount>
                        {currentIdx + 1}/{learningDatas.length}
                    </ProgressCount>
                    <VocaCardContainer>
                        <VocaCard onClick={actionFlipCard}>
                            {!flipped ? <CardWord>{learningDatas[currentIdx].word}</CardWord> : <CardMeans>{currentMeans}</CardMeans>}
                        </VocaCard>
                    </VocaCardContainer>
                    {flipped ? (
                        <ActionButtonsContainer>
                            <Button color="primary" variant="outlined" onClick={actionClickReplyConfirm}>
                                아는 단어입니다.
                            </Button>
                            <Button color="default" variant="outlined" onClick={actionClickReplyLearnMore}>
                                좀 더 학습이 필요합니다.
                            </Button>
                            <Button color="secondary" variant="outlined" onClick={actionClickReplyNegative}>
                                모르는 단어입니다.
                            </Button>
                        </ActionButtonsContainer>
                    ) : null}
                </ScriptRoot>
            ) : null}
        </>
    );
}

LearningVocas.defaultProps = {};

export default LearningVocas;
