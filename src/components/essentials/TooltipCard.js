import React from 'react';
import { Tooltip, withStyles } from '@material-ui/core';

const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
        padding: '0.7rem',
        fontSize: '0.75rem',
        fontWeight: '500',
        borderRadius: '6px',
    },
}))(Tooltip);

function TooltipCard({ children, title }) {
    return <HtmlTooltip title={title}>{children}</HtmlTooltip>;
}

export default TooltipCard;
