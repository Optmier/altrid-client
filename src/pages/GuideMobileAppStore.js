import React, { useEffect } from 'react';
import styled from 'styled-components';
import HeaderLogo from '../images/logos/nav_logo_white.png';
import GooglePlayBadge from '../images/logos/google-play-badge.png';
import AppleStoreBadge from '../images/logos/apple-store-badge.svg';
import channelIOAccessKey from '../components/ChannelIO/accessKeys';
import ChannelService from '../components/ChannelIO/ChannelService';
import generateHash from '../components/ChannelIO/generateHash';
import { Helmet } from 'react-helmet';

const AppStoreGuideRoot = styled.div`
    background-color: #43138b;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    min-width: 380px;
`;

const Header = styled.header`
    display: flex;
    justify-content: center;
    padding: 24px;

    & img {
        height: 40px;
    }
`;

const Main = styled.main`
    align-self: center;
    margin-bottom: 16px;

    & h3 {
        font-size: 1.3125rem;
        line-height: 2rem;
    }

    & p {
        color: #d5d5d5;
        font-size: 1rem;
        margin-top: 1rem;
    }
`;

const BannerContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 32px;

    & div.banner-button {
        cursor: pointer;
        user-select: none;

        & img {
            height: 48px;
        }
    }

    & div + div {
        margin-left: 16px;
    }
`;

const Footer = styled.footer`
    background-color: initial;
    color: #d5d5d5;
    padding: 40px;
    width: initial;
    height: initial;
    min-height: initial;

    & p {
        font-size: 1rem;
        user-select: none;
        cursor: pointer;

        &:hover {
            text-decoration: underline;
        }

        &:active {
            text-decoration: underline;
        }
    }
`;

function GuideMobileAppStore() {
    useEffect(() => {
        if (channelIOAccessKey.pluginKey) {
            ChannelService.boot({
                pluginKey: channelIOAccessKey.pluginKey,
                memberId: null,
                hideChannelButtonOnBoot: true,
                profile: {
                    name: null,
                    email: null,
                    mobileNumber: null,
                    userType: null,
                    academyCode: null,
                    loginedAt: null,
                    referrer: window.location.href,
                },
                memberHash: generateHash(''),
            });
        }
    }, []);

    return (
        <>
            <Helmet>
                <style type="text/css">{`
                    html, body, #root {
                        height: 100% !important;
                        background-color: ##3B168A;
                    }
                `}</style>
            </Helmet>
            <AppStoreGuideRoot>
                <Header>{/* <img src={HeaderLogo} alt="logo" /> */}</Header>
                <Main>
                    <h3>
                        알트리드 서비스를
                        <br />
                        모바일에서 이용하시려면
                        <br />
                        앱을 설치하셔야 합니다.
                    </h3>
                    <p>하단 배너를 통해 다운로드 및 설치해 주세요.</p>
                    <BannerContainer>
                        <div className="banner-button">
                            <img src={GooglePlayBadge} alt="GET IT ON Google Play" />
                        </div>
                        {/* <div className="banner-button">
                        <img src={AppleStoreBadge} alt="Download on the App Store" />
                    </div> */}
                    </BannerContainer>
                </Main>
                <Footer>
                    <p
                        onClick={() => {
                            ChannelService.showMessenger();
                        }}
                    >
                        상담 및 문의하기
                    </p>
                </Footer>
            </AppStoreGuideRoot>
        </>
    );
}

export default React.memo(GuideMobileAppStore);
