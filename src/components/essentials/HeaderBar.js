import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { Link as AnimScrollTo } from 'react-scroll';
import LogoWhite from '../../images/logos/nav_logo_white.png';
import AccountPopOver from './AccountPopOver';
import { useSelector } from 'react-redux';
import Avatar from '../../images/avatar.png';

const useScroll = () => {
    // state를 생성합니다.
    const [state, setState] = useState({
        x: 0,
        y: 0,
    });

    // scrll의 값을 가져와 state를 갱신합니다.
    const onScroll = () => {
        setState({ y: window.scrollY, x: window.scrollX });
    };
    useEffect(() => {
        // scroll 이벤트를 만들어줍니다. 스크롤을 움직일때 마다
        // onScroll 함수가 실행됩니다.
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    return state;
};

function HeaderBar({ match }) {
    const sessions = useSelector((state) => state.RdxSessions);
    const [popoverName, setPopoverName] = useState('');
    const testRef = useRef();

    const { y } = useScroll();

    useEffect(() => {
        setPopoverName(sessions.userName);
    }, [sessions.userName]);

    return (
        <>
            <AccountPopOver userName={popoverName} image={sessions.image} targetEl={testRef ? testRef : null} />
            <header
                className={classNames(
                    'header-bar',
                    y > 16 ? 'scrolled' : '',
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
            </header>
        </>
    );
}

export default React.memo(withRouter(HeaderBar));
