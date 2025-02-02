import Axios from 'axios';
import * as configs from '../../configs/config.json';

const RefreshToken = (exp, threshold, force = false) => {
    return new Promise((resolve, reject) => {
        if (exp - new Date().getTime() / 1000 < threshold || force) {
            Axios.patch(`${configs.SERVER_HOST}/auth`, {}, { withCredentials: true })
                .then((res) => {
                    console.log('token refreshed!');
                    resolve(res.data);
                })
                .catch((err) => {
                    console.error('token refresh error!', err);
                    reject(err);
                });
        }
    });
};

export default RefreshToken;
