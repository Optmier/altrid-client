import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import ClassDialoglDate from './ClassDialoglDate';
import ClassDialogTest from './ClassDialogTest';
import styled from 'styled-components';

const StyleModalButton = styled.button`
    cursor: pointer;
    border-radius: 11px;
    padding: 0.5rem 2rem;
    background-color: #13e2a1;
    color: white;
    font-size: 0.9rem;
    min-width: 120px;
`;

function ClassDialog({ type, subType, open, handleDialogClose }) {
    /** class-dialog 메소드 */
    // type 4가지 : date-init(과제 게시), date-modify(과제 기한 수정), test-init(과제 완료), test-modify(과제 재시작)

    return (
        <Dialog open={open} onClose={handleDialogClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <div style={{ padding: '2rem' }}>
                <DialogContent>
                    {type === 'date' ? (
                        <ClassDialoglDate subType={subType} />
                    ) : subType === 'init' ? (
                        <ClassDialogTest subType={subType} />
                    ) : (
                        <ClassDialoglDate subType={subType} />
                    )}
                </DialogContent>

                <DialogActions style={{ width: '320px', textAlign: 'right' }}>
                    {type === 'date' ? (
                        subType === 'init' ? (
                            <StyleModalButton name="button" onClick={handleDialogClose} color="primary">
                                게시하기
                            </StyleModalButton>
                        ) : (
                            <StyleModalButton name="button-modify" onClick={handleDialogClose} color="primary">
                                수정하기
                            </StyleModalButton>
                        )
                    ) : subType === 'init' ? (
                        <>
                            <StyleModalButton name="button-delete" onClick={handleDialogClose} color="primary">
                                완료 후 삭제
                            </StyleModalButton>
                            <StyleModalButton name="button-complete" onClick={handleDialogClose} color="primary">
                                완료하기
                            </StyleModalButton>
                        </>
                    ) : (
                        <StyleModalButton name="button-restart" onClick={handleDialogClose} color="primary">
                            다시 시작하기
                        </StyleModalButton>
                    )}
                </DialogActions>
            </div>
        </Dialog>
    );
}

export default ClassDialog;
