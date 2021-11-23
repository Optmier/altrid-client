import React, { useState, useRef, useCallback } from 'react';
import '../../styles/class_drawer.scss';
import ToggleSwitch from './ToggleSwitch';
import { useSelector, useDispatch } from 'react-redux';
import { postDraft, patchDraft } from '../../redux_modules/assignmentDraft';
import { withRouter } from 'react-router-dom';
import { Dialog, withStyles } from '@material-ui/core';
import TOFELEditor from '../TOFELEditor/TOFELEditor';
import styled, { css } from 'styled-components';
import { SecondsToHoursAndMinutes } from './TimeChange';
import ClassDialog from '../essentials/ClassDialog';
import { changeDueDate } from '../../redux_modules/assignmentActived';
// import BackdropComponent from './BackdropComponent';
import CloseIcon from '@material-ui/icons/Close';
import RestrictWrapper from './RestrictWrapper';
import DrawerGroupBox from '../../AltridUI/Drawer/DrawerGroupBox';
import BulbIcon from '../../AltridUI/Icons/drawer-groupbox-icon-bulb.svg';
import RestricRoute_1 from './RestricRoute_1';
import DrawerActions from '../../AltridUI/Drawer/DrawerActions';
import Button from '../../AltridUI/Button/Button';

const StyleLabel = styled.label`
    ${(props) =>
        props.clicked === 'left'
            ? css`
                  background-color: #fff !important;
                  box-sizing: border-box;
                  border: 2px solid #3b1689; ;
              `
            : ''}
`;
const StyleLabel2 = styled.label`
    ${(props) =>
        props.clicked === 'right'
            ? css`
                  background-color: #fff !important;
                  box-sizing: border-box;
                  border: 2px solid #3b1689; ;
              `
            : ''}
`;
const StyleSelectdiv = styled.div`
    font-size: 0.75rem;
    font-weight: 400;
    color: ${(props) => (props.errorCheck === '생성방법을 선택해주세요!' ? 'red' : 'black')};

    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1; /* 라인수 */
    -webkit-box-orient: vertical;
    word-wrap: break-word;
    line-height: 1.5rem;
`;

const CreateButton = withStyles((theme) => ({
    root: {
        borderRadius: '10px',
        backgroundColor: '#a6a6a6',
        color: '#fff',
        fontFamily: 'inherit',
        fontSize: '0.9rem',
        width: '150px',
        height: '56px',
        '&.primary': {
            backgroundColor: '#13e2a1',
        },
        '& > span': {
            pointerEvents: 'none',
        },
    },
}))(Button);

