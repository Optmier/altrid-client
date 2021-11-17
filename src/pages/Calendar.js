import React, { useEffect, memo, useRef, useState } from 'react';
import Fullcalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import listPlugin from '@fullcalendar/list';
import moment from 'moment';
import Axios from 'axios';
import { apiUrl } from '../configs/configs';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import { useSelector } from 'react-redux';

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
    justify-content: space-around;
    align-items: center;

    & .calendar {
        width: 70%;
        height: auto;
        margin: 40px 0;
        overflow: hidden;
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
    & .fc-day-sat {
        color: blue;
    }
    & .fc-day-sun {
        color: red;
    }
    & .fc-event-title {
        white-space: normal;
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
    // 클릭시 정보를 넘겨 주기 위한 일시적인 State
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
    // dialog 열기 닫기 함수
    const handleDiaOpen = () => {
        setdialog(true);
    };

    //  닫는 동시에 DB에 업데이트 하기
    const handleSave = () => {
        setdialog(false);
        let daysArr = [];
        Object.keys(buttonAble)
            .filter((i) => buttonAble[i] === true)
            .map((i) => daysArr.push(i));
        setdialog(false);
        if (AddEvent.title == '') {
            alert('일정 제목을 입력해주세요');
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
                color: '#3B1689',
                daysOfWeek: daysArr
                    .toString()
                    .replace('일', '0')
                    .replace('월', '1')
                    .replace('화', '2')
                    .replace('수', '3')
                    .replace('목', '4')
                    .replace('금', '5')
                    .replace('토', '6'),
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
                    alert('일정이  추가 되었습니다.');
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
                    .replace('일', '0')
                    .replace('월', '1')
                    .replace('화', '2')
                    .replace('수', '3')
                    .replace('목', '4')
                    .replace('금', '5')
                    .replace('토', '6'),
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
                    alert('일정이  추가 되었습니다.');
                    setEvents(CalEvents.concat(New_event));
                    setAdd('');
                })
                .catch((error) => console.log(error));
        }
    };
    // 취소 버튼 눌렀을때는 그냥 닫기
    const nosave = () => {
        setdialog(false);
        setAdd('');
    };

    // 정보를 전달하기 위한 state
    const [AddEvent, setAdd] = useState({
        title: '',
        daysOfWeek: null,
        editable: true,
        description: '',
        allDay: true,
        id: ' ',
    });

    const [buttonAble, setButtonAble] = useState({
        월: false,
        화: false,
        수: false,
        목: false,
        금: false,
        토: false,
        일: false,
    });

    const handleDaysButtons = (e) => {
        const { name } = e.target;

        setButtonAble({
            ...buttonAble,
            [name]: !buttonAble[name],
        });
    };

    // 모달 창 닫기 위한 함수
    const handleClose = () => setopen(false);

    // 캘린더 내에서 다른 날짜로 이동 할 때 state 업데이트
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
    // 캘린더 내에 이벤트 기간을 늘리거나 줄였을 때 state 업데이트 하기
    const handleResize = (eventResizeInfo) => {
        console.log(eventResizeInfo.event);
        const new_end = eventResizeInfo.event.endStr;
        for (var i = 0; i < CalEvents.length; i++) {
            if (eventResizeInfo.event.id == CalEvents[i].id) {
                CalEvents[i].end = new_end;
            }
        }
    };
    // 캘린더 내에서 날짜를 셀렉 해서 이벤트 추가하기
    const handleSlect = (selectionInfo) => {
        console.log(selectionInfo);
        setdialog(true);
        setAdd({
            ...AddEvent,
            start: selectionInfo.startStr,
            end: selectionInfo.endStr,
        });
        // const title = prompt('일정을 등록해주세요.');
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
    // 이벤트 수정하기 위한 함수
    const changetitle = () => {
        for (var i = 0; i < CalEvents.length; i++) {
            if (temp.color == 'green') {
                alert('학원 수업은 변경할 수 없습니다.');
                setopen(false);
                break;
            } else if (temp.id == CalEvents[i].id) {
                CalEvents[i].title = temp.title;
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
                    },
                    { withCredentials: true },
                ).then((res) => {
                    alert('수정이 완료되었습니다.');
                });
                setopen(false);
                CalEvents[i].title = temp.title;
                setEvents([...CalEvents]);
                setAdd('');
            }
        }
    };

    //이벤트 클릭 시 모달창 띄우기 및 데이터 넘기기
    const handleEventClick = (clickInfo) => {
        setopen(true);
        console.log(clickInfo.event._def.recurringDef.typeData.daysOfWeek);
        const submit = {
            title: clickInfo.event.title,
            start: clickInfo.event.startStr,
            end: clickInfo.event.ends,
            id: clickInfo.event.id,
            color: clickInfo.event.backgroundColor,
            daysOfWeek: clickInfo.event._def.recurringDef.typeData.daysOfWeek,
        };
        settemp(submit);
    };

    // 이벤트 삭제를 위한 함수
    const RemoveItem = () => {
        const copy = [...CalEvents];
        for (var i = 0; i < copy.length; i++) {
            if (temp.color === 'green') {
                alert('학원 수업 일정은 삭제 할 수 없습니다.');
                setopen(false);
                break;
            } else if (CalEvents[i].id == temp.id) {
                Axios.delete(`${apiUrl}/calendar-events/${temp.id}`, { withCredentials: true })
                    .then((res) => {
                        alert('삭제 되었습니다.');
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
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,listWeek',
    };

    useEffect(() => {
        if (sessions.userType === 'students') {
            Axios.get(`${apiUrl}/classes/class/${num}`, { withCredentials: true })
                .then((result) => {
                    setEvents([
                        {
                            id: result.data[0].idx,
                            title: '오프라인 수업',
                            daysOfWeek: result.data[0].class_day
                                .replace('일', '0')
                                .replace('월', '1')
                                .replace('화', '2')
                                .replace('수', '3')
                                .replace('목', '4')
                                .replace('금', '5')
                                .replace('토', '6'),
                            color: 'green',
                            editable: false,
                        },
                    ]);
                })
                .catch((err) => console.log(err));
            // 개인적인 이벤트
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
                                daysOfWeek: result.days_of_week
                                    .replace('일', '0')
                                    .replace('월', '1')
                                    .replace('화', '2')
                                    .replace('수', '3')
                                    .replace('목', '4')
                                    .replace('금', '5')
                                    .replace('토', '6'),
                                allDay: result.all_day,
                                color: 'purple',
                            })),
                        ),
                    );
                })
                .catch((err) => console.log(err));
            // 선생님 공유 이벤트
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
                            daysOfWeek: result.days_of_week
                                .replace('일', '0')
                                .replace('월', '1')
                                .replace('화', '2')
                                .replace('수', '3')
                                .replace('목', '4')
                                .replace('금', '5')
                                .replace('토', '6'),
                            allDay: result.all_day,
                            color: '#3AE2A1',
                        })),
                    ),
                );
            });
        } else if (sessions.userType === 'teachers') {
            Axios.get(`${apiUrl}/classes/class/${num}`, { withCredentials: true })
                .then((result) => {
                    setEvents([
                        {
                            id: result.data[0].idx,
                            title: '오프라인 수업',
                            daysOfWeek: result.data[0].class_day
                                .replace('일', '0')
                                .replace('월', '1')
                                .replace('화', '2')
                                .replace('수', '3')
                                .replace('목', '4')
                                .replace('금', '5')
                                .replace('토', '6'),
                            color: '#3AE2A1',
                            editable: false,
                        },
                    ]);
                })
                .catch((err) => console.log(err));
            // 개인적인 이벤트
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
                                daysOfWeek: result.days_of_week
                                    .replace('일', '0')
                                    .replace('월', '1')
                                    .replace('화', '2')
                                    .replace('수', '3')
                                    .replace('목', '4')
                                    .replace('금', '5')
                                    .replace('토', '6'),
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
                        initialView="dayGridMonth" // 처음 보여주는 화면 (달별로 출력)
                        selectable={true} // 달력에서 드래그로 날짜 선택
                        editable={false} // 캘린더 내에서 일정 옮기고 수정
                        locale="ko" // 한국어 설정
                        dayMaxEvents={true} // 하나의 날짜에 이벤트 갯수 제한 넘어가면 more로 표시
                        businessHours={true} // 주말 색깔 블러 처리
                        events={CalEvents} // calendar event 불러오기
                        eventDrop={handleDrop} // 이벤트 날짜를 옮겼을 때 state에 업데이트
                        eventResize={handleResize} //이벤트 기간을 늘리거나 줄였을때 state를 업데이트
                        select={handleSlect} // 캘린더 내에서 기간을 선택해서 이벤트 추가하기
                        eventClick={handleEventClick} // 이벤트 클릭 시 모달 창 띄우기
                        headerToolbar={headToolbar} // 캘린더 상단 툴바 설정
                        eventOrderStrict={false}
                    />
                </div>
                {/* 삭제 및 수정 모달 창 띄우기 */}

                <Modal open={open} onClose={handleClose} disableAutoFocus={true} disableRestoreFocus={true}>
                    <Box sx={Boxstyle}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            일정 관리
                        </Typography>
                        <Modal_Style>
                            <Typography id="modal-modal-description">
                                일정 :{' '}
                                <input
                                    type="text"
                                    value={temp.title}
                                    placeholder={temp.title}
                                    style={{ border: 'none', height: '18px', background: 'rgb(239, 239, 239)' }}
                                    onChange={(e) => {
                                        settemp({
                                            ...temp,
                                            title: e.target.value,
                                        });
                                        console.log(e.target.value);
                                    }}
                                />{' '}
                                <br />
                                일시 : {temp.start}
                                <br />
                                <button onClick={changetitle}>수정하기 </button>
                                <button onClick={RemoveItem}>삭제하기</button>
                            </Typography>
                        </Modal_Style>
                    </Box>
                </Modal>
            </Container>
            <Dialog open={dialogopen} onClose={nosave}>
                <DialogContent>
                    <input
                        type="text"
                        placeholder="제목"
                        value={AddEvent.title}
                        onChange={(e) => {
                            setAdd({ ...AddEvent, title: e.target.value });
                        }}
                    />
                    <br />
                    <input
                        type="text"
                        placeholder="설명"
                        value={AddEvent.description}
                        onChange={(e) => {
                            setAdd({ ...AddEvent, description: e.target.value });
                        }}
                    />
                    <hr />
                    <p>
                        시작 : {AddEvent.start} 종료 : {AddEvent.end}
                    </p>
                    <hr />
                    <p>반복일 선택</p>
                    <hr />
                    <FormButton name="월" able={buttonAble['월']} onClick={handleDaysButtons}>
                        월
                    </FormButton>
                    <FormButton name="화" able={buttonAble['화']} onClick={handleDaysButtons}>
                        화
                    </FormButton>
                    <FormButton name="수" able={buttonAble['수']} onClick={handleDaysButtons}>
                        수
                    </FormButton>
                    <FormButton name="목" able={buttonAble['목']} onClick={handleDaysButtons}>
                        목
                    </FormButton>
                    <FormButton name="금" able={buttonAble['금']} onClick={handleDaysButtons}>
                        금
                    </FormButton>
                    <FormButton name="토" able={buttonAble['토']} onClick={handleDaysButtons}>
                        토
                    </FormButton>
                    <FormButton name="일" able={buttonAble['일']} onClick={handleDaysButtons}>
                        일
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
                            학생들에게 일정 공유하기
                        </label>
                    ) : null}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSave} color="primary">
                        확인
                    </Button>
                    <Button onClick={nosave} color="primary" autoFocus>
                        취소
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default Calendar;
