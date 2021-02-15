import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import '../styles/payment_page.scss';
import ClassWrapper from '../components/essentials/ClassWrapper';
import HeaderBar from '../components/essentials/HeaderBar';

function Payment() {
    useEffect(() => {
        //alert('현재는 베타 서비스 기간입니다!\n무료 베타 버전 이용을 원하시는 고객님께서는 우하단 상담 버튼을 클릭해주세요 :)');
        //window.location.href = `${apiUrl}/login?user=teachers`;
    }, []);

    const handlePayment = () => {};

    return (
        <>
            <HeaderBar defaultColor="white" />
            <div className="payment-root">
                <ClassWrapper col={true} type="main_page">
                    <section className="payment-confirm">
                        <div className="payment-header">결제 상품 확인</div>
                        <div className="payment-confirm-box">
                            <div className="left">
                                <div className="left-title">Free</div>
                                <div className="left-contents">
                                    알트리드 서비스에 기본 적용된 000 기능과 000 기능을 사용 할 수 있습니다.
                                </div>
                            </div>
                            <div className="right">
                                <div className="right-top">
                                    9999<span id="small-text">원</span>
                                </div>
                                <div className="right-bottom" id="color-Free">
                                    <span id="small-text" className="gray">
                                        (학생당/월)
                                    </span>
                                    9999<span id="small-text">원</span>
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
                        <button onClick={handlePayment}>9999원 결제하기</button>
                    </section>
                </ClassWrapper>
            </div>
        </>
    );
}

export default withRouter(Payment);
