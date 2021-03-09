import React from 'react';
import PaySuccess from '../components/Payment/PaySuccess';
import PayFail from '../components/Payment/PayFail';
import Error from './Error';
import HeaderBar from '../components/essentials/HeaderBar';
import PaymentWarn from '../components/Payment/PaymentWarn';
import queryString from 'query-string';
import PayGetBillingKey from '../components/Payment/PayGetBillingKey';

//쿼리 스트링 뽑기
//없으면 error 페이지

function PayState({ match, history }) {
    const { state } = match.params;

    const switchPayState = (state) => {
        switch (state) {
            case 'billingkey-add':
                return <PayGetBillingKey method="add" history={history} />;
            case 'billingkey-modify':
                return <PayGetBillingKey method="modify" history={history} />;
            case 'billingkey-updateplan':
                return <PayGetBillingKey method="updatePlan" history={history} />;
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
