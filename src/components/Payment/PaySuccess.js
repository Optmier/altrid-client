import React, { useState, useEffect } from 'react';
import '../../styles/pay_state.scss';
import { apiUrl } from '../../configs/configs';
import Axios from 'axios';
import MenuData from '../../datas/MenuData.json';
import PriceData from '../../datas/PriceData.json';
import { useSelector } from 'react-redux';

function PaySuccess() {
    const sessions = useSelector((state) => state.RdxSessions);

    const [nowPlan, setNowPlan] = useState('Standard');
    const [cardNum, setCardNum] = useState();
    const [cardCompany, setCardCompany] = useState();
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();

    const convertPriceString = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    //카드 정보 및 회원 정보 setState
    useEffect(() => {
        Axios.get(`${apiUrl}/payments/payment-info`, { withCredentials: true })
            .then((res) => {
                setCardCompany(res.data[0].card_company);
                setCardNum(res.data[0].card_number);
                setEmail(res.data[0].email);
                setPhone(res.data[0].phone);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    //플랜 종류 setState
    useEffect(() => {
        if (sessions.academyPlanId) {
            setNowPlan(sessions.academyPlanId === 1 ? 'Free' : sessions.academyPlanId === 2 ? 'Standard' : 'Premium');
        }
    }, [sessions]);

    return (
        <>
            <div className="header-text">
                반갑습니다 고객님 ! <br /> <span id={`color-${nowPlan}`}>Standard</span> 플랜 서비스 구독 신청이 완료되었습니다 :)
            </div>

            <section>
                <div className="payState-header">카드 정보</div>
                <div className="payState-box">
                    <div className="row">
                        <div className="row-title">카드 번호</div>
                        <div className="row-desc">{cardNum}</div>
                    </div>
                    <div className="row">
                        <div className="row-title">카드사</div>
                        <div className="row-desc">{cardCompany}</div>
                    </div>
                    <div className="row">
                        <div className="row-title">결제 이메일</div>
                        <div className="row-desc">{email}</div>
                    </div>
                    <div className="row">
                        <div className="row-title">전화번호</div>
                        <div className="row-desc">{phone}</div>
                    </div>
                </div>
            </section>

            <section>
                <div className="payState-header">나의 구독 정보</div>
                <div className="payState-box">
                    <div className="row">
                        <div className="row-title">회원님의 플랜</div>
                        <div className="row-desc">
                            <span id={`color-${nowPlan}`}>{nowPlan}</span>
                            <span id="color-gray">(학생당 {convertPriceString(MenuData[nowPlan]['discount_personal'])}원)</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="row-title">선생님 초대 가능 수</div>
                        <div className="row-desc">{PriceData[nowPlan]['선생님 초대 인원']}</div>
                    </div>
                    <div className="row">
                        <div className="row-title">학생 초대 가능 수</div>
                        <div className="row-desc">최대 63명</div>
                    </div>
                    <div className="row">
                        <div className="row-title">화상 수업 기능</div>
                        {nowPlan === 'Premium' ? (
                            <div className="row-desc">가능</div>
                        ) : (
                            <div className="row-desc" id="color-red">
                                불가능
                            </div>
                        )}
                    </div>
                    <div className="row">
                        <div className="row-title">다음 결제일</div>
                        <div className="row-desc">server 처리...</div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default PaySuccess;
