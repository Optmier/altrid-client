import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, withStyles } from '@material-ui/core';
import moment from 'moment';
import { changeDueDate } from '../../redux_modules/assignmentActived';
import { useSelector, useDispatch } from 'react-redux';
import Error from '../../pages/Error';

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

    & .modal-init-date {
        display: flex;
        flex-direction: column;
        padding-bottom: 2rem;

        & > div {
            display: flex;
            align-items: center;
            justify-content: space-between;

            & > p {
                font-size: 0.9rem;
                color: #969393;
                font-weight: 600;
                margin-right: 1rem;
            }
        }
        & > div + div {
            margin-top: 1rem;
        }
    }
    & .modal-modify-date {
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
    const classes = useStyles();
    const dispatch = useDispatch();
    const { classDatas, error } = useSelector((state) => state.classes);

    console.log(classDatas, error);

    window.classDatas = classDatas;

    const [dateState, setDateState] = useState(moment().add('minutes', 1).format('YYYY-MM-DDTHH:mm'));

    const onChange = (e) => {
        let { value } = e.target;

        if (moment(value).format('YYMMDDHHmmss') > moment().format('YYMMDDHHmmss')) {
            setDateState(moment(value).format('YYYY-MM-DDTHH:mm'));
            dispatch(changeDueDate(moment(value)));
        }
    };

    if (error) {
        alert('class 데이터 베이스 오류입니다.\n1대1 문의를 남겨주시면 빠른 시일내에 조치해드리겠습니다.');
        console.error(error);

        return <Error />;
    }
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

            {subType === 'init' ? (
                <div className="modal-init-date">
                    <div>
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
                    <div>
                        <p>클래스 선택</p>
                        <select>
                            <option value="">클래스 선택</option>
                            <option value={0}>{'class01'}</option>
                            <option value={1}>{'class02'}</option>
                        </select>
                    </div>
                </div>
            ) : (
                <div className="modal-modify-date">
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
            )}
        </StyleModalShare>
    );
}

export default ClassDialoglDate;
