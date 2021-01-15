import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import LogoWhite from '../../images/logos/nav_logo_white.png';

const StyleSVG = styled.svg`
    margin-right: 10px;
    display: ${(props) => (props.leftNavState ? 'none' : 'inline')};
`;

const StyleDiv = styled.div`
    width: 100%;
    height: 50px;
    box-sizing: border-box;
    padding: 0 16px;
    background-color: black;
    position: fixed;
    display: flex;
    align-items: center;
    top: 0;
    z-index: 9999;

    & img {
        height: 42px;
    }
`;

function TopNav({ leftNavState, handleLeftNav }) {
    return (
        <StyleDiv>
            <StyleSVG
                onClick={handleLeftNav}
                leftNavState={leftNavState}
                xmlns="http://www.w3.org/2000/svg"
                width="24.174"
                height="18.381"
                viewBox="0 0 24.174 18.381"
            >
                <path id="Menu" d="M0,18.381V16.506H24.174v1.876Zm0-8.253V8.253H24.173v1.876ZM0,1.876V0H24.173V1.876Z" fill="#fff" />
            </StyleSVG>

            <Link to={`/`}>
                <img src={LogoWhite} alt="logo_white"></img>
            </Link>
        </StyleDiv>
    );
}

export default TopNav;
