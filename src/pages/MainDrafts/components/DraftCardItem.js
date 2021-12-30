/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Typography from '../../../AltridUI/Typography/Typography';
import getAchieveValueForTypes from '../../../components/essentials/GetAchieveValueForTypes';
import { changeDueDate, postActived } from '../../../redux_modules/assignmentActived';
import { copyDraft, deleteDraft } from '../../../redux_modules/assignmentDraft';
import moment from 'moment-timezone';
import * as $ from 'jquery';
import { SecondsToHoursAndMinutes } from '../../../components/essentials/TimeChange';
import { Drawer } from '@material-ui/core';
import CardPopOver from '../../../components/essentials/CardPopOver';
import CardProblemPreview from '../../../components/TOFELRenderer/CardProblemPreview';
import ClassDrawer from '../../../components/essentials/ClassDrawer';
import ClassDialog from '../../../components/essentials/ClassDialog';
import ClassDialogCopy from '../../../components/essentials/ClassDialogCopy';
import ClassDialogDelete from '../../../components/essentials/ClassDialogDelete';

const CardRoot = styled.div`
    cursor: pointer;
    border: 1px solid #e9edef;
    border-radius: 32px;
    display: flex;
    flex-direction: column;
    padding: 32px;
    min-height: 194px;
    &:hover {
        background-color: #f6f8f9;
    }
    @media (max-width: 768px) {
        padding: 16px;
        user-select: none;
    }
`;
///////////////////////////////////////////////////////////
const CardHeader = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
`;
const TopTagContainer = styled.div`
    display: flex;
`;
const TopTag = styled.div`
    align-items: center;
    border: none;
    border-radius: 8px;
    display: flex;
    padding: 4px 6px;
    &.eyetracks {
        background-color: #d4e2fc;
        color: #174291;
        fill: #174291;
    }
    &.types {
        background-color: #e3ddf2;
        color: #3b1689;
        fill: #3b1689;
    }
    & svg {
        margin-right: 4px;
    }
    & + & {
        margin-left: 8px;
    }
    @media (max-width: 640px) {
        padding: 4px;
    }
`;
const TopMenuContainer = styled.div`
    cursor: pointer;
    align-items: center;
    display: inherit;
    padding: 10px 3px;
