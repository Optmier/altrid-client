import React from 'react';
import PaySuccess from '../components/Payment/PaySuccess';
import PayFail from '../components/Payment/PayFail';
import Error from './Error';

function PayState({ match }) {
    const { state } = match.params;

    console.log(state);

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
    return <>{switchPayState(state)}</>;
}

export default PayState;
