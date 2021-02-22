import React from 'react';
import Error from '../../pages/Error';
import { withRouter } from 'react-router-dom';
import NowPlan from './NowPlan';

const PlanSwitcher = (service) => {
    switch (service) {
        case 'now-plan':
            return <NowPlan />;

        default:
            return <Error />;
    }
};

function Plan({ match }) {
    return <>{PlanSwitcher(match.params.service)}</>;
}

export default withRouter(Plan);
