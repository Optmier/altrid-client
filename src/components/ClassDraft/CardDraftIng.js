import React, { useState } from 'react';
import '../../styles/class_card.scss';
import IsPresence from '../essentials/IsPresence';
import CardPopOver from '../essentials/CardPopOver';
import ClassDialog from '../essentials/ClassDialog';

const InfoItems = ({ title, contents }) => {
    return (
        <div className="card-item">
            <div className="card-content-title-p">{title}</div>
            <div className="card-content-p">{contents}</div>
        </div>
    );
};

function CardDraftIng() {
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
                <div style={{ backgroundColor: '#FFBE2F' }} className="class-card-header class-card-wrapper">
                    <div style={{ color: 'white' }} className="card-title-p">
                        실전 기출 문제 모음
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
                <div
                    style={{
                        fontSize: '2rem',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#706d6d',
                        fontWeight: 600,
                    }}
                >
                    <h4>과제 제작중...</h4>
                </div>
                <div style={{ height: '0' }} className="class-card-bottom-right">
                    <IsPresence type={'eye'} able={true} />
                    <IsPresence type={'share'} able={true} />
                </div>
            </div>
        </>
    );
}

export default CardDraftIng;
