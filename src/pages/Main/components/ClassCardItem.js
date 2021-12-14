import React from 'react';
import styled from 'styled-components';
import Typography from '../../../AltridUI/Typography/Typography';

const ThemeCreator = (themeColor) => {
    switch (themeColor) {
        case 'purple':
            return {
                'background-color': '#F4F1FA',
                color: '#200656',
                '&:hover': {
                    'border-color': '#C1B5E3',
                },
                '& div.class-day-tags > div.tag': {
                    'background-color': '#E3DDF2',
                    color: '#200656',
                },
                '& div.bottom-infos': {
                    color: '#200656',
                    fill: '#200656',
                    '& div.bottom-item': {
                        '& + div.bottom-item::before': {
                            'border-left-color': '#E3DDF2',
                        },
                    },
                },
            };
        case 'blue':
            return {
                'background-color': '#EFF3FE',
                color: '#174291',
                '&:hover': {
                    'border-color': '#A0BFF8',
                },
                '& div.class-day-tags > div.tag': {
                    'background-color': '#D4E2FC',
                    color: '#174291',
                },
                '& div.bottom-infos': {
                    color: '#174291',
                    fill: '#174291',
                    '& div.bottom-item': {
                        '& + div.bottom-item::before': {
                            'border-left-color': '#D4E2FC',
                        },
                    },
                },
            };
        case 'green':
            return {
                'background-color': '#F0FFF9',
                color: '#0A5946',
                '&:hover': {
                    'border-color': '#71FFC8',
                },
                '& div.class-day-tags > div.tag': {
                    'background-color': '#AEFFE0',
                    color: '#0A5946',
                },
                '& div.bottom-infos': {
                    color: '#0A5946',
                    fill: '#0A5946',
                    '& div.bottom-item': {
                        '& + div.bottom-item::before': {
                            'border-left-color': '#AEFFE0',
                        },
                    },
                },
            };
        case 'yellow':
            return {
                'background-color': '#FFFAF0',
                color: '#997328',
                '&:hover': {
                    'border-color': '#FFE3AC',
                },
                '& div.class-day-tags > div.tag': {
                    'background-color': '#FFF2D9',
                    color: '#997328',
                },
                '& div.bottom-infos': {
                    color: '#997328',
                    fill: '#997328',
                    '& div.bottom-item': {
                        '& + div.bottom-item::before': {
                            'border-left-color': '#FFF2D9',
                        },
                    },
                },
            };
        case 'orange':
            return {
                'background-color': '#FFF3EF',
                color: '#9A3F21',
                '&:hover': {
                    'border-color': '#FABDA5',
                },
                '& div.class-day-tags > div.tag': {
                    'background-color': '#FFE1D6',
                    color: '#9A3F21',
                },
                '& div.bottom-infos': {
                    color: '#9A3F21',
                    fill: '#9A3F21',
                    '& div.bottom-item': {
                        '& + div.bottom-item::before': {
                            'border-left-color': '#FFE1D6',
                        },
                    },
                },
            };
        case 'red':
            return {
                'background-color': '#FFEFED',
                color: '#870F00',
                '&:hover': {
                    'border-color': '#F1998E',
                },
                '& div.class-day-tags > div.tag': {
                    'background-color': '#FED7D2',
                    color: '#870F00',
                },
                '& div.bottom-infos': {
                    color: '#870F00',
                    fill: '#870F00',
                    '& div.bottom-item': {
                        '& + div.bottom-item::before': {
                            'border-left-color': '#FED7D2',
                        },
                    },
                },
            };
        default:
            return {
                'background-color': '#F4F1FA',
                color: '#200656',
                '&:hover': {
                    'border-color': '#C1B5E3',
                },
                '& div.class-day-tags > div.tag': {
                    'background-color': '#E3DDF2',
                    color: '#200656',
                },
                '& div.bottom-infos': {
                    color: '#200656',
                    fill: '#200656',
                    '& div.bottom-item': {
                        '& + div.bottom-item::before': {
                            'border-left-color': '#E3DDF2',
                        },
                    },
                },
            };
    }
};

const CardRoot = styled.div`
    cursor: pointer;
    border: 2px solid transparent;
    border-radius: 32px;
    display: flex;
    flex-direction: column;
    padding: 32px;
    height: 180px;
    ${({ themeColor }) => ThemeCreator(themeColor)};
    @media (max-width: 640px) {
        padding: 16px;
        user-select: none;
    }
`;
const DayTagsContainer = styled.div`
    align-items: center;
    display: flex;
    justify-content: flex-start;
    pointer-events: none;
`;
const DayTag = styled.div`
    border-radius: 8px;
    padding: 4px 6px;
    & + & {
        margin-left: 4px;
    }
`;
const ClassTitle = styled.div`
    margin-top: 16px;
    overflow: hidden;
    & div.altrid-typography {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`;
