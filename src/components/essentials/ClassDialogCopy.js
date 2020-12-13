import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, TextField, withStyles } from '@material-ui/core';
import { useState } from 'react';
import { useEffect } from 'react';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
}));

const TitleTextField = withStyles((theme) => ({
    root: {
        fontFamily: 'inherit',
        width: 220,
        outline: 'none',
        '& .MuiInputBase-root': {
            fontSize: '0.9rem',
            outline: 'none',

            '&.Mui-focused': {
                backgroundColor: '#f2f3f6',
                boxShadow: '0 0 0 2px #8f8f8f',
            },
            '&.MuiInput-underline:before': {},

            '&.MuiInput-underline:after': {},
            '& input': {
                outline: 'none !important',
            },
        },
    },
}))(TextField);

const StyleModalButton = styled.button`
    min-width: 114px;
    cursor: pointer;
    border-radius: 10px;
    padding: 0.5rem 2rem;
    background-color: #13e2a1;
    color: white;
    font-size: 0.9rem;

    &.default {
        background-color: #d4d4d4;
        color: #000;
    }

    &.critical {
        background-color: rgba(255, 92, 92, 0.85);
    }
`;
const StyleModalContents = styled.div`
    & > h4 {
        color: #222222;
        padding-bottom: 0.5rem;
    }
    & > p {
        font-size: 0.8rem;
        color: #969393;
        padding-bottom: 1.5rem;
    }

    & .modal-share-date {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 2rem;

        & > p {
            font-size: 0.9rem;
            color: #969393;
            font-weight: 600;
            margin-right: 1rem;
        }
    }
`;

const ModalCloseButton = styled.div`
    cursor: pointer;
    position: absolute;
    top: 8px;
    right: 8px;
`;

const CopyFormContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 1.5rem;
    padding-bottom: 2rem;

    & > p {
        font-size: 0.9rem;
        color: #969393;
        font-weight: 600;
        margin-right: 1rem;
    }
`;

function ClassDialogCopy({ ver, open, defaultTitle, handleDialogClose }) {
    /** redux state */
    // const { data, loading, error } = useSelector((state) => state.assignmentDraft.draftDatas) || {
    //     loading: false,
    //     data: null,
    //     error: null,
    // };

    // if (loading) return <div>로딩 중....</div>; // 로딩중이고 데이터 없을때만
    // if (error) return <div>에러 발생!</div>;
    // if (!data) return null;

    const classes = useStyles();
    const [copiedTitle, setCopiedTitle] = useState(defaultTitle + '의 복사본');

    const onChange = ({ target }) => {
        const { value, name } = target;
        setCopiedTitle(value);
    };

    const handleClose = (e) => {
        if (defaultTitle == copiedTitle) alert('동일한 이름을 가진 과제가 있습니다.\n다른 이름을 입력해 주세요.');
        else {
            handleDialogClose(e, copiedTitle);
        }
    };

    useEffect(() => {
        setCopiedTitle(defaultTitle + '의 복사본');
    }, [open]);

    return (
        <Dialog open={open} onClose={handleDialogClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <ModalCloseButton className="close-icon" onClick={handleDialogClose}>
                <CloseIcon />
            </ModalCloseButton>
            <div style={{ padding: '2rem' }}>
                <DialogContent>
                    <StyleModalContents>
                        <h4 className="modal-copy-title">{ver === 'class' ? '클래스를 ' : '과제를 '} 복사하시겠습니까?</h4>
                        <CopyFormContainer>
                            <p>복사할 이름</p>
                            <form className={classes.container} noValidate>
                                <TitleTextField
                                    onChange={onChange}
                                    value={copiedTitle}
                                    id="input_copied_title"
                                    type="text"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </form>
                        </CopyFormContainer>
                    </StyleModalContents>
                </DialogContent>

                <DialogActions>
                    <StyleModalButton className="default" name="no" onClick={handleDialogClose} color="primary">
                        아니오
                    </StyleModalButton>
                    <StyleModalButton name="yes" onClick={handleClose} color="primary">
                        복사하기
                    </StyleModalButton>
                </DialogActions>
            </div>
        </Dialog>
    );
}

ClassDialogCopy.defaultProps = {
    defaultTitle: '복사될 과제명',
};

export default ClassDialogCopy;
