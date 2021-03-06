import React from 'react';
import styled from 'styled-components';

const IconRoot = styled.svg``;

function AddCamstudyIcon({ width, height, viewBox, fillColor }) {
    return (
        <IconRoot width={width} height={height} viewBox={viewBox}>
            <path
                d="M1 0.5H9C9.13261 0.5 9.25979 0.552678 9.35355 0.646447C9.44732 0.740215 9.5 0.867392 9.5 1V9C9.5 9.13261 9.44732 9.25979 9.35355 9.35355C9.25979 9.44732 9.13261 9.5 9 9.5H1C0.867392 9.5 0.740215 9.44732 0.646447 9.35355C0.552678 9.25979 0.5 9.13261 0.5 9V1C0.5 0.867392 0.552678 0.740215 0.646447 0.646447C0.740215 0.552678 0.867392 0.5 1 0.5ZM4.5 4.5H2.5V5.5H4.5V7.5H5.5V5.5H7.5V4.5H5.5V2.5H4.5V4.5Z"
                fill={fillColor}
            />
        </IconRoot>
    );
}

AddCamstudyIcon.defaultProps = {
    width: 10,
    height: 10,
    viewBox: '0 0 10 10',
    fillColor: '#ffffff',
};

export default AddCamstudyIcon;
