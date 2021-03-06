// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import ClassWrapper from '../essentials/ClassWrapper';
// import '../../styles/manage_page.scss';
// import classNames from 'classnames';
// import MultipleAutocomplete from '../essentials/MultipleAutocomplete';
// import * as $ from 'jquery';
// import Axios from 'axios';
// import { apiUrl } from '../../configs/configs';
// import { withRouter } from 'react-router-dom';
// import ClassDialogDelete from '../essentials/ClassDialogDelete';
// import { Button, withStyles } from '@material-ui/core';
// import styled from 'styled-components';
// import PopOverClipboard from '../essentials/PopOverClipboard';
// import StudentManage from '../ClassStudentManage/StudentManage';
// import Manage from './Manage';


// const CopyButton = styled.div`
//     pointer-events: ${(props) => (props.state ? 'none' : 'all')};
// `;
// const FormButton = styled.button`
//     background-color: ${(props) => (props.able ? '#43138b' : '#f6f7f9')};
//     color: ${(props) => (props.able ? 'white' : '#707070')};
//     border: ${(props) => (props.able ? 'none' : '1px solid #707070')};

//     border-radius: 11px;
//     font-size: 1rem;
//     font-weight: 500;
//     width: 52px;
//     height: 43px;

//     & + & {
//         margin-left: 11px;
//     }
// `;

// const ButtonAble = styled.button`
//     color: ${(props) => (props.able ? '#3B168A' : '#b2b2b2')};
//     border-bottom: ${(props) => (props.able ? '2px solid #3B168A' : 'none')};
// `;

// const CreateButton = withStyles((theme) => ({
//     root: {
//         borderRadius: '10px',
//         backgroundColor: '#13E2A1',
//         color: '#fff',
//         fontFamily: 'inherit',
//         fontSize: '0.9rem',
//         width: '150px',
//         height: '56px',

//         '&.critical': {
//             backgroundColor: '#a6a6a6',
//         },
//     },
// }))(Button);

// function Manage2({ match, history }) {

//     const handleShareCardList = useCallback(
//         (e)=>{
//             const {name,value} = e.target;

//             setablestate({
//                 leaderboard:false,
//                 classmanage:false,
//                 studentmanage:false,
//             });
//             setablestate((prevState)=>({
//                 ...prevState,
//                 [name]: !(value === 'true'),
//             }));
//         },
//         [ablestate],
//     );


//     const [ablestate,setablestate] = useState({
//         leaderboard:true,
//         classmanage:false,
//         studentmanage:false,
//     })
    
//     return (
//         <>
//         <ClassWrapper>        
//                 <div className="class-section-root">
//                     <div className="class-share-header">
//                         <div className="header-title">?????? ??? ????????? </div>
//                         <div className="header-menu">
//                             <ButtonAble name="leaderboard" able={ablestate['leaderboard']} value={ablestate['leaderboard']} onClick={handleShareCardList}>
//                                 ?????? ??????
//                             </ButtonAble>
//                             <ButtonAble name="classmanage" able={ablestate['classmanage']} value={ablestate['classmanage']} onClick={handleShareCardList}>
//                                 ????????? ??????
//                             </ButtonAble>
//                             <ButtonAble name="studentmanage" able={ablestate['studentmanage']} value={ablestate['studentmanage']} onClick={handleShareCardList}>
//                                 ?????? ??????
//                             </ButtonAble>
//                         </div>
//                     </div>
//                 </div>
//             </ClassWrapper>
//             {
//                 ablestate['studentmanage']
//                 ? 
//                 <div className="test">
//                     <StudentManage/>
//                 </div>
//                 : ablestate['classmanage']
//                 ?
//                 <div className="test">
//                     <Manage/>
//                 </div>
//                 : null
//             }

//         </>
//     );
// }

// export default withRouter(Manage2);

import React, { useState, useEffect, useRef } from 'react';
import ClassWrapper from '../essentials/ClassWrapper';
import '../../styles/manage_page.scss';
import classNames from 'classnames';
import MultipleAutocomplete from '../essentials/MultipleAutocomplete';
import * as $ from 'jquery';
import Axios from 'axios';
import { apiUrl } from '../../configs/configs';
import { withRouter } from 'react-router-dom';
import ClassDialogDelete from '../essentials/ClassDialogDelete';
import { Button, withStyles } from '@material-ui/core';
import styled from 'styled-components';
import PopOverClipboard from '../essentials/PopOverClipboard';

const CopyButton = styled.div`
    pointer-events: ${(props) => (props.state ? 'none' : 'all')};
`;
const FormButton = styled.button`
    background-color: ${(props) => (props.able ? '#43138b' : '#f6f7f9')};
    color: ${(props) => (props.able ? 'white' : '#707070')};
    border: ${(props) => (props.able ? 'none' : '1px solid #707070')};
    border-radius: 11px;
    font-size: 1rem;
    font-weight: 500;
    width: 52px;
    height: 43px;
    & + & {
        margin-left: 11px;
    }
`;

