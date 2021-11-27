import React, { useState, useEffect } from 'react';
// import '../../styles/class_card.scss';
import IsPresence from '../essentials/IsPresence';
import CardPopOver from '../essentials/CardPopOver';
import ClassDialog from '../essentials/ClassDialog';
import styled from 'styled-components';
import { Drawer, Tooltip } from '@material-ui/core';
import ClassDrawer from '../essentials/ClassDrawer';
import { SecondsToHoursAndMinutes, SecondtoMinute } from '../essentials/TimeChange';
import { useDispatch, useSelector } from 'react-redux';
import { postActived, changeDueDate } from '../../redux_modules/assignmentActived';
import assignmentDraft, { copyDraft, deleteDraft } from '../../redux_modules/assignmentDraft';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import ClassDialogDelete from '../essentials/ClassDialogDelete';
import CardProblemPreview from '../TOFELRenderer/CardProblemPreview';
import * as $ from 'jquery';
import getAchieveValueForTypes from '../essentials/GetAchieveValueForTypes';
import ClassDialogCopy from '../essentials/ClassDialogCopy';
import TooltipCard from '../essentials/TooltipCard';
import LaunchIcon from '@material-ui/icons/Launch';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

const AssignCard = styled.div`
    & .assgin-class {
        overflow-x: auto;
        /* max-width: 384px; */
        /* width: 100%; */
        height: 262px;
        flex-basis: 1%;
        display: flex;
        flex-direction: column;
        padding: 32px 20px;
        border: 1px solid #e9edef;
        box-sizing: border-box;
        border-radius: 32px;
        margin: 8px 8px;
        & .card-subTitle-p {
            width: 230px;
            color: #000000;
            font-size: 18px;
            font-weight: bold;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-bottom: 16px;
        }
        & .check-list {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            & .lists {
                display: flex;
                & p {
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    width: 100px;
                    overflow: hidden;
                }
            }
            & .eyetracker {
                display: flex;
                align-items: center;
                background-color: #d4e2fc;
                border-radius: 8px;
                padding: 4px 6px;
                margin-right: 8px;
                & p {
                }
            }
            & .possible {
                display: flex;
                align-items: center;
                align-content: center;
                background: #e3ddf2;
                border-radius: 8px;
                padding: 4px 6px;
                & p {
                    color: #3b1689;
                    margin-left: 4px;
                }
            }
            & .impossible {
                margin-right: 8px;
                display: flex;
                align-items: center;
                align-content: center;
                border-radius: 8px;
                padding: 4px 6px;
                & p {
                    color: #000000;
                }
            }
        }
        & .card-item {
            display: flex;
            justify-content: space-between;

            & .card-content-time {
                display: flex;
            }
        }
    }
`;

