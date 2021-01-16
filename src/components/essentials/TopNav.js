import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import LogoColor from '../../images/logos/nav_logo_color_vertical.png';

const StyleSVG = styled.svg`
    margin-right: 25px;
    display: ${(props) => (props.leftNavState ? 'none' : 'inline')};
`;

const StyleDiv = styled.div`
    width: 100%;
    box-sizing: border-box;
    padding: 8px 30px;
    position: fixed;
    display: flex;
    align-items: center;
    top: 0;
    z-index: 9999;
    background-color: #f7f9f8;
    box-shadow: 0 0 4px rgba(200, 200, 200, 0.4);
    border-bottom: 1px solid rgba(0, 0, 0, 0.098);
    transition: all 0.4s;

    & img {
        height: 40px;
    }
    & a {
        display: flex;
        align-items: center;
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
                <g id="Menu" transform="translate(0.002)">
                    <path
                        id="Menu-2"
                        data-name="Menu"
                        d="M0,18.381V16.506H24.174v1.876Zm0-8.253V8.253H24.173v1.876ZM0,1.876V0H24.173V1.876Z"
                        transform="translate(-0.002)"
                        fill="#707070"
                    />
                </g>
            </StyleSVG>

            <Link to={`/`}>
                <img src={LogoColor} alt="logo_color"></img>
            </Link>
        </StyleDiv>
    );
}

export default TopNav;
