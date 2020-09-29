import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Link as AnimScrollTo } from 'react-scroll';
import LogoWhite from '../../images/logos/nav_logo_white.png';

function HeaderBar() {
    const [userName, setUserName] = useState('최세인');
    const [isScrolled, setScrolled] = useState(false);
    const scrollTopRef = useRef();

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

    return (
        <header className={classNames('header-bar', isScrolled ? 'scrolled' : '')}>
            <div className="container left">
                <AnimScrollTo className="scroll-to-top" to="main_top_start" spy={true} smooth={true} duration={700}></AnimScrollTo>
                <Link
                    to="/"
                    onClick={() => {
                        document.getElementsByClassName('scroll-to-top')[0].click();
                    }}
                >
                    <img src={LogoWhite} alt="logo" />
                </Link>
            </div>
            <div className="container center"></div>
            <div className="container right">
                <div className="accounts-welcome">
                    <p>
                        반갑습니다 <span>{userName}</span>선생님!
                    </p>
                </div>
            </div>
        </header>
    );
}

export default React.memo(HeaderBar);
