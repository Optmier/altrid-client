import React, { useState } from 'react';

function CouponInfo() {
    const [couponState, setCouponState] = useState('');

    const handleChange = (e) => {
        setCouponState(e.target.value);
    };
    return (
        <div className="coupon-info-root">
            <div className="mypage-contents white-box">
                <div className="coupon-info">
                    <div className="coupon-info-header">
                        <input placeholder="쿠폰 번호 입력" value={couponState} onChange={handleChange} />
                        <button className="btn-purple">쿠폰 추가</button>
                    </div>
                    <div className="coupon-info-table">
                        <div className="table-title">이름</div>
                        <div className="table-title">쿠폰 코드</div>
                        <div className="table-title">최소 플랜</div>
                        <div className="table-title">할인 가격</div>
                        <div className="table-title">유효 기간</div>
                    </div>
                    <div className="coupon-info-table">
                        <div className="table-desc">[베타기간한정]1만원 할인 쿠폰</div>
                        <div className="table-desc">abcd</div>
                        <div className="table-desc">Premium</div>
                        <div className="table-desc">10,000원</div>
                        <div className="table-desc">2021-04-30</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CouponInfo;
