import React from 'react';
import styled from 'styled-components';

const StyleWrapper = styled.div`
    width: 100%;
    height: 100%;
`;

function RestrictWrapper({ children, restricted }) {
    return <StyleWrapper>{restricted ? <div>현재 플랜 제한 기능입니다.</div> : children}</StyleWrapper>;
}

export default RestrictWrapper;
