import React, { useState } from 'react';
import '../../styles/class_drawer.scss';
import ToggleSwitch from './ToggleSwitch';
import { useSelector, useDispatch } from 'react-redux';
import { postDraft, patchDraft } from '../../redux_modules/assignmentDraft';
import { withRouter } from 'react-router-dom';
import { Dialog } from '@material-ui/core';
import TOFELEditor from '../TOFELEditor/TOFELEditor';
import styled from 'styled-components';
import { SecondtoMinute } from './TimeChange';
import ClassDialog from '../essentials/ClassDialog';
import { changeDueDate } from '../../redux_modules/assignmentActived';

const StyleSelectdiv = styled.div`
    font-size: 0.85rem;
    text-decoration: underline;
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

//ver : draft(생성), modify(수정)
function ClassDrawer({ handleClose, cardData, ver, match, history }) {
    /** redux-state */
    const { data, loading, error } = useSelector((state) => state.assignmentDraft.draftDatas);
    const activedData = useSelector((state) => state.assignmentActived.activedData.data);
    const dispatch = useDispatch();

    let titleArr = [];
    data.filter((i) => i['idx'] !== cardData['idx']).map((i) => titleArr.push(i['title'].replace(/(\s*)/g, '')));

    /** 과제 생성 state */
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
    };
    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
    };

    //업로드 선택
    const handleSelectLeft = () => {
        setSelectSate('left');
    };
    const handleChangeFile = (e) => {
        if (!e.target.files[0]) {
            setSelectName('생성방법을 선택해주세요!');
            return;
        }
        const name = e.target.files[0].name;
        const value = e.target.files[0];
        const fileName = e.target.files[0].name;

        attachFiles.append(name, value, fileName);

        setSelectName(name);
    };

    //직접 제작 선택
    const handleSelectRight = () => {
        setSelectSate('right');

        handleEditDialogOpen();
    };
    const handleChangeContents = (metadata) => {
        if (metadata[0]['title']) {
            setSelectName(metadata[0]['title']);
        } else {
            setSelectName('에디터 타이틀을 입력해주세요.');
        }
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
    let mmm, sss, time_limit;
    if (ver === 'modify') {
        if (cardData['time_limit'] === -2) {
            mmm = '--';
            sss = '--';
            time_limit = false;
        } else {
            mmm = SecondtoMinute(cardData['time_limit'])[0];
            sss = SecondtoMinute(cardData['time_limit'])[1];
            time_limit = true;
        }
    }

    const [timeInputs, setTimeInputs] = useState({
        mm: ver === 'draft' ? '--' : mmm,
        ss: ver === 'draft' ? '--' : sss,
    });

    const { mm, ss } = timeInputs;

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
                mm: '',
                ss: '',
            });
        } else if (name === 'eyetrack' && checked === false) {
            setToggleState({ ...toggleState, [name]: checked });
        } else if (name === 'timeAttack' && checked === true) {
            setToggleState({ ...toggleState, [name]: checked });

            setTimeInputs({
                mm: '',
                ss: '',
            });
        } else if (name === 'timeAttack' && checked === false) {
            if (toggleState['eyetrack'] === false) {
                setToggleState({ ...toggleState, [name]: checked });

                setTimeInputs({
                    mm: '--',
                    ss: '--',
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
        const due_date = activedData['due_date'] ? activedData['due_date'] : null;

        if (name === 'button') {
            if (due_date) {
                //과제 게시하기 버튼 클릭
                const { num } = match.params; //클래스 번호
                const activedDirect = {
                    num: num,
                    due_date: due_date,
                    history: history,
                };

                setDateDialogopen(false);
                dispatch(postDraft(inputs, timeInputs, toggleState, selectState, attachFiles, contentsData, activedDirect));
            } else {
                alert('과제 기한 변경은 필수항목입니다.');
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
            if (timeInputs['mm'] === '' && timeInputs['ss'] === '') {
                return setInputsError({
                    ...inputsError,
                    time_error: '최소시간을 넘겨주세요!',
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

    if (loading) return <div style={{ width: '700px' }}>로딩 중!!!!</div>; // 로딩중이고 데이터 없을때만
    if (error) return <div>에러 발생!</div>;
    if (!data) return null;

    return (
        <>
            <Dialog fullScreen open={editDialogOpen} onClose={handleEditDialogClose}>
                <TOFELEditor
                    mode
                    datas={contentsData}
                    onChange={handleChangeContents}
                    onClose={handleEditDialogClose}
                    onEditFinish={handleEditFinished}
                />
            </Dialog>
            <ClassDialog type="date" subType="init" open={dateDialogopen} handleDialogClose={handleDateDialogClose} />

            <div className="class-drawer-root">
                <div style={{ width: '100%' }}>
                    {ver === 'draft' ? (
                        <h2 className="drawer-title">과제를 생성해보세요 :)</h2>
                    ) : (
                        <>
                            <h2 className="drawer-modify-title">과제 수정이 가능합니다!</h2>
                            <p className="drawer-modify-subTitle">
                                수정된 정보는 <b style={{ fontWeight: '600' }}>이미 공유된 과제</b>에 반영되지 않습니다. 수정된 정보의
                                반영을 원하시는 경우에는 다시 공유를 해주시길 바랍니다.
                            </p>
                        </>
                    )}
                    <div className="class-drawer-block">
                        <div className="drawer-subTitle">
                            {ver === 'draft' ? (
                                <>
                                    1. 과제의 선택적인 정보를 입력해주세요.
                                    {toggleState['eyetrack'] ? (
                                        <StyleSelectdiv>시선흐름 측정시, 제한시간은 필수사항입니다.</StyleSelectdiv>
                                    ) : (
                                        ''
                                    )}
                                </>
                            ) : (
                                <StyleSelectdiv>* 시선흐름 측정시, 제한시간은 필수사항입니다.</StyleSelectdiv>
                            )}
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
                                        type="text"
                                        name="mm"
                                        value={mm}
                                        readOnly={mm === '--' ? true : false}
                                        onChange={onTimeChange}
                                        placeholder="00"
                                    />
                                    <p>분</p>
                                    <input
                                        type="text"
                                        name="ss"
                                        value={ss}
                                        readOnly={ss === '--' ? true : false}
                                        onChange={onTimeChange}
                                        placeholder="00"
                                    />
                                    <p>초</p>
                                </div>

                                <ToggleSwitch
                                    name={'timeAttack'}
                                    toggle={toggleState['timeAttack']}
                                    handleToggleChange={handleChange}
                                    type={'drawer'}
                                />
                            </span>
                        </div>
                        <div className="drawer-error" style={{ textAlign: 'right', padding: '0 1.5rem 0 0' }}>
                            {time_error}
                        </div>
                    </div>
                    <div className="class-drawer-block">
                        {ver === 'draft' ? <p className="drawer-subTitle">2. 과제의 필수적인 정보를 입력해주세요.</p> : ''}
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
                    </div>
                    <div className="class-drawer-block">
                        <div className="drawer-subTitle">
                            {ver === 'draft' ? <> 3. 과제 생성 방법을 선택해주세요.</> : ''}
                            <StyleSelectdiv ver={ver} errorCheck={selectName}>
                                {selectName}
                            </StyleSelectdiv>
                        </div>
                        {ver === 'draft' ? (
                            <>
                                <div className="drawer-selects">
                                    <input id="file-click" type="file" onChange={handleChangeFile} />

                                    <label className="drawer-select" htmlFor="file-click" onClick={handleSelectLeft}>
                                        <svg width="48" height="32" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M38.7 12.08C37.34 5.18 31.28 0 24 0C18.22 0 13.2 3.28 10.7 8.08C4.68 8.72 0 13.82 0 20C0 26.62 5.38 32 12 32H38C43.52 32 48 27.52 48 22C48 16.72 43.9 12.44 38.7 12.08ZM28 18V26H20V18H14L24 8L34 18H28Z"
                                                fill="#969393"
                                            />
                                        </svg>
                                        <h4>과제 파일 업로드하기</h4>
                                        <p>hwp, word, pdf 파일을 올려주시면, 과제를 생성해드립니다.</p>
                                    </label>
                                    <label className="drawer-select" onClick={handleSelectRight}>
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

                                        <h4>직접 제작하기</h4>
                                        <p>과제를 바로 제작하고 싶으시다면, 자체 에디터를 통해 과제 생성이 가능합니다.</p>
                                    </label>
                                </div>
                                <div className="drawer-select-warn">
                                    ** 과제 파일 업로드의 경우, 과제 생성의 완료까지 최대 1일의 시간이 소요됩니다. <br />
                                    ** 여러 파일인 경우, 하나의 파일로 압축해주세요.
                                </div>
                            </>
                        ) : cardData['contents_data'] ? (
                            <>
                                <div className="drawer-selects">
                                    <div style={{ width: '100%' }} className="drawer-select" onClick={handleSelectRight}>
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
                            <button className="drawer-button" name="drawer-share" onClick={onDrawerErrorCheck}>
                                생성 및 게시하기
                            </button>
                            <button className="drawer-button" name="drawer-draft" onClick={onDrawerErrorCheck}>
                                생성하기
                            </button>
                        </>
                    ) : (
                        <button className="drawer-button" name="drawer-share" onClick={onDrawerErrorCheck}>
                            수정하기
                        </button>
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

export default React.memo(withRouter(ClassDrawer));
