import React from 'react';
import CheckIcon from '@material-ui/icons/Check';

function DeleteAccount() {
    const handleDelete = () => {};
    return (
        <div className="delete-root">
            <div className="mypage-title">계정 탈퇴</div>

            <section>
                <div className="mypage-contents white-box delete-list">
                    <div className="row">
                        <CheckIcon style={{ color: '#13e2a1' }} fontSize="small" />
                        <p>탈퇴한 계정은 되돌릴 수 없습니다. 동일한 계정으로 재가입시 정보는 복구되지 않습니다.</p>
                    </div>
                    <div className="row">
                        <CheckIcon style={{ color: '#13e2a1' }} fontSize="small" />
                        <p>이름, 이메일 등의 개인 정보는 삭제되며, 이외의 데이터는 암호화되어 유지됩니다.</p>
                    </div>
                    <div className="row">
                        <CheckIcon style={{ color: '#13e2a1' }} fontSize="small" />
                        <p>탈퇴로 인한 불이익에 대해서 본사는 어떠한 책임도 지지않습니다.</p>
                    </div>
                </div>
            </section>

            <section>
                <div className="mypage-footer">
                    <button className="btn-green" onClick={handleDelete}>
                        회원 탈퇴하기
                    </button>
                </div>
            </section>
        </div>
    );
}

export default DeleteAccount;
