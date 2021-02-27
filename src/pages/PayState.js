import React from 'react';
import PaySuccess from '../components/Payment/PaySuccess';
import PayFail from '../components/Payment/PayFail';
import Error from './Error';
import HeaderBar from '../components/essentials/HeaderBar';
import PaymentWarn from '../components/Payment/PaymentWarn';

//쿼리 스트링 뽑기
//없으면 error 페이지

function PayState({ match }) {
    const { state } = match.params;

    const switchPayState = (state) => {
        switch (state) {
            case 'success':
                return <PaySuccess />;
            case 'fail':
                return <PayFail />;

            default:
                return <Error />;
        }
    };

    return (
        <>
            <HeaderBar defaultColor="white" />

            <div className="payState-root">{switchPayState(state)}</div>

            <PaymentWarn />
        </>
    );
}

export default PayState;