const StyleDraftIng = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8c8989;
`;

const InfoItems = ({ title, contents }) => {
    return (
        <div className="card-item">
            <div className="card-content-title-p">{title}</div>
            {title === '유형별 분석' ? (
                <div className="card-content-p">{contents}</div>
            ) : (
                <TooltipCard title={contents}>
                    <div className="card-content-p">{contents}</div>
                </TooltipCard>
            )}
        </div>
    );
};
const TimeItems = ({ title, time_limit }) => {
    /** 제한시간 분할(분,초) 메소드 */
    // let mm = SecondtoMinute(time_limit)[0];
    // let ss = SecondtoMinute(time_limit)[1];
    /** 시간, 분으로 분할 */
    const hh = SecondsToHoursAndMinutes(time_limit)[0];
    const mm = SecondsToHoursAndMinutes(time_limit)[1];

    return (
        <div className="card-item">
            <div className="card-content-title-p">{title}</div>

            {time_limit === -2 ? (
                <div className="card-content-p">없음</div>
            ) : (
                <TooltipCard title={hh + '시간 ' + mm + '분'}>
                    <div className="card-content-time">
                        {hh > 0 ? (
                            <div className="card-content-p" style={{ marginRight: '0.4rem' }}>
                                {hh}시간
                            </div>
                        ) : null}
                        <div className="card-content-p">{mm}분</div>
                    </div>
                </TooltipCard>
            )}
        </div>
    );
};
const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
        padding: '0.75rem 1rem',
        fontSize: '0.85rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '500',
        borderRadius: '10px',

        '&p': {
            paddingLeft: '0.5rem',
        },
    },
}))(Tooltip);
const HtmlTooltip2 = withStyles((theme) => ({
    tooltip: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(253, 236, 234)',
        filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
        color: '#f44336',
        padding: '6px 16px',
        borderRadius: '4px',

        '& p': {
            margin: '0 0 0 1rem',
            color: 'rgb(97, 26, 21)',
            fontSize: '0.875rem',
            fontWeight: '400',
        },
    },
}))(Tooltip);

function AssignmentDraft({ cardData, match, history }) {
    /** redux actived-state */
    const { data, loading, error } = useSelector((state) => state.assignmentActived.dueData);
    const dispatch = useDispatch();

    /** pop-over (옵션 선택) 메소드 */
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOptionClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleOptionClose = () => {
        setAnchorEl(null);
    };

    /** class-dialog 메소드 */
    // type 4가지 : date-init(과제 게시), date-modify(과제 기한 수정), test-init(과제 완료), test-modify(과제 재시작)
    const [dateDialogopen, setDateDialogopen] = useState(false);
    const [copyDialogopen, setCopyDialogopen] = useState(false);
    const [deleteDialogopen, setDeleteDialogopen] = useState(false);
    const [selectClassState, setSelectClassState] = useState(null);

    const handleDialogOpen = (type) => {
        setDateDialogopen(true);
        handleOptionClose();
    };

    const handleDateDialogClose = (e) => {
        const { name } = e.target;
        const due_date = data ? data : null;

        if (name === 'button') {
            if (due_date && selectClassState) {
                //과제 게시하기 버튼 클릭

                setDateDialogopen(false);
                dispatch(postActived(cardData, selectClassState, due_date));
            } else if (!due_date) {
                alert('과제 기한 변경은 필수사항 입니다.');
            } else if (!selectClassState) {
                alert('클래스 선택은 필수사항 입니다.');
            }
        } else {
            setDateDialogopen(false);
        }

        dispatch(changeDueDate(''));
    };

    const handleDeleteDialogOpen = () => {
        setDeleteDialogopen(true);
        handleOptionClose();
    };
    const handleDeleteDateDialogClose = (e) => {
        const { name } = e.target;

        if (name === 'yes') {
            dispatch(deleteDraft(cardData['idx']));
            setDeleteDialogopen(false);
        } else {
            setDeleteDialogopen(false);
        }
    };

    /** drawer 메소드 */
    const [openCreateNewDrawer, setOpenCreateNewDrawer] = useState(false);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpenCreateNewDrawer(open);

        handleOptionClose();
    };

    /** ProblemPreview 메소드 */
    const [openPreview, setOpenPreview] = useState(false);

    const handlePreviewOpen = () => {
        handleOptionClose();
        if (cardData['contents_data'].flatMap((m) => m.problemDatas).length === 0) {
            return alert('과제 수정을 통해 에디터에서 문항을 추가해주세요 !');
        }
        setOpenPreview(true);
    };

    const handlePreviewClose = () => {
        setOpenPreview(false);
    };

    const handlePreTest = (e) => {
        const $target = $(e.target);
        if (!($target.parents('.card-option').length || $target.attr('class') === 'card-option')) {
            handlePreviewOpen();
        }
    };

    /** 유형별 분석 메소드 */
    const [assignmentTypeState, setAssignmentTypeState] = useState(0);
    const _o = {};
    useEffect(() => {
        if (cardData['contents_data']) {
            cardData['contents_data']
                .flatMap((m) => m.problemDatas)
                .forEach((d) => {
                    const cat = d.category;
                    !_o[cat] && (_o[cat] = {});
                    !_o[cat].category && (_o[cat].category = 0);
                    !_o[cat].count && (_o[cat].count = 0);
                    _o[cat].category = cat;
                    _o[cat].count += 1;
                });

            setAssignmentTypeState(
                getAchieveValueForTypes(
                    Object.keys(_o).map((k) => _o[k]),
                    3,
                ).value,
            );
        }
        return () => {};
    }, [cardData['contents_data']]);

    const handleCopyDialogOpen = (e) => {
        setCopyDialogopen(true);
        handleOptionClose();
    };

    const handleCopyDialogClose = (e, newTitle) => {
        const { name } = e.target;
        if (name === 'yes') {
            dispatch(copyDraft(cardData['idx'], newTitle, cardData));
        }
        setCopyDialogopen(false);
    };

    return (
        <>
            <Drawer anchor="right" open={openCreateNewDrawer}>
                <ClassDrawer ver="modify" cardData={cardData} handleClose={toggleDrawer(false)} />
            </Drawer>

            <CardProblemPreview
                openPreview={openPreview}
                metadata={cardData['contents_data'] ? cardData['contents_data'] : []}
                handlePreviewClose={handlePreviewClose}
                timeLimit={cardData['time_limit']}
            ></CardProblemPreview>

            <CardPopOver
                contents_data={cardData['contents_data']}
                handlePreTest={handlePreTest}
                handleDialogOpen={handleDialogOpen}
                handleDeleteDialogOpen={handleDeleteDialogOpen}
                handleDrawerOpen={toggleDrawer(true)}
                handleOptionClick={handleOptionClick}
                handleOptionClose={handleOptionClose}
                handleThisCopy={handleCopyDialogOpen}
                anchorEl={anchorEl}
            />
            <ClassDialog
                type="date"
                subType="init"
                open={dateDialogopen}
                handleDialogClose={handleDateDialogClose}
                setSelectClassState={setSelectClassState}
                eyetrackAssigmnet={cardData['eyetrack']}
            />

            <ClassDialogCopy
                ver="assignment"
                open={copyDialogopen}
                defaultTitle={cardData['title']}
                handleDialogClose={handleCopyDialogClose}
            />
            <ClassDialogDelete ver="assignment" open={deleteDialogopen} handleDialogClose={handleDeleteDateDialogClose} />

            {!cardData['contents_data'] ? (
                <div className="">
                    <div className="class-card-header class-card-wrapper">
                        <TooltipCard title={cardData['title']}>
                            <div className="card-title-p">{cardData['title']}</div>
                        </TooltipCard>

                        <span className="card-option" onClick={handleOptionClick} style={{ paddingLeft: '1rem' }}>
                            <svg width="19" height="5" viewBox="0 0 19 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="2.5" cy="2.5" r="2.5" />
                                <circle cx="16.5" cy="2.5" r="2.5" />
                                <circle cx="9.5" cy="2.5" r="2.5" />
                            </svg>
                        </span>
                    </div>
                    <div></div>
                    <StyleDraftIng>
                        <h4>과제 제작중 ...</h4>
                    </StyleDraftIng>
                </div>
            ) : (
                <AssignCard>
                    <div className="assgin-class">
                        <div className="check-list">
                            <div className="lists">
                                {cardData['eyetrack'] ? (
                                    <div className="eyetracker">
                                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M0.59082 5C1.06082 2.44 3.30432 0.5 6.00032 0.5C8.69632 0.5 10.9393 2.44 11.4098 5C10.9398 7.56 8.69632 9.5 6.00032 9.5C3.30432 9.5 1.06132 7.56 0.59082 5ZM6.00032 7.5C6.66336 7.5 7.29925 7.23661 7.76809 6.76777C8.23693 6.29893 8.50032 5.66304 8.50032 5C8.50032 4.33696 8.23693 3.70107 7.76809 3.23223C7.29925 2.76339 6.66336 2.5 6.00032 2.5C5.33728 2.5 4.70139 2.76339 4.23255 3.23223C3.76371 3.70107 3.50032 4.33696 3.50032 5C3.50032 5.66304 3.76371 6.29893 4.23255 6.76777C4.70139 7.23661 5.33728 7.5 6.00032 7.5ZM6.00032 6.5C5.6025 6.5 5.22096 6.34196 4.93966 6.06066C4.65836 5.77936 4.50032 5.39782 4.50032 5C4.50032 4.60218 4.65836 4.22064 4.93966 3.93934C5.22096 3.65804 5.6025 3.5 6.00032 3.5C6.39815 3.5 6.77968 3.65804 7.06098 3.93934C7.34229 4.22064 7.50032 4.60218 7.50032 5C7.50032 5.39782 7.34229 5.77936 7.06098 6.06066C6.77968 6.34196 6.39815 6.5 6.00032 6.5Z"
                                                fill="#174291"
                                            />
                                        </svg>

                                        <p>시선흐름 분석 포함</p>
                                    </div>
                                ) : (
                                    <div style={{ color: '#000000', background: '#E9EDEF' }} className="impossible">
                                        <p>시선흐름 분석 미포함</p>
                                    </div>
                                )}

                                {!(assignmentTypeState < 100) ? (
                                    <>
                                        <div className="possible">
                                            <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M5.801 4.87976L6.507 5.58576L10.74 1.35276L11.447 2.05976L6.507 6.99976L3.325 3.81776L4.032 3.11076L5.0945 4.17326L5.801 4.87926V4.87976ZM5.802 3.46576L8.278 0.989258L8.983 1.69426L6.507 4.17076L5.802 3.46576ZM4.3885 6.29326L3.682 6.99976L0.5 3.81776L1.207 3.11076L1.9135 3.81726L1.913 3.81776L4.3885 6.29326Z"
                                                    fill="#3B1689"
                                                />
                                            </svg>
                                            <p>유형별 분석 가능</p>
                                        </div>
                                    </>
                                ) : (
                                    <div style={{ color: '#000000', background: '#E9EDEF' }} className="impossible">
                                        <p>유형별 분석 불가능</p>
                                    </div>
                                )}
                            </div>

                            <span className="card-option" onClick={handleOptionClick} style={{ paddingLeft: '1rem' }}>
                                <svg width="19" height="5" viewBox="0 0 19 5" fill="black" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="2.5" cy="2.5" r="2.5" fill="black" />
                                    <circle cx="16.5" cy="2.5" r="2.5" fill="black" />
                                    <circle cx="9.5" cy="2.5" r="2.5" fill="black" />
                                </svg>
                            </span>
                        </div>

                        <div className="classnew">
                            <TooltipCard title={cardData['title']}>
                                <div
                                    className="card-title-p"
                                    style={{ color: '#000000', fontWeight: ' bold', fontSize: '24px', overflowX: 'hidden' }}
                                >
                                    {cardData['title']}
                                </div>
                            </TooltipCard>
                        </div>
                        <div className="classnew" onClick={handlePreTest}>
                            <div className="contents-block">
                                <div className="card-item">
                                    <TooltipCard title={cardData['description']}>
                                        <div className="card-subTitle-p">{cardData['description']}</div>
                                    </TooltipCard>
                                </div>
                            </div>

                            <div className="contents-block">
                                <InfoItems
                                    title={'문항수'}
                                    contents={cardData['contents_data'].flatMap((m) => m.problemDatas).length + '문제'}
                                />
                                <TimeItems title={'제한시간'} time_limit={cardData['time_limit']} />
                                <InfoItems title={'최종수정'} contents={moment(cardData['updated']).format('MM월 DD일 HH시 mm분')} />
                                <InfoItems
                                    title={'게시 수'}
                                    contents={cardData['actived_count'] ? cardData['actived_count'] + '회' : '미게시'}
                                />
                            </div>
                        </div>
                    </div>
                </AssignCard>
            )}
        </>
    );
}

export default React.memo(withRouter(AssignmentDraft));

// {!(assignmentTypeState < 100) ? (
//     <div className="class-card-bottom-right">
//         {/* 시선흐름 유무 */}
//         <IsPresence type={'eye'} able={cardData['eyetrack']} align="left" />
//         {/* 유형별 분석 유무 */}
//         <IsPresence type={'analysis'} able={assignmentTypeState} align="left" />
//     </div>
// ) : (
//     <HtmlTooltip2
//         title={
//             <>
//                 <ErrorOutlineIcon />
//                 <p>유형별 분석의 최소 조건은 하단 배너를 클릭하여 확인해주세요!</p>
//             </>
//         }
//     >
//         <div className="class-card-bottom-right">
//             {/* 시선흐름 유무 */}
//             <IsPresence type={'eye'} able={cardData['eyetrack']} align="left" />
//             {/* 유형별 분석 유무 */}
//             <IsPresence type={'analysis'} able={assignmentTypeState} align="left" />
//         </div>
//     </HtmlTooltip2>
// )}
