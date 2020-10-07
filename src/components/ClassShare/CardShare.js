import React, { useState } from 'react';
import '../../styles/class_card.scss';
import CardContentBottom from '../essentials/CardContentBottom';
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { IoIosArrowForward } from 'react-icons/io';
import ModifyButton from '../essentials/ModifyButton';
import StudentNum from '../essentials/StudentNum';

const dummyDatas = {};

const IOSSwitch = withStyles((theme) => ({
    root: {
        width: 42,
        height: 26,
        padding: 0,
        margin: theme.spacing(1),
    },
    switchBase: {
        padding: 1,
        backgroundColor: '#d4d1d1',
        '& + $track': {
            backgroundColor: '#bdbaba',
            border: 'none',
        },
        '&$checked': {
            transform: 'translateX(16px)',
            color: theme.palette.common.white,
            '& + $track': {
                backgroundColor: '#13e2a1',
                opacity: 1,
                border: 'none',
            },
        },
        '&$focusVisible $thumb': {
            color: '#52d869',
            border: '5px solid #fff',
        },
    },
    thumb: {
        width: 24,
        height: 24,
    },
    track: {
        borderRadius: 26 / 2,
        border: `1px solid ${theme.palette.grey[400]}`,
        backgroundColor: theme.palette.grey[50],
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
}))(({ classes, ...props }) => {
    return (
        <Switch
            focusVisibleClassName={classes.focusVisible}
            disableRipple
            classes={{
                root: classes.root,
                switchBase: classes.switchBase,
                thumb: classes.thumb,
                track: classes.track,
                checked: classes.checked,
            }}
            {...props}
        />
    );
});

const InfoItems = ({ title, contents }) => {
    return (
        <div className="card-item">
            <div className="card-content-title-p">{title}</div>
            <div className="card-content-p">{contents}</div>
        </div>
    );
};
const DateItems = ({ title, start, end }) => {
    return (
        <div className="card-item">
            <div className="card-content-title-p">{title}</div>
            <div className="card-content-p">
                {start} - {end}
            </div>
            <span style={{ marginRight: '6px' }}></span>
            <ModifyButton />
        </div>
    );
};

function CardShare() {
    const [state, setState] = useState({
        checkedB: false,
    });
    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

    return (
        <div className="class-card-root">
            <div className="class-card-header class-card-wrapper">
                <div className="card-title-p">과제 TITLE</div>
                <span className="card-option">
                    <FormGroup>
                        <FormControlLabel
                            control={<IOSSwitch checked={state.checkedB} onChange={handleChange} name="checkedB" />}
                            label=""
                        />
                    </FormGroup>
                </span>
            </div>

            <div></div>

            <dic className="class-card-flex">
                <div className="class-card-left">
                    <div className="class-card-contents class-card-wrapper">
                        <div className="contents-block">
                            <div className="card-item card-subTitle-p">과제 한줄 설명 과제 한줄 설명 과제 한줄 설명 과제 한줄 설명</div>
                            <div className="card-item card-content-p">에듀이티 고2</div>
                        </div>

                        <div className="contents-block">
                            <InfoItems title={'문항수'} contents={'3set / 15문제'} />
                            <InfoItems title={'제한시간'} contents={'14분'} />
                            <DateItems title={'최종수정'} start={'09/10/2020'} end={'09/30/2020'} />
                        </div>
                    </div>
                    <div className="class-card-bottom-left">
                        <CardContentBottom type={'eye'} able={true} align="left" />
                    </div>
                </div>
                <div className="class-card-right">
                    <div className="class-card-contents class-card-wrapper">
                        <StudentNum completeNum={14} totalNum={30} />
                    </div>

                    <div className="class-card-bottom-right card-bottom-p">
                        <div className="share-report">
                            과제별 리포트 보기 <IoIosArrowForward />
                        </div>
                    </div>
                </div>
            </dic>
        </div>
    );
}

export default CardShare;
