import React, { useState, useEffect } from 'react';
import WarningIcon from '@material-ui/icons/Warning';
import '../../styles/pay_state.scss';
import * as configs from '../../configs/config.json';
import Axios from 'axios';
import MenuData from '../../datas/MenuData.json';
import PriceData from '../../datas/PriceData.json';
import { useSelector } from 'react-redux';
import moment from 'moment-timezone';

function PaySuccess() {
    const sessions = useSelector((state) => state.RdxSessions);

    const [nowPlan, setNowPlan] = useState('Standard');
    const [orderPlan, setOrderPlan] = useState('Standard');
    const [isUpdate, setIsUpdate] = useState(false);
    const [cardNum, setCardNum] = useState();
    const [cardCompany, setCardCompany] = useState();
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();
    const [loaded, setLoaded] = useState(false);

    // 현재 구독중인 플랜 데이터 불러오기
    const [currentPlans, setCurrentPlans] = useState(null);

    const convertPriceString = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    //카드 정보 및 회원 정보 setState
    useEffect(() => {
        Axios.get(`${configs.SERVER_HOST}/payments/payment-info`, { withCredentials: true })
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
            if (sessions.academyPlanId === 1) {
                setCurrentPlans('Free');
                setOrderPlan('Free');
            }
            // 현재 유효한 플랜이 있는지 검사
            Axios.get(`${configs.SERVER_HOST}/payments/order-history/current-valid`, {
                params: { planId: sessions.academyPlanId },
                withCredentials: true,
            })
                .then((validPlan) => {
                    if (validPlan.data && validPlan.data.length > 0) {
                        console.log(validPlan.data[0]);
                        const currents = validPlan.data[0];
                        setCurrentPlans(currents);
                        if (currents.next_plan_id === currents.plan_id) {
                            setIsUpdate(false);
                            setOrderPlan(currents.plan_id === 1 ? 'Free' : currents.plan_id === 2 ? 'Standard' : 'Premium');
                        } else {
                            setIsUpdate(true);
                            setOrderPlan(currents.next_plan_id === 1 ? 'Free' : currents.next_plan_id === 2 ? 'Standard' : 'Premium');
                        }
                    } else {
                        setCurrentPlans(null);
                        console.error('현재 유효한 플랜 정보를 불러오는데 오류가 발생했습니다.');
                    }
                })
                .catch((validPlanError) => {
                    console.error('현재 유효한 플랜 정보를 불러오는데 오류가 발생했습니다.', validPlanError);
                });
        }
    }, [sessions]);

    useEffect(() => {
        if ((cardCompany && currentPlans) || currentPlans === 'Free') setLoaded(true);
    }, [cardCompany, currentPlans]);

    return (
        <>
            {loaded ? (
                <>
                    <div className="header-text">
                        감사합니다! <br /> <span id={`color-${orderPlan}`}>{orderPlan}</span> 플랜 서비스 구독 {isUpdate ? '변경 ' : ''}
                        신청이 완료되었습니다 :)
                        {isUpdate ? (
                            <p
                                style={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    marginTop: '1.2rem',
                                    marginBottom: '-1rem',
                                    fontSize: '1.1rem',
                                    fontWeight: 500,
                                }}
                            >
                                <WarningIcon fontSize="small" style={{ marginRight: '0.18rem' }} />
                                변경된 플랜은 다음 결제일 이후 부터 적용됩니다.
                            </p>
                        ) : null}
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
                                <div className="row-desc">
                                    {currentPlans ? moment(currentPlans.billing_date).format('yyyy년 MM월 DD일') : '-'}
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            ) : null}
        </>
    );
}

export default PaySuccess;
