import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Link as AnimScrollTo } from 'react-scroll';
import LogoWhite from '../../images/logos/nav_logo_white.png';
import AccountPopOver from './AccountPopOver';
import { useSelector } from 'react-redux';

function HeaderBar() {
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
            <AccountPopOver userName={popoverName} targetEl={testRef ? testRef : null} />
            <header className={classNames('header-bar', isScrolled ? 'scrolled' : '', sessions.userType)}>
                <div className="container left">
                    <AnimScrollTo className="scroll-to-top" to="main_top_start" spy={true} smooth={true} duration={700}></AnimScrollTo>
                    <Link
                        to="/"
                        style={{ height: 40 }}
                        onClick={() => {
                            document.getElementsByClassName('scroll-to-top')[0].click();
                        }}
                    >
                        <img src={LogoWhite} alt="logo" />
                    </Link>
                </div>
                <div className="container center"></div>
                <div className="container right">
                    <div className="accounts-welcome" ref={testRef}>
                        <p>
                            반갑습니다 <span>{sessions.userName}</span> {sessions.userType === 'teachers' ? '선생님!' : '님!'}
                        </p>
                    </div>
                </div>
            </header>
        </>
    );
}

export default React.memo(HeaderBar);
