import crypto from 'crypto';
import * as configs from '../../configs/config.json';

export default function generateHash(memberId) {
    return crypto.createHmac('sha256', Buffer.from(configs.CHANNEL_TALK_ACCESS_SECRET, 'hex')).update(memberId).digest('hex');
}
