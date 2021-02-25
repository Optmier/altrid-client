import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import '../styles/payment_page.scss';
import HeaderBar from '../components/essentials/HeaderBar';
import queryString from 'query-string';
import MenuData from '../datas/MenuData.json';
import { useSelector } from 'react-redux';
import Axios from 'axios';
import { apiUrl } from '../configs/configs';
import AddCard from '../components/essentials/AddCard';

function Payment({ location }) {
    const sessions = useSelector((state) => state.RdxSessions);
    const selectBoxRef = useRef();

    const [productPice, setProductPrice] = useState(0);
    const [studentNum, setStudentNum] = useState(1);
    const [discountPrice, setDiscountPrice] = useState(0);
    const [payPrice, setPayPrice] = useState(productPice * studentNum - discountPrice);
    const [tax, setTax] = useState(payPrice * 0.1);
    const [totalPrice, setTotalPrice] = useState(payPrice + tax);
    const [academyApproved, setAcademyApproved] = useState(0);
    const [nowPlan, setNowPlan] = useState('Free');
    const [couponSelectVlue, setCouponSelectVlue] = useState('');

    const handleCalculator = (num, discount) => {
        setPayPrice(productPice * num - discount);
        setTax((productPice * num - discount) * 0.1);
        setTotalPrice((productPice * num - discount) * 1 + (productPice * num - discount) * 0.1);
    };
    const handlePayment = () => {};

    const handleSelectChange = (e) => {
        const { value } = e.target;

        selectBoxRef.current.dataset.content = value;
        setStudentNum(value);
        setDiscountPrice(0);
        setCouponSelectVlue('');
        handleCalculator(value, 0);
    };
    const handleSelectCoupon = (e) => {
        const { value } = e.target;

        setCouponSelectVlue(value);
        if (value === '1') {
            setDiscountPrice(studentNum * 1000);
            handleCalculator(studentNum, studentNum * 1000);
        } else {
            setDiscountPrice(0);
            handleCalculator(studentNum, 0);
        }
    };

    const convertPriceString = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    useEffect(() => {
        //학원 소비자 쿠폰 조회
        if (sessions.userType === 'teachers') {
            Axios.get(`${apiUrl}/academies/${sessions.academyCode}`, { withCredentials: true })
                .then((res) => {
                    setAcademyApproved(res.data.approved);

                    //console.log();
                    setProductPrice(
                        parseInt(
                            MenuData[sessions.academyPlanId === 1 ? 'Free' : sessions.academyPlanId === 2 ? 'Standard' : 'Premium'][
                                'discount_personal'
                            ].replace(',', ''),
                        ),
                    );
                    setNowPlan(sessions.academyPlanId === 1 ? 'Free' : sessions.academyPlanId === 2 ? 'Standard' : 'Premium');
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, [sessions]);

    return (
        <>
            <HeaderBar defaultColor="white" />
            <div className="payment-root">
                <section className="payment-confirm">
                    <div className="payment-header">현재 플랜 확인</div>
                    <div className="payment-confirm-box">
                        <div className="confirm-top">
                            <div className="top-title" id={`color-${nowPlan}`}>
                                {nowPlan}
                            </div>
                            <div className="top-contents"> {MenuData[nowPlan]['desc']}</div>
                        </div>
                    </div>
                </section>
                <section className="payment-confirm">
                    <div className="payment-header">플랜 변경 상품</div>
                    <div className="payment-confirm-box">
                        {nowPlan === queryString.parse(location.search).type ? (
                            <h5>현재 플랜과 동일 플랜 상품을 선택하셨습니다.</h5>
                        ) : (
                            <>
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
                                            {MenuData[queryString.parse(location.search).type]['discount_personal']}
                                            <span id="small-text">원</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </section>
                {nowPlan === queryString.parse(location.search).type ? null : (
                    <>
                        <section className="payment-total">
                            <div className="payment-header">견적 미리보기</div>
                            <div className="payment-total-table">
                                <div className="total-warn">
                                    <li>
                                        * 정확한 가격은 매달 정기 결제일 전날까지의 <b>학생 수</b>를 토대로 산출됩니다.
                                    </li>
                                    <li>
                                        * 학생수는 학원 코드를 공유하는 <b>모든 클래스들에 초대된 학생 수</b>를 더한 값입니다.
                                    </li>
                                    <li>
                                        * 한명의 학생이 여러 클래스에 초대가 되어도 <b>한 명</b>으로 산출 됩니다.
                                    </li>
                                    <li>
                                        * 쿠폰 추가는 <b>마이페이지</b>에서 가능합니다.
                                    </li>
                                </div>

                                <div className="row">
                                    <div className="total-left">
                                        <span className="total-title">결제 상품</span>
                                        <span>{convertPriceString(productPice)}원</span>
                                    </div>
                                    <div className="total-right">{convertPriceString(productPice)}</div>
                                </div>
                                <div className="row">
                                    <div className="total-left">
                                        <span className="total-title">예상 학생수</span>
                                        <select ref={selectBoxRef} onChange={handleSelectChange} data-content="">
                                            {Array.from({ length: 63 }, (v, i) => (
                                                <option key={i} value={i + 1}>
                                                    {i + 1} 명
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="total-right student-num">x {studentNum}</div>
                                </div>
                                <div className="row">
                                    <div className="total-left">
                                        <span className="total-title">쿠폰 선택</span>
                                        <select ref={selectBoxRef} onChange={handleSelectCoupon} value={couponSelectVlue} data-content="">
                                            <option value="">적용 쿠폰</option>
                                            {academyApproved ? (
                                                <option value="1">[학원소비자한정]학생당 1천원 할인 쿠폰</option>
                                            ) : (
                                                <option value="0">적용 쿠폰이 없습니다.</option>
                                            )}
                                        </select>
                                    </div>
                                    <div className="total-right">- {convertPriceString(discountPrice)}</div>
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
                            <AddCard />
                        </section>
                        <section className="payment-footer">
                            <button id={`back-color-${queryString.parse(location.search).type}`} onClick={handlePayment}>
                                플랜 변겅하기
                            </button>
                        </section>
                    </>
                )}

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
