import React, { useState } from 'react';
import '../../styles/class_card.scss';
import IsPresence from '../essentials/IsPresence';
import CardPopOver from '../essentials/CardPopOver';
import ClassDialog from '../essentials/ClassDialog';
import styled from 'styled-components';
import { Drawer } from '@material-ui/core';
import ClassDrawer from '../essentials/ClassDrawer';
import { SecondtoMinute } from '../essentials/TimeChange';
import { useDispatch, useSelector } from 'react-redux';
import { postActived, changeDueDate } from '../../redux_modules/assignmentActived';
import { deleteDraft } from '../../redux_modules/assignmentDraft';

import { withRouter } from 'react-router-dom';
import moment from 'moment';
import ClassDialogDelete from '../essentials/ClassDialogDelete';

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
            <div className="card-content-title-p" title={title}>
                {title}
            </div>
            <div className="card-content-p" title={contents}>
                {contents}
            </div>
        </div>
    );
};
const TimeItems = ({ title, mm, ss }) => {
    return (
        <div className="card-item">
            <div className="card-content-title-p" title={title}>
                {title}
            </div>

            {mm === -1 ? (
                <div className="card-content-p">없음</div>
            ) : (
                <>
                    <div className="card-content-p" style={{ marginRight: '0.4rem' }}>
                        {mm}분
                    </div>
                    <div className="card-content-p">{ss}초</div>
                </>
            )}
        </div>
    );
};

function CardDraft({ cardData, match, history }) {
    /** redux actived-state */
    const { data, loading, error } = useSelector((state) => state.assignmentActived.activedData);
    const dispatch = useDispatch();

    /** 제한시간 분할(분,초) 메소드 */
    let mm = SecondtoMinute(cardData['time_limit'])[0];
    let ss = SecondtoMinute(cardData['time_limit'])[1];

    /** pop-over (옵션 선택) 메소드 */
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOptionClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleOptionClose = () => {
        setAnchorEl(null);
    };

    /** class-modal 메소드 */
    // type 4가지 : date-init(과제 게시), date-modify(과제 기한 수정), test-init(과제 완료), test-modify(과제 재시작)
    const [dateDialogopen, setDateDialogopen] = useState(false);
    const [deleteDialogopen, setDeleteDialogopen] = useState(false);

    const handleDialogOpen = (type) => {
        setDateDialogopen(true);
        handleOptionClose();
    };
    const handleDateDialogClose = (e) => {
        const { name } = e.target;
        const due_date = data['due_date'] ? data['due_date'] : null;

        if (name === 'button') {
            if (due_date) {
                //과제 게시하기 버튼 클릭
                const { num } = match.params; //클래스 번호

                setDateDialogopen(false);

                dispatch(postActived(cardData, num, due_date, history));
            } else {
                alert('과제 기한 변경은 필수항목입니다.');
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

    return (
        <>
            <Drawer anchor="right" open={openCreateNewDrawer} onClose={toggleDrawer(false)}>
                <ClassDrawer ver="modify" cardData={cardData} handleClose={toggleDrawer(false)} />
            </Drawer>

            <CardPopOver
                contents_data={cardData['contents_data']}
                handleDialogOpen={handleDialogOpen}
                handleDeleteDialogOpen={handleDeleteDialogOpen}
                handleDrawerOpen={toggleDrawer(true)}
                handleOptionClick={handleOptionClick}
                handleOptionClose={handleOptionClose}
                anchorEl={anchorEl}
            />
            <ClassDialog type="date" subType="init" open={dateDialogopen} handleDialogClose={handleDateDialogClose} />
            <ClassDialogDelete open={deleteDialogopen} handleDialogClose={handleDeleteDateDialogClose} />

            <div className="class-card-root">
                {!cardData['contents_data'] ? (
                    <>
                        <div className="class-card-header class-card-wrapper">
                            <div className="card-title-p" title={cardData['title']}>
                                {cardData['title']}
                            </div>
                            <span className="card-option" onClick={handleOptionClick}>
                                <svg width="19" height="5" viewBox="0 0 19 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="2.5" cy="2.5" r="2.5" fill="#C4C4C4" />
                                    <circle cx="16.5" cy="2.5" r="2.5" fill="#C4C4C4" />
                                    <circle cx="9.5" cy="2.5" r="2.5" fill="#C4C4C4" />
                                </svg>
                            </span>
                        </div>
                        <div></div>
                        <StyleDraftIng>
                            <h4>과제 제작중 ...</h4>
                        </StyleDraftIng>
                    </>
                ) : (
                    <>
                        <div className="class-card-header-on class-card-wrapper">
                            <div className="card-title-p" title={cardData['title']}>
                                {cardData['title']}
                            </div>
                            <span className="card-option" onClick={handleOptionClick}>
                                <svg width="19" height="5" viewBox="0 0 19 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="2.5" cy="2.5" r="2.5" fill="white" />
                                    <circle cx="16.5" cy="2.5" r="2.5" fill="white" />
                                    <circle cx="9.5" cy="2.5" r="2.5" fill="white" />
                                </svg>
                            </span>
                        </div>

                        <div></div>
                        <div className="class-card-contents class-card-wrapper">
                            <div className="contents-block">
                                <div className="card-item">
                                    <div className="card-subTitle-p" title={cardData['description']}>
                                        {cardData['description']}
                                    </div>
                                </div>
                            </div>

                            <div className="contents-block">
                                <InfoItems title={'문항수'} contents={cardData['question_num']} />
                                <TimeItems title={'제한시간'} mm={mm} ss={ss} />
                                <InfoItems title={'최종수정'} contents={moment(cardData['updated']).format('MM월 DD일 HH시 mm분')} />
                            </div>
                        </div>
                        <div className="class-card-bottom-right">
                            {/* 시선흐름 유무 */}
                            <IsPresence type={'eye'} able={cardData['eyetrack']} />
                            {/* 공유 유무 */}
                            <IsPresence type={'share'} able={0} />
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default React.memo(withRouter(CardDraft));