`;
//////////////////////////////////////////////////////////
const TitleContainer = styled.div`
    margin-top: 8px;
    overflow: hidden;
    & div.altrid-typography {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`;
//////////////////////////////////////////////////////////
const DescriptionContainer = styled.div`
    margin-top: 8px;
    overflow: hidden;
    & div.altrid-typography {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`;
//////////////////////////////////////////////////////////
const DetailsContainer = styled.div`
    margin-top: 16px;
`;
const DetailsItem = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
    & + & {
        margin-top: 4px;
    }
`;

function DraftCardItem({ cardData, children }) {
    /** redux actived-state */
    const { data } = useSelector((state) => state.assignmentActived.dueData);
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
        if (!($target.parents('.card-option').length || $target.attr('class').includes('card-option'))) {
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
            />

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
            <CardRoot onClick={handlePreTest}>
                <CardHeader>
                    <TopTagContainer>
                        {cardData['eyetrack'] ? (
                            <TopTag className="eyetracks">
                                <svg width="12" height="10" viewBox="0 0 12 10" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.59082 5C1.06082 2.44 3.30432 0.5 6.00032 0.5C8.69632 0.5 10.9393 2.44 11.4098 5C10.9398 7.56 8.69632 9.5 6.00032 9.5C3.30432 9.5 1.06132 7.56 0.59082 5ZM6.00032 7.5C6.66336 7.5 7.29925 7.23661 7.76809 6.76777C8.23693 6.29893 8.50032 5.66304 8.50032 5C8.50032 4.33696 8.23693 3.70107 7.76809 3.23223C7.29925 2.76339 6.66336 2.5 6.00032 2.5C5.33728 2.5 4.70139 2.76339 4.23255 3.23223C3.76371 3.70107 3.50032 4.33696 3.50032 5C3.50032 5.66304 3.76371 6.29893 4.23255 6.76777C4.70139 7.23661 5.33728 7.5 6.00032 7.5ZM6.00032 6.5C5.6025 6.5 5.22096 6.34196 4.93966 6.06066C4.65836 5.77936 4.50032 5.39782 4.50032 5C4.50032 4.60218 4.65836 4.22064 4.93966 3.93934C5.22096 3.65804 5.6025 3.5 6.00032 3.5C6.39815 3.5 6.77968 3.65804 7.06098 3.93934C7.34229 4.22064 7.50032 4.60218 7.50032 5C7.50032 5.39782 7.34229 5.77936 7.06098 6.06066C6.77968 6.34196 6.39815 6.5 6.00032 6.5Z" />
                                </svg>
                                <Typography type="label" size="s" bold>
                                    시선 분석 포함
                                </Typography>
                            </TopTag>
                        ) : null}
                        {assignmentTypeState >= 100 ? (
                            <TopTag className="types">
                                <svg width="12" height="7" viewBox="0 0 12 7" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.801 4.87976L6.507 5.58576L10.74 1.35276L11.447 2.05976L6.507 6.99976L3.325 3.81776L4.032 3.11076L5.0945 4.17326L5.801 4.87926V4.87976ZM5.802 3.46576L8.278 0.989258L8.983 1.69426L6.507 4.17076L5.802 3.46576ZM4.3885 6.29326L3.682 6.99976L0.5 3.81776L1.207 3.11076L1.9135 3.81726L1.913 3.81776L4.3885 6.29326Z" />
                                </svg>
                                <Typography type="label" size="s" bold>
                                    유형별 분석
                                </Typography>
                            </TopTag>
                        ) : null}
                    </TopTagContainer>
                    <TopMenuContainer className="card-option" onClick={handleOptionClick}>
                        <svg width="18" height="4" viewBox="0 0 18 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M1.5 0.5C0.675 0.5 0 1.175 0 2C0 2.825 0.675 3.5 1.5 3.5C2.325 3.5 3 2.825 3 2C3 1.175 2.325 0.5 1.5 0.5ZM16.5 0.5C15.675 0.5 15 1.175 15 2C15 2.825 15.675 3.5 16.5 3.5C17.325 3.5 18 2.825 18 2C18 1.175 17.325 0.5 16.5 0.5ZM9 0.5C8.175 0.5 7.5 1.175 7.5 2C7.5 2.825 8.175 3.5 9 3.5C9.825 3.5 10.5 2.825 10.5 2C10.5 1.175 9.825 0.5 9 0.5Z"
                                fill="black"
                            />
                        </svg>
                    </TopMenuContainer>
                </CardHeader>
                <TitleContainer>
                    <Typography className="altrid-typography" type="label" size="xxl" bold>
                        {cardData['title']}
                    </Typography>
                </TitleContainer>
                <DescriptionContainer>
                    <Typography className="altrid-typography" type="label" size="xl" bold>
                        {cardData['description']}
                    </Typography>
                </DescriptionContainer>
                <DetailsContainer>
                    <DetailsItem>
                        <Typography type="label" size="l">
                            문항 수
                        </Typography>
                        <Typography type="label" size="l" bold>
                            {cardData['contents_data'].flatMap((m) => m.problemDatas).length}문제
                        </Typography>
                    </DetailsItem>
                    <DetailsItem>
                        <Typography type="label" size="l">
                            제한시간
                        </Typography>
                        <Typography type="label" size="l" bold>
                            {((value) => {
                                const hh = SecondsToHoursAndMinutes(value)[0];
                                const mm = SecondsToHoursAndMinutes(value)[1];
                                return value === -2 ? '없음' : hh > 0 ? `${hh}시간 ${mm}분` : `${mm}분`;
                            })(cardData['time_limit'])}
                        </Typography>
                    </DetailsItem>
                    <DetailsItem>
                        <Typography type="label" size="l">
                            최종수정
                        </Typography>
                        <Typography type="label" size="l" bold>
                            {moment(cardData['updated']).format('MM월 DD일 HH시 mm분')}
                        </Typography>
                    </DetailsItem>
                    <DetailsItem>
                        <Typography type="label" size="l">
                            게시횟수
                        </Typography>
                        <Typography type="label" size="l" bold>
                            {cardData['actived_count'] ? cardData['actived_count'] + '회' : '미게시'}
                        </Typography>
                    </DetailsItem>
                </DetailsContainer>
            </CardRoot>
        </>
    );
}

DraftCardItem.defaultProps = {};

export default DraftCardItem;
