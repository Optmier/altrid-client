/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import '../../styles/manage_page.scss';
import classNames from 'classnames';
import * as $ from 'jquery';
import Axios from 'axios';
import { apiUrl } from '../../configs/configs';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import StudentManage from '../ClassStudentManage/StudentManage';
import Leaderboard from '../ClassStudentManage/Leaderboard';
import HeaderMenu from '../../AltridUI/HeaderMenu/HeaderMenu';
import Button from '../../AltridUI/Button/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import DrawerGroupBox from '../../AltridUI/Drawer/DrawerGroupBox';
import BulbIcon from '../../AltridUI/Icons/drawer-groupbox-icon-bulb.svg';
import InnerPageBottomActions from '../../AltridUI/OtherContainers/InnerPageBottomActions';
import Typography from '../../AltridUI/Typography/Typography';
import { useDispatch } from 'react-redux';
import { closeAlertDialog, openAlertDialog, openAlertSnackbar } from '../../redux_modules/alertMaker';

const FormButton = styled.button`
    background-color: ${(props) => (props.able ? '#FFFFFF' : '#F4F1FA')};
    color: ${(props) => (props.able ? '#3B1689' : '#3B1689')};
    border: ${(props) => (props.able ? '2px solid #3B1689' : 'none')};
    border-radius: 11px;
    font-size: 1rem;
    font-weight: 500;
    width: 129px;
    height: 54px;
    & + & {
        margin-left: 8px;
    }
`;

const ClassCopyRoot = styled.div`
    align-items: center;
    background-color: #ffffff;
    border: 2px solid #3b1689;
    border-radius: 16px;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-start;
    padding: 14px 44px;
    margin-bottom: 40px;
    @media all and (max-width: 530px) {
        padding: 12px 16px;
        justify-content: space-between;
    }
`;
const CodeContainer = styled.div`
    align-items: center;
    display: flex;
    @media all and (max-width: 530px) {
        align-items: flex-start;
        flex-direction: column;
        justify-content: center;
    }
`;
const ClassCopyTitle = styled.p`
    font-size: 18px;
    line-height: 22px;
    @media all and (max-width: 530px) {
        font-size: 14px;
        line-height: 18px;
    }
`;
const ClassCopyInput = styled.input`
    font-weight: 700;
    font-size: 24px;
    line-height: 28px;
    margin-left: 40px;
    width: 140px;
    @media all and (max-width: 530px) {
        font-size: 18px;
        line-height: 22px;
        margin: 0;
    }
`;

const ManageInputsContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    & input {
        background-color: #ffffff;
        border: none;
        border-radius: 16px;
        box-sizing: border-box;
        color: #707070;
        font-family: inherit;
        font-size: 1rem;
        font-weight: 400;
        line-height: 2.625rem;
        width: 100%;
        height: 60px;
        outline: none;
        padding: 0px 30px;
    }
    & textarea {
        margin-top: 16px;
        background-color: #ffffff;
        border: none;
        border-radius: 16px;
        box-sizing: border-box;
        color: #707070;
        font-family: inherit;
        font-size: 1rem;
        resize: vertical;
        background-color: #f6f8f9;
        font-weight: 400;
        line-height: 1.25;
        width: 100%;
        height: 264px;
        outline: none;
        padding: 20px 30px;
        resize: none;
    }
    & div.form-buttons {
        display: flex;
        width: 100%;
    }
`;

const ClassManagementRoot = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 32px;
    margin-bottom: ${(props) => (props['bottom-actions'] ? '72px' : null)};
    max-width: 960px;
    height: 100%;
    @media (max-width: 640px) {
        margin-top: 30px;
    }
`;
const ContentsWrapper = styled.div`
    margin: 24px 0;
`;

