import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import '../styles/payment_page.scss';

function Payment({ history }) {
    useEffect(() => {
        //alert('현재는 베타 서비스 기간입니다!\n무료 베타 버전 이용을 원하시는 고객님께서는 우하단 상담 버튼을 클릭해주세요 :)');
        //window.location.href = `${apiUrl}/login?user=teachers`;
    }, []);

    return <div className="payment-root">결제 모듈 준비 중...</div>;
}

export default withRouter(Payment);
