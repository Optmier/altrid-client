import React from 'react';

function PaymentInfo() {
    return (
        <div className="mypage-contents white-box now-plan">
            <div className="now-plan-left">
                <div className="row">
                    <div className="row-title">현재 플랜</div>
                    <div className="row-desc">FREE</div>
                </div>
                <div className="row">
                    <div className="row-title">사용 기간</div>
                    <div className="row-desc">현재는 베타 서비스 기간입니다.</div>
                </div>
            </div>
            <div className="now-plan-right">
                <button className="btn-purple">플랜 변경</button>
            </div>
        </div>
    );
}

export default PaymentInfo;
