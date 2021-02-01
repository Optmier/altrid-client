import React from 'react';

function Plan() {
    const handlePlanBtn = () => {
        alert('현재는 베타 서비스 기간으로, 플랜변경이 불가능합니다!');
    };
    return (
        <div className="plan-root">
            <div className="mypage-title">플랜 관리</div>

            <section>
                <div className="mypage-header">현재 플랜</div>
                <div className="mypage-contents white-box now-plan">
                    <div className="now-plan-left">
                        <div className="row">
                            <div className="row-title">현재 플랜</div>
                            <div className="row-desc">FREE</div>
                        </div>
                        <div className="row">
                            <div className="row-title">사용 기간</div>
                            <div className="row-desc">2021년 1월 10일 ~ 2021년 2월 10일</div>
                        </div>
                    </div>
                    <div className="now-plan-right">
                        <button className="btn-purple" onClick={handlePlanBtn}>
                            플랜 변경
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Plan;
