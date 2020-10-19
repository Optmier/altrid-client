import React from 'react';
import Popover from '@material-ui/core/Popover';
import styled from 'styled-components';

const StylePopOverList = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 400;
    background-color: #222222;
    color: white;

    & .popover-section {
        cursor: pointer;
        padding: 7px 0;
        & .popover-list {
            width: 100%;
            box-sizing: border-box;
            text-align: center;
            padding: 5px 45px;
        }
        & .popover-list:hover {
            background-color: #02a1f8;
        }
    }

    & .popover-section + .popover-section {
        border-top: 1px solid #4e4e4e;
    }
`;

function CardPopOver({ handleModalOpen, handleOptionClose, anchorEl, handleModify }) {
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleOptionClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            <StylePopOverList>
                <div className="popover-section">
                    <div className="popover-list">과제 확인</div>
                    <div className="popover-list" onClick={handleModalOpen}>
                        과제 공유
                    </div>
                </div>
                <div className="popover-section">
                    <div className="popover-list">복사하기</div>
                    <div className="popover-list">수정하기</div>
                </div>
                <div className="popover-section">
                    <div className="popover-list">삭제하기</div>
                </div>
            </StylePopOverList>
        </Popover>
    );
}

export default CardPopOver;
