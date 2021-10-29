import React,{useEffect,memo, useRef, useState} from 'react';
import Fullcalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin,{Draggable} from '@fullcalendar/interaction';
import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import listPlugin from '@fullcalendar/list'
import  Button from '@material-ui/core/Button';

// import rrulePlugin from '@fullcalendar/rrule';

    const Container  =  styled.div`
        
    display:flex;
    justify-Content: space-around;
    alignItems:center;

        & .calendar{
            width:70%;
            height:auto;
            margin: 40px 0;
            overflow:hidden;
        }
        & .Todo{
            box-shadow:2px 2px 2px 1px rgba(0, 0, 0, 0.2);
            width:20%;
            height:270px;
            overflow-y:scroll;
            margin: 30px 0;
            background-color:#F5F5F5;
                & h2{
                    text-align:center;
                }
                & .list{
                    padding:10px;
                }
        }
        & .fc-day-sat {
            color:blue;
        }
        & .fc-day-sun {
            color:red;
        }
        & .fc-event-title{
            white-space:normal;
        }
    `
        // Css ClassName
        // Month change button = > .fc-button
        // Today button =>  .fc-button-primary  || active => .fc-button-primary:disabled
        // Day table = > .fc-daygrid-day-frame
        // Today table => .fc-day-today 
        // Day Select => .fc-highlight
       

    const Modal_Style = styled.div`
        & input{
            width:100px;
        }
        & button{
            margin-right:10px;
            height:20px;
        }

    `


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



// 이벤트 Todolist 에서 drag n drop 기능
    const ToDoList = memo(({event})=>{
        const elRef = useRef(null);
        
        useEffect(() => {
            const draggable = new Draggable(elRef.current, {
            eventData: function () {
                return { ...event, create: true };

            }
            },[]);
        
            return () => draggable.destroy(event);
        });
        return (
            <div
              ref={elRef}
              className="fc-event fc-h-event mb-1 fc-daygrid-event fc-daygrid-block-event p-2"
              title={event.title}
              style={{
                marginTop:"10px",
                cursor: "pointer",
                background:"#8b00ff",
                border:" none",
                padding:"5px",
              }}
            >
              <div className="fc-event-main">
                <div>
                  <strong>{event.title}</strong>
                </div>
              </div>
            </div>
          );
    
    });


