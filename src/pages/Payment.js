import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import '../styles/payment_page.scss';
import HeaderBar from '../components/essentials/HeaderBar';
import queryString from 'query-string';
import MenuData from '../datas/MenuData.json';
import { useSelector } from 'react-redux';
import Axios from 'axios';
import { apiUrl } from '../configs/configs';

function Payment({ location }) {
    const sessions = useSelector((state) => state.RdxSessions);
    const selectBoxRef = useRef();

    const [productPice, setProductPrice] = useState(
        parseInt(MenuData[queryString.parse(location.search).type]['discount_' + 'personal'].replace(',', '')),
    );
    const [studentNum, setStudentNum] = useState(1);
    const [discountPrice, setDiscountPrice] = useState(0);
    const [payPrice, setPayPrice] = useState(productPice * studentNum - discountPrice);
    const [tax, setTax] = useState(payPrice * 0.1);
    const [totalPrice, setTotalPrice] = useState(payPrice + tax);

    const handleCalculator = (num, discount) => {
        setPayPrice(productPice * num);
        setTax(productPice * num * 0.1);
        setTotalPrice(productPice * num + productPice * num * 0.1);
    };
    const handlePayment = () => {};

    const handleSelectChange = (e) => {
        const { value } = e.target;

        selectBoxRef.current.dataset.content = value;
        setStudentNum(value);
        handleCalculator(value, 0);
    };

    const convertPriceString = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    useEffect(() => {
        //베타서비스 쿠폰 조회
        if (sessions.userType === 'teachers') {
            Axios.get(`${apiUrl}/my-page/profile`, { withCredentials: true })
                .then((res) => {
                    console.log(res.data);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, []);

    return (
        <>
            <HeaderBar defaultColor="white" />
            <div className="payment-root">
                <section className="payment-confirm">
                    <div className="payment-header">결제 상품 확인</div>
                    <div className="payment-confirm-box">
                        <div className="confirm-top">
                            <div className="top-title" id={`color-${queryString.parse(location.search).type}`}>
                                {queryString.parse(location.search).type}
                            </div>
                            <div className="top-contents"> {MenuData[queryString.parse(location.search).type]['desc']}</div>
                        </div>
                        <div className="confirm-bottom">
                            <div className="bottom-top">
                                <div id="small-text" className="gray">
                                    (학생당/월)
                                </div>
                                <div id="strike-through">
                                    {MenuData[queryString.parse(location.search).type]['price']}
                                    <span id="small-text">원</span>
                                </div>
                            </div>
                            <div className="bottom-bottom" id={`color-${queryString.parse(location.search).type}`}>
                                <div className="coupon-ment">베타 서비스 할인가</div>
                                <div>
                                    {MenuData[queryString.parse(location.search).type]['discount_' + 'personal']}
                                    <span id="small-text">원</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="payment-total">
                    <div className="payment-header">합계</div>
                    <div className="payment-total-table">
                        <div className="row">
                            <div className="total-left">
                                <span className="total-title">결제 상품</span>
                                <span>{convertPriceString(productPice)}원</span>
                            </div>
                            <div className="total-right">{convertPriceString(productPice)}</div>
                        </div>
                        <div className="row">
                            <div className="total-left">
                                <span className="total-title">학생 인원</span>
                                <select ref={selectBoxRef} onChange={handleSelectChange} data-content="">
                                    {Array.from({ length: 64 }, (v, i) => (
                                        <option key={i} value={i + 1}>
                                            {i + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="total-right student-num">x {studentNum}</div>
                        </div>
                        <div className="row">
                            <div className="total-left">
                                <span className="total-title">쿠폰 선택</span>
                                <select ref={selectBoxRef} onChange={handleSelectChange} data-content="">
                                    <option value="">적용 쿠폰이 없습니다.</option>
                                </select>
                            </div>
                            <div className="total-right">- {discountPrice}</div>
                        </div>
                        <div className="total-footer">
                            <div className="total-footer-top">
                                <div className="title">부가세(10%)</div>
                                <div className="num">₩ {convertPriceString(tax)}원</div>
                            </div>
                            <div className="total-footer-bottom">
                                <div className="title">상품 금액</div>
                                <div className="num">₩ {convertPriceString(payPrice)}원</div>
                            </div>
                            <div className="total-footer-bottom">
                                <div className="title">최종 금액</div>
                                <div className="num">₩ {convertPriceString(totalPrice)}원</div>
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
                        {convertPriceString(totalPrice)}원 결제하기
                    </button>
                </section>

                <section className="payment-warn">
                    <li>- 구독형 서비스로, 1개월마다 정기결제 됩니다.</li>
                    <li>- 입력 전에 쿠폰의 유효기간을 반드시 확인해주시기 바랍니다.</li>
                    <li>- 쿠폰 입력 시 최종 할인가격을 확인할 수 있습니다. </li>
                    <li>- 쿠폰 오류 시, 오류문구, 사용자 계정과 쿠폰 번호를 아래 메일로 전달 부탁드립니다.</li>
                    <li>- 문의사항은 rikjeon94@optmier.com 으로 연락 부탁드립니다.</li>
                </section>
            </div>
        </>
    );
}

export default React.memo(withRouter(Payment));
