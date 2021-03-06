/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from 'react';
import Fullcalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import listPlugin from '@fullcalendar/list';
import moment from 'moment';
import Axios from 'axios';
import { apiUrl } from '../../../configs/configs';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import { useDispatch, useSelector } from 'react-redux';
import TextField from '../../../AltridUI/TextField/TextField';
import { openAlertSnackbar } from '../../../redux_modules/alertMaker';

const FormButton = styled.button`
    background-color: ${(props) => (props.able ? '#FFFFFF' : '#FFFFFF')};
    color: ${(props) => (props.able ? 'black' : 'black')};
    border: ${(props) => (props.able ? '1px solid black' : 'none')};
    border-radius: 11px;
    font-size: 1rem;
    font-weight: 500;
    width: 50px;
    height: 25px;
    & + & {
        margin-left: 8px;
    }
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 32px;
    max-width: 960px;
    height: 100%;
    @media (max-width: 640px) {
        margin-top: 30px;
    }

    & .calendar {
        width: 100%;
        height: auto;
        margin: 40px 0;
        overflow: hidden;
        @media (min-width: 0px) and (max-width: 480px) {
            width: 100%;
        }
    }
    & .Todo {
        box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
        width: 20%;
        height: 270px;
        overflow-y: scroll;
        margin: 30px 0;
        background-color: #f5f5f5;
        & h2 {
            text-align: center;
        }
        & .list {
            padding: 10px;
        }
    }
    /* & .fc-day-sat {
        color: blue;
    } */
    & .fc-day-sun {
        color: red;
    }
    & .fc-event-title {
        white-space: normal;
    }
    /*  fc-button-primary fc-button-active */
    /* & .fc-button {
        width: 161px;
        height: 32px;
    } */
    & .fc-prev-button,
    .fc-next-button {
        background: #f4f1fa;
        border-radius: 12px;
        border: none;
    }

    & .fc-listWeek-button,
    .fc-dayGridMonth-button {
        background: #f6f8f9;
        border-radius: 8px;
        border: none;
        color: #9aa5af;
    }
    & .fc-button-active {
        background: #3b1689;
        border-radius: 4px;
        color: #ffffff;
    }
    & .fc-today-button {
        border-radius: 104px;
        background: #6c46a1;
        color: #ffffff;
        border: none;
    }
    & .fc-button-primary {
        background: #f4f1fa;
        /* color: #ffffff; */
    }
    & .fc-button-primary:hover {
        background: #6c46a1;
    }
    & .fc-button-primary:disabled {
        background-color: #6c46a1;
        border: none;
    }
    & .fc .fc-button-primary:not(:disabled).fc-button-active {
        background: #3b1689;
        border-radius: 4px;
    }
    & .fc .fc-button-primary:hover {
        border: none;
        background: #3b1689;
    }
    /* & .fc-non-business {
        background: #f6f8f9;
    } */
    & .fc-theme-standard td {
        background-color: #ffffff;
    }
    & .fc table {
        background-color: #ffffff;
    }
    & .fc-icon-chevron-left {
        color: #3b1689;
    }
    & .fc-icon-chevron-right {
        color: #3b1689;
    }
    & .fc-icon-chevron-left:hover,
    .fc-icon-chevron-right:hover {
        color: white;
    }
    & .fc-event-title {
        color: black;
    }
`;

const Modal_Style = styled.div`
    & input {
        width: 100px;
    }
    & button {
        margin-right: 10px;
        height: 20px;
    }
`;

const Boxstyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function Calendar({ match }) {
    const { num } = match.params;
    const [CalEvents, setEvents] = useState([]);
    const sessions = useSelector((state) => state.RdxSessions);
    // ????????? ????????? ?????? ?????? ?????? ???????????? State
    const [temp, settemp] = useState({
        title: ' ',
        id: ' ',
        color: ' ',
        start: ' ',
        end: '',
    });
    const [open, setopen] = useState(false);
    const [day, setday] = useState(new Date());
    const [dialogopen, setdialog] = useState(false);
    // dialog ?????? ?????? ??????
    // const handleDiaOpen = () => {
    //     setdialog(true);
    // };

    const dispatch = useDispatch();

    //  ?????? ????????? DB??? ???????????? ??????
    const handleSave = () => {
        setdialog(false);
        let daysArr = [];
        Object.keys(buttonAble)
            .filter((i) => buttonAble[i] === true)
            .map((i) => daysArr.push(i));
        setdialog(false);
        if (AddEvent.title == '') {
            dispatch(openAlertSnackbar('?????? ????????? ??????????????????.', 'warning'));
        } else if (sessions.userType === 'students') {
            console.log(daysArr);
            const New_event = {
                id: Math.floor(Math.random() * 1001),
                title: AddEvent.title,
                description: AddEvent.description,
                start: AddEvent.start,
                end: AddEvent.end,
                type: 0,
                classNumber: num,
                color: '#AEFFE0',
                daysOfWeek: !AddEvent.days_of_week
                    ? null
                    : AddEvent.days_of_week
                          .replace('???', '0')
                          .replace('???', '1')
                          .replace('???', '2')
                          .replace('???', '3')
                          .replace('???', '4')
                          .replace('???', '5')
                          .replace('???', '6'),
                editable: 1,
                allDay: 1,
            };
            Axios.post(
                `${apiUrl}/calendar-events/students/my`,
                {
                    calId: Math.floor(Math.random() * 1001),
                    title: AddEvent.title,
                    description: AddEvent.description,
                    starts: AddEvent.start,
                    ends: AddEvent.end,
                    type: 0,
                    classNumber: num,
                    colorSets: '#3B1689',
                    daysOfWeek: daysArr.toString(),
                    editable: 1,
                    allDay: 1,
                },
                { withCredentials: true },
            )
                .then((result) => {
                    dispatch(openAlertSnackbar('????????? ?????????????????????.'));
                    setAdd('');
                    setEvents(CalEvents.concat(New_event));
                })
                .catch((error) => console.log(error));
        } else if (sessions.userType === 'teachers') {
            console.log(AddEvent);
            const New_event = {
                id: Math.floor(Math.random() * 1001),
                title: AddEvent.title,
                description: AddEvent.description,
                start: AddEvent.start,
                end: AddEvent.end,
                type: 0,
                classNumber: num,
                color: '#3B1689',
                daysOfWeek: daysArr
                    .toString()
                    .replace('???', '0')
                    .replace('???', '1')
                    .replace('???', '2')
                    .replace('???', '3')
                    .replace('???', '4')
                    .replace('???', '5')
                    .replace('???', '6'),
                editable: 1,
                allDay: 1,
                shared: AddEvent.shared,
            };
            Axios.post(
                `${apiUrl}/calendar-events/teachers/my`,
                {
                    calId: Math.floor(Math.random() * 1001),
                    title: AddEvent.title,
                    description: AddEvent.description,
                    starts: AddEvent.start,
                    ends: AddEvent.end,
                    type: 0,
                    classNumber: num,
                    colorSets: '#3B1689',
                    daysOfWeek: daysArr.toString(),
                    editable: 1,
                    allDay: 1,
                    shared: AddEvent.shared,
                },
                { withCredentials: true },
            )
                .then((result) => {
                    dispatch(openAlertSnackbar('????????? ?????????????????????.'));
                    setEvents(CalEvents.concat(New_event));
                    setAdd('');
                })
                .catch((error) => console.log(error));
        }
    };
    // ?????? ?????? ??????????????? ?????? ??????
    const nosave = () => {
        setdialog(false);
        setAdd('');
    };

    // ????????? ???????????? ?????? state
    const [AddEvent, setAdd] = useState({
        title: '',
        daysOfWeek: null,
        editable: true,
        description: '',
        allDay: true,
        id: ' ',
    });

    const [buttonAble, setButtonAble] = useState({
        ???: false,
        ???: false,
        ???: false,
        ???: false,
        ???: false,
        ???: false,
        ???: false,
    });

    const handleDaysButtons = (e) => {
        const { name } = e.target;

        setButtonAble({
            ...buttonAble,
            [name]: !buttonAble[name],
        });
    };

    // ?????? ??? ?????? ?????? ??????
    const handleClose = () => setopen(false);

    // ????????? ????????? ?????? ????????? ?????? ??? ??? state ????????????
    const handleDrop = (eventDropInfo) => {
        const new_start = eventDropInfo.event.startStr;
        const new_end = eventDropInfo.event.endStr;
        for (var i = 0; i < CalEvents.length; i++) {
            if (eventDropInfo.event.id == CalEvents[i].id) {
                CalEvents[i].start = new_start;
                CalEvents[i].end = new_end;
            }
        }
    };
    // ????????? ?????? ????????? ????????? ???????????? ????????? ??? state ???????????? ??????
    const handleResize = (eventResizeInfo) => {
        console.log(eventResizeInfo.event);
        const new_end = eventResizeInfo.event.endStr;
        for (var i = 0; i < CalEvents.length; i++) {
            if (eventResizeInfo.event.id == CalEvents[i].id) {
                CalEvents[i].end = new_end;
            }
        }
    };
    // ????????? ????????? ????????? ?????? ?????? ????????? ????????????
    const handleSlect = (selectionInfo) => {
        console.log(selectionInfo);
        setdialog(true);
        setAdd({
            ...AddEvent,
            start: selectionInfo.startStr,
            end: selectionInfo.endStr,
        });
        // const title = prompt('????????? ??????????????????.');
        // if (title) {
        //     const New_event = {
        //         id: Math.floor(Math.random() * 1001),
        //         title,
        //         color: 'blue',
        //         start: selectionInfo.startStr,
        //         end: selectionInfo.endStr,
        //     };
        //     setEvents(CalEvents.concat(New_event));
        // }
    };
    // ????????? ???????????? ?????? ??????
    const changetitle = () => {
        for (var i = 0; i < CalEvents.length; i++) {
            if (temp.color == '#D4E2FC') {
                dispatch(openAlertSnackbar('?????? ????????? ????????? ??? ????????????.', 'error'));
                setopen(false);
                break;
            } else if (temp.id == CalEvents[i].id) {
                CalEvents[i].title = temp.title;
                CalEvents[i].description = temp.description;
                Axios.patch(
                    `${apiUrl}/calendar-events/students/my/${temp.id}`,
                    {
                        title: temp.title,
                        starts: moment(temp.start).format('YYYY-MM-DD HH:mm:ss'),
                        ends: moment(temp.end).format('YYYY-MM-DD HH:mm:ss'),
                        types: 1,
                        allDay: 1,
                        daysOfWeek: temp.daysOfWeek,
                        editable: 0,
                        startEditable: 1,
                        durationEditable: 1,
                        resourceEditable: 0,
                        colorSets: 'green',
                        completed: 0,
                        classNumber: num,
                        description: temp.description,
                    },
                    { withCredentials: true },
                ).then((res) => {
                    dispatch(openAlertSnackbar('????????? ?????????????????????.'));
                });
                setopen(false);
                CalEvents[i].title = temp.title;
                setEvents([...CalEvents]);
                setAdd('');
            }
        }
    };

    //????????? ?????? ??? ????????? ????????? ??? ????????? ?????????
    const handleEventClick = (clickInfo) => {
        setopen(true);
        console.log(clickInfo.event);
        const submit = {
            title: clickInfo.event.title,
            start: clickInfo.event.startStr,
            end: clickInfo.event.ends,
            id: clickInfo.event.id,
            color: clickInfo.event.backgroundColor,
            // daysOfWeek: {!clickInfo.event._def.recurringDef.typeData.daysOfWeek},
            description: clickInfo.event._def.extendedProps.description,
            shared: clickInfo.event._def.extendedProps.shared,
        };
        settemp(submit);
        console.log(submit.description);
    };

    // ????????? ????????? ?????? ??????
    const RemoveItem = () => {
        const copy = [...CalEvents];
        for (var i = 0; i < copy.length; i++) {
            if (temp.color === '#D4E2FC') {
                dispatch(openAlertSnackbar('?????? ?????? ????????? ????????? ??? ????????????.', 'error'));
                setopen(false);
                break;
            } else if (CalEvents[i].id == temp.id) {
                Axios.delete(`${apiUrl}/calendar-events/${temp.id}`, { withCredentials: true })
                    .then((res) => {
                        dispatch(openAlertSnackbar('?????? ???????????????.'));
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                copy.splice(i, 1);
                setEvents(copy);
                setopen(false);
            }
        }
    };

    const headToolbar = {
        left: 'title',
        center: 'dayGridMonth,listWeek',
        right: 'prev today next',
    };

    useEffect(() => {
        if (sessions.userType === 'students') {
            Axios.get(`${apiUrl}/classes/class/${num}`, { withCredentials: true })
                .then((result) => {
                    setEvents((events) =>
                        events.concat({
                            id: result.data[0].idx,
                            title: '???????????? ??????',
                            daysOfWeek: result.data[0].class_day
                                .replace('???', '0')
                                .replace('???', '1')
                                .replace('???', '2')
                                .replace('???', '3')
                                .replace('???', '4')
                                .replace('???', '5')
                                .replace('???', '6'),
                            color: '#D4E2FC',
                            editable: false,
                        }),
                    );
                })
                .catch((err) => console.log(err));
            // ???????????? ?????????
            Axios.get(`${apiUrl}/calendar-events/my/${num}`, {
                params: { currentDate: moment(day).format('YYYY-MM-DD') },
                withCredentials: true,
            })
                .then((result) => {
                    // console.log(result.data);
                    setEvents((events) =>
                        events.concat(
                            result.data.map((result, index) => ({
                                title: result.title,
                                start: result.starts,
                                end: result.ends,
                                description: result.description,
                                id: parseInt(result.cal_id),
                                daysOfWeek: !result.days_of_week
                                    ? null
                                    : result.days_of_week
                                          .replace('???', '0')
                                          .replace('???', '1')
                                          .replace('???', '2')
                                          .replace('???', '3')
                                          .replace('???', '4')
                                          .replace('???', '5')
                                          .replace('???', '6'),
                                allDay: result.all_day,
                                color: '#AEFFE0',
                            })),
                        ),
                    );
                })
                .catch((err) => console.log(err));
            // ????????? ?????? ?????????
            Axios.get(`${apiUrl}/calendar-events/class-shared/${num}`, {
                params: { currentDate: moment(day).format('YYYY-MM-DD') },
                withCredentials: true,
            }).then((result) => {
                setEvents((resource) =>
                    resource.concat(
                        result.data.map((result, index) => ({
                            title: result.title,
                            start: result.starts,
                            end: result.ends,
                            description: result.description,
                            id: parseInt(result.cal_id),
                            daysOfWeek: !result.days_of_week
                                ? null
                                : result.days_of_week
                                      .replace('???', '0')
                                      .replace('???', '1')
                                      .replace('???', '2')
                                      .replace('???', '3')
                                      .replace('???', '4')
                                      .replace('???', '5')
                                      .replace('???', '6'),
                            allDay: result.all_day,
                            color: '#3AE2A1',
                            shared: result.shared,
                        })),
                    ),
                );
            });
        } else if (sessions.userType === 'teachers') {
            Axios.get(`${apiUrl}/classes/class/${num}`, { withCredentials: true })
                .then((result) => {
                    setEvents((events) =>
                        events.concat({
                            id: result.data[0].idx,
                            title: '???????????? ??????',
                            daysOfWeek: result.data[0].class_day
                                .replace('???', '0')
                                .replace('???', '1')
                                .replace('???', '2')
                                .replace('???', '3')
                                .replace('???', '4')
                                .replace('???', '5')
                                .replace('???', '6'),
                            color: '#D4E2FC',
                            editable: false,
                        }),
                    );
                })
                .catch((err) => console.log(err));
            // ???????????? ?????????
            Axios.get(`${apiUrl}/calendar-events/my/${num}`, {
                params: { currentDate: moment(day).format('YYYY-MM-DD') },
                withCredentials: true,
            })
                .then((result) => {
                    console.log(result.data);

                    setEvents((events) =>
                        events.concat(
                            result.data.map((result, index) => ({
                                title: result.title,
                                start: result.starts,
                                end: result.ends,
                                description: result.description,
                                id: parseInt(result.cal_id),
                                daysOfWeek: !result.days_of_week
                                    ? null
                                    : result.days_of_week
                                          .replace('???', '0')
                                          .replace('???', '1')
                                          .replace('???', '2')
                                          .replace('???', '3')
                                          .replace('???', '4')
                                          .replace('???', '5')
                                          .replace('???', '6'),
                                allDay: result.all_day,
                                color: '#957FCE',
                                shared: result.shared,
                            })),
                        ),
                    );
                })
                .catch((err) => console.log(err));
        }
    }, []);

    window.test = CalEvents;
    return (
        <>
            <Container>
                <div className="calendar">
                    <Fullcalendar
                        plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
                        // googleCalendarApiKey = 'AIzaSyByCEDWVM3WF5eLKNK05-dW_NOgKwLSYXY' // google Calendar Api keys
                        initialView="dayGridMonth" // ?????? ???????????? ?????? (????????? ??????)
                        selectable={true} // ???????????? ???????????? ?????? ??????
                        editable={false} // ????????? ????????? ?????? ????????? ??????
                        locale="ko" // ????????? ??????
                        dayMaxEvents={true} // ????????? ????????? ????????? ?????? ?????? ???????????? more??? ??????
                        businessHours={true} // ?????? ?????? ?????? ??????
                        events={CalEvents} // calendar event ????????????
                        eventDrop={handleDrop} // ????????? ????????? ????????? ??? state??? ????????????
                        eventResize={handleResize} //????????? ????????? ???????????? ???????????? state??? ????????????
                        select={handleSlect} // ????????? ????????? ????????? ???????????? ????????? ????????????
                        eventClick={handleEventClick} // ????????? ?????? ??? ?????? ??? ?????????
                        headerToolbar={headToolbar} // ????????? ?????? ?????? ??????
                        eventOrderStrict={false}
                    />
                </div>
                {/* ?????? ??? ?????? ?????? ??? ????????? */}

                <Modal open={open} onClose={handleClose} disableAutoFocus={true} disableRestoreFocus={true}>
                    <Box sx={Boxstyle}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            ?????? ??????
                        </Typography>
                        <Modal_Style>
                            <Typography id="modal-modal-description">
                                ?????? :{' '}
                                <input
                                    type="text"
                                    value={temp.title}
                                    placeholder={!temp.title ? '' : temp.title}
                                    style={{ border: 'none', height: '18px', background: 'rgb(239, 239, 239)' }}
                                    onChange={(e) => {
                                        settemp({
                                            ...temp,
                                            title: e.target.value,
                                        });
                                        // console.log(e.target.value);
                                    }}
                                />{' '}
                                <br />
                                ?????? :{' '}
                                <input
                                    type="text"
                                    value={!temp.description ? '' : temp.description}
                                    placeholder={temp.description}
                                    style={{ border: 'none', height: '18px', background: 'rgb(239, 239, 239)' }}
                                    onChange={(e) => {
                                        settemp({
                                            ...temp,
                                            description: e.target.value,
                                        });
                                        // console.log(e.target.value);
                                    }}
                                />{' '}
                                <br />
                                ?????? : {temp.start}
                                <br />
                                {temp.shared === 1 ? null : (
                                    <>
                                        <button onClick={changetitle}>???????????? </button>
                                        <button onClick={RemoveItem}>????????????</button>
                                    </>
                                )}
                            </Typography>
                        </Modal_Style>
                    </Box>
                </Modal>
            </Container>
            <Dialog open={dialogopen} onClose={nosave}>
                <DialogContent>
                    <TextField
                        autoFocus
                        variant="filled"
                        required
                        fullWidth
                        label="?????? ??????"
                        defaultValue=" "
                        // disabled={Boolean(defaultData)}
                        // inputRef={titleFieldRef}
                        InputProps={{ disableUnderline: true }}
                        // status={fieldErrorControl['title'].error ? 'error' : null}
                        // helperText={fieldErrorControl['title'].errorText}
                        name="title"
                        onChange={(e) => {
                            setAdd({ ...AddEvent, title: e.target.value });
                        }}
                    />
                    <br />
                    <br />
                    <TextField
                        autoFocus
                        variant="filled"
                        required
                        fullWidth
                        label="??????"
                        defaultValue=" "
                        // disabled={Boolean(defaultData)}
                        // inputRef={titleFieldRef}
                        InputProps={{ disableUnderline: true }}
                        // status={fieldErrorControl['title'].error ? 'error' : null}
                        // helperText={fieldErrorControl['title'].errorText}
                        name="description"
                        onChange={(e) => {
                            setAdd({ ...AddEvent, description: e.target.value });
                        }}
                    />
                    {/* <input

                        type="text"
                        placeholder="??????"
                        value={AddEvent.title}
                        onChange={(e) => {
                            setAdd({ ...AddEvent, title: e.target.value });
                        }}
                    /> */}

                    {/* <input
                        type="text"
                        placeholder="??????"
                        value={AddEvent.description}
                        onChange={(e) => {
                            setAdd({ ...AddEvent, description: e.target.value });
                        }}
                    /> */}
                    <hr />
                    <p style={{ textAlign: 'center' }}>
                        ?????? : {AddEvent.start} ?????? : {moment(AddEvent.end).subtract(1, 'day').format('YYYY-MM-DD')}
                    </p>
                    <hr />
                    <p style={{ textAlign: 'center' }}>????????? ??????</p>
                    <hr />
                    <FormButton name="???" able={buttonAble['???']} onClick={handleDaysButtons}>
                        ???
                    </FormButton>
                    <FormButton name="???" able={buttonAble['???']} onClick={handleDaysButtons}>
                        ???
                    </FormButton>
                    <FormButton name="???" able={buttonAble['???']} onClick={handleDaysButtons}>
                        ???
                    </FormButton>
                    <FormButton name="???" able={buttonAble['???']} onClick={handleDaysButtons}>
                        ???
                    </FormButton>
                    <FormButton name="???" able={buttonAble['???']} onClick={handleDaysButtons}>
                        ???
                    </FormButton>
                    <FormButton name="???" able={buttonAble['???']} onClick={handleDaysButtons}>
                        ???
                    </FormButton>
                    <FormButton name="???" able={buttonAble['???']} onClick={handleDaysButtons}>
                        ???
                    </FormButton>
                    <br />
                    <hr />
                    {sessions.userType === 'teachers' ? (
                        <label>
                            <input
                                type="checkbox"
                                name="shared"
                                onChange={(e) => {
                                    if (e.target.checked)
                                        setAdd({
                                            ...AddEvent,
                                            shared: 1,
                                        });
                                    else {
                                        setAdd({
                                            ...AddEvent,
                                            editable: 0,
                                        });
                                    }
                                }}
                                value="shared"
                            />
                            ??????????????? ?????? ????????????
                        </label>
                    ) : null}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSave} color="primary">
                        ??????
                    </Button>
                    <Button onClick={nosave} color="primary" autoFocus>
                        ??????
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default Calendar;
