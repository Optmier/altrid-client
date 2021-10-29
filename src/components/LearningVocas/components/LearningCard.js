import { Card, CardActionArea, CardContent, LinearProgress } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

const CardContentsContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;
const Header = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
`;
const HeaderLeft = styled.div`
    font-size: 18px;
    font-weight: 600;
`;
const HeaderRight = styled.div`
    font-size: 14px;
`;
const Body = styled.div``;
const ProgressContainer = styled.div``;
const ProgressTextsContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    margin-top: 16px;
`;
const ProgressTextsLeft = styled.div``;
const ProgressTextsRight = styled.div``;
const ProgressBarContainer = styled.div`
    margin-top: 12px;
`;

function LearningCard({ idx, title, desc, progress, total, completed, actionCardClick, children, ...rest }) {
    const onCardClick = () => {
        actionCardClick(idx);
    };
    return (
        <Card variant="outlined">
            <CardActionArea onClick={onCardClick}>
                <CardContent>
                    <CardContentsContainer>
                        <Header>
                            <HeaderLeft>{title}</HeaderLeft>
                            <HeaderRight>{completed ? '완료됨' : '진행중'}</HeaderRight>
                        </Header>
                        <Body>
                            <ProgressContainer>
                                <ProgressTextsContainer>
                                    <ProgressTextsLeft>
                                        {progress}/{total}
                                    </ProgressTextsLeft>
                                    <ProgressTextsRight>{((progress / total) * 100).toFixed(0)}%</ProgressTextsRight>
                                </ProgressTextsContainer>
                                <ProgressBarContainer>
                                    <LinearProgress variant="determinate" value={(progress / total) * 100} />
                                </ProgressBarContainer>
                            </ProgressContainer>
                        </Body>
                    </CardContentsContainer>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

LearningCard.defaultProps = {
    idx: 0,
    title: '세트 제목',
    desc: '설명',
    progress: 3,
    total: 10,
    completed: false,
    actionCardClick(idx) {
        console.log(`card ${idx} clicked.`);
    },
};

export default LearningCard;
