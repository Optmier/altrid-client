import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, withStyles } from '@material-ui/core';
import moment from 'moment';
import { changeDueDate } from '../../redux_modules/assignmentActived';
import { useSelector, useDispatch } from 'react-redux';
import Error from '../../pages/Errors/Error';
import { openAlertSnackbar } from '../../redux_modules/alertMaker';

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
                width: 85px;
            }
            & > select {
                cursor: pointer;
                background: url('/bg_images/Vector.png') no-repeat 95% 50%;
                width: 220px; /* 원하는 너비설정 */
                padding: 0.5rem 2rem 0.5rem 0.15rem; /* 여백으로 높이 설정 */
                font-family: inherit; /* 폰트 상속 */
                font-size: 0.9rem;
                font-weight: 400;
                border: none;
                border-bottom: 1px solid rgba(0, 0, 0, 0.87);
                border-radius: 0px; /* iOS 둥근모서리 제거 */
                -webkit-appearance: none; /* 네이티브 외형 감추기 */
                -moz-appearance: none;
                appearance: none;
                outline: none;

                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
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

function ClassDialoglDate({ subType, setSelectClassState }) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const selectBoxRef = useRef();

    const { classDatas, error } = useSelector((state) => state.classes);
    const [dateState, setDateState] = useState(
        moment().add('day', 1).set('hours', 0).set('minutes', 0).set('seconds', 0).format('YYYY-MM-DDTHH:mm'),
    );

    const onChange = (e) => {
        let { value } = e.target;

        if (moment(value).format('YYMMDDHHmmss') > moment().format('YYMMDDHHmmss')) {
            setDateState(moment(value).format('YYYY-MM-DDTHH:mm'));
            dispatch(changeDueDate(moment(value)));
        }
    };
    const handleSelectChange = (e) => {
        const { value } = e.target;

        selectBoxRef.current.dataset.content = value;
        setSelectClassState(value);
    };

    if (error) {
        dispatch(openAlertSnackbar('데이터베이스 오류가 발생했습니다.\n문제 지속시 기술지원 문의 부탁드리겠습니다.', 'error', 5000));
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
                        <select ref={selectBoxRef} onChange={handleSelectChange} data-content="">
                            <option value="">클래스 선택</option>
                            {Object.keys(classDatas).map((i) => (
                                <option key={classDatas[i]['idx']} value={classDatas[i]['idx']}>
                                    {classDatas[i]['name']}
                                </option>
                            ))}
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
