import React from 'react';
import styled from 'styled-components';

const IconRoot = styled.svg``;

function CardKeyIcon({ width, height, viewBox, fillColor }) {
    return (
        <IconRoot width={width} height={height} viewBox={viewBox}>
            <path
                d="M6.21435 0C2.75221 0 0 2.75221 0 6.1949C0 8.7915 1.55602 11.0866 3.9873 12.0105V21.6092C3.9873 21.8523 4.0651 22.0371 4.24015 22.2219L5.86424 23.8557C6.02957 24.021 6.36022 24.0697 6.56445 23.8654L9.64731 20.7826C9.85154 20.5686 9.84181 20.2866 9.64731 20.0824L7.73146 18.1957L10.3572 15.5796C10.542 15.3851 10.542 15.1031 10.3378 14.8891L7.74119 12.2731C10.7462 11.0769 12.419 8.85958 12.419 6.1949C12.419 2.77166 9.64731 0 6.21435 0ZM6.21435 5.94204C5.26129 5.94204 4.48328 5.17376 4.48328 4.21097C4.48328 3.24819 5.24184 2.4799 6.21435 2.4799C7.16741 2.4799 7.94542 3.25791 7.94542 4.21097C7.94542 5.17376 7.16741 5.94204 6.21435 5.94204Z"
                fill={fillColor}
            />
        </IconRoot>
    );
}

CardKeyIcon.defaultProps = {
    width: 13,
    height: 24,
    viewBox: '0 0 13 24',
    fillColor: '#997328',
};

export default CardKeyIcon;
