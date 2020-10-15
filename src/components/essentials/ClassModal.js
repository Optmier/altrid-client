import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import ClassModalDate from './ClassModalDate';
import styled from 'styled-components';

const StyleModalButton = styled.div`
    cursor: pointer;
    border-radius: 11px;
    padding: 0.5rem 2rem;
    background-color: #13e2a1;
    color: white;
    font-size: 0.9rem;
`;

function ClassModal({ open, handleModalClose, type }) {
    return (
        <Dialog open={open} onClose={handleModalClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <div style={{ padding: '2rem' }}>
                <DialogContent>{type === 'share' ? <ClassModalDate /> : ''}</DialogContent>
                <DialogActions>
                    <StyleModalButton onClick={handleModalClose} color="primary">
                        수정하기
                    </StyleModalButton>
                </DialogActions>
            </div>
        </Dialog>
    );
}

export default ClassModal;
