import React from 'react';
import styled from 'styled-components';

const StyleDiv = styled.div`
    transition: all 0.4s;

    @media (min-width: 903px) {
        padding: ${(props) => (props.leftNavState ? '95px 0 0 240px' : '95px 0 0 0')};
    }

    @media (min-width: 0) and (max-width: 902px) {
        padding: 95px 0 0 0;
    }
`;

function StudentState() {
    return <div></div>;
}

export default StudentState;
