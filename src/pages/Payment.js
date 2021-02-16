import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import '../styles/payment_page.scss';
import HeaderBar from '../components/essentials/HeaderBar';
import queryString from 'query-string';
import PriceData from '../datas/PriceData.json';
import MenuData from '../datas/MenuData.json';

function Payment({ location }) {
    useEffect(() => {
        //axios 쿠폰 검사...
    }, []);

    const handlePayment = () => {};

    return (
        <>
            <HeaderBar defaultColor="white" />
            <div className="payment-root">
                <section className="payment-coupon">
                    <div className="payment-header">쿠폰 확인</div>
                </section>

                <section className="payment-confirm">
                    <div className="payment-header">결제 상품 확인</div>
                    <div className="payment-confirm-box">
                        <div className="left">
                            <div className="left-title" id={`color-${queryString.parse(location.search).type}`}>
                                {queryString.parse(location.search).type}
                            </div>
                            <div className="left-contents"> {MenuData[queryString.parse(location.search).type]['desc']}</div>
                        </div>
                        <div className="right">
                            <div className="right-top">
                                {MenuData[queryString.parse(location.search).type]['price']}
                                <span id="small-text">원</span>
                            </div>
                            <div className="right-bottom" id={`color-${queryString.parse(location.search).type}`}>
                                <span id="small-text" className="gray">
                                    (학생당/월)
                                </span>
                                <div>
                                    {MenuData[queryString.parse(location.search).type]['discount_' + 'personal']}
                                    <span id="small-text">원</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="payment-select">
                    <div className="payment-header">결제 수단 선택</div>
                    <div className="payment-selects">
                        <div className="payment-select-box">
                            <svg width="18" height="24" viewBox="0 0 18 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M15 4H3C2.1675 4 1.5075 4.89 1.5075 6L1.5 18C1.5 19.11 2.1675 20 3 20H15C15.8325 20 16.5 19.11 16.5 18V6C16.5 4.89 15.8325 4 15 4ZM15 18H3V12H15V18ZM15 8H3V6H15V8Z"
                                    fill="#575555"
                                />
                            </svg>
                            토스 페이먼츠
                        </div>
                    </div>
                </section>
                <section className="payment-footer">
                    <button id={`back-color-${queryString.parse(location.search).type}`} onClick={handlePayment}>
                        9999원 결제하기
                    </button>
                </section>
            </div>
        </>
    );
}

export default withRouter(Payment);
