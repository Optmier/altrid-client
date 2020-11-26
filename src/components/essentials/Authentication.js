import Axios from 'axios';
import { apiUrl } from '../../configs/configs';

const RefreshToken = (exp, threshold) => {
    return new Promise((resolve, reject) => {
        if (exp - new Date().getTime() / 1000 < threshold) {
            Axios.patch(`${apiUrl}/auth`, {}, { withCredentials: true })
                .then((res) => {
                    console.log('token refreshed!');
                    resolve(res.data);
                })
                .catch((err) => {
                    console.err('token refresh error!', err);
                    reject(err);
                });
        }
    });
};

export default RefreshToken;
