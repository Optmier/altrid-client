import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { Link as AnimScrollTo } from 'react-scroll';
import LogoWhite from '../../images/logos/nav_logo_white.png';
import AccountPopOver from './AccountPopOver';
import { useSelector } from 'react-redux';
import Avatar from '../../images/avatar.png';
import styled from 'styled-components';

const StyleHeader = styled.header`
    background-color: ${(props) => (props.defalutColor ? props.defalutColor : 'transparent')};
`;

function HeaderBar({ match, defalutColor }) {
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
                defalutColor={defalutColor}
                className={classNames(
                    'header-bar',
                    isScrolled ? 'scrolled' : '',
                    sessions.userType === 'teachers' ? (match.path === '/' ? sessions.userType : 'teachers-draft') : sessions.userType,
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
                        <img src={LogoWhite} alt="logo" />
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
                </div>
            </StyleHeader>
        </>
    );
}

export default React.memo(withRouter(HeaderBar));
