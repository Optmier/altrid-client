import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

const PopOverList = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 400;

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

const useStyles = makeStyles((theme) => ({
    typography: {
        padding: theme.spacing(0),
        backgroundColor: '#222222',
        color: 'white',
    },
}));

function CardPopOver({ handleModalOpen, handleOptionClose, anchorEl, handleModify }) {
    const classes = useStyles();

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
            <Typography className={classes.typography}>
                <PopOverList>
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
                </PopOverList>
            </Typography>
        </Popover>
    );
}

export default CardPopOver;
