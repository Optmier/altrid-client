import React, { useEffect, useState, useRef } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core';
import classNames from 'classnames';
import * as $ from 'jquery';
import MultipleAutocomplete from '../essentials/MultipleAutocomplete';
import Axios from 'axios';
import { apiUrl } from '../../configs/configs';
import { $_classDefault } from '../../configs/front_urls';
import styled from 'styled-components';
import ShortUniqueId from 'short-unique-id';
import DrawerGroupBox from '../../AltridUI/Drawer/DrawerGroupBox';
import BulbIcon from '../../AltridUI/Icons/drawer-groupbox-icon-bulb.svg';
import DrawerActions from '../../AltridUI/Drawer/DrawerActions';
import Button from '../../AltridUI/Button/Button';

const CreateButton = withStyles((theme) => ({
    root: {
        borderRadius: '10px',
        backgroundColor: '#13E2A1',
        color: '#fff',
        fontFamily: 'inherit',
        fontSize: '0.9rem',
        width: '150px',
        height: '56px',
    },
}))(Button);

const FormButton = styled.button`
    background-color: ${(props) => (props.able ? '#FFFFFF' : '#F4F1FA')};
    color: ${(props) => (props.able ? '#3B1689' : '#3B1689')};
    border: ${(props) => (props.able ? '2px solid #3B1689' : 'none')};
    /* width: 100%; */
    max-width: 70px;

    max-height: 54px;
    border-radius: 11px;
    font-size: 1rem;
    font-weight: 500;
    padding: 14px 24px;
    margin: 8px 4px;
    @media (min-width: 0px) and (max-width: 480px) {
        max-width: 40px;
        width: 100%;
        padding: 14px 8px;
        /* margin: 0 2px; */
    }
`;

