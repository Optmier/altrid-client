import { loadTossPayments } from '@tosspayments/sdk';
import { tossPaymentsClientKey } from '../../configs/configs';

async function handleCallPayments() {
    const tossPayments = await loadTossPayments(tossPaymentsClientKey);

    tossPayments.requestBillingAuth('카드', {
        customerKey: 'KeG4na-UOxik8VGJKgd-X',
        successUrl: window.location.origin + '/pay-state/success',
        failUrl: window.location.origin + '/pay-state/fail',
    });
}
export default handleCallPayments;
