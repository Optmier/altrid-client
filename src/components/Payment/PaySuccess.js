import React, { useState, useEffect } from 'react';
import '../../styles/pay_state.scss';
import { apiUrl } from '../../configs/configs';
import Axios from 'axios';
import MenuData from '../../datas/MenuData.json';
import { useSelector } from 'react-redux';

function PaySuccess() {
    const sessions = useSelector((state) => state.RdxSessions);

    const [nowPlan, setNowPlan] = useState();

    //카드 정보 및 회원 정보 setState
    useEffect(() => {
        Axios.get(`${apiUrl}/payments`, { withCredentials: true })
            .then((res) => {
                console.log(res.data);
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
                반갑습니다 고객님 ! <br /> <span id="color-Standard">Standard</span> 플랜 서비스 구독 신청이 완료되었습니다 :)
            </div>

            <section>
                <div className="payState-header">카드 정보</div>
                <div className="payState-box">
                    <div className="row">
                        <div className="row-title">카드 번호</div>
                        <div className="row-desc">신용카드 **** **** **** 3041</div>
                    </div>
                    <div className="row">
                        <div className="row-title">카드사</div>
                        <div className="row-desc">현대</div>
                    </div>
                    <div className="row">
                        <div className="row-title">결제 이메일</div>
                        <div className="row-desc">jun094@optmier.com</div>
                    </div>
                    <div className="row">
                        <div className="row-title">전화번호</div>
                        <div className="row-desc">010-3724-2781</div>
                    </div>
                </div>
            </section>

            <section>
                <div className="payState-header">나의 구독 정보</div>
                <div className="payState-box">
                    <div className="row">
                        <div className="row-title">회원님의 플랜</div>
                        <div className="row-desc">
                            <span id="color-Standard">Standard</span>
                            <span id="color-gray">(학생당 7,900원)</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="row-title">선생님 초대 가능 수</div>
                        <div className="row-desc">5명</div>
                    </div>
                    <div className="row">
                        <div className="row-title">학생 초대 가능 수</div>
                        <div className="row-desc">최대 63명</div>
                    </div>
                    <div className="row">
                        <div className="row-title">화상 수업 기능</div>
                        <div className="row-desc" id="color-red">
                            불가능
                        </div>
                    </div>
                    <div className="row">
                        <div className="row-title">다음 결제일</div>
                        <div className="row-desc">2021년 3월 15일</div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default PaySuccess;
