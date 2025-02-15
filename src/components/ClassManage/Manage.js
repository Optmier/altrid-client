/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import '../../styles/manage_page.scss';
import classNames from 'classnames';
import * as $ from 'jquery';
import Axios from 'axios';
import * as configs from '../../configs/config.json';
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

    const fetchStudents = () => {
        Axios.get(`${configs.SERVER_HOST}/students-in-teacher/current`, { withCredentials: true })
            .then((res) => {
                // console.log('선생님의 학생들 : ', res.data);
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

        // 중복 체크하기
    }, [inputState]);

    useEffect(() => {
        Axios.get(`${configs.SERVER_HOST}/classes/class/${num}`, { withCredentials: true })
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

    /** 수강생 데이터 처리 */
    const handleStudentInClass = (name) => {
        //수정의 경우 : 학생 데이터 없는 경우-> delete만 진행 // 있는 경우 -> delete 후 post작업 진행
        //삭제의 경우 : 무조건 delete
        Axios.delete(`${configs.SERVER_HOST}/students-in-class/${num}`, { withCredentials: true })
            .then((res1) => {
                dispatch(openAlertSnackbar('삭제 되었습니다.', 'success'));
                history.replace('/');
            })
            .catch((err) => {
                console.error(err);
                dispatch(openAlertSnackbar('수강생 삭제에 실패했습니다.', 'error'));
            });
    };

    /** 클래스 데이터 삭제 */
    const handleClassDelete = (name) => {
        Axios.delete(`${configs.SERVER_HOST}/classes/${num}`, { withCredentials: true })
            .then((res) => {
                //class table - name, description 삭제 완료!
                handleStudentInClass(name); //수강생 데이터 처리...
            })
            .catch((err) => {
                console.error(err);
                dispatch(openAlertSnackbar('클래스 삭제에 실패했습니다.', 'error'));
            })
            .finally(() => {
                dispatch(closeAlertDialog());
            });
    };
    /** 수정, 삭제하기 버튼 */
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
                `${configs.SERVER_HOST}/classes/${num}`,
                {
                    name: inputState.entry_new_name,
                    description: inputState.entry_new_description,
                    class_day: daysArr.toString(),
                },
                { withCredentials: true },
            )
                .then((res) => {
                    //name, description 수정 완료!
                    dispatch(openAlertSnackbar('클래스 정보 수정이 완료되었습니다.', 'success'));
                })
                .catch((err) => {
                    console.error(err);
                    dispatch(openAlertSnackbar('클래스 정보 수정에 실패했습니다..', 'error'));
                });
        } else if (name === 'delete') {
            dispatch(
                openAlertDialog(
                    'warning',
                    '정말로 클래스를 삭제하시겠습니까?',
                    '삭제된 클래스는 복구가 불가능합니다.',
                    'no|yes',
                    '아니오|삭제하기',
                    'red|light',
                    'white|light',
                    'defaultClose',
                    handleClassDelete,
                ),
            );
        }
    };
    /**  수업 요일 버튼 */
    const handleDaysButtons = (e) => {
        const { name } = e.target;

        setButtonAble({
            ...buttonAble,
            [name]: !buttonAble[name],
        });
    };
    /**  복사하기 버튼 */
    const handleCopy = () => {
        if (clipboardState) return;
        textCopy.current.select();
        textCopy.current.setSelectionRange(0, 9999);
        document.execCommand('copy');

        setClipboardState(true);
        dispatch(openAlertSnackbar('클래스 코드가 복사되었습니다.', 'info'));
        setTimeout(function () {
            setClipboardState(false);
        }, 3000);
    };

    const menuDatas = [
        {
            mId: 0,
            mName: '리더보드',
        },
        {
            mId: 1,
            mName: '클래스 관리',
        },
        {
            mId: 2,
            mName: '학생 관리',
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
                '경고',
                `선택하신 학생${arr.length > 1 ? '들' : ''}을 삭제하시겠습니까?`,
                'no|yes',
                '아니오|예',
                'red|light',
                'white|light',
                'defaultClose',
                () => {
                    dispatch(closeAlertDialog());
                    Axios.delete(`${configs.SERVER_HOST}/students-in-class/students/${num}`, {
                        data: {
                            students: arr.join(','),
                        },
                        withCredentials: true,
                    })
                        .then((res) => {
                            dispatch(openAlertSnackbar('학생 삭제가 완료되었습니다.', 'success'));
                            history.go(0);
                        })
                        .catch((err) => {
                            console.error(err);
                            dispatch(openAlertSnackbar('학생 삭제에 실패했습니다.', 'error'));
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
                title="학생 및 클래스"
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
                                        <ClassCopyTitle>클래스 초대 코드</ClassCopyTitle>
                                        <ClassCopyInput readOnly type="text" defaultValue={codeState} ref={textCopy} />
                                    </CodeContainer>
                                    <Button variant="light" sizes="small" colors="purple" onClick={handleCopy}>
                                        복사하기
                                    </Button>
                                </ClassCopyRoot>

                                <DrawerGroupBox
                                    title="클래스 소개"
                                    description="클래스 이름 및 소개를 입력해 주세요"
                                    descriptionAdornment={BulbIcon}
                                >
                                    <ManageInputsContainer>
                                        <input
                                            style={{ backgroundColor: '#ffffff' }}
                                            className={classNames('default', inputError ? 'error' : '')}
                                            type="text"
                                            name="entry_new_name"
                                            id="entry_new_name"
                                            placeholder="클래스 이름"
                                            onChange={handleInputChange}
                                            value={inputState['entry_new_name']}
                                        />
                                        <textarea
                                            style={{ backgroundColor: '#ffffff' }}
                                            className="default"
                                            type="text"
                                            name="entry_new_description"
                                            id="entry_new_description"
                                            placeholder="클래스 한줄 설명"
                                            onChange={handleInputChange}
                                            value={inputState['entry_new_description']}
                                        />
                                    </ManageInputsContainer>
                                </DrawerGroupBox>

                                <DrawerGroupBox
                                    title="수업 요일"
                                    description="수업을 하시는 요일을 모두 선택해주세요."
                                    descriptionAdornment={BulbIcon}
                                >
                                    <ManageInputsContainer>
                                        <div className="form-buttons">
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
                                    선택 삭제
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
                                클래스 삭제
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
                            수정하기
                        </Button>
                    </>
                ) : null}
            </InnerPageBottomActions>
        </ClassManagementRoot>
    );
}

export default withRouter(Manage);
