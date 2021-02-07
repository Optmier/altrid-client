import React from 'react';
import styled from 'styled-components';

const StyleDiv = styled.div`
    opacity: ${(props) => (props.state ? '100' : '0')};
    position: fixed;
    bottom: ${(props) => (props.state ? '50px' : '0px')};
    left: 52%;
    padding: 1rem 1.5rem;
    color: ${(props) => (props.state ? 'white' : 'transparent')};
    background-color: ${(props) => (props.state ? '#636363' : 'transparent')};
    box-shadow: ${(props) => (props.state ? '0px 2px 20px 6px rgb(0 0 0 / 26%)' : 'none')};

    border-radius: 11px;
    z-index: 9999;
    transition: all 0.3s;
`;
function PopOverClipboard({ state }) {
    return <StyleDiv state={state}>코드가 복사되었습니다.</StyleDiv>;
}

export default PopOverClipboard;
