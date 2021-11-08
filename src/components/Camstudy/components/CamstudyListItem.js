import moment from 'moment';
import React from 'react';
import styled from 'styled-components';

const ItemRoot = styled.div`
    background-color: #ffffff;
    border-radius: 11px;
    display: flex;
    padding: 16px;

    & + & {
        margin-top: 16px;
    }
`;
const ItemLeft = styled.div`
    flex-basis: 70%;
    margin-right: 16px;
`;
const ItemRight = styled.div`
    align-items: center;
    border-left: 1px solid #e2e2e2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 16px;
    width: 30%;

    & button + button {
        margin-top: 8px;
    }
`;
const MainInfo = styled.div``;
const SubInfo = styled.div`
    color: #757575;
    display: flex;
    font-size: 0.9rem;
    justify-content: space-between;
    margin-top: 8px;
`;
const Title = styled.div`
    font-size: 1.2rem;
    font-weight: 600;
`;
const Description = styled.div``;
const CreatorName = styled.div``;
const LiveCounts = styled.div``;
const MaxCounts = styled.div``;
const Dist = styled.div``;
const SessionEndDate = styled.div`
    color: #757575;
    font-size: 0.9rem;
    margin-top: 8px;
`;

function CamstudyListItem({
    roomId,
    creator,
    title,
    description,
    rules,
    liveCounts,
    maxJoinCounts,
    sessionEndDate,
    publicState,
    isMine,
    onEnter,
    onModify,
    onDelete,
    children,
}) {
    const actionEnterStudy = () => {
        onEnter(roomId, rules);
    };

    const actionModifyStudy = () => {
        onModify(roomId);
    };

    const actionDeleteStudy = () => {
        onDelete(roomId);
    };

    return (
        <ItemRoot>
            <ItemLeft>
                <MainInfo>
                    <Title>{title}</Title>
                    <Description>{description}</Description>
                </MainInfo>
                <SubInfo>
                    <CreatorName>{creator}</CreatorName>
                    <LiveCounts>실시간 {liveCounts}명</LiveCounts>
                    <MaxCounts>최대 {maxJoinCounts}명 까지</MaxCounts>
                    <Dist>{publicState === 0 ? '공개됨' : publicState === 1 ? '비밀번호 설정됨' : null}</Dist>
                </SubInfo>
                <SessionEndDate>자동 종료일: {moment(sessionEndDate).format('YY년 MM월 DD일 HH:mm')}</SessionEndDate>
            </ItemLeft>
            <ItemRight>
                <button onClick={actionEnterStudy}>입장하기</button>
                {isMine ? (
                    <>
                        <button onClick={actionModifyStudy}>수정하기</button>
                        <button onClick={actionDeleteStudy}>종료하기</button>
                    </>
                ) : null}
            </ItemRight>
        </ItemRoot>
    );
}

CamstudyListItem.defaultProps = {
    roomId: 'id0001',
    creator: '만든이',
    title: '방 제목',
    description: '방 설명입니다',
    rules: {
        delta: [],
        render: '',
    },
    liveCounts: 0,
    maxJoinCounts: 4,
    sessionEndDate: new Date(),
    publicState: 0, // 0: 공개됨 | 1: 비밀번호 걸려있음 | 2: 초대됨
    isMine: false,
    onEnter() {},
    onModify() {},
    onDelete() {},
};

export default CamstudyListItem;
