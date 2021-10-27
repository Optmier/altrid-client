import React, { useState, useEffect } from 'react';
import '../../styles/class_card.scss';
import IsPresence from '../essentials/IsPresence';
import CardPopOver from '../essentials/CardPopOver';
import ClassDialog from '../essentials/ClassDialog';
import styled from 'styled-components';
import { Drawer, Tooltip } from '@material-ui/core';
import ClassDrawer from '../essentials/ClassDrawer';
import { SecondsToHoursAndMinutes, SecondtoMinute } from '../essentials/TimeChange';
import { useDispatch, useSelector } from 'react-redux';
import { postActived, changeDueDate } from '../../redux_modules/assignmentActived';
import { copyDraft, deleteDraft } from '../../redux_modules/assignmentDraft';
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

function CardDraft({ cardData, match, history }) {
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
                <div className="class-card-root">
                    <div className="class-card-header class-card-wrapper">
                        <TooltipCard title={cardData['title']}>
                            <div className="card-title-p">{cardData['title']}</div>
                        </TooltipCard>

                        <span className="card-option" onClick={handleOptionClick} style={{ paddingLeft: '1rem' }}>
                            <svg width="19" height="5" viewBox="0 0 19 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="2.5" cy="2.5" r="2.5" fill="white" />
                                <circle cx="16.5" cy="2.5" r="2.5" fill="white" />
                                <circle cx="9.5" cy="2.5" r="2.5" fill="white" />
                            </svg>
                        </span>
                    </div>
                    <div></div>
                    <StyleDraftIng>
                        <h4>과제 제작중 ...</h4>
                    </StyleDraftIng>
                </div>
            ) : (
                <div className="class-card-root">
                    <div className="class-card-header-on class-card-wrapper" style={{ backgroundColor: '#43138B' }}>
                        <TooltipCard title={cardData['title']}>
                            <div className="card-title-p" style={{ width: 'calc(100% - 36px)' }}>
                                {cardData['title']}
                            </div>
                        </TooltipCard>

                        <span className="card-option" onClick={handleOptionClick} style={{ paddingLeft: '1rem' }}>
                            <svg width="19" height="5" viewBox="0 0 19 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="2.5" cy="2.5" r="2.5" fill="white" />
                                <circle cx="16.5" cy="2.5" r="2.5" fill="white" />
                                <circle cx="9.5" cy="2.5" r="2.5" fill="white" />
                            </svg>
                        </span>
                    </div>
                    <div></div>
                    <div className="class-card-contents class-card-wrapper" onClick={handlePreTest}>
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

                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingTop: '8px',
                                    fontSize: '0.82rem',
                                    color: '#706d6d',
                                }}
                            >
                                <InfoItems
                                    title={'게시 수'}
                                    contents={cardData['actived_count'] ? cardData['actived_count'] + '회' : '미게시'}
                                />
                                <HtmlTooltip
                                    placement="bottom"
                                    title={
                                        <>
                                            {cardData['class_name']
                                                ? Array.from(new Set(cardData['class_name'].split(','))).map((name, key) => (
                                                      <div key={key} className="class-button">
                                                          {name}반{key !== 0 ? ' /' : ' '}
                                                      </div>
                                                  ))
                                                : '게시중인 반 없음'}
                                        </>
                                    }
                                >
                                    <LaunchIcon color="inherit" fontSize="inherit" style={{ marginLeft: '6px' }} />
                                </HtmlTooltip>
                            </div>
                        </div>
                    </div>
                    {!(assignmentTypeState < 100) ? (
                        <div className="class-card-bottom-right">
                            {/* 시선흐름 유무 */}
                            <IsPresence type={'eye'} able={cardData['eyetrack']} align="left" />
                            {/* 유형별 분석 유무 */}
                            <IsPresence type={'analysis'} able={assignmentTypeState} align="left" />
                        </div>
                    ) : (
                        <HtmlTooltip2
                            title={
                                <>
                                    <ErrorOutlineIcon />
                                    <p>유형별 분석의 최소 조건은 하단 배너를 클릭하여 확인해주세요!</p>
                                </>
                            }
                        >
                            <div className="class-card-bottom-right">
                                {/* 시선흐름 유무 */}
                                <IsPresence type={'eye'} able={cardData['eyetrack']} align="left" />
                                {/* 유형별 분석 유무 */}
                                <IsPresence type={'analysis'} able={assignmentTypeState} align="left" />
                            </div>
                        </HtmlTooltip2>
                    )}
                </div>
            )}
        </>
    );
}

export default React.memo(withRouter(CardDraft));
