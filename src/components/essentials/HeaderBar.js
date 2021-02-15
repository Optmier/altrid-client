import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { Link as AnimScrollTo } from 'react-scroll';
import LogoWhite from '../../images/logos/nav_logo_white.png';
import LogoColor from '../../images/logos/nav_logo_color_vertical.png';
import AccountPopOver from './AccountPopOver';
import { useSelector } from 'react-redux';
import Avatar from '../../images/avatar.png';
import styled from 'styled-components';

const StylePriceLink = styled.div`
    background-color: ${(props) => (props.defaultColor ? 'rgba(52, 51, 53, 0.73)' : 'rgba(196, 196, 196, 0.23)')};
    color: ${(props) => (props.defaultColor ? 'rgba(239, 239, 239, 1)' : '#e8e8e8;')};

    margin-left: 20px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 11px;
    font-size: 11px;
    font-weight: 500;
    padding: 0 14px;

    & > svg {
        margin-right: 10px;
    }
`;
const StyleHeader = styled.header`
    background-color: ${(props) => (props.defaultColor ? props.defaultColor : 'transparent')};
    color: ${(props) => (props.defaultColor ? 'black' : '#ffffff;')};
`;

function HeaderBar({ match, defaultColor }) {
    const sessions = useSelector((state) => state.RdxSessions);
    const [isScrolled, setScrolled] = useState(false);
    const [popoverName, setPopoverName] = useState('');
    const testRef = useRef();

    useEffect(() => {
        if (window.scrollY > 16) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    }, [window.scrollY]);

    window.onscroll = () => {
        if (window.scrollY > 16) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    };

    useEffect(() => {
        setPopoverName(sessions.userName);
    }, [sessions.userName]);

    return (
        <>
            <AccountPopOver userName={popoverName} image={sessions.image} targetEl={testRef ? testRef : null} />
            <StyleHeader
                defaultColor={defaultColor}
                className={classNames(
                    'header-bar',
                    isScrolled ? 'scrolled' : '',
                    sessions.userType === 'teachers'
                        ? match.path === '/'
                            ? sessions.userType
                            : match.path === '/main-draft' || match.path === '/pricing'
                            ? 'teachers-draft'
                            : 'white'
                        : sessions.userType,
                )}
            >
                <div className="container left">
                    <AnimScrollTo className="scroll-to-top" to="main_top_start" spy={true} smooth={true} duration={700}></AnimScrollTo>
                    <Link
                        to="/"
                        style={{ height: 48 }}
                        onClick={() => {
                            document.getElementsByClassName('scroll-to-top')[0].click();
                        }}
                    >
                        {defaultColor === 'white' ? <img src={LogoColor} alt="logo" /> : <img src={LogoWhite} alt="logo" />}
                    </Link>
                </div>
                {sessions.userType === 'teachers' ? (
                    <div className="container center">
                        <NavLink exact activeStyle={{ borderBottom: '2px solid white' }} to="/">
                            클래스
                        </NavLink>

                        <NavLink activeStyle={{ borderBottom: '2px solid white' }} to="/main-draft">
                            과제
                        </NavLink>
                    </div>
                ) : null}

                <div className="container right">
                    <div className="accounts-welcome" ref={testRef}>
                        <p>
                            반갑습니다 <span>{sessions.userName}</span> {sessions.userType === 'teachers' ? '선생님!' : '님!'}
                        </p>
                        <img src={sessions.image ? sessions.image : Avatar} alt="avatar" />
                    </div>
                    {sessions.userType === 'teachers' ? (
                        <Link to="/pricing">
                            <StylePriceLink defaultColor={defaultColor}>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M4.2 11.2C3.43 11.2 2.807 11.83 2.807 12.6C2.807 13.37 3.43 14 4.2 14C4.97 14 5.6 13.37 5.6 12.6C5.6 11.83 4.97 11.2 4.2 11.2ZM0 0V1.4H1.4L3.92 6.713L2.975 8.428C2.863 8.624 2.8 8.855 2.8 9.1C2.8 9.87 3.43 10.5 4.2 10.5H12.6V9.1H4.494C4.396 9.1 4.319 9.023 4.319 8.925L4.34 8.841L4.97 7.7H10.185C10.71 7.7 11.172 7.413 11.41 6.979L13.916 2.436C13.972 2.338 14 2.219 14 2.1C14 1.715 13.685 1.4 13.3 1.4H2.947L2.289 0H0ZM11.2 11.2C10.43 11.2 9.807 11.83 9.807 12.6C9.807 13.37 10.43 14 11.2 14C11.97 14 12.6 13.37 12.6 12.6C12.6 11.83 11.97 11.2 11.2 11.2Z"
                                        fill={defaultColor === 'white' ? 'rgba(239, 239, 239, 1)' : '#E8E8E8'}
                                    />
                                </svg>
                                이용권 구매
                            </StylePriceLink>
                        </Link>
                    ) : null}
                </div>
            </StyleHeader>
        </>
    );
}

export default React.memo(withRouter(HeaderBar));
