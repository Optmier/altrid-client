import crypto from 'crypto';
import accessKeys from './accessKeys';

export default function generateHash(memberId) {
    return crypto.createHmac('sha256', Buffer.from(accessKeys.accessSecret, 'hex')).update(memberId).digest('hex');
}