function Manage({ match, history }) {
    const textCopy = useRef();

    const dispatch = useDispatch();
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
    }, []);

    useEffect(() => {
        if (!selectOpen) {
            setStudentsData([]);
        } else {
            fetchStudents();
        }
    }, [selectOpen]);

    /** ????????? ????????? ?????? */
    const handleStudentInClass = (name) => {
        //????????? ?????? : ?????? ????????? ?????? ??????-> delete??? ?????? // ?????? ?????? -> delete ??? post?????? ??????
        //????????? ?????? : ????????? delete
        Axios.delete(`${apiUrl}/students-in-class/${num}`, { withCredentials: true })
            .then((res1) => {
                dispatch(openAlertSnackbar('?????? ???????????????.', 'success'));
                history.replace('/');
            })
            .catch((err) => {
                console.error(err);
                dispatch(openAlertSnackbar('????????? ????????? ??????????????????.', 'error'));
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
                dispatch(openAlertSnackbar('????????? ????????? ??????????????????.', 'error'));
            })
            .finally(() => {
                dispatch(closeAlertDialog());
            });
    };
    /** ??????, ???????????? ?????? */
    const handleButton = (e) => {
        // const $target = $(e.target);
        const { name } = e.target;

        if (!inputState['entry_new_name'].trim()) {
            setInputError(true);
            return;
        } else {
            setInputError(false);
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
                    dispatch(openAlertSnackbar('????????? ?????? ????????? ?????????????????????.', 'success'));
                })
                .catch((err) => {
                    console.error(err);
                    dispatch(openAlertSnackbar('????????? ?????? ????????? ??????????????????..', 'error'));
                });
        } else if (name === 'delete') {
            dispatch(
                openAlertDialog(
                    'warning',
                    '????????? ???????????? ?????????????????????????',
                    '????????? ???????????? ????????? ??????????????????.',
                    'no|yes',
                    '?????????|????????????',
                    'red|light',
                    'white|light',
                    'defaultClose',
                    handleClassDelete,
                ),
            );
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

        setClipboardState(true);
        dispatch(openAlertSnackbar('????????? ????????? ?????????????????????.', 'info'));
        setTimeout(function () {
            setClipboardState(false);
        }, 3000);
    };

    const menuDatas = [
        {
            mId: 0,
            mName: '????????????',
        },
        {
            mId: 1,
            mName: '????????? ??????',
        },
        {
            mId: 2,
            mName: '?????? ??????',
        },
    ];

    const [selectedMenu, setSelectedMenu] = useState(0);
    const [toDeleteStudentData, setToDeleteStudentData] = useState({});

    const actionChangeStudentsSelection = (data) => {
        setToDeleteStudentData(data);
    };

    const actionDeleteStudents = () => {
        let arr = [];
        Object.keys(toDeleteStudentData)
            .filter((i) => toDeleteStudentData[i] === true)
            .map((i) => arr.push(`'${i}'`));

        dispatch(
            openAlertDialog(
                'warning',
                '??????',
                `???????????? ??????${arr.length > 1 ? '???' : ''}??? ?????????????????????????`,
                'no|yes',
                '?????????|???',
                'red|light',
                'white|light',
                'defaultClose',
                () => {
                    dispatch(closeAlertDialog());
                    Axios.delete(`${apiUrl}/students-in-class/students/${num}`, {
                        data: {
                            students: arr.join(','),
                        },
                        withCredentials: true,
                    })
                        .then((res) => {
                            dispatch(openAlertSnackbar('?????? ????????? ?????????????????????.', 'success'));
                            history.go(0);
                        })
                        .catch((err) => {
                            console.error(err);
                            dispatch(openAlertSnackbar('?????? ????????? ??????????????????.', 'error'));
                        });
                },
            ),
        );
    };

    const [rootHasBottomActions, setRootHasBottomActions] = useState(false);
    const hasActions = (bool) => {
        setRootHasBottomActions(bool);
    };

    return (
        <ClassManagementRoot bottom-actions={rootHasBottomActions}>
            <HeaderMenu
                fullWidth
                title="?????? ??? ?????????"
                menuDatas={menuDatas}
                selectedMenuId={selectedMenu}
                fixed
                backgroundColor="#f6f8f9"
                onItemClick={(id) => {
                    setSelectedMenu(id);
                }}
            />
            <ContentsWrapper>
                {selectedMenu === 2 ? (
                    <StudentManage onChangeStudentSelection={actionChangeStudentsSelection} />
                ) : selectedMenu === 1 ? (
                    <>
                        <div className="class-manage-root" style={{ width: '100%' }}>
                            <div>
                                <ClassCopyRoot>
                                    <CodeContainer>
                                        <ClassCopyTitle>????????? ?????? ??????</ClassCopyTitle>
                                        <ClassCopyInput readOnly type="text" defaultValue={codeState} ref={textCopy} />
                                    </CodeContainer>
                                    <Button variant="light" sizes="small" colors="purple" onClick={handleCopy}>
                                        ????????????
                                    </Button>
                                </ClassCopyRoot>

                                <DrawerGroupBox
                                    title="????????? ??????"
                                    description="????????? ?????? ??? ????????? ????????? ?????????"
                                    descriptionAdornment={BulbIcon}
                                >
                                    <ManageInputsContainer>
                                        <input
                                            style={{ backgroundColor: '#ffffff' }}
                                            className={classNames('default', inputError ? 'error' : '')}
                                            type="text"
                                            name="entry_new_name"
                                            id="entry_new_name"
                                            placeholder="????????? ??????"
                                            onChange={handleInputChange}
                                            value={inputState['entry_new_name']}
                                        />
                                        <textarea
                                            style={{ backgroundColor: '#ffffff' }}
                                            className="default"
                                            type="text"
                                            name="entry_new_description"
                                            id="entry_new_description"
                                            placeholder="????????? ?????? ??????"
                                            onChange={handleInputChange}
                                            value={inputState['entry_new_description']}
                                        />
                                    </ManageInputsContainer>
                                </DrawerGroupBox>

                                <DrawerGroupBox
                                    title="?????? ??????"
                                    description="????????? ????????? ????????? ?????? ??????????????????."
                                    descriptionAdornment={BulbIcon}
                                >
                                    <ManageInputsContainer>
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
                                    </ManageInputsContainer>
                                </DrawerGroupBox>
                            </div>
                        </div>
                    </>
                ) : selectedMenu === 0 ? (
                    <Leaderboard classNum={num} />
                ) : null}
            </ContentsWrapper>
            <InnerPageBottomActions hasActions={hasActions}>
                {selectedMenu === 2 ? (
                    <>
                        {Object.keys(toDeleteStudentData).filter((i) => toDeleteStudentData[i] === true).length ? (
                            <Button
                                sizes="medium"
                                colors="red"
                                variant="light"
                                leftIcon={<DeleteIcon fontSize="inherit" color="inherit" />}
                                onClick={actionDeleteStudents}
                            >
                                <Typography type="label" size="l" bold>
                                    ?????? ??????
                                </Typography>
                            </Button>
                        ) : null}
                    </>
                ) : selectedMenu === 1 ? (
                    <>
                        <Button
                            sizes="medium"
                            colors="red"
                            variant="light"
                            name="delete"
                            leftIcon={<DeleteIcon fontSize="inherit" color="inherit" />}
                            disabled={!createButtonEnabled}
                            onClick={handleButton}
                        >
                            <Typography type="label" size="l" bold>
                                ????????? ??????
                            </Typography>
                        </Button>
                        <Button
                            sizes="medium"
                            colors="purple"
                            variant="filled"
                            name="modify"
                            disabled={!createButtonEnabled}
                            onClick={handleButton}
                        >
                            ????????????
                        </Button>
                    </>
                ) : null}
            </InnerPageBottomActions>
        </ClassManagementRoot>
    );
}

export default withRouter(Manage);
