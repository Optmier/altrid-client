import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import ClassDialoglDate from './ClassDialoglDate';
import ClassDialogTest from './ClassDialogTest';
import styled from 'styled-components';

const StyleModalButton = styled.div`
    cursor: pointer;
    border-radius: 11px;
    padding: 0.5rem 2rem;
    background-color: #13e2a1;
    color: white;
    font-size: 0.9rem;
`;

function ClassDialog({ type, subType, open, handleDialogClose }) {
    /** class-modal 메소드 */
    // type 4가지 : date-init(과제 공유), date-modify(과제 기한 수정), test-init(과제 완료), test-modify(과제 재시작)

    return (
        <Dialog open={open} onClose={handleDialogClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <div style={{ padding: '2rem' }}>
                <DialogContent>
                    {type === 'date' ? <ClassDialoglDate subType={subType} /> : <ClassDialogTest subType={subType} />}
                </DialogContent>

                <DialogActions>
                    <StyleModalButton onClick={handleDialogClose} color="primary">
                        {type === 'date'
                            ? subType === 'init'
                                ? '공유하기'
                                : '수정하기'
                            : subType === 'init'
                            ? '완료하기'
                            : '다시 시작하기'}
                    </StyleModalButton>
                </DialogActions>
            </div>
        </Dialog>
    );
}

export default ClassDialog;