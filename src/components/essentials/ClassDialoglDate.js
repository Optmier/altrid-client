import React, { useState } from 'react';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, withStyles } from '@material-ui/core';
import moment from 'moment';
import { changeDueDate } from '../../redux_modules/assignmentActived';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
}));

const DateTextField = withStyles((theme) => ({
    root: {
        fontFamily: 'inherit',
        width: 220,
        outline: 'none',
        '& .MuiInputBase-root': {
            fontSize: '0.9rem',
            outline: 'none',

            '&.Mui-focused': {
                backgroundColor: '#f2f3f6',
                boxShadow: '0 0 0 2px #8f8f8f',
            },
            '&.MuiInput-underline:before': {},

            '&.MuiInput-underline:after': {},
            '& input': {
                outline: 'none !important',
            },
        },
    },
}))(TextField);

const StyleModalShare = styled.div`
    & > h4 {
        color: #222222;
        padding-bottom: 0.5rem;
    }
    & > p {
        font-size: 0.8rem;
        color: #969393;
        padding-bottom: 1.5rem;
    }

    & .modal-share-date {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 2rem;

        & > p {
            font-size: 0.9rem;
            color: #969393;
            font-weight: 600;
            margin-right: 1rem;
        }
    }
`;

function ClassDialoglDate({ subType }) {
    const dispatch = useDispatch();

    const [dateState, setDateState] = useState(moment().add('minutes', 1).format('YYYY-MM-DDTHH:mm'));

    const classes = useStyles();

    const onChange = (e) => {
        let { value } = e.target;

        if (moment(value).format('YYMMDDHHmmss') > moment().format('YYMMDDHHmmss')) {
            setDateState(value);
            dispatch(changeDueDate(moment(value)));
        }
    };
    return (
        <StyleModalShare>
            {subType === 'init' ? (
                <>
                    <h4 className="modal-share-title">과제를 게시하시겠습니까?</h4>
                    <p className="modal-share-subTitle">과제 게시 후에도 기한수정이 가능합니다.</p>
                </>
            ) : (
                <>
                    <h4 className="modal-share-title">과제 기한을 수정하시겠습니까?</h4>
                    <p className="modal-share-subTitle">수정한 기한은 바로 적용됩니다.</p>
                </>
            )}

            <div className="modal-share-date">
                <p>기한 설정</p>
                <form className={classes.container} noValidate>
                    <DateTextField
                        onChange={onChange}
                        value={dateState}
                        id="datetime-local"
                        type="datetime-local"
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </form>
            </div>
        </StyleModalShare>
    );
}

export default ClassDialoglDate;
