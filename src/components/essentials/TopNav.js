import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { withRouter, Link } from 'react-router-dom';
import LogoColor from '../../images/logos/nav_logo_color_vertical.png';
import BranchNav from './BranchNav';
import AccountPopOver from './AccountPopOver';
import { useSelector } from 'react-redux';

const StyleSVG = styled.svg`
    margin-right: 25px;
    display: ${(props) => (props.leftNavState ? 'none' : 'inline')};
    @media (min-width: 0) and (max-width: 902px) {
        display: none;
    }
`;
const StyleSVGMobile = styled.svg`
    margin-right: 25px;
    display: ${(props) => (props.leftNavState ? 'none' : 'inline')};
    @media (min-width: 903px) {
        display: none;
    }
`;

const StyleDiv = styled.div`
    box-sizing: border-box;
    padding: 8px 30px;
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: space-between;
    top: 0;
    z-index: 1298;
    background-color: #f7f9f8;
    box-shadow: 0 0 4px rgba(200, 200, 200, 0.4);
    border-bottom: 1px solid rgba(0, 0, 0, 0.098);
    transition: all 0.4s;
    width: ${(props) => (props.leftNavState ? 'calc(100% - 240px)' : '100%')};

    @media all and (max-width: 902px) {
        width: 100%;
    }

    & img,
    svg {
        height: 40px;
    }
    & .top-nav-left {
        display: flex;
        align-items: center;
        & a {
            display: flex;
            align-items: center;
        }
    }
    & .top-nav-right {
        display: flex;
        align-items: center;
        & img {
            height: 40px;
            width: 40px;
            border-radius: 50%;
        }
    }
`;

function TopNav({ leftNavState, handleLeftNav, match, deps }) {
    const testRef = useRef();
    const sessions = useSelector((state) => state.RdxSessions);
    const [popoverName, setPopoverName] = useState('');

    useEffect(() => {
        setPopoverName(sessions.userName);
    }, [sessions.userName]);

    return (
        <>
            <AccountPopOver userName={popoverName} image={sessions.image} targetEl={testRef ? testRef : null} />

            <StyleDiv leftNavState={leftNavState}>
                <div className="top-nav-left">
                    <StyleSVG
                        onClick={handleLeftNav}
                        leftNavState={leftNavState}
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
                    </StyleSVG>
                    <StyleSVGMobile
                        onClick={handleLeftNav}
                        leftNavState={leftNavState}
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
                    </StyleSVGMobile>

                    <Link to={`/`}>
                        <img src={LogoColor} alt="logo_color"></img>
                    </Link>
                    {/* {match.params.id === 'share' ? <BranchNav deps={3} /> : null} */}
                </div>
                <div className="top-nav-right" ref={testRef}>
                    {sessions.image ? (
                        <img src={sessions.image} alt="avatar..." />
                    ) : (
                        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M16.9999 0.333984C7.79992 0.333984 0.333252 7.80065 0.333252 17.0007C0.333252 26.2007 7.79992 33.6673 16.9999 33.6673C26.1999 33.6673 33.6666 26.2007 33.6666 17.0007C33.6666 7.80065 26.1999 0.333984 16.9999 0.333984ZM16.9999 5.33398C19.7666 5.33398 21.9999 7.56732 21.9999 10.334C21.9999 13.1007 19.7666 15.334 16.9999 15.334C14.2333 15.334 11.9999 13.1007 11.9999 10.334C11.9999 7.56732 14.2333 5.33398 16.9999 5.33398ZM16.9999 29.0007C12.8333 29.0007 9.14992 26.8673 6.99992 23.634C7.04992 20.3173 13.6666 18.5007 16.9999 18.5007C20.3166 18.5007 26.9499 20.3173 26.9999 23.634C24.8499 26.8673 21.1666 29.0007 16.9999 29.0007Z"
                                fill="#707070"
                            />
                        </svg>
                    )}
                </div>
            </StyleDiv>
        </>
    );
}

export default withRouter(TopNav);
