import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

const StyleModalButton = styled.button`
    min-width: 114px;
    cursor: pointer;
    border-radius: 11px;
    padding: 0.5rem 2rem;
    background-color: #13e2a1;
    color: white;
    font-size: 0.9rem;
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

function ClassDialogDelete({ open, handleDialogClose }) {
    /** redux state */
    const { data, loading, error } = useSelector((state) => state.assignmentDraft.draftDatas) || {
        loading: false,
        data: null,
        error: null,
    };

    // if (loading) return <div>로딩 중....</div>; // 로딩중이고 데이터 없을때만
    // if (error) return <div>에러 발생!</div>;
    // if (!data) return null;

    return (
        <Dialog open={open} onClose={handleDialogClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <div style={{ padding: '2rem' }}>
                <DialogContent>
                    <StyleModalContents>
                        <h4 className="modal-share-title">과제를 정말 삭제하시겠습니까?</h4>
                        <p className="modal-share-subTitle">삭제된 과제는 복구가 불가능합니다.</p>
                    </StyleModalContents>
                </DialogContent>

                <DialogActions>
                    <StyleModalButton name="no" onClick={handleDialogClose} color="primary">
                        아니오
                    </StyleModalButton>
                    <StyleModalButton name="yes" onClick={handleDialogClose} color="primary">
                        삭제하기
                    </StyleModalButton>
                </DialogActions>
            </div>
        </Dialog>
    );
}

export default ClassDialogDelete;
