import { FormControlLabel } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const SwitchLabel = withStyles({
    root: {
        '& span.MuiTypography-root.MuiFormControlLabel-label': {
            color: '#11171C',
            fontFamily:
                'inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
            fontSize: '0.875rem',
            fontWeight: 700,
            letterSpacing: 'initial',
            marginLeft: 8,
        },
    },
})(FormControlLabel);

export default SwitchLabel;
