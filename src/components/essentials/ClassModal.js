import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import ClassModalDate from './ClassModalDate';

function ClassModal({ open, handleModalClose, type }) {
    return (
        <Dialog open={open} onClose={handleModalClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <div style={{ padding: '2rem' }}>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">{type === 'share' ? <ClassModalDate /> : ''}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <button onClick={handleModalClose} color="primary">
                        수정하기
                    </button>
                </DialogActions>
            </div>
        </Dialog>
    );
}

export default ClassModal;
