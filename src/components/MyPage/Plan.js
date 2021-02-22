import React from 'react';
import Error from '../../pages/Error';
import { withRouter } from 'react-router-dom';
import NowPlan from './NowPlan';
import PaymentInfo from './PaymentInfo';
import CouponInfo from './CouponInfo';

const PlanSwitcher = (service) => {
    switch (service) {
        case 'now-plan':
            return <NowPlan />;
        case 'payment-info':
            return <PaymentInfo />;
        case 'coupon-info':
            return <CouponInfo />;

        default:
            return <Error />;
    }
};

function Plan({ match }) {
    return <>{PlanSwitcher(match.params.service)}</>;
}

export default withRouter(Plan);
