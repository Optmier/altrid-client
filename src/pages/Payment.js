import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import '../styles/payment_page.scss';
import HeaderBar from '../components/essentials/HeaderBar';
import queryString from 'query-string';
import MenuData from '../datas/MenuData.json';
import { useSelector } from 'react-redux';
import Axios from 'axios';
import { apiUrl, tossPaymentsClientKey } from '../configs/configs';
import handleCallPayments from '../components/TossPayment/handleCallPayments.js';
import { loadTossPayments } from '@tosspayments/sdk';
/** https://github.com/jeanlescure/short-unique-id
 * Copyright (c) 2018-2020 Short Unique ID Contributors.
 * Licensed under the Apache License 2.0.
 */
import ShortUniqueId from 'short-unique-id';

function Confirm({ location }) {
    const sessions = useSelector((state) => state.RdxSessions);
    const selectBoxRef = useRef();
    const tossPayments = useRef();
    const generateUid = useRef();

    //선택 플랜, 선택 플랜 가격
    const [productPlan, setProductPlan] = useState(queryString.parse(location.search).type);
    const [productPlanId, setProductPlanId] = useState(MenuData[queryString.parse(location.search).type]['id']);
    const [productPice, setProductPrice] = useState(MenuData[queryString.parse(location.search).type]['discount_personal']);

    //현재 플랜
    const [nowPlan, setNowPlan] = useState('Free');

    //견적 미리보기
    const [studentNum, setStudentNum] = useState(1);
    const [couponSelectVlue, setCouponSelectVlue] = useState('');
    const [couponSelectId, setCouponSelectId] = useState(null);
    const [discountPrice, setDiscountPrice] = useState(0);
    const [academyApproved, setAcademyApproved] = useState(0);
    const [payPrice, setPayPrice] = useState(productPice * studentNum - discountPrice);
    const [tax, setTax] = useState(payPrice * 0.1);
    const [totalPrice, setTotalPrice] = useState(payPrice + tax);

    // 쿠폰 메뉴
    const [couponMenus, setCouponMenus] = useState([]);

    // 결제정보 있는지 여부
    const [isPaymentsExists, setIsPaymentsExists] = useState(false);

    // 현재 구독중인 플랜 데이터 불러오기
    const [currentPlans, setCurrentPlans] = useState(null);

    const handleCalculator = (num, discount) => {
        setPayPrice(productPice * num - discount);
        setTax((productPice * num - discount) * 0.1);
        setTotalPrice((productPice * num - discount) * 1 + (productPice * num - discount) * 0.1);
    };

    const handleSelectChange = (e) => {
        const { value } = e.target;

        selectBoxRef.current.dataset.content = value;
        setStudentNum(value);
        setDiscountPrice(0);
        setCouponSelectVlue('');
        handleCalculator(value, 0);
    };
    const handleSelectCoupon = (e) => {
        const { value, selectedOptions } = e.target;

        setCouponSelectId(selectedOptions[0].dataset.id ? selectedOptions[0].dataset.id : null);
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

    // 쿠폰 발급 메소드(현재는 기간 한정 서비스이므로 일부 데이터 고정)
    const giveCouponsFn = (isUpdate) => {
        if (productPlan === 'Free') {
            window.location.href = window.location.origin + '/pay-state/success';
            return;
        }
        // 쿠폰 아이디(하기는 플랜별 일시 할인 쿠폰 적용)
        const couponIds = [`personal_${productPlan.toLowerCase()}`];
        // 주문번호는 매월로 고정
        const orderNos = ['monthly'];
        // 쿠폰 상태는 예약됨 고정
        const status = ['queued'];
        // 사용 예정 기준일
        const usedAfterStdDate = isUpdate ? new Date(currentPlans.plan_start) : new Date();
        // 사용 예정일(이후) 30일, 한달로 고정, 업데이트인 경우 두달 뒤로 고정
        const usedAfterValues = [isUpdate ? 2 : 1];
        // 사용 예정일 단위(d: 일 / m: 달)
        const usedAfterUnits = ['m'];
        // 학원 운영자 고객은 그룹 할인 쿠폰 적용
        if (couponSelectId) {
            couponIds.push(couponSelectId);
            orderNos.push('monthly');
            status.push('queued');
            usedAfterValues.push(isUpdate ? 2 : 1);
            usedAfterUnits.push('m');
        }
        Axios.post(
            `${apiUrl}/payments/coupon-history`,
            {
                couponIds: couponIds,
                orderNos: orderNos,
                status: status,
                usedAfterStdDate: usedAfterStdDate,
                usedAfterValues: usedAfterValues,
                usedAfterUnits: usedAfterUnits,
            },
            { withCredentials: true },
        )
            .then((giveCouponResults) => {
                console.log(giveCouponResults);
                // 성공 결과창으로 이동
                window.location.href = window.location.origin + '/pay-state/success';
            })
            .catch((giveCouponErr) => {
                alert('쿠폰을 등록 오류가 발생하였습니다.\n관리자의 조치를 받으시기 바랍니다.');
                console.error(giveCouponErr);
            });
    };

    const planChangeActionClick = () => {
        if (!sessions.authId) return alert('사용자 인증에 실패하였습니다.');
        if (currentPlans && currentPlans.next_plan_id === productPlanId) {
            const conf = window.confirm('플랜 변경 신청을 취소하시겠습니까?');
            if (!conf) return;
            // 플랜 변경 신청을 취소하면 현재 플랜으로 업데이트 해서 원래 플랜으로 돌아감
            const idx = currentPlans.idx;
            Axios.patch(
                `${apiUrl}/payments/order-history/mod-next-plan`,
                {
                    orderIdx: idx,
                    nextPlanId: currentPlans.plan_id,
                },
                { withCredentials: true },
            )
                .then((updatePlanResult) => {
                    console.log(updatePlanResult);
                    window.location.reload();
                })
                .catch((updatePlanErr) => {
                    alert('플랜 변경에 오류가 발생하였습니다.\n관리자의 조치를 받으시기 바랍니다.');
                    console.error(updatePlanErr);
                });
        } else {
            const conf = window.confirm('선택하신 플랜을 신청하시겠습니까?');
            if (!conf) return;
            const currentDate = new Date();
            if (isPaymentsExists || productPlan === 'Free') {
                // 결제정보가 존재하면 쿠폰데이터 및 플랜 주문 정보 넣고 성공 페이지로 넘김
                console.log('결제정보 존재');
                console.log(couponSelectId);

                // 현재 유효한 플랜이 있는지 검사
                if (currentPlans) {
                    // 유효한 플랜이 있으면 현재 유효한 플랜에서 다음 플랜을 변동시킴
                    const idx = currentPlans.idx;
                    Axios.patch(
                        `${apiUrl}/payments/order-history/mod-next-plan`,
                        {
                            orderIdx: idx,
                            nextPlanId: productPlanId,
                        },
                        { withCredentials: true },
                    )
                        .then((updatePlanResult) => {
                            console.log(updatePlanResult);
                            giveCouponsFn(true);
                        })
                        .catch((updatePlanErr) => {
                            alert('플랜 변경에 오류가 발생하였습니다.\n관리자의 조치를 받으시기 바랍니다.');
                            console.error(updatePlanErr);
                        });
                } else {
                    // 유효한 플랜이 없으면 새로 주문으로 플랜을 추가함
                    // 다만 무료 플랜을 선택한 경우에는 원래 유효한 플랜이 있는 상태에서 변경 가능하므로, 없는 경우는 에러처리함.
                    if (productPlan === 'Free') {
                        // alert('오류 발생으로 관리자에게 문의 바랍니다!');
                        Axios.patch(`${apiUrl}/payments/plan-free`, {}, { withCredentials: true })
                            .then((res) => {
                                console.log(res);
                                window.location.href = window.location.origin + '/pay-state/success';
                            })
                            .catch((err) => {
                                console.error(err);
                            });
                        return;
                    }
                    const newOrderNo = currentDate.getTime() + '_' + generateUid.current(11);
                    Axios.post(
                        `${apiUrl}/payments/order-history`,
                        {
                            orderNo: newOrderNo,
                            planId: productPlanId,
                            orderPrice: 0,
                            paymentPrice: 0,
                            startDate: currentDate,
                        },
                        { withCredentials: true },
                    )
                        .then((orderResults) => {
                            console.log(orderResults);
                            // 쿠폰 발급 메소드 실행
                            giveCouponsFn(false);
                        })
                        .catch((orderErr) => {
                            alert('플랜 구독 설정에 오류가 발생하였습니다.\n관리자의 조치를 받으시기 바랍니다.');
                            console.error(orderErr);
                        });
                }
                // Axios.post(`${apiUrl}/payments/order-history`, {}, { withCredentials: true })
                //     .then((orderResults) => {
                //         console.log(orderResults);

                //         Axios.post(`${apiUrl}/payments/coupon-history`, {}, { withCredentials: true })
                //             .then((giveCouponResults) => {
                //                 console.log(giveCouponResults);
                //             })
                //             .catch((giveCouponErr) => {
                //                 console.error(giveCouponErr);
                //             });
                //     })
                //     .catch((orderErr) => {
                //         console.error(orderErr);
                //     });
            } else {
                /* 결제정보가 존재하지 않으면 paygetbillingkey로 보내서 우선 빌링키를 발급받아 결제정보에 넣고
                쿠폰데이터 및 플랜 주문 정보를 넣는다.
             */
                console.log('결제정보 없음');
                let successUrl = window.location.origin + `/pay-state/billingkey-updateplan?plan=${productPlan}&coupon=${couponSelectId}`;
                tossPayments.current.requestBillingAuth('카드', {
                    customerKey: sessions.authId,
                    successUrl: successUrl,
                    failUrl: window.location.origin + '/pay-state/fail',
                });
            }
        }
    };

    useEffect(() => {
        // console.log(couponMenus);
        // 베타기간 플랜 쿠폰 유효성 검사
        if (couponMenus.find((d) => d.coupon_id === `personal_${productPlan.toLowerCase()}`)) {
            // console.log('current plan ' + productPlan + ' coupon is exists');
        } else {
            // console.log('current plan ' + productPlan + " coupon doesn't exists");
            // setProductPrice(MenuData[queryString.parse(location.search).type]['price']);
        }

        // 학원 소비자 쿠폰 유효성 검사
        if (couponMenus.find((d) => d.coupon_id === `group`)) {
        } else {
        }
    }, [couponMenus]);

    useEffect(() => {
        if (!sessions || !sessions.authId || !sessions.userType || !sessions.academyName) return;
        //학원 소비자 쿠폰 조회
        if (sessions.userType === 'teachers') {
            setAcademyApproved(sessions.academyApproved);
            setNowPlan(sessions.academyPlanId === 1 ? 'Free' : sessions.academyPlanId === 2 ? 'Standard' : 'Premium');

            Axios.get(`${apiUrl}/payments/coupon-menus`, { params: { searchAll: false }, withCredentials: true })
                .then((coupons) => {
                    console.log(coupons.data);
                    setCouponMenus(coupons.data);
                })
                .catch((couponsErr) => {
                    console.error(couponsErr);
                    setCouponMenus([]);
                });

            // 현재 유효한 플랜이 있는지 검사
            Axios.get(`${apiUrl}/payments/order-history/current-valid`, {
                params: { planId: sessions.academyPlanId },
                withCredentials: true,
            })
                .then((validPlan) => {
                    if (validPlan.data && validPlan.data.length > 0) {
                        setCurrentPlans(validPlan.data[0]);
                    } else {
                        setCurrentPlans(null);
                    }
                })
                .catch((validPlanError) => {
                    console.error('현재 유효한 플랜 정보를 불러오는데 오류가 발생했습니다.', validPlanError);
                });

            Axios.get(`${apiUrl}/payments/payment-info`, { withCredentials: true })
                .then((res) => {
                    console.log(res.data);
                    if (res.data && res.data.length > 0) {
                        setIsPaymentsExists(true);
                    } else {
                        setIsPaymentsExists(false);
                    }
                })
                .catch((err) => {
                    console.error(err);
                    setIsPaymentsExists(false);
                });

            loadTossPayments(tossPaymentsClientKey)
                .then((res) => {
                    tossPayments.current = res;
                })
                .catch((err) => {
                    console.error(err);
                });
            generateUid.current = new ShortUniqueId();
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
                        {nowPlan === productPlan ? (
                            <h5>현재 플랜과 동일 플랜 상품을 선택하셨습니다.</h5>
                        ) : (
                            <>
                                <div className="confirm-top">
                                    <div className="top-title" id={`color-${productPlan}`}>
                                        {productPlan}
                                    </div>
                                    <div className="top-contents"> {MenuData[productPlan]['desc']}</div>
                                </div>
                                <div className="confirm-bottom">
                                    <div className="bottom-top">
                                        <div id="small-text" className="gray">
                                            (학생당/월)
                                        </div>
                                        <div id="strike-through">
                                            {convertPriceString(MenuData[productPlan]['price'])}
                                            <span id="small-text">원</span>
                                        </div>
                                    </div>
                                    <div className="bottom-bottom" id={`color-${productPlan}`}>
                                        <div className="coupon-ment">베타 서비스 할인가</div>
                                        <div>
                                            {convertPriceString(productPice)}
                                            <span id="small-text">원</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </section>
                {nowPlan === productPlan ? null : (
                    <>
                        {productPlan === 'Free' ? null : (
                            <section className="payment-total">
                                <div className="payment-header">견적 미리보기</div>
                                <div className="payment-total-table">
                                    <div className="total-warn">
                                        <li>
                                            * 정확한 가격은 매달 정기 결제일 전날까지의 <b>최대 학생 수</b>를 토대로 산출됩니다.
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
                                            <select
                                                ref={selectBoxRef}
                                                onChange={handleSelectCoupon}
                                                value={couponSelectVlue}
                                                data-content=""
                                            >
                                                <option value="">적용 쿠폰</option>
                                                {academyApproved && couponMenus.find((d) => d.coupon_id === `group`) ? (
                                                    <option value="1" data-id="group">
                                                        [학원소비자한정]학생당 1천원 할인 쿠폰
                                                    </option>
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
                                            <div className="title">총 예상 금액</div>
                                            <div className="num">₩ {convertPriceString(totalPrice)}원</div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}
                        {/* <section className="payment-select">
                            <div className="payment-header">결제 수단 선택</div>
                            <TossAddCard />
                        </section> */}
                        <section className="payment-footer">
                            <button
                                id={`back-color-${
                                    currentPlans && productPlanId === currentPlans.next_plan_id ? 'PlanCancel' : productPlan
                                }`}
                                onClick={planChangeActionClick}
                            >
                                {currentPlans && productPlanId === currentPlans.next_plan_id ? '플랜 변경 취소' : '플랜 변경하기'}
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

export default React.memo(withRouter(Confirm));
