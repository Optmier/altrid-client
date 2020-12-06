import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import LogoWhite from '../images/logos/nav_logo_white.png';
import Footer from '../components/essentials/Footer';
import LoginButtons from '../components/Login/LoginButtons';
import '../styles/logins.scss';
import { apiUrl } from '../configs/configs';
import { withRouter } from 'react-router-dom';

function LoginAdmin({ history }) {
    const onSuccessGoogleAuth = ({ profileObj }) => {
        Axios.post(
            apiUrl + '/auth/admins',
            {
                email: profileObj.email,
                authId: profileObj.authId + '',
            },
            { withCredentials: true },
        )
            .then((res) => {
                // console.log(res);
                history.replace('/admins');
            })
            .catch((err) => {
                console.error(err.response);
                switch (err.response.data.code) {
                    case 'not-in-database':
                        alert('관리자 정보가 없습니다.\n등록을 해주세요.');
                        break;
                    case 'not-approved':
                        alert('승인이 필요한 관리자 입니다.');
                        break;
                }
            });
    };

    const onFailedGoogleAuth = (err) => {
        console.error(err);
        alert('로그인에 실패했습니다. 에러코드 :: ' + err);
    };

    const onSuccessKakaoAuth = ({ profile }) => {
        Axios.post(
            apiUrl + '/auth/admins',
            {
                email: profile.kakao_account.email,
                authId: profile.id + '',
            },
            { withCredentials: true },
        )
            .then((res) => {
                // console.log(res);
                history.replace('/admins');
            })
            .catch((err) => {
                switch (err.response.data.code) {
                    case 'not-in-database':
                        alert('관리자 정보가 없습니다.\n등록을 해주세요.');
                        break;
                    case 'not-approved':
                        alert('승인이 필요한 관리자 입니다.');
                        break;
                }
            });
    };

    const onFailedKakaoAuth = (err) => {
        console.error(err);
        alert('로그인에 실패했습니다. 에러코드 :: ' + err);
    };
    return (
        <>
            <header className={'header-bar'}>
                <div className="container left">
                    <img src={LogoWhite} alt="logo" />
                </div>
                <div className="container center"></div>
                <div className="container right"></div>
            </header>
            <main className="login-page">
                <section className="decorator-root admins"></section>
                <section className="contents-root">
                    <div className="login-form">
                        <h4>관리자 로그인</h4>
                        <LoginButtons
                            onSuccessGoogleAuth={onSuccessGoogleAuth}
                            onFailedGoogleAuth={onFailedGoogleAuth}
                            onSuccessKakaoAuth={onSuccessKakaoAuth}
                            onFailedKakaoAuth={onFailedKakaoAuth}
                            style={{ marginTop: '1.2rem' }}
                        />
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}

export default withRouter(LoginAdmin);
