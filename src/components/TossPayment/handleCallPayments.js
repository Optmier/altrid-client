import { loadTossPayments } from '@tosspayments/sdk';
import * as configs from '../../configs/config.json'

async function handleCallPayments() {
    const tossPayments = await loadTossPayments(configs.TOSS_PAYMENTS_CLIENT_KEY);

    tossPayments.requestBillingAuth('카드', {
        customerKey: configs.TOSS_PAYMENTS_CUSTOMER_KEY,
        successUrl: window.location.origin + '/pay-state/success',
        failUrl: window.location.origin + '/pay-state/fail',
    });
}
export default handleCallPayments;
