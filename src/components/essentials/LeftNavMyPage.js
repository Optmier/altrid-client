import React, { useState, useEffect } from 'react';
import '../../styles/nav_left.scss';
import { NavLink, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { setLeftNavStateGlobal } from '../../redux_modules/leftNavStateGlobal';

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
                            <svg width="12" height="14" viewBox="0 0 12 14" fill="white" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M10.6667 1.99935H7.88C7.6 1.22602 6.86667 0.666016 6 0.666016C5.13333 0.666016 4.4 1.22602 4.12 1.99935H1.33333C0.6 1.99935 0 2.59935 0 3.33268V12.666C0 13.3993 0.6 13.9993 1.33333 13.9993H10.6667C11.4 13.9993 12 13.3993 12 12.666V3.33268C12 2.59935 11.4 1.99935 10.6667 1.99935ZM6 1.99935C6.36667 1.99935 6.66667 2.29935 6.66667 2.66602C6.66667 3.03268 6.36667 3.33268 6 3.33268C5.63333 3.33268 5.33333 3.03268 5.33333 2.66602C5.33333 2.29935 5.63333 1.99935 6 1.99935ZM6 4.66602C7.10667 4.66602 8 5.55935 8 6.66602C8 7.77268 7.10667 8.66602 6 8.66602C4.89333 8.66602 4 7.77268 4 6.66602C4 5.55935 4.89333 4.66602 6 4.66602ZM10 12.666H2V11.7327C2 10.3993 4.66667 9.66601 6 9.66601C7.33333 9.66601 10 10.3993 10 11.7327V12.666Z"
                                    fill="white"
                                />
                            </svg>

                            <p>프로필 설정</p>
                        </LeftNavItem>
                    </div>
                    {sessions.userType === 'teachers' ? (
                        <div className="a-wrapper">
                            <LeftNavItem linkTo={`/mypage/manage-plan/now-plan`}>
                                <svg width="13" height="12" viewBox="0 0 13 12" fill="white" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M12 10V10.6667C12 11.4 11.4 12 10.6667 12H1.33333C0.593333 12 0 11.4 0 10.6667V1.33333C0 0.6 0.593333 0 1.33333 0H10.6667C11.4 0 12 0.6 12 1.33333V2H6C5.26 2 4.66667 2.6 4.66667 3.33333V8.66667C4.66667 9.4 5.26 10 6 10H12ZM6 8.66667H12.6667V3.33333H6V8.66667ZM8.66667 7C8.11333 7 7.66667 6.55333 7.66667 6C7.66667 5.44667 8.11333 5 8.66667 5C9.22 5 9.66667 5.44667 9.66667 6C9.66667 6.55333 9.22 7 8.66667 7Z"
                                        fill="white"
                                    />
                                </svg>

                                <p>플랜 관리</p>
                            </LeftNavItem>
                        </div>
                    ) : null}

                    <div className="a-wrapper">
                        <LeftNavItem linkTo={`/mypage/delete-account`}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="white" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M4.72667 8.39333L5.66667 9.33333L9 6L5.66667 2.66667L4.72667 3.60667L6.44667 5.33333H0V6.66667H6.44667L4.72667 8.39333ZM10.6667 0H1.33333C0.593333 0 0 0.6 0 1.33333V4H1.33333V1.33333H10.6667V10.6667H1.33333V8H0V10.6667C0 11.4 0.593333 12 1.33333 12H10.6667C11.4 12 12 11.4 12 10.6667V1.33333C12 0.6 11.4 0 10.6667 0Z"
                                    fill="white"
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
