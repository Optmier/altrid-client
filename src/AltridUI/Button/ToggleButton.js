import React from 'react';
import styled from 'styled-components';

const ToggleButtonRoot = styled.div``;

function ToggleButton({ checked, children }) {
    return <ToggleButtonRoot></ToggleButtonRoot>;
}

ToggleButton.defaultProps = {
    colors: 'purple',
    sizes: 'large',
    checked: 'false',
};

export default ToggleButton;
