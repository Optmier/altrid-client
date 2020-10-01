import React from 'react';
import '../../styles/nav_left.scss';
import { NavLink, withRouter } from 'react-router-dom';
import NavLogoWhite from '../../images/nav_logo_white.png';
import Avatar from '../../images/avatar.png';

const LeftNavItem = React.memo(function LeftNavItem({ linkTo, children }) {
    return (
        <NavLink to={linkTo} activeClassName="left-nav-active">
            <div className="left-nav-item">{children}</div>
        </NavLink>
    );
});

function LeftNav({ history }) {
    return (
        <div className="left-nav-root">
            <div className="left-nav-wrapper">
                <div className="left-nav-box logo-wrapper">
                    <img src={NavLogoWhite} alt="logo_white"></img>
                </div>
                <div className="left-nav-box info-wrapper">
                    <div className="info-header">
                        <h4>Class 02반</h4>
                        <h5>에듀이티학원 도플 700점 목표반입니다.</h5>
                        <div className="info-num">
                            <img alt="student_num" src={Avatar} />
                            <h5>학생 수 30명</h5>
                        </div>
                    </div>
                </div>
                <div className="left-nav-wrapper">
                    <LeftNavItem linkTo="/class/manage">
                        <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M14.5455 0V10.1818H16V0H14.5455ZM11.6364 10.1818H13.0909V0H11.6364V10.1818ZM9.45455 0H0.727273C0.327273 0 0 0.327273 0 0.727273V9.45454C0 9.85454 0.327273 10.1818 0.727273 10.1818H9.45455C9.85455 10.1818 10.1818 9.85454 10.1818 9.45454V0.727273C10.1818 0.327273 9.85455 0 9.45455 0ZM5.09091 2C5.99273 2 6.72727 2.73455 6.72727 3.63636C6.72727 4.53818 5.99273 5.27273 5.09091 5.27273C4.18909 5.27273 3.45455 4.53818 3.45455 3.63636C3.45455 2.73455 4.18909 2 5.09091 2ZM8.36364 8.72727H1.81818V8.18182C1.81818 7.09091 4 6.54545 5.09091 6.54545C6.18182 6.54545 8.36364 7.09091 8.36364 8.18182V8.72727Z"
                                fill="white"
                            />
                        </svg>
                        클래스 관리
                    </LeftNavItem>
                    <LeftNavItem linkTo="/class/draft">
                        <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M11.25 0H2.25C1.65326 0 1.08097 0.237053 0.65901 0.65901C0.237053 1.08097 0 1.65326 0 2.25V13.5C0 14.0967 0.237053 14.669 0.65901 15.091C1.08097 15.5129 1.65326 15.75 2.25 15.75H11.25C11.8467 15.75 12.419 15.5129 12.841 15.091C13.2629 14.669 13.5 14.0967 13.5 13.5V2.25C13.5 1.65326 13.2629 1.08097 12.841 0.65901C12.419 0.237053 11.8467 0 11.25 0ZM7.3125 5.625C7.3125 5.47582 7.25324 5.33274 7.14775 5.22725C7.04226 5.12176 6.89918 5.0625 6.75 5.0625C6.60082 5.0625 6.45774 5.12176 6.35225 5.22725C6.24676 5.33274 6.1875 5.47582 6.1875 5.625V7.3125H4.5C4.35082 7.3125 4.20774 7.37176 4.10225 7.47725C3.99676 7.58274 3.9375 7.72582 3.9375 7.875C3.9375 8.02418 3.99676 8.16726 4.10225 8.27275C4.20774 8.37824 4.35082 8.4375 4.5 8.4375H6.1875V10.125C6.1875 10.2742 6.24676 10.4173 6.35225 10.5227C6.45774 10.6282 6.60082 10.6875 6.75 10.6875C6.89918 10.6875 7.04226 10.6282 7.14775 10.5227C7.25324 10.4173 7.3125 10.2742 7.3125 10.125V8.4375H9C9.14918 8.4375 9.29226 8.37824 9.39775 8.27275C9.50324 8.16726 9.5625 8.02418 9.5625 7.875C9.5625 7.72582 9.50324 7.58274 9.39775 7.47725C9.29226 7.37176 9.14918 7.3125 9 7.3125H7.3125V5.625Z"
                                fill="white"
                            />
                        </svg>
                        과제 생성
                    </LeftNavItem>
                    <LeftNavItem linkTo="/class/share">
                        <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M11.25 10.56C10.68 10.56 10.17 10.785 9.78 11.1375L4.4325 8.025C4.47 7.8525 4.5 7.68 4.5 7.5C4.5 7.32 4.47 7.1475 4.4325 6.975L9.72 3.8925C10.125 4.2675 10.6575 4.5 11.25 4.5C12.495 4.5 13.5 3.495 13.5 2.25C13.5 1.005 12.495 0 11.25 0C10.005 0 9 1.005 9 2.25C9 2.43 9.03 2.6025 9.0675 2.775L3.78 5.8575C3.375 5.4825 2.8425 5.25 2.25 5.25C1.005 5.25 0 6.255 0 7.5C0 8.745 1.005 9.75 2.25 9.75C2.8425 9.75 3.375 9.5175 3.78 9.1425L9.12 12.2625C9.0825 12.42 9.06 12.585 9.06 12.75C9.06 13.9575 10.0425 14.94 11.25 14.94C12.4575 14.94 13.44 13.9575 13.44 12.75C13.44 11.5425 12.4575 10.56 11.25 10.56Z"
                                fill="white"
                            />
                        </svg>
                        과제 공유
                    </LeftNavItem>
                </div>
            </div>
        </div>
    );
}

export default React.memo(withRouter(LeftNav));
