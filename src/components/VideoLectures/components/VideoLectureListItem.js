import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import Button from '../../../AltridUI/Button/Button';
import CardEyetrackIcon from '../../../AltridUI/Icons/CardEyetrackIcon';
import CardClockIcon from '../../../AltridUI/Icons/CardClockIcon';
import CardPeopleIcon from '../../../AltridUI/Icons/CardPeopleIcon';

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
            case 'live':
                return '#FF6937';
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
            case 'live':
                return '#ffffff';
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
    & svg {
        margin-right: 5px;
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
const DueDate = styled.div`
    color: #77818b;
    letter-spacing: -0.02em;
    font-size: 16px;
    font-weight: 400;
    line-height: 20px;
    margin-top: 16px;
    & div.date-time-tag {
        font-size: 14px;
        font-weight: 700;
        line-height: 18px;
    }
`;
const ItemActionsContainer = styled.div`
    align-items: center;
    display: flex;
    justify-content: flex-start;
    margin-top: 20px;
    width: 100%;
    & button + button {
        margin-left: 8px;
    }
`;

function VideoLectureListItem({
    number,
    title,
    description,
    startDate,
    endDate,
    totalParticipants,
    currentParticipants,
    hasEyetrack,
    status,
    userType,
    serverDate,
    onEntranceClick,
    onLectureCloseClick,
    children,
}) {
    return (
        <ItemRoot>
            <ItemTopInfoTagContaier>
                {status === 0 ? (
                    <TopInfoTag colors="live">
                        <span>LIVE</span>
                    </TopInfoTag>
                ) : null}
                {hasEyetrack ? (
                    <TopInfoTag colors="blue">
                        <CardEyetrackIcon />
                        <span>시선추적 포함</span>
                    </TopInfoTag>
                ) : null}
                {status !== 2 ? (
                    <TopInfoTag colors="purple">
                        {status === 0 ? (
                            <>
                                <CardPeopleIcon style={{ marginTop: -1 }} />
                                <span>
                                    참여중 {currentParticipants}/{totalParticipants}
                                </span>
                            </>
                        ) : status === 1 ? (
                            <>
                                <CardClockIcon />
                                <span>
                                    {(() => {
                                        const diffHours = moment(startDate).diff(moment(serverDate), 'hours');
                                        return diffHours > 999 ? '999+' : diffHours;
                                    })()}
                                    시간 남음
                                </span>
                            </>
                        ) : null}
                    </TopInfoTag>
                ) : null}
            </ItemTopInfoTagContaier>

            <ItemMainInfoContainer>
                <Title>{title}</Title>
                <Description>{description}</Description>
                <DueDate>
                    <div className="date-time-tag">강의시간</div>
                    <div>
                        {moment(startDate).format('YY년 M월 D일 H:mm')} ~ {moment(endDate).format('YY년 M월 D일 H:mm')}
                    </div>
                </DueDate>
            </ItemMainInfoContainer>

            <ItemActionsContainer>
                {status === 0 ? (
                    <Button variant="light" sizes="medium" colors="purple" onClick={onEntranceClick}>
                        입장하기
                    </Button>
                ) : null}
                {status !== 2 && userType === 'teachers' ? (
                    <Button variant="outlined" sizes="medium" colors="red" onClick={onLectureCloseClick}>
                        종료하기
                    </Button>
                ) : null}
            </ItemActionsContainer>
        </ItemRoot>
    );
}

VideoLectureListItem.defaultProps = {
    number: 0,
    title: '강의 제목 입니다.',
    description: '강의 설명 입니다.',
    startDate: new Date(),
    endDate: new Date(),
    totalParticipants: 10,
    currentParticipants: 7,
    hasEyetrack: true,
    status: 0, // current: 0 | scheduled: 1 | done: 2
    userType: 'teachers',
    serverDate: new Date(),
    onEntranceClick() {},
    onLectureCloseClick() {},
};

export default VideoLectureListItem;
