/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import DashboardDDay from '../../../controllers/DashboardDDay';
import styled from 'styled-components';
import Typography from '../../../AltridUI/Typography/Typography';
import moment from 'moment-timezone';
import Tooltip from '../../../AltridUI/Tooltip/Tooltip';
import { useDispatch } from 'react-redux';
import { openAlertSnackbar } from '../../../redux_modules/alertMaker';

const DDayRoot = styled.div`
    align-items: center;
    background-color: white;
    border: 1px solid;
    border-color: #e9edef;
    border-radius: 16px;
    cursor: ${({ editMode }) => (editMode ? 'initial' : 'pointer')};
    display: flex;
    padding: 8px 16px;
    transition: background-color 0.2s;
    &:hover {
        background-color: ${({ editMode }) => (editMode ? null : '#F6F8F9')};
    }
    @media all and (max-width: 640px) {
        border-color: transparent;
        padding: 8px 2px;
        &:hover {
            background-color: white;
        }
    }
`;
const DDayWrapper = styled.div`
    align-items: inherit;
    display: inherit;
`;
const DayText = styled.div`
    color: ${({ colorOpt }) => (colorOpt > 0 ? '#3b1689' : colorOpt === 0 ? '#C14F29' : '#4D5C6A')};
    margin-right: 8px;
`;
const EventText = styled.div`
    color: #9aa5af;
`;
///////////////////////////////////////////////////////////////////////
const InputCompxBox = styled.div`
    align-items: center;
    display: flex;
`;
const InputTitle = styled.input`
    color: #11171c;
    font-size: 0.8rem;
`;
const InputDate = styled.input`
    color: #11171c;
    font-size: 0.8rem;
    margin-left: 4px;
`;
const BtnCompleted = styled.button`
    align-items: center;
    cursor: pointer;
    border: 1px solid #e9edef;
    border-radius: 8px;
    color: #4d5c6a;
    display: flex;
    justify-content: center;
    outline: none;
    margin-left: 4px;
`;

function Dday(props) {
    const classNum = props.classNum;
    const [dDayEvent, setDDayEvent] = useState('');
    const [dDayDate, setDDayDate] = useState(''); // db??? ???????????? ??????????????? DDay ??????
    const [dDayDiff, setDDayDiff] = useState('');
    const [edit, setEdit] = useState(false);
    const inputTitleRef = useRef();
    const inputDateRef = useRef();
    const saveBtnRef = useRef();
    const dashboardDDay = useRef();
    const dispatch = useDispatch();

    const setEditMode = (e) => {
        setEdit(true);
    };
    const unsetEditMode = () => {
        setEdit(false);
    };
    const toggleEditMode = () => {
        setEdit(!edit);
    };
    const actionClickRoot = (e) => {
        if (edit) {
            e.stopPropagation();
        } else {
            setEditMode();
        }
    };
    const actionSave = () => {
        const valueEvent = inputTitleRef.current.value;
        if (!valueEvent.trim()) {
            dispatch(openAlertSnackbar('?????? ????????? ??????????????????.', 'warning'));
            return;
        }
        const valueDate = inputDateRef.current.value;
        if (!valueDate.trim()) {
            dispatch(openAlertSnackbar('????????? ??????????????????', 'warning'));
            return;
        }
        const saveDB = JSON.stringify({
            title: valueEvent,
            date: valueDate,
        });
        dashboardDDay.current.save(saveDB, null, (msg, res) => {
            console.log(msg, res);
            if (msg === 'success') {
                dispatch(openAlertSnackbar('D-Day ??? ?????????????????????.', 'success'));
                setDDayEvent(valueEvent);
                setDDayDate(valueDate);
            } else {
                dispatch(openAlertSnackbar('????????? ??????????????????.\n????????? ???????????? ?????? ????????????.', 'error'));
            }
        });
        unsetEditMode();
    };

    useEffect(() => {
        dashboardDDay.current = new DashboardDDay(classNum, (msg, res) => {
            // console.log(res.value);
            if (!res || !res.value) {
                return;
            }
            const obj = JSON.parse(res.value);
            setDDayEvent(obj.title);
            setDDayDate(obj.date);
        });
    }, []);

    useEffect(() => {
        const diff = Math.ceil(moment.duration(moment(dDayDate).diff(moment())).asDays());
        setDDayDiff(diff);
    }, [dDayDate]);

    useEffect(() => {
        const docClickFn = () => {
            const inputTitle = inputTitleRef.current;
            const inputDate = inputDateRef.current;
            const saveBtn = saveBtnRef.current;
            if (![inputTitle, inputDate, saveBtn].includes(document.activeElement)) {
                unsetEditMode();
            }
        };
        const keyEventFn = (event) => {
            if (event.keyCode === 27) {
                unsetEditMode();
            } else if (event.keyCode === 13) {
                actionSave();
            }
        };
        if (!edit || !inputTitleRef.current || !inputDateRef.current || !saveBtnRef.current) {
            document.removeEventListener('click', docClickFn);
            document.removeEventListener('keydown', keyEventFn);
            return;
        }
        document.addEventListener('click', docClickFn);
        document.addEventListener('keydown', keyEventFn);
        return () => {
            document.removeEventListener('click', docClickFn);
            document.removeEventListener('keydown', keyEventFn);
        };
    }, [edit, inputTitleRef, inputDateRef, saveBtnRef]);

    return (
        <DDayRoot onClick={actionClickRoot} editMode={edit}>
            {!edit ? (
                <Tooltip title="?????????????????? ???????????????.">
                    <DDayWrapper>
                        {dDayEvent === '' ? null : (
                            <DayText colorOpt={dDayDiff}>
                                <Typography type="label" size="l" bold>
                                    {dDayDiff === 0 ? 'D-Day' : Math.abs(dDayDiff) + '???'}
                                </Typography>
                            </DayText>
                        )}
                        <EventText>
                            <Typography type="label" size="l" bold>
                                {dDayEvent === ''
                                    ? '????????? ???????????? ????????? ?????????!'
                                    : ((days, event) => {
                                          if (days > 0) return `${event}?????? ????????????`;
                                          else if (days === 0) return `${event}`;
                                          else return `${event} ?????? ??????`;
                                      })(dDayDiff, dDayEvent)}
                            </Typography>
                        </EventText>
                    </DDayWrapper>
                </Tooltip>
            ) : (
                <InputCompxBox>
                    <InputTitle type="text" placeholder="?????? ??????" defaultValue={dDayEvent} autoFocus ref={inputTitleRef} />
                    <InputDate type="date" ref={inputDateRef} defaultValue={dDayDate} />
                    <BtnCompleted onClick={actionSave} ref={saveBtnRef}>
                        ??????
                    </BtnCompleted>
                </InputCompxBox>
            )}
        </DDayRoot>
    );
}

export default Dday;
