/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import Axios from 'axios';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { apiUrl } from '../../configs/configs';
import MenuData from '../../datas/MenuData.json';
/** https://github.com/jeanlescure/short-unique-id
 * Copyright (c) 2018-2020 Short Unique ID Contributors.
 * Licensed under the Apache License 2.0.
 */
import ShortUniqueId from 'short-unique-id';
import { openAlertSnackbar } from '../../redux_modules/alertMaker';

function PayGetBillingKey({ method, history }) {
    const sessions = useSelector((state) => state.RdxSessions);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!sessions || !sessions.authId || !sessions.userType || !sessions.academyName) {
            return;
        }

        const urlSearchParams = new URLSearchParams(history.location.search);
        const customerKey = urlSearchParams.get('customerKey');
        const authKey = urlSearchParams.get('authKey');
        const productPlan = urlSearchParams.get('plan');
        const productPlanId = method !== 'updatePlan' ? null : MenuData[productPlan].id;
        const couponSelectId = urlSearchParams.get('coupon');

        const generateUid = new ShortUniqueId();

        console.log(customerKey, authKey, productPlan, productPlanId, couponSelectId);

        // 빌링키 발급 메소드
        const getBillingKey = Axios.get(`${apiUrl}/payments/billing-key?customerKey=${customerKey}&authKey=${authKey}`, {
            withCredentials: true,
        }).catch((err) => {
            console.error(err.response);
            dispatch(openAlertSnackbar('결제 키 생성 중 오류가 발생했습니다.\n문제 지속 시 기술문의 바랍니다.', 'error'));
            history.goBack();
        });

        // 쿠폰 발급 메소드(현재는 기간 한정 서비스이므로 일부 데이터 고정)
        const giveCouponsFn = (isUpdate, currentPlans) => {
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
            if (couponSelectId && couponSelectId != 'null') {
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
                    dispatch(openAlertSnackbar('쿠폰 등록 오류가 발생하였습니다.\n문제 지속 시 기술문의 바랍니다.', 'error'));
                    console.error(giveCouponErr);
                });
        };

        const updatePlanMethod = () => {
            const currentDate = new Date();
            // 현재 유효한 플랜이 있는지 검사
            Axios.get(`${apiUrl}/payments/order-history/current-valid`, {
                params: { planId: sessions.academyPlanId },
                withCredentials: true,
            })
                .then((validPlan) => {
                    if (validPlan.data && validPlan.data.length > 0) {
                        const currentPlans = validPlan.data[0];
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
                                giveCouponsFn(true, currentPlans);
                            })
                            .catch((updatePlanErr) => {
                                dispatch(openAlertSnackbar('플랜 변경에 오류가 발생하였습니다.\n문제 지속 시 기술문의 바랍니다.', 'error'));
                                console.error(updatePlanErr);
                            });
                    } else {
                        // 유효한 플랜이 없으면 새로 주문으로 플랜을 추가함
                        const newOrderNo = currentDate.getTime() + '_' + generateUid(11);
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
                                giveCouponsFn(false, null);
                            })
                            .catch((orderErr) => {
                                dispatch(
                                    openAlertSnackbar('플랜 구독 설정에 오류가 발생하였습니다.\n문제 지속 시 기술문의 바랍니다.', 'error'),
                                );
                                console.error(orderErr);
                            });
                    }
                })
                .catch((validPlanError) => {
                    dispatch(
                        openAlertSnackbar(
                            '현재 유효한 플랜 정보를 불러오는데 오류가 발생했습니다.\n문제 지속 시 기술문의 바랍니다.',
                            'error',
                        ),
                    );
                    console.error('현재 유효한 플랜 정보를 불러오는데 오류가 발생했습니다.', validPlanError);
                });
        };

        switch (method) {
            case 'add':
            case 'updatePlan':
                // 카드 추가 또는 플랜 업데이트인 경우(결제 정보가 없을때) 빌링키 발급 후 결제정보 추가하고, 플랜 업데이트는 업데이트 메소드 돌림
                getBillingKey.then((res) => {
                    if (res.data) {
                        // 결제 정보 추가하기
                        Axios.post(
                            `${apiUrl}/payments/payment-info`,
                            {
                                ...res.data,
                                pgName: '토스페이먼츠',
                            },
                            { withCredentials: true },
                        )
                            .then((afterAdd) => {
                                if (method === 'updatePlan') {
                                    // 플랜 정보 업데이트 하는 거라면 플랜 업데이트 하기
                                    updatePlanMethod();
                                } else {
                                    // 카드 추가만 하는 경우
                                    dispatch(openAlertSnackbar('결제 카드가 성공적으로 추가되었습니다.'));
                                    history.goBack();
                                }
                            })
                            .catch((err) => {
                                console.error(err);
                            });
                    }
                });
                break;
            case 'modify':
                getBillingKey.then((res) => {
                    // 결제 정보 업데이트 하기
                    if (res.data) {
                        Axios.patch(
                            `${apiUrl}/payments/payment-info`,
                            {
                                ...res.data,
                                pgName: '토스페이먼츠',
                            },
                            { withCredentials: true },
                        )
                            .then((afterModify) => {
                                dispatch(openAlertSnackbar('결제 카드가 성공적으로 변경되었습니다.'));
                                history.goBack();
                            })
                            .catch((err) => {
                                console.error(err);
                            });
                    }
                });
                break;
            default:
                dispatch(openAlertSnackbar('잘못된 접근입니다.', 'error'));
                history.goBack();
                return;
        }
    }, [method, sessions]);
    return <div>잠시만 기다려 주세요...</div>;
}

export default PayGetBillingKey;
