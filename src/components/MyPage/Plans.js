import React from 'react';
import { Route, withRouter, NavLink } from 'react-router-dom';
import Plan from './Plan';

function Plans({ match }) {
    return (
        <div className="plan-root">
            <div className="mypage-title">플랜 관리</div>

            <section>
                <div className="mypage-header">
                    <li>
                        <NavLink to="/mypage/manage-plan/now-plan" activeStyle={{ background: 'black', color: 'white' }}>
                            현재 플랜
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/mypage/manage-plan/payment-info" activeStyle={{ background: 'black', color: 'white' }}>
                            결제 정보
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/mypage/manage-plan/coupon-info" activeStyle={{ background: 'black', color: 'white' }}>
                            할인 쿠폰
                        </NavLink>
                    </li>
                </div>
                <Route path="/mypage/manage-plan/:service" component={Plan} exact />
            </section>
        </div>
    );
}

export default withRouter(Plans);
