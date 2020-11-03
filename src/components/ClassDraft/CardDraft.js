import React, { useState } from 'react';
import '../../styles/class_card.scss';
import IsPresence from '../essentials/IsPresence';
import CardPopOver from '../essentials/CardPopOver';
import ClassDialog from '../essentials/ClassDialog';
import styled from 'styled-components';

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

function CardDraft({ testNum, cardData }) {
    /** pop-over (옵션 선택) 메소드 */
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOptionClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleOptionClose = () => {
        setAnchorEl(null);
    };
    /*====================*/

    /** class-modal 메소드 */
    // type 4가지 : date-init(과제 공유), date-modify(과제 기한 수정), test-init(과제 완료), test-modify(과제 재시작)
    const [dateDialogopen, setDateDialogopen] = useState(false);

    const handleDialogOpen = (type) => {
        setDateDialogopen(true);
    };
    const handleDateDialogClose = () => {
        setDateDialogopen(false);
    };
    /** =================== */

    return (
        <>
            <CardPopOver
                handleDialogOpen={handleDialogOpen}
                handleOptionClick={handleOptionClick}
                handleOptionClose={handleOptionClose}
                anchorEl={anchorEl}
            />
            <ClassDialog type="date" subType="init" open={dateDialogopen} handleDialogClose={handleDateDialogClose} />
            <div className="class-card-root">
                {cardData['question_num'] === '-' ? (
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
                        {cardData['progress'] ? (
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
                        ) : (
                            <div className="class-card-header-default class-card-wrapper">
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
                        )}

                        <div></div>
                        <div className="class-card-contents class-card-wrapper">
                            <div className="contents-block">
                                <div className="card-item">
                                    <div className="card-subTitle-p" title={cardData['desc']}>
                                        {cardData['desc']}
                                    </div>
                                </div>
                                <div className="card-item">
                                    <div className="card-content-p" title={cardData['age']}>
                                        {cardData['age']}
                                    </div>
                                </div>
                            </div>

                            <div className="contents-block">
                                <InfoItems title={'문항수'} contents={cardData['question_num']} />
                                <InfoItems title={'제한시간'} contents={cardData['time']} />
                                <InfoItems title={'최종수정'} contents={cardData['start']} />
                            </div>
                        </div>
                        <div className="class-card-bottom-right">
                            <IsPresence type={'eye'} able={cardData['eyetrack']} />
                            <IsPresence type={'share'} able={cardData['progress']} />
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default CardDraft;
