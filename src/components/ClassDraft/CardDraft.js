import React, { useState } from 'react';
import '../../styles/class_card.scss';
import CardContentBottom from '../essentials/CardContentBottom';
import CardPopOver from '../essentials/CardPopOver';
import ClassModal from '../essentials/ClassModal';

const dummyDatas = {};

const InfoItems = ({ title, contents }) => {
    return (
        <div className="card-item">
            <div className="card-content-title-p">{title}</div>
            <div className="card-content-p">{contents}</div>
        </div>
    );
};

function CardDraft() {
    /** pop-over 메소드 */
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOptionClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleOptionClose = () => {
        setAnchorEl(null);
    };
    /*====================*/

    /** class-modal 메소드 */
    // type 3가지 : share, complete, date_modify
    const [open, setOpen] = useState(false);

    const handleModalOpen = () => {
        setOpen(true);
    };

    const handleModalClose = () => {
        setOpen(false);
    };
    /** =================== */

    return (
        <>
            <CardPopOver
                handleModalOpen={handleModalOpen}
                handleOptionClick={handleOptionClick}
                handleOptionClose={handleOptionClose}
                anchorEl={anchorEl}
            />
            <ClassModal type="share" open={open} handleModalClose={handleModalClose} />
            <div className="class-card-root">
                <div className="class-card-header class-card-wrapper">
                    <div className="card-title-p">과제 TITLE</div>
                    <span className="card-option" onClick={handleOptionClick}>
                        <svg width="19" height="5" viewBox="0 0 19 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="2.5" cy="2.5" r="2.5" fill="#C4C4C4" />
                            <circle cx="16.5" cy="2.5" r="2.5" fill="#C4C4C4" />
                            <circle cx="9.5" cy="2.5" r="2.5" fill="#C4C4C4" />
                        </svg>
                    </span>
                </div>
                <div></div>
                <div className="class-card-contents class-card-wrapper">
                    <div className="contents-block">
                        <div className="card-item card-subTitle-p">과제 한줄 설명 과제 한줄 설명 과제 한줄 설명 과제 한줄 설명</div>
                        <div className="card-item card-content-p">에듀이티 고2</div>
                    </div>

                    <div className="contents-block">
                        <InfoItems title={'문항수'} contents={'3set / 15문제'} />
                        <InfoItems title={'제한시간'} contents={'14분'} />
                        <InfoItems title={'최종수정'} contents={'09/10/2020'} />
                    </div>
                </div>
                <div className="class-card-bottom-right">
                    <CardContentBottom type={'eye'} able={true} />
                    <CardContentBottom type={'share'} able={true} />
                </div>
            </div>
        </>
    );
}

export default CardDraft;