const CreateButton = withStyles((theme) => ({
    root: {
        borderRadius: '10px',
        backgroundColor: '#13E2A1',
        color: '#fff',
        fontFamily: 'inherit',
        fontSize: '0.9rem',
        width: '150px',
        height: '56px',

        '&.critical': {
            backgroundColor: '#a6a6a6',
        },
    },
}))(Button);

function Classoption({ match, history }) {
    const textCopy = useRef();

    const { num } = match.params;
    const [inputState, setInputState] = useState({
        entry_new_name: '',
        entry_new_description: '',
        entry_new_students: null,
    });
    const [selectOpen, setSelectOpen] = useState(false);
    const [inputError, setInputError] = useState(false);
    const [studentsData, setStudentsData] = useState([]);
    const [createButtonEnabled, setCreateButtonEnabled] = useState(false);
    const [codeState, setCodeState] = useState('');
    const [clipboardState, setClipboardState] = useState(false);
    const [buttonAble, setButtonAble] = useState({
        ???: false,
        ???: false,
        ???: false,
        ???: false,
        ???: false,
        ???: false,
        ???: false,
    });

    const handleInputChange = (e, value) => {
        if ($(e.target).hasClass('default')) {
            setInputState({
                ...inputState,
                [e.target.name]: e.target.value,
            });
        } else {
            setInputState({
                ...inputState,
                entry_new_students: value,
            });
        }
    };

    const fetchStudents = () => {
        Axios.get(`${apiUrl}/students-in-teacher/current`, { withCredentials: true })
            .then((res) => {
                // console.log('???????????? ????????? : ', res.data);
                setStudentsData(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    useEffect(() => {
        if (!inputState['entry_new_name'].trim()) {
            setCreateButtonEnabled(false);
        } else {
            setCreateButtonEnabled(true);
        }

        // ?????? ????????????
    }, [inputState]);

    useEffect(() => {
        Axios.get(`${apiUrl}/classes/class/${num}`, { withCredentials: true })
            .then((res1) => {
                // Axios.get(`${apiUrl}/students-in-class/${num}`, { withCredentials: true })
                //     .then((res2) => {
                //         setInputState({
                //             ...inputState,
                //             entry_new_name: res1.data[0]['class_name'],
                //             entry_new_description: res1.data[0]['description'],
                //             entry_new_students: res2.data.map(({ name, student_id }) => ({
                //                 ...inputState.entry_new_students,
                //                 name: name,
                //                 student_id: student_id,
                //             })),
                //         });
                //     })
                //     .catch((err) => {
                //         console.error(err);
                //     });

                setInputState({
                    ...inputState,
                    entry_new_name: res1.data[0]['class_name'],
                    entry_new_description: res1.data[0]['description'],
                });
                setCodeState(res1.data[0]['class_code']);

                if (res1.data[0]['class_day']) {
                    let daysObj = {};
                    res1.data[0]['class_day'].split(',').map((i) => (daysObj[i] = true));

                    setButtonAble({
                        ...buttonAble,
                        ...daysObj,
                    });
                }
            })
            .catch((err) => {
                console.error(err);
            });

        // return () => {
        //     setInputState(null);
        // };
    }, []);

    useEffect(() => {
        if (!selectOpen) {
            setStudentsData([]);
        } else {
            fetchStudents();
        }
    }, [selectOpen]);

    /** delete-dialog ????????? */
    const [deleteDialogopen, setDeleteDialogopen] = useState(false);
    const handleDeleteDialogOpen = () => {
        setDeleteDialogopen(true);
    };
    const handleDeleteDateDialogClose = (e) => {
        const { name } = e.target;

        if (name === 'yes') {
            handleClassDelete(name);
            setDeleteDialogopen(false);
        } else {
            setDeleteDialogopen(false);
        }
    };

    /** ????????? ????????? ?????? */
    const handleStudentInClass = (name) => {
        //????????? ?????? : ?????? ????????? ?????? ??????-> delete??? ?????? // ?????? ?????? -> delete ??? post?????? ??????
        //????????? ?????? : ????????? delete

        Axios.delete(`${apiUrl}/students-in-class/${num}`, { withCredentials: true })
            .then((res1) => {
                // // ???????????? ?????????
                // if (name === 'modify') {
                //     //???????????? ?????? ????????????, post ??????
                //     if (inputState.entry_new_students.length === 0) {
                //         alert('????????? ?????? ????????? ?????????????????????!');
                //     } else {
                //         Axios.post(
                //             `${apiUrl}/students-in-class`,
                //             {
                //                 classNumber: num,
                //                 students: inputState.entry_new_students,
                //             },
                //             { withCredentials: true },
                //         )
                //             .then((res2) => {
                //                 alert('????????? ?????? ????????? ?????????????????????!');
                //             })
                //             .catch((err) => {
                //                 console.error(err);
                //             });
                //     }
                //     history.replace(`/class/${num}/manage`);
                // }
                // // ???????????? ?????????, ????????? ??????
                // else {
                alert('?????? ?????????????????????!');
                history.replace('/');
                //}
            })
            .catch((err) => {
                console.error(err);
            });
    };

    /** ????????? ????????? ?????? */
    const handleClassDelete = (name) => {
        Axios.delete(`${apiUrl}/classes/${num}`, { withCredentials: true })
            .then((res) => {
                //class table - name, description ?????? ??????!
                handleStudentInClass(name); //????????? ????????? ??????...
            })
            .catch((err) => {
                console.error(err);
            });
    };
    /** ??????, ???????????? ?????? */
    const handleButton = (e) => {
        const $target = $(e.target);

        if (!inputState['entry_new_name'].trim()) {
            setInputError(true);
            return;
        } else {
            setInputError(false);
        }

        let name = '';
        if ($target.parents('.button-modify').length !== 0 || $target.attr('class').includes('button-modify')) {
            name = 'modify';
        } else if ($target.parents('.button-delete').length !== 0 || $target.attr('class').includes('button-delete')) {
            name = 'delete';
        }
        if (name === 'modify') {
            let daysArr = [];
            Object.keys(buttonAble)
                .filter((i) => buttonAble[i] === true)
                .map((i) => daysArr.push(i));

            Axios.patch(
                `${apiUrl}/classes/${num}`,
                {
                    name: inputState.entry_new_name,
                    description: inputState.entry_new_description,
                    class_day: daysArr.toString(),
                },
                { withCredentials: true },
            )
                .then((res) => {
                    //name, description ?????? ??????!
                    alert('????????? ?????? ????????? ?????????????????????!');
                })
                .catch((err) => {
                    console.error(err);
                });
        } else if (name === 'delete') {
            handleDeleteDialogOpen();
        }
    };
    /**  ?????? ?????? ?????? */
    const handleDaysButtons = (e) => {
        const { name } = e.target;

        setButtonAble({
            ...buttonAble,
            [name]: !buttonAble[name],
        });
    };
    /**  ???????????? ?????? */
    const handleCopy = () => {
        if (clipboardState) return;

        textCopy.current.select();
        textCopy.current.setSelectionRange(0, 9999);

        document.execCommand('copy');

        console.log(clipboardState);

        setClipboardState(true);
        setTimeout(function () {
            setClipboardState(false);
        }, 3000);
    };

    return (
        <>
            <PopOverClipboard state={clipboardState} />
            <ClassDialogDelete ver="class" open={deleteDialogopen} handleDialogClose={handleDeleteDateDialogClose} />
            <ClassWrapper col="col">
                <div className="class-manage-root">
                    <div>
                        <div className="manage-header">
                            <h2 className="manage-title">????????? ?????? ??? ??????</h2>
                        </div>
                        <div className="manage-inputs">
                            <div className="manage-inputs-header">????????? ?????? ??????</div>
                            <div className="manage-invite">
                                <input readOnly type="text" defaultValue={codeState} ref={textCopy} />
                                <button onClick={handleCopy}>????????????</button>
                            </div>
                        </div>

                        <div className="manage-inputs">
                            <div className="manage-inputs-header">????????? ??????</div>

                            <input
                                className={classNames('default', inputError ? 'error' : '')}
                                type="text"
                                name="entry_new_name"
                                id="entry_new_name"
                                placeholder="????????? ??????"
                                onChange={handleInputChange}
                                value={inputState['entry_new_name']}
                            />
                            <textarea
                                className="default"
                                type="text"
                                name="entry_new_description"
                                id="entry_new_description"
                                placeholder="????????? ?????? ??????"
                                onChange={handleInputChange}
                                value={inputState['entry_new_description']}
                            />
                        </div>
                        <div className="manage-inputs">
                            <div className="manage-inputs-header">
                                <div>
                                    ?????? ??????<span>(??????)</span>
                                </div>
                                <span className="form-info">*?????? ????????? ?????? ??????????????????.</span>
                            </div>
                            <div className="form-buttons">
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
                            </div>
                        </div>
                    </div>

                    <div className="manage-footer">
                        <CreateButton
                            className="button-delete critical"
                            size="large"
                            variant="contained"
                            disabled={!createButtonEnabled}
                            name="delete"
                            onClick={handleButton}
                        >
                            ????????????
                        </CreateButton>
                        <CreateButton
                            className="button-modify"
                            size="large"
                            variant="contained"
                            disabled={!createButtonEnabled}
                            name="modify"
                            onClick={handleButton}
                        >
                            ????????????
                        </CreateButton>
                    </div>
                </div>
            </ClassWrapper>
        </>
    );
}

export default Classoption;
