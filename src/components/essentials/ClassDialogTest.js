import React from 'react';
import styled from 'styled-components';

const StyleModalShare = styled.div`
    & > h4 {
        color: #222222;
        padding-bottom: 0.5rem;
    }
    & > p {
        font-size: 0.8rem;
        color: #969393;
        padding-bottom: 1.5rem;
    }
`;

function ClassDialogTest({ subType }) {
    /* type : test
       subType : complete or modify
     */
    return (
        <StyleModalShare>
            {subType === 'init' ? (
                <>
                    <h4 className="modal-share-title">과제를 완료하시겠습니까?</h4>
                    <p className="modal-share-subTitle">과제 완료 후에도 다시 과제를 시작할 수 있습니다.</p>
                </>
            ) : (
                <>
                    <h4 className="modal-share-title">과제를 다시 오픈하시겠습니까?</h4>
                    <p className="modal-share-subTitle">과제 오픈 후에도 다시 과제를 완료할 수 있습니다.</p>
                </>
            )}
        </StyleModalShare>
    );
}

export default ClassDialogTest;
