import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Tooltip, withStyles } from '@material-ui/core';

const StyleTestSquareList = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    & .square {
        min-width: 30px;
        width: -webkit-fill-available;
        height: 30px;
        border-radius: 5px;
    }

    & .square + .square {
        margin-left: 5px;
    }

    & + & {
        margin-top: 5px;
    }
`;
const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
        padding: '0.5rem 1rem',
        fontSize: '0.75rem',
        fontWeight: '500',
        borderRadius: '5px',
    },
}))(Tooltip);
function Progress({ mode, idx, selections, problemNumbers }) {
    const [squares, setSquars] = useState([]);
    useEffect(() => {
        const limiter = mode ? selections.length : problemNumbers;

        for (let i = 0; i < limiter; i++) {
            if (!selections || !selections[i] || selections[i] === -1) {
                setSquars((squares) => [
                    ...squares,
                    <HtmlTooltip key={i} title={i + 1 + limiter * idx + '번'} placement="top">
                        <div key={i} className="square" style={{ backgroundColor: '#E5E5E5' }}></div>
                    </HtmlTooltip>,
                ]);
            } else if (selections[i] === -2) {
                setSquars((squares) => [...squares, <div key={i} className="square" style={{ backgroundColor: '#f7f9f8' }}></div>]);
            } else if (selections[i].correct) {
                setSquars((squares) => [
                    ...squares,
                    <HtmlTooltip key={i} title={i + 1 + limiter * idx + '번'} placement="top">
                        <div key={i} className="square" style={{ backgroundColor: '#13E2A1' }}></div>
                    </HtmlTooltip>,
                ]);
            } else if (!selections[i].correct) {
                setSquars((squares) => [
                    ...squares,
                    <HtmlTooltip key={i} title={i + 1 + limiter * idx + '번'} placement="bottom-end">
                        <div key={i} className="square" style={{ backgroundColor: '#FFA552' }}></div>
                    </HtmlTooltip>,
                ]);
            }
        }
    }, []);

    return <StyleTestSquareList>{squares}</StyleTestSquareList>;
}

Progress.defaultProps = {
    mode: false,
};

export default Progress;