function CreateNewEntry({ history, handleClose }) {
    const generateUid = useRef();

    const [createButtonEnabled, setCreateButtonEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectOpen, setSelectOpen] = useState(false);
    const [inputState, setInputState] = useState({
        entry_new_name: '',
        entry_new_description: '',
        entry_new_students: [],
    });
    const [inputError, setInputError] = useState(false);
    const [studentsData, setStudentsData] = useState([]);
    const [buttonAble, setButtonAble] = useState({
        월: false,
        화: false,
        수: false,
        목: false,
        금: false,
        토: false,
        일: false,
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

    const handleClickCreate = () => {
        let daysArr = [];

        if (!inputState['entry_new_name'].trim()) {
            setInputError(true);
            return;
        } else {
            setInputError(false);
        }

        Object.keys(buttonAble)
            .filter((i) => buttonAble[i] === true)
            .map((i) => daysArr.push(i));

        Axios.post(
            `${apiUrl}/classes`,
            {
                name: inputState.entry_new_name,
                description: inputState.entry_new_description,
                class_code: generateUid.current(8),
                days: daysArr.toString(),
            },
            { withCredentials: true },
        )
            .then((res1) => {
                // if (inputState.entry_new_students.length > 0)
                //     Axios.post(
                //         `${apiUrl}/students-in-class`,
                //         {
                //             classNumber: res1.data.insertId,
                //             students: inputState.entry_new_students,
                //         },
                //         { withCredentials: true },
                //     )
                //         .then((res2) => {
                //             // console.log('클래스가 생성됨.');
                //             history.push(`${$_classDefault}/${res1.data.insertId}/draft`);
                //         })
                //         .catch((err) => {
                //             console.error(err);
                //         });
                // else {
                //     // console.log('클래스가 생성됨.');
                //     history.push(`${$_classDefault}/${res1.data.insertId}/draft`);
                // }
                history.push(`${$_classDefault}/${res1.data.insertId}/share`);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const fetchStudents = () => {
        setLoading(true);
        Axios.get(`${apiUrl}/students-in-teacher/current`, { withCredentials: true })
            .then((res) => {
                setStudentsData(res.data);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleButtons = (e) => {
        const { name } = e.target;

        setButtonAble({
            ...buttonAble,
            [name]: !buttonAble[name],
        });
    };

    useEffect(() => {
        if (!inputState['entry_new_name'].trim()) {
            setCreateButtonEnabled(false);
        } else {
            setCreateButtonEnabled(true);
        }

        // 중복 체크하기
    }, [inputState]);

    useEffect(() => {
        if (!selectOpen) {
            setStudentsData([]);
        } else {
            fetchStudents();
        }
    }, [selectOpen]);

    useEffect(() => {
        generateUid.current = new ShortUniqueId();
    }, []);

    return (
        <div className="create-new-entry-root">
            <svg onClick={handleClose} width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="16" fill="#F6F8F9" />
                <path
                    d="M24 22.5862L28.95 17.6362L30.364 19.0502L25.414 24.0002L30.364 28.9502L28.95 30.3642L24 25.4142L19.05 30.3642L17.636 28.9502L22.586 24.0002L17.636 19.0502L19.05 17.6362L24 22.5862Z"
                    fill="#77818B"
                />
            </svg>
            <div className="drawer-header">
                <div className="title">
                    <h2>클래스를 생성하여 시작해보세요 :)</h2>
                </div>
                {/* <div className="close-icon" onClick={handleClose}>
                    <CloseIcon />
                </div> */}
            </div>

            <DrawerGroupBox title="클래스 소개" description="클래스 소개를 입력하세요" descriptionAdornment={BulbIcon}>
                <div className="form-container">
                    <input
                        className={classNames('default', inputError ? 'error' : '')}
                        type="text"
                        name="entry_new_name"
                        id="entry_new_name"
                        placeholder="클래스 이름"
                        onChange={handleInputChange}
                        value={inputState['entry_new_name']}
                    />
                    <textarea
                        className="default"
                        type="text"
                        name="entry_new_description"
                        id="entry_new_description"
                        placeholder="클래스 한줄 설명"
                        onChange={handleInputChange}
                        value={inputState['entry_new_description']}
                    />
                </div>
            </DrawerGroupBox>

            {/* <div style={{ marginTop: 24 }}>
                    <MultipleAutocomplete
                        id="entry_new_students"
                        onOpen={() => {
                            setSelectOpen(true);
                        }}
                        onClose={() => {
                            setSelectOpen(false);
                        }}
                        onChange={handleInputChange}
                        value={inputState['entry_new_students']}
                        options={studentsData}
                        getOptionLabel={(option) => option.name}
                        renderOption={(option, state) => (
                            <React.Fragment>
                                {option.name} [{option.email}]
                            </React.Fragment>
                        )}
                        loading={loading}
                        placeholder="수강생 선택"
                    />
                </div> */}
            <DrawerGroupBox
                title="수업 요일"
                description="수업요일을 모두 선택해주세요 중복 선택이 가능합니다"
                descriptionAdornment={BulbIcon}
            >
                <div className="form-buttons">
                    <FormButton name="월" able={buttonAble['월']} onClick={handleButtons}>
                        {buttonAble['월'] ? (
                            <>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M6.71354 13.6668C3.03154 13.6668 0.046875 10.6822 0.046875 7.00016C0.046875 3.31816 3.03154 0.333496 6.71354 0.333496C10.3955 0.333496 13.3802 3.31816 13.3802 7.00016C13.3802 10.6822 10.3955 13.6668 6.71354 13.6668ZM6.04888 9.66683L10.7622 4.95283L9.81954 4.01016L6.04888 7.7815L4.16288 5.8955L3.22021 6.83816L6.04888 9.66683Z"
                                        fill="#3B1689"
                                    />
                                </svg>
                                <br />월
                            </>
                        ) : (
                            <>월</>
                        )}
                    </FormButton>
                    <FormButton name="화" able={buttonAble['화']} onClick={handleButtons}>
                        {buttonAble['화'] ? (
                            <>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M6.71354 13.6668C3.03154 13.6668 0.046875 10.6822 0.046875 7.00016C0.046875 3.31816 3.03154 0.333496 6.71354 0.333496C10.3955 0.333496 13.3802 3.31816 13.3802 7.00016C13.3802 10.6822 10.3955 13.6668 6.71354 13.6668ZM6.04888 9.66683L10.7622 4.95283L9.81954 4.01016L6.04888 7.7815L4.16288 5.8955L3.22021 6.83816L6.04888 9.66683Z"
                                        fill="#3B1689"
                                    />
                                </svg>
                                <br />화
                            </>
                        ) : (
                            <>화</>
                        )}
                    </FormButton>
                    <FormButton name="수" able={buttonAble['수']} onClick={handleButtons}>
                        {buttonAble['수'] ? (
                            <>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M6.71354 13.6668C3.03154 13.6668 0.046875 10.6822 0.046875 7.00016C0.046875 3.31816 3.03154 0.333496 6.71354 0.333496C10.3955 0.333496 13.3802 3.31816 13.3802 7.00016C13.3802 10.6822 10.3955 13.6668 6.71354 13.6668ZM6.04888 9.66683L10.7622 4.95283L9.81954 4.01016L6.04888 7.7815L4.16288 5.8955L3.22021 6.83816L6.04888 9.66683Z"
                                        fill="#3B1689"
                                    />
                                </svg>
                                <br />수
                            </>
                        ) : (
                            <>수</>
                        )}
                    </FormButton>
                    <FormButton name="목" able={buttonAble['목']} onClick={handleButtons}>
                        {buttonAble['목'] ? (
                            <>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M6.71354 13.6668C3.03154 13.6668 0.046875 10.6822 0.046875 7.00016C0.046875 3.31816 3.03154 0.333496 6.71354 0.333496C10.3955 0.333496 13.3802 3.31816 13.3802 7.00016C13.3802 10.6822 10.3955 13.6668 6.71354 13.6668ZM6.04888 9.66683L10.7622 4.95283L9.81954 4.01016L6.04888 7.7815L4.16288 5.8955L3.22021 6.83816L6.04888 9.66683Z"
                                        fill="#3B1689"
                                    />
                                </svg>
                                <br />목
                            </>
                        ) : (
                            <>목</>
                        )}
                    </FormButton>
                    <FormButton name="금" able={buttonAble['금']} onClick={handleButtons}>
                        {buttonAble['금'] ? (
                            <>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M6.71354 13.6668C3.03154 13.6668 0.046875 10.6822 0.046875 7.00016C0.046875 3.31816 3.03154 0.333496 6.71354 0.333496C10.3955 0.333496 13.3802 3.31816 13.3802 7.00016C13.3802 10.6822 10.3955 13.6668 6.71354 13.6668ZM6.04888 9.66683L10.7622 4.95283L9.81954 4.01016L6.04888 7.7815L4.16288 5.8955L3.22021 6.83816L6.04888 9.66683Z"
                                        fill="#3B1689"
                                    />
                                </svg>
                                <br />금
                            </>
                        ) : (
                            <>금</>
                        )}
                    </FormButton>
                    <FormButton name="토" able={buttonAble['토']} onClick={handleButtons}>
                        {buttonAble['토'] ? (
                            <>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M6.71354 13.6668C3.03154 13.6668 0.046875 10.6822 0.046875 7.00016C0.046875 3.31816 3.03154 0.333496 6.71354 0.333496C10.3955 0.333496 13.3802 3.31816 13.3802 7.00016C13.3802 10.6822 10.3955 13.6668 6.71354 13.6668ZM6.04888 9.66683L10.7622 4.95283L9.81954 4.01016L6.04888 7.7815L4.16288 5.8955L3.22021 6.83816L6.04888 9.66683Z"
                                        fill="#3B1689"
                                    />
                                </svg>
                                <br />토
                            </>
                        ) : (
                            <>토</>
                        )}
                    </FormButton>
                    <FormButton name="일" able={buttonAble['일']} onClick={handleButtons}>
                        {buttonAble['일'] ? (
                            <>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M6.71354 13.6668C3.03154 13.6668 0.046875 10.6822 0.046875 7.00016C0.046875 3.31816 3.03154 0.333496 6.71354 0.333496C10.3955 0.333496 13.3802 3.31816 13.3802 7.00016C13.3802 10.6822 10.3955 13.6668 6.71354 13.6668ZM6.04888 9.66683L10.7622 4.95283L9.81954 4.01016L6.04888 7.7815L4.16288 5.8955L3.22021 6.83816L6.04888 9.66683Z"
                                        fill="#3B1689"
                                    />
                                </svg>
                                <br />일
                            </>
                        ) : (
                            <>일</>
                        )}
                    </FormButton>
                </div>
            </DrawerGroupBox>
            <DrawerActions>
                <Button variant="filled" colors="purple" disabled={!createButtonEnabled} onClick={handleClickCreate}>
                    생성하기
                </Button>
            </DrawerActions>
            {/* <div className="create-button">
                <CreateButton size="large" variant="contained" disabled={!createButtonEnabled} onClick={handleClickCreate}>
                    생성하기
                </CreateButton>
            </div> */}
        </div>
    );
}

export default CreateNewEntry;