const ClassDescription = styled.div`
    margin-top: 8px;
    overflow: hidden;
    & div.altrid-typography {
        display: -webkit-box;
        height: 66px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
    }
`;
const ClassBottomInfoContainer = styled.div`
    align-items: center;
    display: flex;
    justify-content: flex-start;
    margin-top: auto;
`;
const BottomInfoItem = styled.div`
    align-items: center;
    display: flex;
    &:first-child {
        overflow: hidden;
        & div.altrid-typography {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    & svg {
        margin-right: 6px;
        margin-top: -3px;
    }
    & + &::before {
        border-left: 1px solid transparent;
        content: '';
        display: inline-block;
        margin: 0 8px;
        margin-bottom: 0px;
        height: 8px;
    }
`;

function ClassCardItem({
    themeColor,
    classTitle,
    classDescription,
    teacherName,
    classDay,
    numOfStudents,
    numOfAssignments,
    onClick,
    children,
}) {
    return (
        <CardRoot themeColor={themeColor} onClick={onClick}>
            <DayTagsContainer className="class-day-tags">
                {classDay.map((s) => (
                    <DayTag className="tag" key={s}>
                        <Typography type="label" size="s" bold>
                            {s}
                        </Typography>
                    </DayTag>
                ))}
            </DayTagsContainer>
            <ClassTitle>
                <Typography type="label" size="xxl" bold title={classTitle}>
                    {classTitle}
                </Typography>
            </ClassTitle>
            <ClassDescription>
                <Typography type="label" size="xl" bold title={classDescription}>
                    {classDescription}
                </Typography>
            </ClassDescription>
            <ClassBottomInfoContainer className="bottom-infos">
                <BottomInfoItem className="bottom-item">
                    <Typography type="label" size="xl" bold title={teacherName}>
                        {teacherName}
                    </Typography>
                </BottomInfoItem>
                <BottomInfoItem className="bottom-item">
                    <svg width="15" height="15" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.333008 14.6665C0.333008 13.252 0.894911 11.8955 1.89511 10.8953C2.8953 9.89507 4.25185 9.33317 5.66634 9.33317C7.08083 9.33317 8.43738 9.89507 9.43758 10.8953C10.4378 11.8955 10.9997 13.252 10.9997 14.6665H0.333008ZM5.66634 8.6665C3.45634 8.6665 1.66634 6.8765 1.66634 4.6665C1.66634 2.4565 3.45634 0.666504 5.66634 0.666504C7.87634 0.666504 9.66634 2.4565 9.66634 4.6665C9.66634 6.8765 7.87634 8.6665 5.66634 8.6665ZM10.575 10.1552C11.5948 10.4173 12.5059 10.9944 13.1786 11.8044C13.8513 12.6144 14.2513 13.616 14.3217 14.6665H12.333C12.333 12.9265 11.6663 11.3425 10.575 10.1552ZM9.22634 8.63784C9.78501 8.13815 10.2318 7.52606 10.5374 6.84167C10.843 6.15727 11.0005 5.41603 10.9997 4.6665C11.0011 3.75548 10.7681 2.85942 10.323 2.0645C11.0781 2.21623 11.7573 2.62475 12.2453 3.22063C12.7333 3.81652 12.9998 4.56299 12.9997 5.33317C12.9999 5.80815 12.8985 6.27768 12.7024 6.71029C12.5063 7.1429 12.22 7.5286 11.8627 7.84153C11.5054 8.15447 11.0853 8.38741 10.6306 8.52475C10.1759 8.66208 9.69715 8.70064 9.22634 8.63784Z" />
                    </svg>
                    <Typography type="label" size="xl" bold title="학생 수">
                        {numOfStudents}
                    </Typography>
                </BottomInfoItem>
                <BottomInfoItem className="bottom-item">
                    <svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.00033 9.00016V1.00016C2.00033 0.823352 2.07056 0.653782 2.19559 0.528758C2.32061 0.403734 2.49018 0.333496 2.66699 0.333496H13.3337C13.5105 0.333496 13.68 0.403734 13.8051 0.528758C13.9301 0.653782 14.0003 0.823352 14.0003 1.00016V11.6668C14.0003 12.1973 13.7896 12.706 13.4145 13.081C13.0395 13.4561 12.5308 13.6668 12.0003 13.6668H2.66699C2.13656 13.6668 1.62785 13.4561 1.25278 13.081C0.877706 12.706 0.666992 12.1973 0.666992 11.6668V10.3335H11.3337V11.6668C11.3337 11.8436 11.4039 12.0132 11.5289 12.1382C11.6539 12.2633 11.8235 12.3335 12.0003 12.3335C12.1771 12.3335 12.3467 12.2633 12.4717 12.1382C12.5968 12.0132 12.667 11.8436 12.667 11.6668V9.00016H2.00033Z" />
                    </svg>
                    <Typography type="label" size="xl" bold title="과제 수">
                        {numOfAssignments}
                    </Typography>
                </BottomInfoItem>
            </ClassBottomInfoContainer>
        </CardRoot>
    );
}

ClassCardItem.defaultProps = {
    themeColor: 'purple',
    classTitle: '클래스 이름',
    classDescription: '클래스 설명 입니다.',
    teacherName: '선생님',
    classDay: ['월', '수', '금'],
    numOfStudents: 3,
    numOfAssignments: 10,
};

export default ClassCardItem;
