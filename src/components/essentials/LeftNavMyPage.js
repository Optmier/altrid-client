import React, { useState, useEffect } from 'react';
import '../../styles/nav_left.scss';
import { NavLink, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

const StyleLeftNav = styled.div`
    transition: all 0.4s;

    @media (min-width: 903px) {
        width: 240px;
        left: ${(props) => (props.leftNavState ? '0' : '-240px')};
    }

    @media (min-width: 0) and (max-width: 902px) {
        width: 100%;
        left: ${(props) => (props.leftNavState ? '0' : '-100%')};
    }
`;

const LeftNavItem = React.memo(function LeftNavItem({ linkTo, children }) {
    return (
        <NavLink to={linkTo} activeClassName="left-a-active">
            <div className="left-nav-item">{children}</div>
        </NavLink>
    );
});

function LeftNavMyPage({ history, leftNavState, handleLeftNav, setLeftNavState }) {
    const sessions = useSelector((state) => state.RdxSessions);

    useEffect(() => {
        if (window.innerWidth <= 902) {
            setLeftNavState(false);
        }
    }, [history.location.pathname]);

    return (
        <StyleLeftNav leftNavState={leftNavState} className="left-nav-root">
            <div className="left-nav">
                <div className="left-nav-box">
                    <div className="box-wrapper">
                        <div className="left-nav-hambuger">
                            마이 페이지
                            <div id="left-nav-drawer" onClick={handleLeftNav}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14.96" height="20.049" viewBox="0 0 14.96 20.049">
                                    <g id="그룹_523" data-name="그룹 523" transform="translate(-227.939 -26.244)" opacity="0.558">
                                        <path
                                            id="패스_550"
                                            data-name="패스 550"
                                            d="M-10394.5,18180.551l-7.92,10.176,7.92,9.24"
                                            transform="translate(10637 -18154)"
                                            fill="none"
                                            stroke="#fff"
                                            strokeWidth="1"
                                        />
                                        <path
                                            id="패스_551"
                                            data-name="패스 551"
                                            d="M-10394.5,18180.551l-7.92,10.176,7.92,9.24"
                                            transform="translate(10631 -18154)"
                                            fill="none"
                                            stroke="#fff"
                                            strokeWidth="1"
                                        />
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="left-nav-box">
                    <div className="a-wrapper">
                        <LeftNavItem linkTo={`/mypage/profile`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13.11" viewBox="0 0 12 13.11">
                                <path
                                    id="mdi_file_copy"
                                    d="M10.342.75H2.763A1.233,1.233,0,0,0,1.5,1.942v8.343H2.763V1.942h7.579ZM9.711,3.134,13.5,6.709v5.959a1.233,1.233,0,0,1-1.263,1.192H5.283a1.227,1.227,0,0,1-1.257-1.192l.006-8.343A1.227,1.227,0,0,1,5.289,3.134ZM9.079,7.305h3.474L9.079,4.028Z"
                                    transform="translate(-1.5 -0.75)"
                                    fill="#fff"
                                />
                            </svg>
                            <p>프로필 설정</p>
                        </LeftNavItem>
                    </div>
                    {sessions.userType === 'teachers' ? (
                        <div className="a-wrapper">
                            <LeftNavItem linkTo={`/mypage/manage-plan/now-plan`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13.11" viewBox="0 0 12 13.11">
                                    <path
                                        id="mdi_file_copy"
                                        d="M10.342.75H2.763A1.233,1.233,0,0,0,1.5,1.942v8.343H2.763V1.942h7.579ZM9.711,3.134,13.5,6.709v5.959a1.233,1.233,0,0,1-1.263,1.192H5.283a1.227,1.227,0,0,1-1.257-1.192l.006-8.343A1.227,1.227,0,0,1,5.289,3.134ZM9.079,7.305h3.474L9.079,4.028Z"
                                        transform="translate(-1.5 -0.75)"
                                        fill="#fff"
                                    />
                                </svg>
                                <p>서비스 구독</p>
                            </LeftNavItem>
                        </div>
                    ) : null}

                    <div className="a-wrapper">
                        <LeftNavItem linkTo={`/mypage/delete-account`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13.11" viewBox="0 0 12 13.11">
                                <path
                                    id="mdi_file_copy"
                                    d="M10.342.75H2.763A1.233,1.233,0,0,0,1.5,1.942v8.343H2.763V1.942h7.579ZM9.711,3.134,13.5,6.709v5.959a1.233,1.233,0,0,1-1.263,1.192H5.283a1.227,1.227,0,0,1-1.257-1.192l.006-8.343A1.227,1.227,0,0,1,5.289,3.134ZM9.079,7.305h3.474L9.079,4.028Z"
                                    transform="translate(-1.5 -0.75)"
                                    fill="#fff"
                                />
                            </svg>
                            <p>계정 탈퇴</p>
                        </LeftNavItem>
                    </div>
                </div>
            </div>
        </StyleLeftNav>
    );
}

export default React.memo(withRouter(LeftNavMyPage));
