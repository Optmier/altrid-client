import { Chip as MuiChip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const Chip = withStyles((theme) => ({
    root: {
        backgroundColor: '#F4F1FA',
        borderRadius: 16,
        fontFamily: [
            'inter',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ],
        padding: '8px 9px 8px 8px',
        height: 40,
    },
    avatar: {
        '&.MuiChip-avatar': {
            marginLeft: 0,
            marginRight: 0,
            margin: 0,
        },
    },
    label: {
        fontFamily: 'inherit',
        fontSize: 18,
        fontWeight: 500,
        letterSpacing: '-0.02em',
        lineHeight: '22px',
        padding: 0,
        marginLeft: 8,
    },
    deleteIcon: {
        '&.MuiChip-deleteIcon': {
            margin: 0,
            marginLeft: 9,
            height: 14,
            width: 14,
        },
    },
}))(MuiChip);

export default Chip;
