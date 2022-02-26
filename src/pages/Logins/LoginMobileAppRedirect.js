/* eslint-disable react-hooks/exhaustive-deps */
import Axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { apiUrl } from '../../configs/configs';
import { openAlertSnackbar } from '../../redux_modules/alertMaker';

function LoginMobileAppRedirect({ match, history }) {
    const dispatch = useDispatch();

    useEffect(() => {
        const urlSearchParams = new URLSearchParams(history.location.search);
        const authId = urlSearchParams.get('authId');
        const email = urlSearchParams.get('email');
        // const profImgUrl = urlSearchParams.get('profImgUrl');
        const userType = urlSearchParams.get('userType');

        Axios.post(
            apiUrl + '/auth/' + userType,
            {
                email: email || '',
                authId: authId || '',
            },
            { withCredentials: true },
        )
            .then(() => {
                history.goBack();
            })
            .catch((err) => {
                console.error(err);
                switch (err.response.data.code) {
                    case 'not-in-database':
                        dispatch(openAlertSnackbar('회원 정보가 없습니다.\n등록을 해주세요.', 'error'));
                        break;
                    case 'not-approved':
                        dispatch(
                            `승인이 필요한 계정입니다.\n${userType === 'students' ? '선생님의' : '관리자의'} 승인을 기다려주세요!`,
                            'warning',
                        );
                        break;
                    default:
                        break;
                }
            });
    }, []);
    return <div>모바일 앱 로그인 처리 중...</div>;
}

export default LoginMobileAppRedirect;
