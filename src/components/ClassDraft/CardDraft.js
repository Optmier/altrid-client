import React, { useState } from 'react';
import '../../styles/class_card.scss';
import IsPresence from '../essentials/IsPresence';
import CardPopOver from '../essentials/CardPopOver';
import ClassDialog from '../essentials/ClassDialog';
import styled from 'styled-components';
import { Drawer } from '@material-ui/core';
import ClassDrawerModify from '../essentials/ClassDrawerModify';
import { SecondtoMinute } from '../essentials/TimeChange';

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

            {mm ? (
                <>
                    <div className="card-content-p" style={{ marginRight: '0.4rem' }}>
                        {mm}분
                    </div>
                    <div className="card-content-p">{ss}초</div>
                </>
            ) : (
                <div className="card-content-p">없음</div>
            )}
        </div>
    );
};

function CardDraft({ testNum, cardData }) {
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
    // type 4가지 : date-init(과제 공유), date-modify(과제 기한 수정), test-init(과제 완료), test-modify(과제 재시작)
    const [dateDialogopen, setDateDialogopen] = useState(false);

    const handleDialogOpen = (type) => {
        setDateDialogopen(true);
        handleOptionClose();
    };
    const handleDateDialogClose = () => {
        setDateDialogopen(false);
    };

    /** drawer 메소드 */
    const [openCreateNewDrawer, setOpenCreateNewDrawer] = useState(false);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        !cardData['contents_data'] ? alert('제작 중인 과제는 수정이 불가능합니다 :(') : setOpenCreateNewDrawer(open);

        handleOptionClose();
    };

    return (
        <>
            <Drawer anchor="right" open={openCreateNewDrawer} onClose={toggleDrawer(false)}>
                <ClassDrawerModify testNum={testNum} />
            </Drawer>

            <CardPopOver
                handleDialogOpen={handleDialogOpen}
                handleDrawerOpen={toggleDrawer(true)}
                handleOptionClick={handleOptionClick}
                handleOptionClose={handleOptionClose}
                anchorEl={anchorEl}
            />
            <ClassDialog type="date" subType="init" open={dateDialogopen} handleDialogClose={handleDateDialogClose} />
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
                        {cardData['actived'] ? (
                            <div className="class-card-header-sharing class-card-wrapper">
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
                        ) : (
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
                        )}

                        <div></div>
                        <div className="class-card-contents class-card-wrapper">
                            <div className="contents-block">
                                <div className="card-item">
                                    <div className="card-subTitle-p" title={cardData['description']}>
                                        {cardData['description']}
                                    </div>
                                </div>
                                <div className="card-item">
                                    <div className="card-content-p" title={cardData['grade']}>
                                        {cardData['grade']}
                                    </div>
                                </div>
                            </div>

                            <div className="contents-block">
                                <InfoItems title={'문항수'} contents={cardData['question_num']} />
                                <TimeItems title={'제한시간'} mm={mm} ss={ss} />
                                <InfoItems title={'최종수정'} contents={cardData['updated']} />
                            </div>
                        </div>
                        <div className="class-card-bottom-right">
                            {/* 시선흐름 유무 */}
                            <IsPresence type={'eye'} able={cardData['eyetrack']} />
                            {/* 공유 유무 */}
                            <IsPresence type={'share'} able={cardData['actived']} />
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default React.memo(CardDraft);