//ver : draft(생성), modify(수정)
function ClassDrawer({ handleClose, cardData, ver, match, history }) {
    /** redux-state */
    const { data, loading, error } = useSelector((state) => state.assignmentDraft.draftDatas);
    const activedData = useSelector((state) => state.assignmentActived.dueData.data);
    const { fileCreation } = useSelector((state) => state.planInfo.restricted);

    const dispatch = useDispatch();

    let titleArr = [];
    data.filter((i) => i['idx'] !== cardData['idx']).map((i) => titleArr.push(i['title'].replace(/(\s*)/g, '')));

    /** 과제 생성 state */
    const [direct, setdirect] = useState(false);
    const [upload, setupload] = useState(false);
    const [selectClassState, setSelectClassState] = useState(null);
    const [attachFiles, setAttachFiles] = useState(new FormData());
    const [contentsData, setContentsData] = useState(
        ver === 'draft'
            ? [
                  {
                      title: '',
                      passageForRender: '',
                      passageForEditor: `{"ops":[{"insert":"\n"}]}`,
                      problemDatas: [],
                  },
              ]
            : cardData['contents_data'],
    );
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectState, setSelectSate] = useState(ver === 'draft' ? '' : 'right');
    const [selectName, setSelectName] = useState(
        ver === 'draft'
            ? ''
            : !cardData['contents_data']
            ? '과제 파일 변환중'
            : cardData['contents_data'][0]['title'] === ''
            ? '파일 제목 없음'
            : cardData['contents_data'][0]['title'],
    );

    const handleEditDialogOpen = () => {
        setEditDialogOpen(true);
        setdirect(true);
    };
    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
    };

    //업로드 선택
    const filesInput = useRef();
    const handleChangeFile = (e) => {
        if (!e.target.files[0]) return;

        attachFiles.delete(selectName);

        const name = e.target.files[0].name;
        const value = e.target.files[0];
        const fileName = e.target.files[0].name;

        attachFiles.append(name, value, fileName);
        setSelectName(name);
        setSelectSate('left');
    };

    //직접 제작 선택
    const handleChangeContents = (metadata) => {
        if (ver === 'draft' && filesInput.current.files.length) {
            filesInput.current.value = '';
        }

        //에디터 메타데이터로 최신화
        if (metadata[0]['title']) {
            setSelectName(metadata[0]['title']);
        } else {
            setSelectName('에디터 타이틀을 입력해주세요.');
        }
        setSelectSate('right');
    };

    const handleEditFinished = (metadata) => {
        setContentsData(metadata);
    };

    /** 여러개 input 상태 관리 */
    //1. text-input
    const [inputs, setInputs] = useState({
        title: ver === 'draft' ? '' : cardData['title'],
        description: ver === 'draft' ? '' : cardData['description'],
    });
    const [inputsError, setInputsError] = useState({
        title_error: '',
        description_error: '',
        time_error: '',
    });

    const { title, description } = inputs;
    const { title_error, description_error, time_error } = inputsError;

    const onInputChange = (e) => {
        const { value, name } = e.target;
        setInputs({
            ...inputs,
            [name]: value,
        });
    };

    const onInputOut = (e) => {
        // 중복 체크
        const { name } = e.target;

        if (name === 'title') {
            titleArr.includes(title)
                ? setInputsError({
                      ...inputsError,
                      title_error: '과제 제목이 중복되었습니다 :(',
                  })
                : setInputsError({
                      ...inputsError,
                      title_error: '',
                  });
        } else if (name === 'description') {
            setInputsError({
                ...inputsError,
                description_error: '',
            });
        }
    };

    //2. time-input
    let hhh, mmm, time_limit;
    if (ver === 'modify') {
        if (cardData['time_limit'] === -2) {
            hhh = '--';
            mmm = '--';
            time_limit = false;
        } else {
            hhh = SecondsToHoursAndMinutes(cardData['time_limit'])[0];
            mmm = SecondsToHoursAndMinutes(cardData['time_limit'])[1];
            time_limit = true;
        }
    }

    const [timeInputs, setTimeInputs] = useState({
        hh: ver === 'draft' ? '--' : hhh,
        mm: ver === 'draft' ? '--' : mmm,
    });

    const { hh, mm } = timeInputs;

    const onTimeChange = (e) => {
        setInputsError({
            ...inputsError,
            time_error: '',
        });

        const { value, name } = e.target;
        if (value.length > '2') {
            return 0;
        }

        setTimeInputs({
            ...timeInputs,
            [name]: value,
        });
    };

    /** toggle-state 상태 관리 */
    const [toggleState, setToggleState] = useState({
        eyetrack: ver === 'draft' ? false : cardData['eyetrack'],
        timeAttack: ver === 'draft' ? false : time_limit,
    });

    const handleChange = (event) => {
        const { checked, name } = event.target;

        //eyetrack의 경우 켜지면 둘다 on, 꺼지면 eyetrack만 off
        if (name === 'eyetrack' && checked === true) {
            setToggleState({ ...toggleState, eyetrack: true, timeAttack: true });
            setTimeInputs({
                hh: '',
                mm: '',
            });
        } else if (name === 'eyetrack' && checked === false) {
            setToggleState({ ...toggleState, [name]: checked });
        } else if (name === 'timeAttack' && checked === true) {
            setToggleState({ ...toggleState, [name]: checked });

            setTimeInputs({
                hh: '',
                mm: '',
            });
        } else if (name === 'timeAttack' && checked === false) {
            if (toggleState['eyetrack'] === false) {
                setToggleState({ ...toggleState, [name]: checked });

                setTimeInputs({
                    hh: '--',
                    mm: '--',
                });

                setInputsError({
                    ...inputsError,
                    time_error: '',
                });
            }
        }
    };

    /** class-dialog 메소드 */
    // type 4가지 : date-init(과제 게시), date-modify(과제 기한 수정), test-init(과제 완료), test-modify(과제 재시작)
    const [dateDialogopen, setDateDialogopen] = useState(false);
    const handleDialogOpen = (type) => {
        setDateDialogopen(true);
    };
    const handleDateDialogClose = (e) => {
        const { name } = e.target;
        const due_date = activedData ? activedData : null;

        if (name === 'button') {
            if (due_date) {
                //과제 게시하기 버튼 클릭
                const activedDirect = {
                    num: selectClassState,
                    due_date: due_date,
                };

                setDateDialogopen(false);
                dispatch(postDraft(inputs, timeInputs, toggleState, selectState, attachFiles, contentsData, activedDirect));
            } else if (!due_date) {
                alert('과제 기한 변경은 필수사항 입니다.');
            } else if (!selectClassState) {
                alert('클래스 선택은 필수사항 입니다.');
            }
        } else {
            setDateDialogopen(false);
        }

        dispatch(changeDueDate(''));
    };

    /** 최종적으로 drawer input들 error 체크 */
    const onDrawerErrorCheck = (e) => {
        const { name } = e.target;

        //1. 제한시간 설정
        if (toggleState['timeAttack'] === true) {
            if ((timeInputs['hh'] === '' && timeInputs['mm'] === '') || (timeInputs['hh'] <= 0 && timeInputs['mm'] <= 0)) {
                return setInputsError({
                    ...inputsError,
                    time_error: '제한시간을 입력해주세요!',
                });
            }
            if (isNaN(timeInputs['hh']) || isNaN(timeInputs['mm'])) {
                return setInputsError({
                    ...inputsError,
                    time_error: '올바른 값을 입력해주세요!',
                });
            }
        }

        //2. title, description 빈칸 아님 체크
        if (title.replace(/(\s*)/g, '') === '') {
            return setInputsError({
                ...inputsError,
                title_error: '빈칸을 채워주세요!',
            });
        }
        if (description.replace(/(\s*)/g, '') === '') {
            return setInputsError({
                ...inputsError,
                description_error: '빈칸을 채워주세요!',
            });
        }

        //3. title 중복 체크
        if (title_error !== '') {
            return console.log('아직 오류 중..');
        }

        //4. 생성방법 선택
        if (selectState === '') {
            setSelectName('생성방법을 선택해주세요!');
            return;
        }

        //5. axios 작업
        if (ver === 'draft') {
            if (name === 'drawer-draft') {
                dispatch(postDraft(inputs, timeInputs, toggleState, selectState, attachFiles, contentsData));

                handleClose(e);
            } else if (name === 'drawer-share') {
                if (selectState === 'right') {
                    handleDialogOpen();
                } else {
                    alert('파일 업로드시, 과제 생성 기간이 필요하므로 바로 게시할 수 없습니다 :(');
                }
            }
        } else if (ver === 'modify') {
            dispatch(patchDraft(cardData, inputs, timeInputs, toggleState, contentsData));
            handleClose(e);
        }
    };

    return (
        <>
            <Dialog disableEscapeKeyDown fullScreen open={editDialogOpen} onClose={handleEditDialogClose}>
                <div style={{ height: 'calc(100% - 142px)' }}>
                    <TOFELEditor
                        mode
                        datas={contentsData}
                        onChange={handleChangeContents}
                        onClose={handleEditDialogClose}
                        onEditFinish={handleEditFinished}
                    />
                </div>
            </Dialog>
            <ClassDialog
                type="date"
                subType="init"
                open={dateDialogopen}
                handleDialogClose={handleDateDialogClose}
                setSelectClassState={setSelectClassState}
                eyetrackAssigmnet={toggleState['eyetrack']}
            />

            <div className="class-drawer-root">
                <div className="close-icon" onClick={handleClose}>
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="48" rx="16" fill="#F6F8F9" />
                        <path
                            d="M24.0002 22.5857L28.9502 17.6357L30.3642 19.0497L25.4142 23.9997L30.3642 28.9497L28.9502 30.3637L24.0002 25.4137L19.0502 30.3637L17.6362 28.9497L22.5862 23.9997L17.6362 19.0497L19.0502 17.6357L24.0002 22.5857Z"
                            fill="#77818B"
                        />
                    </svg>
                </div>
                <div style={{ width: '100%' }}>
                    {ver === 'draft' ? (
                        <h2 className="drawer-title">과제를 생성해보세요 :)</h2>
                    ) : (
                        <>
                            <h2 className="drawer-modify-title">과제 수정이 가능합니다!</h2>
                            <p className="drawer-modify-subTitle">
                                수정된 정보는 <b style={{ fontWeight: '600' }}>이미 게시된 과제</b>에 반영되지 않습니다. 수정된 정보의
                                반영을 원하시는 경우에는 다시 게시를 해주시길 바랍니다.
                            </p>
                        </>
                    )}
                    <div className="class-drawer-block">
                        {ver === 'draft' ? (
                            <>
                                <DrawerGroupBox
                                    title="과제 필수 정보 "
                                    description="과제 소개를 입력해주세요"
                                    descriptionAdornment={BulbIcon}
                                >
                                    <div className="drawer-inputs">
                                        <div className="drawer-input">
                                            <input
                                                name="title"
                                                value={title}
                                                className="input-name"
                                                placeholder="과제 이름"
                                                onChange={onInputChange}
                                                onBlur={onInputOut}
                                            ></input>
                                            <div className="drawer-error">{title_error}</div>
                                        </div>
                                        <div className="drawer-input">
                                            <input
                                                name="description"
                                                value={description}
                                                className="input-desc"
                                                placeholder="과제 한 줄 설명"
                                                onChange={onInputChange}
                                                onBlur={onInputOut}
                                            ></input>
                                            <div className="drawer-error">{description_error}</div>
                                        </div>
                                    </div>{' '}
                                </DrawerGroupBox>
                            </>
                        ) : (
                            <div className="drawer-error" style={{ width: '100%', textAlign: 'right' }}>
                                {time_error}
                            </div>
                        )}

                        <div className="class-drawer-block">
                            {ver === 'draft' ? (
                                <>
                                    <DrawerGroupBox
                                        title="과제 설정 "
                                        description="시선흐름 측정시 제한시간은 필수사항입니다."
                                        descriptionAdornment={BulbIcon}
                                    >
                                        <div className="drawer-toggle">
                                            <span>
                                                <p>시선흐름 측정</p>
                                                <ToggleSwitch
                                                    name={'eyetrack'}
                                                    toggle={toggleState['eyetrack']}
                                                    handleToggleChange={handleChange}
                                                    type={'drawer'}
                                                />
                                            </span>
                                            <span>
                                                <p>제한시간 설정</p>

                                                <div className="time-inputs">
                                                    <input
                                                        style={{ backgroundColor: '#F6F8F9' }}
                                                        type="number"
                                                        name="hh"
                                                        value={hh}
                                                        readOnly={hh === '--' ? true : false}
                                                        onChange={onTimeChange}
                                                        placeholder="00"
                                                    />
                                                    <p>시간</p>
                                                    <input
                                                        style={{ backgroundColor: '#F6F8F9' }}
                                                        type="number"
                                                        name="mm"
                                                        value={mm}
                                                        readOnly={mm === '--' ? true : false}
                                                        onChange={onTimeChange}
                                                        placeholder="00"
                                                    />
                                                    <p>분</p>
                                                </div>

                                                <ToggleSwitch
                                                    name={'timeAttack'}
                                                    toggle={toggleState['timeAttack']}
                                                    handleToggleChange={handleChange}
                                                    type={'drawer'}
                                                />
                                            </span>
                                        </div>
                                        <div className="drawer-select-warn">** 시선흐름 측정시, 제한시간은 필수사항입니다.</div>
                                        <div className="drawer-select-warn">
                                            ** 제한시간이 포함된 과제는 단 1번의 풀이 기회가 제공됩니다.{' '}
                                        </div>
                                    </DrawerGroupBox>
                                </>
                            ) : (
                                ''
                            )}
                            {ver === 'draft' ? null : (
                                <>
                                    <div className="drawer-inputs">
                                        <div className="drawer-input">
                                            <input
                                                name="title"
                                                value={title}
                                                className="input-name"
                                                placeholder="과제 이름"
                                                onChange={onInputChange}
                                                onBlur={onInputOut}
                                            ></input>
                                            <div className="drawer-error">{title_error}</div>
                                        </div>
                                        <div className="drawer-input">
                                            <input
                                                name="description"
                                                value={description}
                                                className="input-desc"
                                                placeholder="과제 한 줄 설명"
                                                onChange={onInputChange}
                                                onBlur={onInputOut}
                                            ></input>
                                            <div className="drawer-error">{description_error}</div>
                                        </div>
                                    </div>

                                    <div className="drawer-toggle">
                                        <span>
                                            <p>시선흐름 측정</p>
                                            <ToggleSwitch
                                                name={'eyetrack'}
                                                toggle={toggleState['eyetrack']}
                                                handleToggleChange={handleChange}
                                                type={'drawer'}
                                            />
                                        </span>
                                        <span>
                                            <p>제한시간 설정</p>

                                            <div className="time-inputs">
                                                <input
                                                    style={{ backgroundColor: '#F6F8F9' }}
                                                    type="number"
                                                    name="hh"
                                                    value={hh}
                                                    readOnly={hh === '--' ? true : false}
                                                    onChange={onTimeChange}
                                                    placeholder="00"
                                                />
                                                <p>시간</p>
                                                <input
                                                    style={{ backgroundColor: '#F6F8F9' }}
                                                    type="number"
                                                    name="mm"
                                                    value={mm}
                                                    readOnly={mm === '--' ? true : false}
                                                    onChange={onTimeChange}
                                                    placeholder="00"
                                                />
                                                <p>분</p>
                                            </div>

                                            <ToggleSwitch
                                                name={'timeAttack'}
                                                toggle={toggleState['timeAttack']}
                                                handleToggleChange={handleChange}
                                                type={'drawer'}
                                            />
                                        </span>
                                    </div>

                                    <div className="drawer-select-warn">** 시선흐름 측정시, 제한시간은 필수사항입니다.</div>
                                    <div className="drawer-select-warn">** 제한시간이 포함된 과제는 단 1번의 풀이 기회가 제공됩니다. </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="class-drawer-block">
                        {ver === 'draft' ? (
                            <>
                                <DrawerGroupBox
                                    title="과제 생성 방법"
                                    description="파일 업로드의 경우 과제 생성의 완료까지 최대 1일의 시간이 소요됩니다."
                                    descriptionAdornment={BulbIcon}
                                >
                                    <div className="drawer-selects">
                                        <input
                                            ref={filesInput}
                                            id={fileCreation ? null : 'file-click'}
                                            type="file"
                                            accept=".hwp,.pdf,.docx"
                                            onChange={handleChangeFile}
                                        />

                                        <StyleLabel
                                            // clicked={selectState}
                                            className={fileCreation ? 'disabled' : 'prepare'}
                                            // className={fileCreation ? 'disabled' : 'disabled'}
                                            // htmlFor={fileCreation ? null : 'file-click'}
                                        >
                                            <>
                                                <RestricRoute_1
                                                    // onClick={() => {
                                                    //     setupload(true);
                                                    // }}
                                                    type="default"
                                                    restricted={fileCreation}
                                                >
                                                    {upload ? (
                                                        <>
                                                            {/* <svg
                                                                width="15"
                                                                height="14"
                                                                viewBox="0 0 15 14"
                                                                fill="black"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    d="M7.50016 13.6663C3.81816 13.6663 0.833496 10.6817 0.833496 6.99967C0.833496 3.31767 3.81816 0.333008 7.50016 0.333008C11.1822 0.333008 14.1668 3.31767 14.1668 6.99967C14.1668 10.6817 11.1822 13.6663 7.50016 13.6663ZM6.8355 9.66634L11.5488 4.95234L10.6062 4.00967L6.8355 7.78101L4.9495 5.89501L4.00683 6.83767L6.8355 9.66634Z"
                                                                    fill="#3B1689"
                                                                />
                                                            </svg> */}
                                                            <h4>과제 파일 업로드하기</h4>
                                                            <p>hwp, word, pdf 파일을 올려주시면, 과제를 생성해드립니다.</p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {/* <svg
                                                                width="15"
                                                                height="14"
                                                                viewBox="0 0 15 14"
                                                                fill="black"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    d="M7.50016 13.6663C3.81816 13.6663 0.833496 10.6817 0.833496 6.99967C0.833496 3.31767 3.81816 0.333008 7.50016 0.333008C11.1822 0.333008 14.1668 3.31767 14.1668 6.99967C14.1668 10.6817 11.1822 13.6663 7.50016 13.6663ZM7.50016 12.333C8.91465 12.333 10.2712 11.7711 11.2714 10.7709C12.2716 9.77072 12.8335 8.41416 12.8335 6.99967C12.8335 5.58519 12.2716 4.22863 11.2714 3.22844C10.2712 2.22824 8.91465 1.66634 7.50016 1.66634C6.08567 1.66634 4.72912 2.22824 3.72893 3.22844C2.72873 4.22863 2.16683 5.58519 2.16683 6.99967C2.16683 8.41416 2.72873 9.77072 3.72893 10.7709C4.72912 11.7711 6.08567 12.333 7.50016 12.333V12.333Z"
                                                                    fill="#3B1689"
                                                                />
                                                            </svg> */}
                                                            <h4>과제 파일 업로드하기</h4>
                                                            <p>hwp, word, pdf 파일을 올려주시면, 과제를 생성해드립니다.</p>
                                                        </>
                                                    )}
                                                </RestricRoute_1>
                                            </>
                                        </StyleLabel>

                                        <>
                                            <StyleLabel2 clicked={selectState} className="drawer-select" onClick={handleEditDialogOpen}>
                                                {direct ? (
                                                    <>
                                                        <svg
                                                            width="15"
                                                            height="14"
                                                            viewBox="0 0 15 14"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M7.50016 13.6663C3.81816 13.6663 0.833496 10.6817 0.833496 6.99967C0.833496 3.31767 3.81816 0.333008 7.50016 0.333008C11.1822 0.333008 14.1668 3.31767 14.1668 6.99967C14.1668 10.6817 11.1822 13.6663 7.50016 13.6663ZM6.8355 9.66634L11.5488 4.95234L10.6062 4.00967L6.8355 7.78101L4.9495 5.89501L4.00683 6.83767L6.8355 9.66634Z"
                                                                fill="#3B1689"
                                                            />
                                                        </svg>
                                                        <h4>직접 제작하기</h4>
                                                        <p>과제를 바로 제작하고 싶으시다면, 자체 에디터를 통해 과제 생성이 가능합니다.</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg
                                                            width="15"
                                                            height="14"
                                                            viewBox="0 0 15 14"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M7.50016 13.6663C3.81816 13.6663 0.833496 10.6817 0.833496 6.99967C0.833496 3.31767 3.81816 0.333008 7.50016 0.333008C11.1822 0.333008 14.1668 3.31767 14.1668 6.99967C14.1668 10.6817 11.1822 13.6663 7.50016 13.6663ZM7.50016 12.333C8.91465 12.333 10.2712 11.7711 11.2714 10.7709C12.2716 9.77072 12.8335 8.41416 12.8335 6.99967C12.8335 5.58519 12.2716 4.22863 11.2714 3.22844C10.2712 2.22824 8.91465 1.66634 7.50016 1.66634C6.08567 1.66634 4.72912 2.22824 3.72893 3.22844C2.72873 4.22863 2.16683 5.58519 2.16683 6.99967C2.16683 8.41416 2.72873 9.77072 3.72893 10.7709C4.72912 11.7711 6.08567 12.333 7.50016 12.333V12.333Z"
                                                                fill="#3B1689"
                                                            />
                                                        </svg>

                                                        <h4>직접 제작하기</h4>
                                                        <p>과제를 바로 제작하고 싶으시다면, 자체 에디터를 통해 과제 생성이 가능합니다.</p>
                                                    </>
                                                )}
                                            </StyleLabel2>
                                        </>
                                    </div>
                                    <div className="drawer-select-warn">
                                        ** 과제 파일 업로드의 경우, 과제 생성의 완료까지 최대 1일의 시간이 소요됩니다. <br />
                                        ** 여러 파일인 경우, 하나의 파일로 압축해주세요.
                                    </div>
                                </DrawerGroupBox>
                            </>
                        ) : (
                            ''
                        )}
                        {/* <StyleSelectdiv ver={ver} errorCheck={selectName}>
                            {selectName}
                        </StyleSelectdiv> */}

                        {ver === 'draft' ? null : cardData['contents_data'] ? (
                            <>
                                <div className="drawer-selects">
                                    <div style={{ width: '100%' }} className="drawer-select" onClick={handleEditDialogOpen}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clipPath="url(#clip0)">
                                                <path
                                                    d="M17.75 7.00006L14 3.25006L4 13.2501V17.0001H7.75L17.75 7.00006ZM20.71 4.04006C21.1 3.65006 21.1 3.02006 20.71 2.63006L18.37 0.290059C17.98 -0.0999414 17.35 -0.0999414 16.96 0.290059L15 2.25006L18.75 6.00006L20.71 4.04006Z"
                                                    fill="#969393"
                                                />
                                                <path d="M0 20H24V24H0V20Z" fill="black" fillOpacity="0.36" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0">
                                                    <rect width="24" height="24" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>

                                        <h4>에디터에서 과제 수정하기</h4>
                                        <p>제작된 과제를 에디터에서 바로 수정 가능합니다.</p>
                                    </div>
                                </div>
                                <div className="drawer-select-warn">
                                    ** 업로드된 파일은 에디터에서 수정이 가능합니다. <br /> ** 다른 파일에 대한 업로드를 원한다면, 새로운
                                    과제를 생성해주세요.
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="drawer-selects">
                                    <div style={{ width: '100%', pointerEvents: 'none' }} className="drawer-select">
                                        <h3 style={{ color: '#969393' }}>과제 제작 중...</h3>
                                    </div>
                                </div>
                                <div className="drawer-select-warn">
                                    ** 파일 업로드시, 과제 제작이 완료 된 후, 에디터에서 수정이 가능합니다.
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="drawer-footer">
                    {ver === 'draft' ? (
                        <>
                            <DrawerActions>
                                <Button variant="filled" colors="purple" onClick={onDrawerErrorCheck}>
                                    생성하기
                                </Button>
                            </DrawerActions>
                        </>
                    ) : (
                        <CreateButton
                            className="drawer-button primary"
                            name="drawer-share"
                            variant="contained"
                            onClick={onDrawerErrorCheck}
                        >
                            수정하기
                        </CreateButton>
                    )}
                </div>
            </div>
        </>
    );
}

ClassDrawer.defaultProps = {
    cardData: {
        idx: '',
        academy_code: '',
        teacher_id: '',
        title: '',
        description: '',
        time_limit: '',
        eyetrack: '',
        contents_data: '',
        file_url: '',
        created: '',
        updated: '',
    },
};

export default withRouter(React.memo(ClassDrawer));
