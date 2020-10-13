import React, { useState } from 'react';
import HtmlParser from 'react-html-parser';
import styled from 'styled-components';
import TimerIcon from '@material-ui/icons/Timer';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Button, IconButton } from '@material-ui/core';
import ProblemComponent from './ProblemComponent';

const pad = (n, width) => {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
};

const timeValueToTimer = (seconds) => {
    return `${pad(parseInt(seconds / 60), 2)}:${pad(seconds % 60, 2)}`;
};

const RenderRoot = styled.div`
    min-width: 1280px;
    min-height: 750px;
    max-width: 1280px;
    max-height: 750px;
    height: 750px;
`;
const HeaderToolbar = styled.div`
    border-bottom: 1px solid #cccccc;
    box-sizing: border-box;
    color: #666666;
    display: flex;
    justify-content: space-between;
    height: 42px;
    padding: 8px;
`;
const ContentsContainer = styled.div`
    display: flex;
    flex-direction: row;
    height: calc(100% - 42px - 16px);

    & p {
        font-family: 'Times New Roman';
        font-size: 1.125rem;
        line-height: 1.75rem;
    }
`;
const PassageContainer = styled.div`
    overflow: auto;
    padding: 8px;
    width: 60%;
    height: 100%;
`;
const ProblemsContainer = styled.div`
    border-left: 1px solid #cccccc;
    padding: 8px;
    overflow: auto;
    width: 40%;
    height: 100%;

    & p {
        font-family: 'Times New Roman';
        font-size: 1rem;
        line-height: 1.5rem;
    }
`;
const HeaderTitle = styled.div``;
const HeaderTimer = styled.div`
    display: flex;
    align-items: center;

    & h5 {
        margin-left: 8px;
        width: 6rem;
    }
`;
const HeaderPageController = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 12rem;
`;
const HeaderMasterSWs = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

function SmartTOFELRender({ preview, title, passageForRender, problemDatas, timer, onPrev, onNext, onEnd }) {
    const [currentProblemIdx, setCurrentProblemIdx] = useState(0);

    const handlePrev = () => {
        setCurrentProblemIdx(currentProblemIdx - 1);
    };

    const handleNext = () => {
        if (currentProblemIdx >= problemDatas.length - 1) {
            onEnd();
            return;
        }
        setCurrentProblemIdx(currentProblemIdx + 1);
    };

    const handleEnd = () => {
        onEnd();
    };
    return (
        <RenderRoot>
            <HeaderToolbar>
                <HeaderTitle>
                    <h4>{title}</h4>
                </HeaderTitle>
                <HeaderTimer>
                    <TimerIcon />
                    <h5>{timeValueToTimer(timer)}</h5>
                </HeaderTimer>
                <HeaderPageController>
                    <IconButton size="small" disabled={currentProblemIdx <= 0} onClick={handlePrev}>
                        <NavigateBeforeIcon />
                    </IconButton>
                    <h5>
                        {currentProblemIdx + 1} / {problemDatas.length}
                    </h5>
                    <IconButton size="small" disabled={currentProblemIdx >= problemDatas.length - 1} onClick={handleNext}>
                        <NavigateNextIcon />
                    </IconButton>

                    <HeaderMasterSWs>
                        <Button size="small" endIcon={<ExitToAppIcon />} color="secondary" onClick={handleEnd}>
                            종료
                        </Button>
                    </HeaderMasterSWs>
                </HeaderPageController>
            </HeaderToolbar>
            <ContentsContainer>
                <PassageContainer>{HtmlParser(passageForRender)}</PassageContainer>
                <ProblemsContainer>
                    <ProblemComponent
                        category={problemDatas[currentProblemIdx].category}
                        type={problemDatas[currentProblemIdx].type}
                        textForRender={problemDatas[currentProblemIdx].textForRender}
                        selections={problemDatas[currentProblemIdx].selections}
                        answer={problemDatas[currentProblemIdx].answer}
                    />
                </ProblemsContainer>
            </ContentsContainer>
        </RenderRoot>
    );
}

SmartTOFELRender.defaultProps = {
    preview: false,
    title: '타이틀',
    passageForRender: '',
    problemDatas: [],
    timer: 90,
    onPrev() {},
    onNext() {},
    onEnd() {},
};

export default React.memo(SmartTOFELRender);
