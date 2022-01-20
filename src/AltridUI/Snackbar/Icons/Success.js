import React, { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';

const IconRoot = styled.svg`
    fill: ${({ color }) => (color ? color : null)};
    width: ${({ fontSize }) => (fontSize ? fontSize : null)};
    height: ${({ fontSize }) => (fontSize ? fontSize : null)};
`;

export default function Success({ color, fontSize }) {
    const rootRef = useRef();
    const [inheritFontSize, setInheritFontSize] = useState('16px');
    const [inheritFontColor, setInheritFontColor] = useState('#000000');
    useEffect(() => {
        const parentElement = rootRef.current.parentElement.parentElement;
        const parentStyles = window.getComputedStyle(parentElement);
        const parentFontSize = parentStyles.fontSize;
        const parentColor = parentStyles.color;
        setInheritFontSize(parentFontSize);
        setInheritFontColor(parentColor);
    }, []);
    return (
        <IconRoot
            color={color === 'inherit' ? inheritFontColor : color}
            fontSize={fontSize === 'inherit' ? inheritFontSize : fontSize}
            viewBox="0 0 22 22"
            ref={rootRef}
        >
            <path d="M11 1C16.5228 1 21 5.47715 21 11C21 16.5228 16.5228 21 11 21C5.47715 21 1 16.5228 1 11C1 5.47715 5.47715 1 11 1ZM11 2.5C6.30558 2.5 2.5 6.30558 2.5 11C2.5 15.6944 6.30558 19.5 11 19.5C15.6944 19.5 19.5 15.6944 19.5 11C19.5 6.30558 15.6944 2.5 11 2.5ZM9.75 12.4393L14.2197 7.96967C14.5126 7.67678 14.9874 7.67678 15.2803 7.96967C15.5466 8.23594 15.5708 8.6526 15.3529 8.94621L15.2803 9.03033L10.2803 14.0303C10.0141 14.2966 9.5974 14.3208 9.30379 14.1029L9.21967 14.0303L6.71967 11.5303C6.42678 11.2374 6.42678 10.7626 6.71967 10.4697C6.98594 10.2034 7.4026 10.1792 7.69621 10.3971L7.78033 10.4697L9.75 12.4393L14.2197 7.96967L9.75 12.4393Z" />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11 1.5C5.75329 1.5 1.5 5.75329 1.5 11C1.5 16.2467 5.75329 20.5 11 20.5C16.2467 20.5 20.5 16.2467 20.5 11C20.5 5.75329 16.2467 1.5 11 1.5ZM0.5 11C0.5 5.20101 5.20101 0.5 11 0.5C16.799 0.5 21.5 5.20101 21.5 11C21.5 16.799 16.799 21.5 11 21.5C5.20101 21.5 0.5 16.799 0.5 11ZM2 11C2 6.02944 6.02944 2 11 2C15.9706 2 20 6.02944 20 11C20 15.9706 15.9706 20 11 20C6.02944 20 2 15.9706 2 11ZM11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3ZM14.9268 8.32322C14.8291 8.22559 14.6709 8.22559 14.5732 8.32322L9.75 13.1464L7.43973 10.8362L7.38724 10.7909C7.2905 10.727 7.15838 10.7381 7.07322 10.8232C6.97559 10.9209 6.97559 11.0791 7.07322 11.1768L9.56028 13.6638L9.61276 13.7091C9.70949 13.773 9.84162 13.7619 9.92678 13.6768L14.9138 8.68973L14.9591 8.63724C15.023 8.5405 15.0119 8.40838 14.9268 8.32322ZM13.8661 7.61612C14.3543 7.12796 15.1457 7.12796 15.6339 7.61612C16.078 8.06021 16.1179 8.75443 15.7545 9.24415L15.7435 9.25897L15.6468 9.37093L10.6339 14.3839C10.1898 14.828 9.49557 14.8679 9.00585 14.5045L8.99103 14.4935L8.87907 14.3968L6.36612 11.8839C5.87796 11.3957 5.87796 10.6043 6.36612 10.1161C6.81021 9.67203 7.50443 9.63215 7.99415 9.99551L8.00897 10.0065L8.12093 10.1032L9.75 11.7322L13.8661 7.61612Z"
            />
        </IconRoot>
    );
}
