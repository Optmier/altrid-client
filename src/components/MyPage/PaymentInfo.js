import Axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { apiUrl, tossPaymentsClientKey } from '../../configs/configs';
import moment from 'moment-timezone';
import { loadTossPayments } from '@tosspayments/sdk';
import { useSelector } from 'react-redux';

//카드 내역 있으면 '카드 추가'
//카드 내역 없으면 '카드 변경'

function PaymentInfo() {
    const sessions = useSelector((state) => state.RdxSessions);
    const [paymentsInfo, setPaymentsInfo] = useState({
        valid: false,
        auth_date: '-',
        card_company: '-',
        card_number: '-',
        email: '-',
        pg_name: '-',
        phone: '-',
    });
    const [paymentHistory, setPaymentHistory] = useState([]);
    const tossPayments = useRef();

    const paymentsCardActionClick = () => {
        let successUrl = null;
        if (paymentsInfo.valid) {
            // 카드 변경 메소드
            successUrl = window.location.origin + '/pay-state/billingkey-modify';
        } else {
            // 카드 추가 메소드
            successUrl = window.location.origin + '/pay-state/billingkey-add';
        }

        if (!sessions.authId) return alert('사용자 인증에 실패하였습니다.');

        tossPayments.current.requestBillingAuth('카드', {
            customerKey: sessions.authId,
            successUrl: successUrl,
            failUrl: window.location.origin + '/pay-state/fail',
        });
    };

    useEffect(() => {
        if (!sessions || !sessions.authId || !sessions.userType || !sessions.academyName) return;
        if (sessions.userType === 'teachers') {
            Axios.get(`${apiUrl}/payments/payment-info`, { withCredentials: true })
                .then((res) => {
                    if (res.data && res.data.length > 0) {
                        setPaymentsInfo({
                            ...paymentsInfo,
                            ...res.data[0],
                            auth_date: moment(res.data[0].auth_date).format('YYYY년 MM월 DD일'),
                            card_number: res.data[0].card_number
                                .replace(/\*/gi, '•')
                                .replace(/(.{4})/g, '$1 ')
                                .trim(),
                            valid: true,
                        });
                    }
                })
                .catch((err) => {
                    console.error(err);
                });

            loadTossPayments(tossPaymentsClientKey)
                .then((res) => {
                    tossPayments.current = res;
                })
                .catch((err) => {
                    console.error(err);
                });

            // 결제 내역 불러오기
            Axios.get(`${apiUrl}/payments/payment-history`, { withCredentials: true })
                .then((resPaymentHistory) => {
                    if (resPaymentHistory && resPaymentHistory.data) {
                        setPaymentHistory(resPaymentHistory.data);
                    }
                })
                .catch((errPaymentHistory) => {
                    console.error(errPaymentHistory);
                });
        }
    }, [sessions]);

    return (
        <>
            <div className="payment-info-root">
                <div className="mypage-contents white-box">
                    <div className="card-info">
                        <div className="card-info-top">
                            <div className="card-info-left">
                                <div className="row">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M14 0H2C1.1675 0 0.5075 0.89 0.5075 2L0.5 14C0.5 15.11 1.1675 16 2 16H14C14.8325 16 15.5 15.11 15.5 14V2C15.5 0.89 14.8325 0 14 0ZM14 14H2V8H14V14ZM14 4H2V2H14V4Z"
                                            fill="#575555"
                                        />
                                    </svg>
                                    <h5> 카드</h5>
                                </div>
                                <div className="row">
                                    <p>유료 플랜 및 부가서비스를 이용하기 위해서 1개 이상의 카드가 필요합니다.</p>
                                </div>
                            </div>
                            <div className="card-info-right">
                                <button className={paymentsInfo.valid ? 'btn-green' : 'btn-purple'} onClick={paymentsCardActionClick}>
                                    {paymentsInfo.valid ? '카드 변경' : '카드 추가'}
                                </button>
                            </div>
                        </div>
                        <div className="card-info-bottom">
                            <div className="card-col">
                                <div className="card-col-header">등록일</div>
                                <div className="card-col-desc">{paymentsInfo.auth_date}</div>
                            </div>
                            <div className="card-col">
                                <div className="card-col-header">카드사</div>
                                <div className="card-col-desc">{paymentsInfo.card_company}</div>
                            </div>
                            <div className="card-col">
                                <div className="card-col-header">카드번호</div>
                                <div className="card-col-desc">{paymentsInfo.card_number}</div>
                            </div>
                            <div className="card-col">
                                <div className="card-col-header">결제사</div>
                                <div className="card-col-desc">{paymentsInfo.pg_name}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mypage-contents white-box">
                    <div className="pay-info">
                        <div className="pay-info-header">
                            <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M16 2H11.82C11.4 0.84 10.3 0 9 0C7.7 0 6.6 0.84 6.18 2H2C0.9 2 0 2.9 0 4V18C0 19.1 0.9 20 2 20H16C17.1 20 18 19.1 18 18V4C18 2.9 17.1 2 16 2ZM9 2C9.55 2 10 2.45 10 3C10 3.55 9.55 4 9 4C8.45 4 8 3.55 8 3C8 2.45 8.45 2 9 2ZM11 16H4V14H11V16ZM14 12H4V10H14V12ZM14 8H4V6H14V8Z"
                                    fill="#575555"
                                />
                            </svg>
                            <h5>결제 내역</h5>
                        </div>
                        <div className="pay-info-table">
                            <div className="table-title">날짜</div>
                            <div className="table-title">설명</div>
                            <div className="table-title">서비스 기간</div>
                            <div className="table-title">결제 수단</div>
                            <div className="table-title">이용료</div>
                            <div className="table-title">지불 금액</div>
                        </div>
                        {paymentHistory.map((data) => (
                            <div className="pay-info-table" key={data.payment_key}>
                                <div className="table-desc date">{moment(data.approved_at).format('YYYY년 MM월 DD일')}</div>
                                <div className="table-desc">{data.name}</div>
                                <div className="table-desc">
                                    {moment(data.plan_start).format('YYYY년 MM월 DD일')}—{moment(data.plan_end).format('YYYY년 MM월 DD일')}
                                </div>
                                <div className="table-desc">
                                    {data.card_type}{' '}
                                    {data.card_number
                                        .replace(/\*/gi, '•')
                                        .replace(/(.{4})/g, '$1 ')
                                        .trim()}
                                </div>
                                <div className="table-desc">
                                    {data.payment_price * 0.9}원 <span>(+{data.payment_price * 0.1}원 부가세)</span>
                                </div>
                                <div className="table-desc">{data.payment_price}원</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default PaymentInfo;
