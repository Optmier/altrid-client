import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import Button from '../../../AltridUI/Button/Button';
import CardPeopleIcon from '../../../AltridUI/Icons/CardPeopleIcon';
import CardKeyIcon from '../../../AltridUI/Icons/CardKeyIcon';
import CardClockIcon from '../../../AltridUI/Icons/CardClockIcon';

const ItemRoot = styled.div`
    background-color: #ffffff;
    border: 1px solid #e9edef;
    border-radius: 32px;
    display: flex;
    flex-direction: column;
    font-family: inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji',
        'Segoe UI Emoji', 'Segoe UI Symbol';
    padding: 25px 32px;

    & + & {
        margin-top: 16px;
    }
`;
const ItemTopInfoTagContaier = styled.div`
    align-items: center;
    display: flex;
`;
const TopInfoTag = styled.div`
    align-items: center;
    background-color: ${({ colors }) => {
        switch (colors) {
            case 'blue':
                return '#D4E2FC';
            case 'yellow':
                return '#FFF2D9';
            case 'purple':
                return '#E3DDF2';
            default:
                return '#ffffff';
        }
    }};
    color: ${({ colors }) => {
        switch (colors) {
            case 'blue':
                return '#174291';
            case 'yellow':
                return '#997328';
            case 'purple':
                return '#3B1689';
            default:
                return '#000000';
        }
    }};
    border-radius: 8px;
    display: flex;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: -0.01em;
    line-height: 16px;
    padding: 4px 6px;
    text-align: center;
    & + & {
        margin-left: 4px;
    }
    & span {
        margin-left: 5px;
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
const ItemMainInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin-top: 8px;
    width: 100%;
`;
const Title = styled.div`
    color: #000000;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.75rem;
`;
const Description = styled.div`
    color: #000000;
    font-weight: 700;
    font-size: 1rem;
    letter-spacing: -0.02em;
    line-height: 1.25rem;
`;
const CreatorName = styled.div``;
const ItemActionsContainer = styled.div`
    align-items: center;
    display: flex;
    justify-content: flex-start;
    margin-top: 32px;
    width: 100%;
    & button + button {
        margin-left: 8px;
    }
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
            {/* <ItemLeft>
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
            </ItemRight> */}
            <ItemTopInfoTagContaier>
                <TopInfoTag colors="blue">
                    <CardPeopleIcon style={{ marginTop: -1 }} />
                    <span>
                        {liveCounts}/{maxJoinCounts}
                    </span>
                </TopInfoTag>
                <TopInfoTag colors="purple">
                    <CardClockIcon />
                    <span>34시간 남음</span>
                </TopInfoTag>
                {publicState === 1 ? (
                    <TopInfoTag colors="yellow">
                        <CardKeyIcon width={6} height={12} viewBox="0 0 13 24" />
                        <span>암호 설정 됨</span>
                    </TopInfoTag>
                ) : null}
            </ItemTopInfoTagContaier>

            <ItemMainInfoContainer>
                <Title>{title}</Title>
                <Description>{description}</Description>
            </ItemMainInfoContainer>

            <ItemActionsContainer>
                <Button variant="light" sizes="medium" colors="purple" onClick={actionEnterStudy}>
                    입장하기
                </Button>
                {isMine ? (
                    <>
                        <Button variant="mono" sizes="medium" onClick={actionModifyStudy}>
                            수정하기
                        </Button>
                        <Button variant="outlined" sizes="medium" colors="red" onClick={actionDeleteStudy}>
                            종료하기
                        </Button>
                    </>
                ) : null}
            </ItemActionsContainer>
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
