import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import Plan from './Plan';

function Plans() {
    return (
        <div className="plan-root">
            <div className="mypage-title">플랜 관리</div>

            <section>
                <div className="mypage-header">
                    <li>
                        <NavLink to="/mypage/manage-plan/now-plan" activeStyle={{ color: '#3f1990' }}>
                            현재 플랜
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/mypage/manage-plan/payment-info" activeStyle={{ color: '#3f1990' }}>
                            결제 정보
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/mypage/manage-plan/coupon-info" activeStyle={{ color: '#3f1990' }}>
                            할인 쿠폰
                        </NavLink>
                    </li>
                </div>
                <Route path="/mypage/manage-plan/:service" component={Plan} exact />
            </section>
        </div>
    );
}

export default Plans;
