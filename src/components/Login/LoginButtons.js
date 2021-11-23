import React from 'react';
import GoogleLogin from 'react-google-login';
import KakaoLogin from 'react-kakao-login';
import { googleAuthClientId, kakaoAuthJSKey } from '../../configs/configs';
import SimbolLoginWithKakao from '../../images/logos/simbol_login_with_kakao.svg';
import styled from 'styled-components';

const AuthButtonsRoot = styled.div`
    margin: 0 auto;
    width: 384px;
    & .button-auth {
        border-radius: 32px !important;

        color: #909090;
        cursor: pointer;
        font-size: 16px !important;
        width: 100%;
        height: 48px;
        outline: none;
        justify-content: center;

        &.google {
            background: #f2f5fe;
            border-radius: 32px !important;
            & div {
                margin-left: 10px;
                margin-right: -24px !important;
            }

            & span {
                margin: 0 auto;
            }
        }

        &.kakao {
            background-color: #fee500;
            color: rgba(0, 0, 0, 0.85);
            padding-left: 20px;

            &:active {
                background-color: #e4cd00;
            }
        }
    }

    & .auth-kakao-root {
        margin-top: 8px;

        & .simbol {
            pointer-events: none;
            position: absolute;
            height: 28px;
            margin-left: 11px;
            padding: 10px;
        }

        &:hover {
            opacity: 0.9;
        }
    }
`;

function LoginButtons({ onSuccessGoogleAuth, onFailedGoogleAuth, onSuccessKakaoAuth, onFailedKakaoAuth, ...rest }) {
    return (
        <>
            <AuthButtonsRoot {...rest} className="auth-buttons">
                <GoogleLogin
                    className="button-auth google"
                    clientId={googleAuthClientId}
                    buttonText={'구글로 시작하기'}
                    onSuccess={onSuccessGoogleAuth}
                    onFailure={onFailedGoogleAuth}
                    cookiePolicy={'single_host_origin'}
                />
                <div className="auth-kakao-root">
                    <img alt="img.." className="simbol" src={SimbolLoginWithKakao} width="18" height="18" />
                    <KakaoLogin
                        className="button-auth kakao"
                        jsKey={kakaoAuthJSKey}
                        buttonText={'카카오로 시작하기'}
                        getProfile
                        onSuccess={onSuccessKakaoAuth}
                        onFailure={onFailedKakaoAuth}
                    />
                </div>
            </AuthButtonsRoot>
        </>
    );
}

export default React.memo(LoginButtons);
