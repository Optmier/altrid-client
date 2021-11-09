import React from 'react';
import CheckIconSample from '@material-ui/icons/CheckCircleOutline';
import styled from 'styled-components';

const TextFieldHelperTextRoot = styled.div`
    align-items: center;
    display: flex;
    & svg.MuiSvgIcon-root {
        margin-right: 2px;
    }
`;

function TextFieldHelperText({ adornmentIcon, children }) {
    return (
        <TextFieldHelperTextRoot>
            {adornmentIcon}
            {children}
        </TextFieldHelperTextRoot>
    );
}

TextFieldHelperText.defaultProps = {
    adornmentIcon: <CheckIconSample />,
};

export default TextFieldHelperText;