function Calendar(){

    // 캘린더 안에 들어있는 이벤트들 
    const [CalEvents, setEvents]  = useState([ 
        // {
        //     id : 2341, 
        //     title: '학원 수업',
        //     color: 'red',
        //     start: '2021-10-19T11:00',
        //     end: '2021-10-19T13:00',
        //     editable:false // 이벤트 수정 제한
     
        // },
        // {
        //     id : 57124,
        //     title: '학원 수업',
        //     color: 'red',
        //     // start: '2021-10-21T11:00',
        //     // end: '2021-10-21T13:00',
        //     constraint:'학원 수업' ,
        //     editable:false, //이벤트 수정 제한
        // },       
        
        {
        id: 11111,
        title:'학원 수업',
        daysOfWeek: [ '1','3','5'], //[일,월,화,수,목,금,토,일] 배열 인덱스 값으로 반복 요일 설정
        color: 'green',
        editable:false,          
        } 
    ]);



    window.calevent = CalEvents;

    // Todolist 안에 들어있는 이벤트들
    const [Todo , setTodo]  = useState([
        {
            id: 14351,
            title:"과제 1 단어",
            color:"#8b00ff",
            start:' ',
            end: ' ',    
        },
        {   id: 14203,
            title:"수능 특강 풀기",
            color:"#8b00ff",
            start:' ',
            end: ' ',     
        },
        {
            id: 15151,
            title:"개념 복습하기",
            color:"#8b00ff",
            start:' ',
            end: ' ',           
        },
        {
            id: 16131,
            title:"모의고사1 다시 풀기",
            color:"#8b00ff",
            start:' ',
            end: ' ',           
        },
        {
            id: 15678,
            title:"오답노트 쓰기",
            color:"#8b00ff",
            start:' ',
            end: ' ',   
        },
       
    ]);

    // 클릭시 정보를 넘겨 주기 위한 일시적인 State
    const [temp,settemp] = useState({
        title: ' ', 
        id:' ' ,
        color:' ',
        start: ' ', 
        end: ''
    });

    const [open,setopen] = useState(false);

    // 모달 창 닫기 위한 함수
    const handleClose = () => setopen(false);

    // TodoLIst에서 캘린더로 드롭 후 todolist 와 CalEvents State 업데이트 
    const handleRecive = (info) => {
        const new_start = info.event.startStr;
        const new_end = info.event.endStr;
        const NewEvent ={
            id:info.event.id,
            title:info.event.title,
            color:"#8b00ff",
            start: new_start,
            end:new_end,
            dow:[2,3]
            
        }
        // calEvents state 업데이트
        const DropList = CalEvents.concat(NewEvent);
        setEvents(DropList);
        // Todolist State 업데이트 
        for(var i = 0; i<Todo.length; i++){
            const C_todo = [...Todo]
            if(info.event.id == C_todo[i].id){
                C_todo.splice(i,1);
                setTodo(C_todo);
            }
        }
        info.revert();
    }  


        // 캘린더 내에서 다른 날짜로 이동 할 때 state 업데이트 
        const handleDrop = (eventDropInfo) => {
            const new_start = eventDropInfo.event.startStr;
            const new_end = eventDropInfo.event.endStr;
            for(var i = 0; i<CalEvents.length; i++ ){
                if(eventDropInfo.event.id == CalEvents[i].id){
                    CalEvents[i].start = new_start
                    CalEvents[i].end = new_end
                }   
            }
        }

        // 캘린더 내에 이벤트 기간을 늘리거나 줄였을 때 state 업데이트 하기
        const handleResize = (eventResizeInfo) => {
            console.log(eventResizeInfo.event)
            const new_end = eventResizeInfo.event.endStr
            for(var i = 0; i<CalEvents.length; i++){
                if(eventResizeInfo.event.id == CalEvents[i].id){
                    CalEvents[i].end  = new_end
                }
            }
        }

        // 캘린더 내에서 날짜를 셀렉 해서 이벤트 추가하기
        const handleSlect = (selectionInfo) => {
            console.log(selectionInfo)
            const title = prompt('일정을 등록해주세요.')
            if(title){
                const New_event ={
                    id : Math.floor(Math.random()*1001),
                    title,
                    color:"blue",
                    start :selectionInfo.startStr,
                    end:selectionInfo.endStr,
                }
            setEvents(CalEvents.concat(New_event))
            }
        }

        // 이벤트 수정하기 위한 함수 
        const changetitle= () =>{
            for(var i =0; i<CalEvents.length; i++){
                if(temp.color == 'red'){
                    alert('학원 수업은 변경할 수 없습니다.')
                    setopen(false)
                    break;
                }
                else if(temp.id == CalEvents[i].id){
                    CalEvents[i].title = temp.title
                    setEvents([...CalEvents])
                    alert('수정이 완료되었습니다')
                    setopen(false)
                }
            }
        
        }

        //이벤트 클릭 시 모달창 띄우기 및 데이터 넘기기
        const handleEventClick = (clickInfo) =>{
            setopen(true);
            console.log(clickInfo)
            const submit ={
                title : clickInfo.event.title,
                start : clickInfo.event.startStr,
                end : clickInfo.event.endStr,
                id : clickInfo.event.id,
                color:clickInfo.event.backgroundColor
            }
            settemp(submit);
        }
    
        // 이벤트 삭제를 위한 함수
        const RemoveItem = () => {
            const copy = [...CalEvents]
            for(var i = 0; i<copy.length; i++){
                if(temp.color === 'red'){
                    alert('학원 수업 일정은 삭제 할 수 없습니다.')
                    setopen(false)
                    break;
                }
                else if(copy[i].color === "blue"){
                    copy.splice(i,1)
                    setEvents(copy)
                    alert('일정이 삭제되었습니다.')
                    setopen(false)
                }
                else if(copy[i].id == temp.id){
                    copy.splice(i,1)
                    setEvents(copy)
                    alert('일정이 삭제되었습니다.')
                    setopen(false)
                    setTodo(Todo.concat(temp))
                    break;
                }
            }
        }


       
        //이벤트 드롭 제한
        // const handleallow = (dropInfo,draggedEvent)=>{
        //     // dropInfo.start='2021-10-15'
        //     if (draggedEvent.id === '14351') {
        //         return dropInfo.start < new Date('2021-10-16') && dropInfo.start > new Date('2021-10-10')-----
        //       }
        //       else {
        //         return true;
        //       }
        // }

        // 캘린더 상단 툴바 설정 
        const headToolbar ={
            left:'prev,next today',
            center:'title',
            right:'dayGridMonth,listWeek',
         
        }

    return(
        <Container>
            <div className="calendar">
                <Fullcalendar
                plugins={[dayGridPlugin,interactionPlugin,listPlugin]}
                // googleCalendarApiKey = 'AIzaSyByCEDWVM3WF5eLKNK05-dW_NOgKwLSYXY' // google Calendar Api keys
                initialView = "dayGridMonth" // 처음 보여주는 화면 (달별로 출력)
                selectable={true}  // 달력에서 드래그로 날짜 선택 
                editable={true} // 캘린더 내에서 일정 옮기고 수정  
                locale='ko' // 한국어 설정
                dayMaxEvents={true} // 하나의 날짜에 이벤트 갯수 제한 넘어가면 more로 표시 
                businessHours={true} // 주말 색깔 블러 처리
                events ={CalEvents} // calendar event 불러오기
                eventReceive = {handleRecive} // Todolist 에서 event를 드롭했을 때 state 업데이트
                eventDrop={handleDrop} // 이벤트 날짜를 옮겼을 때 state에 업데이트 
                eventResize={handleResize} //이벤트 기간을 늘리거나 줄였을때 state를 업데이트 
                select={handleSlect} // 캘린더 내에서 기간을 선택해서 이벤트 추가하기
                eventClick={handleEventClick} // 이벤트 클릭 시 모달 창 띄우기
                headerToolbar={headToolbar} // 캘린더 상단 툴바 설정 
                eventOrderStrict={true}
             
                />
             </div>

            {/* 투 두 리스트  */}
          
             <div className="Todo">
                 <h2>To Do List</h2>
                    <div className="list">
                        {Todo.map((event,index)=>{
                            return(
                            <>
                            <ToDoList key ={index} event={event}/>
                            <Button fullWidth onClick={()=>{
                                const copy_todo = [...Todo];
                                copy_todo.splice(index,1);
                                setTodo(copy_todo);
                            }}>삭제하기</Button>
                            </>
                        )})}
                    </div>
                    <Button fullWidth>To Do list 추가하기</Button>
             </div>
           
                
        
 


            {/* 삭제 및 수정 모달 창 띄우기 */}

            <Modal 
            open={open}
            onClose={handleClose}
            disableAutoFocus={true}
            disableRestoreFocus={true}
            > 
            <Box sx={Boxstyle}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                일정 관리
            </Typography>
            <Modal_Style>
            <Typography id="modal-modal-description">
                일정 : <input  type="text" value={temp.title} placeholder={temp.title} style={{border:"none" , height:"18px",background:"rgb(239, 239, 239)"} } onChange={(e)=>{
                    settemp({
                        ...temp,
                        title:e.target.value})
                    console.log(e.target.value)
                    
                }}  /> <br/>
                일시 : {temp.start}
                <br/>
                <button onClick={(changetitle)}>수정하기</button>
                <button  onClick={(RemoveItem)}>삭제하기</button>
              
            </Typography>
            </Modal_Style>
            </Box>
            </Modal>
        
        </Container>

    )
}

export default Calendar;
