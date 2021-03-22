import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { apiUrl } from '../../configs/configs';
import moment from 'moment-timezone';

function CouponInfo() {
    const [couponState, setCouponState] = useState('');
    const [couponHistory, setCouponHistory] = useState([]);
    const { academyPlanId } = useSelector((state) => state.RdxSessions);

    const handleChange = (e) => {
        setCouponState(e.target.value);
    };

    const convertPriceString = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    useEffect(() => {
        if (!academyPlanId) return;
        Axios.get(`${apiUrl}/payments/coupon-history`, { withCredentials: true })
            .then((resCouponHistory) => {
                console.log(resCouponHistory.data);
                setCouponHistory(resCouponHistory.data);
            })
            .catch((errCouponHistory) => {
                console.error(errCouponHistory);
            });
    }, [academyPlanId]);

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
                        <div className="table-title">적용 플랜</div>
                        <div className="table-title">할인 가격</div>
                        <div className="table-title">유효 기간 (이전 까지)</div>
                    </div>
                    {couponHistory.map((data) => (
                        <div className="coupon-info-table" key={data.coupon_id}>
                            <div className="table-desc">{data.name}</div>
                            <div className="table-desc">{data.coupon_id}</div>
                            <div className="table-desc">
                                {data.applied_plan === 2 ? 'Standard' : data.applied_plan === 3 ? 'Premium' : '-'}
                            </div>
                            <div className="table-desc">
                                {convertPriceString(data.discount)}
                                {data.type === 'absolute' ? '원' : '%'}
                            </div>
                            <div className="table-desc">{moment(data.expired).format('YYYY년 MM월 DD일')}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CouponInfo;
