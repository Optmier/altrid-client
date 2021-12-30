import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PlanInfo from '../../datas/PlanInfo.json';
import { useSelector } from 'react-redux';
import BackdropComponent from '../essentials/BackdropComponent';
import Axios from 'axios';
import { apiUrl } from '../../configs/configs';
import moment from 'moment-timezone';
import { withRouter } from 'react-router';
import '../../styles/mypage.scss';

const StylePossible = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    font-weight: 600;
    color: ${(props) => (props.able ? '#13e2a1' : '#C7C7C7')};
    & svg {
        margin-left: 10px;
    }
`;

const StyledPlanName = styled.div`
    display: flex;
    align-items: center;
    &.color-Free {
        color: rgba(19, 226, 161, 1);
    }
    &.color-Standard {
        color: rgba(109, 42, 250, 1);
    }
    &.color-Premium {
        color: rgba(59, 22, 138, 1);
    }
    & button.inner {
        background-color: #9f9f9f;
        box-shadow: none;
        border-radius: 6px;
        color: white;
        margin-left: 1.5rem;
        padding: 6px 16px;
    }
    & button.inner.upgrade {
        background-color: rgba(19, 226, 161, 1);
    }
    & button.inner.modify {
        background-color: #3f1990;
    }
`;

function Possible({ able }) {
    return (
        <StylePossible able={able}>
            {able ? (
                <>
                    가능
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z"
                            fill="#E6F6F6"
                        />
                        <path
                            d="M13.5339 6.42015L8.2278 11.4288L6.79998 9.86189C6.17041 9.36015 5.18085 9.9445 5.63041 10.6967L7.3278 13.4323C7.59737 13.7662 8.2278 14.1002 8.8565 13.4323C9.12607 13.0984 14.253 7.17146 14.253 7.17146C14.8835 6.50363 14.0739 5.91928 13.5339 6.42015Z"
                            fill="#58C1C3"
                        />
                    </svg>
                </>
            ) : (
                <>
                    제한
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M19.25 10C19.25 15.1086 15.1086 19.25 10 19.25C4.89137 19.25 0.75 15.1086 0.75 10C0.75 4.89137 4.89137 0.75 10 0.75C15.1086 0.75 19.25 4.89137 19.25 10Z"
                            stroke="#E4E4E4"
                            strokeWidth="1.5"
                        />
                    </svg>
                </>
            )}
        </StylePossible>
    );
}
function NowPlan({ history }) {
    const [nowPlan, setNowPlan] = useState('Free');
    const [nextPlan, setNextPlan] = useState('-');
    const { academyPlanId } = useSelector((state) => state.RdxSessions);
    const { data } = useSelector((state) => state.planInfo);
    const [planDurationDate, setPlanDurationDate] = useState('-');

    const handlePlanBtn = () => {
        // alert('현재는 베타 서비스 기간으로, 플랜변경이 불가능합니다!');
        history.push('/pricing');
    };

    const handleUnsubscribe = () => {
        const confirm = window.confirm('플랜 구독을 해지하시겠습니까?\n현재 플랜 이용일 이후에 해지됩니다.');
        if (confirm) history.push('/payment?type=Free');
    };

    const handleCancelModifPlan = () => {
        history.push(`/payment?type=${nextPlan}`);
    };

    useEffect(() => {
        if (academyPlanId && data) {
            setNowPlan(academyPlanId === 1 ? 'Free' : academyPlanId === 2 ? 'Standard' : 'Premium');

            // 현재 유효한 플랜이 있는지 검사
            Axios.get(`${apiUrl}/payments/order-history/current-valid`, {
                params: { planId: academyPlanId },
                withCredentials: true,
            })
                .then((validPlan) => {
                    // console.log(validPlan.data);
                    if (validPlan.data && validPlan.data.length > 0) {
                        const starts = validPlan.data[0].plan_start;
                        const ends = validPlan.data[0].plan_end;
                        const nextPlanId = validPlan.data[0].next_plan_id;
                        setPlanDurationDate(`${moment(starts).format('yyyy년 MM월 DD일')} - ${moment(ends).format('yyyy년 MM월 DD일')}`);
                        setNextPlan(nextPlanId === 1 ? 'Free' : nextPlanId === 2 ? 'Standard' : 'Premium');
                    } else {
                        setPlanDurationDate('-');
                    }
                })
                .catch((validPlanError) => {
                    console.error('현재 유효한 플랜 정보를 불러오는데 오류가 발생했습니다.', validPlanError);
                });
        }
    }, [academyPlanId, data]);

    if (!(academyPlanId && data)) return <BackdropComponent open={true} />;
    return (
        <>
            <div className="now-plan-root">
                <div className="mypage-contents white-box now-plan">
                    <div className="now-plan-left">
                        <div className="row">
                            <div className="row-title">현재 플랜</div>
                            <StyledPlanName className={`row-desc color-${nowPlan}`}>
                                {nowPlan}{' '}
                                {/* {nowPlan !== 'Free' && nextPlan !== 'Free' ? (
                                <button className="inner" onClick={handleUnsubscribe}>
                                    플랜 구독 해지
                                </button>
                            ) : null} */}
                            </StyledPlanName>
                        </div>
                        <div className="row">
                            <div className="row-title">이용 기간</div>
                            {/* <div className="row-desc">현재는 베타 서비스 기간입니다.</div> */}
                            <div className="row-desc">{planDurationDate}</div>
                        </div>
                        <div className="row">
                            <div className="row-title">다음 플랜</div>
                            <StyledPlanName className={`row-desc color-${nextPlan}`}>
                                {nextPlan}{' '}
                                {nowPlan === 'Free' ? (
                                    <button className="inner upgrade" onClick={handlePlanBtn}>
                                        플랜 업그레이드
                                    </button>
                                ) : nowPlan === nextPlan ? (
                                    <button className="inner modify" onClick={handlePlanBtn}>
                                        플랜 변경
                                    </button>
                                ) : (
                                    <button className="inner" onClick={handleCancelModifPlan}>
                                        변경 취소
                                    </button>
                                )}
                            </StyledPlanName>
                        </div>
                    </div>
                    <div className="now-plan-right">
                        {nowPlan === 'Free' || nextPlan === 'Free' ? null : (
                            <button className="btn-gray" onClick={handleUnsubscribe}>
                                구독 해지
                            </button>
                        )}
                    </div>
                </div>
                <div className="mypage-contents white-box plan-info">
                    <div className="plan-info-header">나의 플랜 가능 정보</div>
                    <div className="plan-info-table">
                        {Object.keys(PlanInfo[nowPlan]).map((i) => (
                            <div key={i} className="info-row">
                                <div className="title">
                                    <div className="title-header">{i}</div>
                                    <div className="title-info">{PlanInfo[nowPlan][i]['info']}</div>
                                </div>
                                <div className="desc">
                                    {PlanInfo[nowPlan][i]['type'] !== 'bool' ? (
                                        <div className="desc-count">
                                            {PlanInfo[nowPlan][i]['desc']}{' '}
                                            <span>
                                                {PlanInfo[nowPlan][i]['subType'] === 'person'
                                                    ? `(현재 ${data[PlanInfo[nowPlan][i]['type']]}명)`
                                                    : `(현재 ${data[PlanInfo[nowPlan][i]['type']]}회)`}
                                            </span>
                                        </div>
                                    ) : PlanInfo[nowPlan][i]['desc'] === '가능' ? (
                                        <Possible able={true} />
                                    ) : (
                                        <Possible able={false} />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default withRouter(NowPlan);
