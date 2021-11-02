import React from 'react';
import styled from 'styled-components';

const ItemRoot = styled.div`
    background-color: #ffffff;
    border-radius: 11px;
    display: flex;
    padding: 16px;
`;
const ItemLeft = styled.div`
    flex-basis: 70%;
    margin-right: 16px;
`;
const ItemRight = styled.div`
    align-items: center;
    border-left: 1px solid #e2e2e2;
    display: flex;
    justify-content: center;
    margin-left: 16px;
    width: 30%;
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
    dist,
    isMine,
    onEnter,
    onModify,
    onDelete,
    children,
}) {
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
                    <Dist>{dist === 0 ? '공개됨' : dist === 1 ? '비밀번호 설정됨' : null}</Dist>
                </SubInfo>
                <SessionEndDate>세션 종료일: {sessionEndDate.toDateString()}</SessionEndDate>
            </ItemLeft>
            <ItemRight>
                <button>입장하기</button>
                {isMine ? (
                    <>
                        <button>종료하기</button>
                        <button>수정하기</button>
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
    dist: 0, // 0: 공개됨 | 1: 비밀번호 걸려있음 | 2: 초대됨
    isMine: false,
    onEnter() {},
    onModify() {},
    onDelete() {},
};

export default CamstudyListItem;
