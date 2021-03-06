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
    @media all and (max-width: 799px) {
        padding: 24px 16px;
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
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    white-space: nowrap;
`;
const Description = styled.div`
    color: #000000;
    font-weight: 700;
    font-size: 1rem;
    letter-spacing: -0.02em;
    line-height: 1.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    white-space: nowrap;
`;
// const CreatorName = styled.div``;
const ItemActionsContainer = styled.div`
    align-items: center;
    display: flex;
    justify-content: flex-start;
    margin-top: 32px;
    overflow: auto;
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
                    <LiveCounts>????????? {liveCounts}???</LiveCounts>
                    <MaxCounts>?????? {maxJoinCounts}??? ??????</MaxCounts>
                    <Dist>{publicState === 0 ? '?????????' : publicState === 1 ? '???????????? ?????????' : null}</Dist>
                </SubInfo>
                <SessionEndDate>?????? ?????????: {moment(sessionEndDate).format('YY??? MM??? DD??? HH:mm')}</SessionEndDate>
            </ItemLeft>
            <ItemRight>
                <button onClick={actionEnterStudy}>????????????</button>
                {isMine ? (
                    <>
                        <button onClick={actionModifyStudy}>????????????</button>
                        <button onClick={actionDeleteStudy}>????????????</button>
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
                    <span>
                        {(() => {
                            const diffHours = moment(sessionEndDate).diff(moment(), 'hours');
                            return diffHours > 999 ? '999+' : diffHours;
                        })()}
                        ?????? ??????
                    </span>
                </TopInfoTag>
                {publicState === 1 ? (
                    <TopInfoTag colors="yellow">
                        <CardKeyIcon width={6} height={12} viewBox="0 0 13 24" />
                        <span>?????? ?????? ???</span>
                    </TopInfoTag>
                ) : null}
            </ItemTopInfoTagContaier>

            <ItemMainInfoContainer>
                <Title>{title}</Title>
                <Description>{description}</Description>
            </ItemMainInfoContainer>

            <ItemActionsContainer>
                <Button variant="light" sizes="medium" colors="purple" onClick={actionEnterStudy}>
                    ????????????
                </Button>
                {isMine ? (
                    <>
                        <Button variant="mono" sizes="medium" onClick={actionModifyStudy}>
                            ????????????
                        </Button>
                        <Button variant="outlined" sizes="medium" colors="red" onClick={actionDeleteStudy}>
                            ????????????
                        </Button>
                    </>
                ) : null}
            </ItemActionsContainer>
        </ItemRoot>
    );
}

CamstudyListItem.defaultProps = {
    roomId: 'id0001',
    creator: '?????????',
    title: '??? ??????',
    description: '??? ???????????????',
    rules: {
        delta: [],
        render: '',
    },
    liveCounts: 0,
    maxJoinCounts: 4,
    sessionEndDate: new Date(),
    publicState: 0, // 0: ????????? | 1: ???????????? ???????????? | 2: ?????????
    isMine: false,
    onEnter() {},
    onModify() {},
    onDelete() {},
};

export default CamstudyListItem;
