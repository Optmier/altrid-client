import { loadTossPayments } from '@tosspayments/sdk';

//임시 발급 키
const clientKey = 'test_ck_Z0RnYX2w532N9QLWa9M3NeyqApQE';

async function handleCallPayments() {
    const tossPayments = await loadTossPayments(clientKey);

    tossPayments.requestBillingAuth('카드', {
        customerKey: 'KeG4na-UOxik8VGJKgd-X',
        successUrl: window.location.origin + '/pay-state/success',
        failUrl: window.location.origin + '/pay-state/fail',
    });
}
export default handleCallPayments;
