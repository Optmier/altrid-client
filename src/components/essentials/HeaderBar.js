import React, { useState, useEffect, useRef } from 'react';
import { Link, withRouter } from 'react-router-dom';
import LogoColor from '../../images/logos/nav_logo_color_vertical.png';
import AccountPopOver from './AccountPopOver';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Button from '../../AltridUI/Button/Button';
import MuiAccordion from '@material-ui/core/Accordion';
import { toggleLeftNavGlobal } from '../../redux_modules/leftNavStateGlobal';
import { AccordionDetails, AccordionSummary, withStyles } from '@material-ui/core';
import ExpandMore from '@material-ui/icons/ExpandMore';

const useScroll = () => {
    const [state, setState] = useState({
        x: 0,
        y: 0,
    });
    const onScroll = () => {
        setState({ y: window.scrollY, x: window.scrollX });
    };
    useEffect(() => {
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    return state;
};
const HeaderBarDummy = styled.div`
    display: flex;
    padding: 20px 32px 20px 32px;
    padding: ${({ shrinked }) => (shrinked ? '8px 32px 8px 32px' : null)};
    pointer-events: none;
    width: calc(100% - 64px);
    min-height: ${({ shrinked }) => (shrinked ? '32px' : '40px')};
    @media (max-width: 640px) {
        width: calc(100% - 32px);
        padding: 18px 16px 16px 16px;
        padding: ${({ shrinked }) => (shrinked ? '8px 16px 8px 16px' : null)};
        min-height: ${({ shrinked }) => (shrinked ? '32px' : '40px')};
    }
`;
const HeaderBarRoot = styled.header`
    align-items: center;
    background-color: #ffffff;
    box-shadow: ${({ scrolled, shrinked }) =>
        !shrinked && scrolled ? '0px 4px 4px #ffffff' : shrinked ? '0px -1px 0px 0px #E9EDEF inset' : null};
    display: flex;
    justify-content: center;
    padding: 20px 32px 20px 32px;
    padding: ${({ shrinked }) => (shrinked ? '8px 32px 8px 32px' : null)};
    position: fixed;
    width: calc(100% - 64px);
    z-index: 1300;
    @media (max-width: 640px) {
        width: calc(100% - 32px);
        padding: 18px 16px 16px 16px;
        padding: ${({ shrinked }) => (shrinked ? '8px 16px 8px 16px' : null)};
        /* box-shadow: none; */
    }
`;
const HeaderBarContainer = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
    max-width: ${({ shrinked }) => (shrinked ? null : '1216px')};
    width: 100%;
`;

const LeftLogoContainer = styled.div`
    align-items: center;
    display: flex;
`;
const MiddleActions = styled.div`
    align-items: center;
    display: flex;
    & a + a {
        margin-left: 8px;
    }
    @media (max-width: 590px) {
        display: none;
    }
`;
const RightActions = styled.div`
    align-items: center;
    display: flex;
    @media (max-width: 590px) {
        button.btn-purchase {
            display: none;
        }
    }
`;
const Logo = styled.img`
    height: ${({ shrinked }) => (shrinked ? '32px' : '52px')};
    margin-top: -6px;
    margin-bottom: -9px;
    margin-left: -3px;
    @media (max-width: 590px) {
        height: ${({ shrinked }) => (shrinked ? '32px' : '42px')};
    }
`;
const RightProfile = styled.div`
    align-items: center;
    cursor: pointer;
    display: flex;
    margin-left: 8px;
`;
const ProfileImageContainer = styled.div`
    max-width: 40px;
    max-height: 40px;
    border-radius: 50%;
`;
const ProfileImage = styled.img`
    border-radius: ${({ shrinked }) => (shrinked ? '12px' : '16px')};
    width: ${({ shrinked }) => (shrinked ? '32px' : '40px')};
    height: ${({ shrinked }) => (shrinked ? '32px' : '40px')};
`;
const ProfileNoImage = styled.div`
    background-color: #f4f1fa;
    border-radius: ${({ shrinked }) => (shrinked ? '12px' : '16px')};
    width: ${({ shrinked }) => (shrinked ? '32px' : '40px')};
    height: ${({ shrinked }) => (shrinked ? '32px' : '40px')};
`;
const ProfileNoImageIcon = styled.svg`
    width: ${({ shrinked }) => (shrinked ? '32px' : '40px')};
    height: ${({ shrinked }) => (shrinked ? '32px' : '40px')};
`;

const LeftNavHandleBtn = styled.svg`
    margin-right: 25px;
    display: ${(props) => (props.leftNavState ? 'none' : 'inline')};
    @media (min-width: 0) and (max-width: 902px) {
        display: none;
    }
`;
const LeftNavHandleBtnMobile = styled.svg`
    margin-right: 25px;
    display: ${(props) => (props.leftNavState ? 'none' : 'inline')};
    @media (min-width: 903px) {
        display: none;
    }
`;

const Accordion = withStyles({
    root: {
        border: '1px solid rgba(0, 0, 0, .125)',
        boxShadow: 'none',
        backgroundColor: '#F6F8F9',
        '&:not(:last-child)': {
            borderBottom: '1px solid #F6F8F9',
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    expanded: {},
})(MuiAccordion);

const HeaderSection = styled.div`
    & .GoLink {
        margin-bottom: 40px;
        display: none;
        @media (min-width: 0px) and (max-width: 590px) {
            display: block;
        }
    }
`;

function HeaderBar({ history, match, defaultColor, onlyLogo, shrinked }) {
    const sessions = useSelector((state) => state.RdxSessions);
    const { leftNavGlobal } = useSelector((state) => state.RdxGlobalLeftNavState);
    const [popoverName, setPopoverName] = useState('');
    const testRef = useRef();
    const dispatch = useDispatch();

    const { y } = useScroll();

    const handleLeftNav = () => {
        dispatch(toggleLeftNavGlobal());
    };

    useEffect(() => {
        setPopoverName(sessions.userName);
    }, [sessions.userName]);

    return (
        <>
            <HeaderBarDummy className="header-bar-set" shrinked={shrinked} />
            <HeaderBarRoot className="header-bar-set" scrolled={y > 0} shrinked={shrinked}>
                <HeaderBarContainer shrinked={shrinked}>
                    <LeftLogoContainer>
                        {shrinked ? (
                            <>
                                <LeftNavHandleBtn
                                    onClick={handleLeftNav}
                                    leftNavState={leftNavGlobal}
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="20.68"
                                    viewBox="0 0 16 20.68"
                                >
                                    <g id="그룹_524" data-name="그룹 524" transform="translate(243.293 46.617) rotate(180)">
                                        <path
                                            id="패스_550"
                                            data-name="패스 550"
                                            d="M-10394.5,18180.551l-7.92,10.176,7.92,9.24"
                                            transform="translate(10637 -18154)"
                                            fill="none"
                                            stroke="#707070"
                                            strokeWidth="2"
                                        />
                                        <path
                                            id="패스_551"
                                            data-name="패스 551"
                                            d="M-10394.5,18180.551l-7.92,10.176,7.92,9.24"
                                            transform="translate(10631 -18154)"
                                            fill="none"
                                            stroke="#707070"
                                            strokeWidth="2"
                                        />
                                    </g>
                                </LeftNavHandleBtn>
                                <LeftNavHandleBtnMobile
                                    onClick={handleLeftNav}
                                    leftNavState={leftNavGlobal}
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24.174"
                                    height="18.381"
                                    viewBox="0 0 24.174 18.381"
                                >
                                    <g id="Menu" transform="translate(0.002)">
                                        <path
                                            id="Menu-2"
                                            data-name="Menu"
                                            d="M0,18.381V16.506H24.174v1.876Zm0-8.253V8.253H24.173v1.876ZM0,1.876V0H24.173V1.876Z"
                                            transform="translate(-0.002)"
                                            fill="#707070"
                                        />
                                    </g>
                                </LeftNavHandleBtnMobile>
                            </>
                        ) : null}

                        <Link to="/">
                            <Logo alt="logo" src={LogoColor} shrinked={shrinked} />
                        </Link>
                    </LeftLogoContainer>
                    {onlyLogo ? (
                        <div className="dummy"></div>
                    ) : (
                        <>
                            {!shrinked && sessions.userType === 'teachers' ? (
                                <MiddleActions>
                                    <Link to="/">
                                        <Button
                                            sizes="medium"
                                            colors="purple"
                                            variant={history.location.pathname === '/' ? 'filled' : 'light'}
                                        >
                                            클래스
                                        </Button>
                                    </Link>
                                    <Link to="/main-draft">
                                        <Button
                                            sizes="medium"
                                            colors="purple"
                                            variant={history.location.pathname === '/main-draft' ? 'filled' : 'light'}
                                        >
                                            과제
                                        </Button>
                                    </Link>
                                </MiddleActions>
                            ) : null}
                            <RightActions>
                                {!shrinked && sessions.userType === 'teachers' ? (
                                    <Link to="/pricing">
                                        <Button
                                            className="btn-purchase"
                                            sizes="medium"
                                            colors="purple"
                                            variant="filled"
                                            leftIcon={
                                                <svg
                                                    width="12"
                                                    height="10"
                                                    viewBox="0 0 12 10"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M7.5 3.09235e-06C7.85114 -3.86887e-05 8.19611 0.0923691 8.50021 0.267935C8.80431 0.443501 9.05683 0.696037 9.23237 1.00015C9.40792 1.30426 9.5003 1.64923 9.50024 2.00038C9.50017 2.35152 9.40766 2.69646 9.232 3.0005L11.5 3V4H10.5V9C10.5 9.13261 10.4473 9.25979 10.3536 9.35356C10.2598 9.44732 10.1326 9.5 10 9.5H2C1.86739 9.5 1.74021 9.44732 1.64645 9.35356C1.55268 9.25979 1.5 9.13261 1.5 9V4H0.5V3L2.768 3.0005C2.51993 2.57095 2.44034 2.06453 2.54469 1.57959C2.64904 1.09465 2.92987 0.665787 3.33267 0.376279C3.73546 0.0867716 4.23147 -0.0427221 4.72437 0.0129424C5.21728 0.0686069 5.67192 0.305457 6 0.677503C6.1873 0.464194 6.41803 0.29339 6.67673 0.176542C6.93544 0.0596942 7.21613 -0.000497124 7.5 3.09235e-06ZM6.5 4H5.5V9H6.5V4ZM4.5 1C4.24051 0.998842 3.99073 1.0986 3.80342 1.27819C3.61612 1.45779 3.50597 1.70316 3.49623 1.96247C3.48649 2.22178 3.57794 2.47473 3.75125 2.66786C3.92455 2.861 4.16615 2.9792 4.425 2.9975L4.5 3H5.5V2C5.50001 1.76103 5.41444 1.52996 5.2588 1.34863C5.10315 1.1673 4.88771 1.04771 4.6515 1.0115L4.5745 1.0025L4.5 1ZM7.5 1C7.24771 0.999923 7.00472 1.09521 6.81973 1.26675C6.63474 1.4383 6.52142 1.67343 6.5025 1.925L6.5 2V3H7.5C7.75229 3.00008 7.99528 2.9048 8.18027 2.73325C8.36526 2.56171 8.47858 2.32658 8.4975 2.075L8.5 2C8.5 1.73479 8.39464 1.48043 8.20711 1.2929C8.01957 1.10536 7.76522 1 7.5 1Z"
                                                        fill="white"
                                                    />
                                                </svg>
                                            }
                                        >
                                            이용권 구매
                                        </Button>
                                    </Link>
                                ) : null}
                                <RightProfile className="profile" ref={testRef}>
                                    {sessions.image ? (
                                        <ProfileImageContainer className="profile-img-container">
                                            <ProfileImage src={sessions.image} alt="profileimage" shrinked={shrinked} />
                                        </ProfileImageContainer>
                                    ) : (
                                        <ProfileNoImage shrinked={shrinked}>
                                            <ProfileNoImageIcon shrinked={shrinked} viewBox={shrinked ? '8 8 24 24' : '4 4 32 32'}>
                                                <path
                                                    d="M14.6665 26.6665C14.6665 25.252 15.2284 23.8955 16.2286 22.8953C17.2288 21.8951 18.5853 21.3332 19.9998 21.3332C21.4143 21.3332 22.7709 21.8951 23.7711 22.8953C24.7713 23.8955 25.3332 25.252 25.3332 26.6665H14.6665ZM19.9998 20.6665C17.7898 20.6665 15.9998 18.8765 15.9998 16.6665C15.9998 14.4565 17.7898 12.6665 19.9998 12.6665C22.2098 12.6665 23.9998 14.4565 23.9998 16.6665C23.9998 18.8765 22.2098 20.6665 19.9998 20.6665Z"
                                                    fill="#3B1689"
                                                />
                                            </ProfileNoImageIcon>
                                        </ProfileNoImage>
                                    )}

                                    <AccountPopOver
                                        userName={sessions.userName}
                                        image={sessions.image}
                                        targetEl={testRef ? testRef : null}
                                    />
                                </RightProfile>
                            </RightActions>
                        </>
                    )}
                </HeaderBarContainer>
            </HeaderBarRoot>
            {!shrinked && !onlyLogo ? (
                <HeaderSection>
                    {/* <HeaderBar /> */}
                    <div className="GoLink">
                        {sessions.userType === 'teachers' ? (
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMore />}>클래스</AccordionSummary>
                                {/* <AccordionDetails>
                                <Link to="/">클래스</Link>
                            </AccordionDetails> */}
                                <AccordionDetails>
                                    <Link to="/main-draft">과제</Link>
                                </AccordionDetails>
                                <AccordionDetails>
                                    <Link to="/pricing">이용권 구매하기</Link>
                                </AccordionDetails>
                            </Accordion>
                        ) : null}
                    </div>
                </HeaderSection>
            ) : null}
        </>
    );
}

HeaderBar.defaultProps = {
    onlyLogo: false,
    shrinked: false,
};

export default React.memo(withRouter(HeaderBar));
