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
    user-select: none;

    & .popover-section {
        cursor: pointer;
        padding: 7px 0;
        & .popover-list {
            width: 100%;
            box-sizing: border-box;
            text-align: center;
            padding: 5px 35px;
        }
        & .popover-list:hover {
            background-color: #02a1f8;
        }
    }

    & .popover-section + .popover-section {
        border-top: 1px solid #4e4e4e;
    }
`;

function CardPopOver({ handlePreTest, handleDeleteDialogOpen, handleGoToReport, handleOptionClose, anchorEl }) {
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
                    <div className="popover-list" onClick={handleGoToReport}>
                        과제 리포트
                    </div>
                    <div id="pre-test" className="popover-list" onClick={handlePreTest}>
                        과제 확인
                    </div>
                    <div className="popover-list" onClick={handleDeleteDialogOpen}>
                        삭제하기
                    </div>
                </div>
            </StylePopOverList>
        </Popover>
    );
}

export default CardPopOver;
