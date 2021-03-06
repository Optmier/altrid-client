/* eslint-disable react/jsx-pascal-case */
import React, { useState, useRef } from 'react';
import '../../styles/class_drawer.scss';
import ToggleSwitch from './ToggleSwitch';
import { useSelector, useDispatch } from 'react-redux';
import { postDraft, patchDraft } from '../../redux_modules/assignmentDraft';
import { withRouter } from 'react-router-dom';
import { Dialog } from '@material-ui/core';
import TOFELEditor from '../TOFELEditor/TOFELEditor';
import styled, { css } from 'styled-components';
import { SecondsToHoursAndMinutes } from './TimeChange';
import ClassDialog from '../essentials/ClassDialog';
import { changeDueDate } from '../../redux_modules/assignmentActived';
// import BackdropComponent from './BackdropComponent';
import DrawerGroupBox from '../../AltridUI/Drawer/DrawerGroupBox';
import BulbIcon from '../../AltridUI/Icons/drawer-groupbox-icon-bulb.svg';
import RestricRoute_1 from './RestricRoute_1';
import DrawerActions from '../../AltridUI/Drawer/DrawerActions';
import Button from '../../AltridUI/Button/Button';
import { openAlertSnackbar } from '../../redux_modules/alertMaker';

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
const CategorySelect = styled.select`
    cursor: pointer;
    background: url(/bg_images/Vector.png) no-repeat 92% 50%;
    background-color: #f6f7f9;
    width: 100%;
    min-height: 40px;
    padding: 1.2rem 1.3rem;
    font-family: inherit;
    font-size: 0.8rem;
    border: none;
    /* border: 1px solid rgba(112, 112, 112, 0.79); */
    border-radius: 10px;
    color: #000;
    font-weight: 500;
    -webkit-appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    outline: none;
    margin-bottom: 16px;

    &.small {
        width: 120px;
    }

    &.tiny {
        width: 90px;
        height: 32px;
        min-height: initial;
    }
`;

//ver : draft(??????), modify(??????)
function ClassDrawer({ handleClose, cardData, ver, match, history }) {
    /** redux-state */
    const { data } = useSelector((state) => state.assignmentDraft.draftDatas);
    const activedData = useSelector((state) => state.assignmentActived.dueData.data);
    const { fileCreation } = useSelector((state) => state.planInfo.restricted);

    const dispatch = useDispatch();

    let titleArr = [];
    data.filter((i) => i['idx'] !== cardData['idx']).map((i) => titleArr.push(i['title'].replace(/(\s*)/g, '')));

    /** ?????? ?????? state */
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
            ? '?????? ?????? ?????????'
            : cardData['contents_data'][0]['title'] === ''
            ? '?????? ?????? ??????'
            : cardData['contents_data'][0]['title'],
    );

    const handleEditDialogOpen = () => {
        setEditDialogOpen(true);
        setdirect(true);
    };
    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
    };

    //????????? ??????
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

    //?????? ?????? ??????
    const handleChangeContents = (metadata) => {
        if (ver === 'draft' && filesInput.current.files.length) {
            filesInput.current.value = '';
        }

        //????????? ?????????????????? ?????????
        if (metadata[0]['title']) {
            setSelectName(metadata[0]['title']);
        } else {
            setSelectName('????????? ???????????? ??????????????????.');
        }
        setSelectSate('right');
    };

    const handleEditFinished = (metadata) => {
        setContentsData(metadata);
    };

    /** ????????? input ?????? ?????? */
    //1. text-input
    const [inputs, setInputs] = useState({
        title: ver === 'draft' ? '' : cardData['title'],
        description: ver === 'draft' ? '' : cardData['description'],
    });
    const [selectedSubject, setSelectedSubject] = useState(ver === 'draft' ? 0 : cardData['subject']);
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
        // ?????? ??????
        const { name } = e.target;

        if (name === 'title') {
            titleArr.includes(title)
                ? setInputsError({
                      ...inputsError,
                      title_error: '?????? ????????? ????????????????????? :(',
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

    /** toggle-state ?????? ?????? */
    const [toggleState, setToggleState] = useState({
        eyetrack: ver === 'draft' ? false : cardData['eyetrack'],
        timeAttack: ver === 'draft' ? false : time_limit,
    });

    const handleChange = (event) => {
        const { checked, name } = event.target;

        //eyetrack??? ?????? ????????? ?????? on, ????????? eyetrack??? off
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

    /** class-dialog ????????? */
    // type 4?????? : date-init(?????? ??????), date-modify(?????? ?????? ??????), test-init(?????? ??????), test-modify(?????? ?????????)
    const [dateDialogopen, setDateDialogopen] = useState(false);
    const handleDialogOpen = (type) => {
        setDateDialogopen(true);
    };
    const handleDateDialogClose = (e) => {
        const { name } = e.target;
        const due_date = activedData ? activedData : null;

        if (name === 'button') {
            if (due_date) {
                //?????? ???????????? ?????? ??????
                const activedDirect = {
                    num: selectClassState,
                    due_date: due_date,
                };

                setDateDialogopen(false);
                dispatch(
                    postDraft(inputs, timeInputs, toggleState, selectState, attachFiles, contentsData, activedDirect, selectedSubject),
                );
            } else if (!due_date) {
                dispatch(openAlertSnackbar('?????? ?????? ????????? ???????????? ?????????.', 'warning'));
            } else if (!selectClassState) {
                dispatch(openAlertSnackbar('????????? ????????? ???????????? ?????????.'));
            }
        } else {
            setDateDialogopen(false);
        }

        dispatch(changeDueDate(''));
    };

    /** ??????????????? drawer input??? error ?????? */
    const onDrawerErrorCheck = (e) => {
        const { name } = e.target;

        //1. ???????????? ??????
        if (toggleState['timeAttack'] === true) {
            if ((timeInputs['hh'] === '' && timeInputs['mm'] === '') || (timeInputs['hh'] <= 0 && timeInputs['mm'] <= 0)) {
                return setInputsError({
                    ...inputsError,
                    time_error: '??????????????? ??????????????????!',
                });
            }
            if (isNaN(timeInputs['hh']) || isNaN(timeInputs['mm'])) {
                return setInputsError({
                    ...inputsError,
                    time_error: '????????? ?????? ??????????????????!',
                });
            }
        }

        //2. title, description ?????? ?????? ??????
        if (title.replace(/(\s*)/g, '') === '') {
            return setInputsError({
                ...inputsError,
                title_error: '????????? ???????????????!',
            });
        }
        if (description.replace(/(\s*)/g, '') === '') {
            return setInputsError({
                ...inputsError,
                description_error: '????????? ???????????????!',
            });
        }

        //3. title ?????? ??????
        if (title_error !== '') {
            return console.log('?????? ?????? ???..');
        }

        //4. ???????????? ??????
        if (selectState === '') {
            setSelectName('??????????????? ??????????????????!');
            return;
        }

        //5. axios ??????
        if (ver === 'draft') {
            if (name === 'drawer-draft') {
                dispatch(postDraft(inputs, timeInputs, toggleState, selectState, attachFiles, contentsData, null, selectedSubject));
                handleClose(e);
            } else if (name === 'drawer-share') {
                if (selectState === 'right') {
                    handleDialogOpen();
                } else {
                    dispatch(openAlertSnackbar('?????? ????????????, ?????? ?????? ????????? ??????????????? ?????? ????????? ??? ????????????.', 'warning', 5000));
                }
            }
        } else if (ver === 'modify') {
            dispatch(patchDraft(cardData, inputs, timeInputs, toggleState, contentsData, selectedSubject));
            handleClose(e);
        }
    };

    const actionChangeSubject = ({ target }) => {
        const { value } = target;
        console.log(value);
        setSelectedSubject(parseInt(value));
    };

    return (
        <>
            <Dialog disableEscapeKeyDown fullScreen open={editDialogOpen} onClose={handleEditDialogClose}>
                <div style={{ height: 'calc(100% - 142px)' }}>
                    <TOFELEditor
                        mode
                        datas={contentsData}
                        subject={selectedSubject}
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
            {/* <NewAssignment> */}
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
                        <h2 className="drawer-title">????????? ?????????????????? :)</h2>
                    ) : (
                        <>
                            <h2 className="drawer-modify-title">?????? ????????? ???????????????!</h2>
                            <p className="drawer-modify-subTitle">
                                ????????? ????????? <b style={{ fontWeight: '600' }}>?????? ????????? ??????</b>??? ???????????? ????????????. ????????? ?????????
                                ????????? ???????????? ???????????? ?????? ????????? ???????????? ????????????.
                            </p>
                        </>
                    )}
                    <div className="class-drawer-block ">
                        {ver === 'draft' ? (
                            <>
                                <DrawerGroupBox
                                    title="?????? ?????? ?????? "
                                    description="??????, ??????, ????????? ??????????????????"
                                    descriptionAdornment={BulbIcon}
                                >
                                    <div className="drawer-inputs">
                                        <CategorySelect
                                            labelId="subject-label"
                                            id="subject"
                                            defaultValue={selectedSubject}
                                            onChange={actionChangeSubject}
                                            label="subject"
                                        >
                                            <option value={0}>?????? ??????</option>
                                            <option value={1}>TOFEL Reading</option>
                                        </CategorySelect>
                                        <div className="drawer-input">
                                            <input
                                                name="title"
                                                value={title}
                                                className="input-name"
                                                placeholder="?????? ??????"
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
                                                placeholder="?????? ??? ??? ??????"
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
                                        title="?????? ?????? "
                                        description="???????????? ????????? ??????????????? ?????????????????????."
                                        descriptionAdornment={BulbIcon}
                                    >
                                        <div className="drawer-toggle " style={{ overflowX: 'auto' }}>
                                            <span>
                                                <p style={{ whiteSpace: 'nowrap' }}>???????????? ??????</p>
                                                <ToggleSwitch
                                                    name={'eyetrack'}
                                                    toggle={toggleState['eyetrack']}
                                                    handleToggleChange={handleChange}
                                                    type={'drawer'}
                                                />
                                            </span>
                                            <span>
                                                <p style={{ whiteSpace: 'nowrap' }}>???????????? ??????</p>

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
                                                    <p>??????</p>
                                                    <input
                                                        style={{ backgroundColor: '#F6F8F9' }}
                                                        type="number"
                                                        name="mm"
                                                        value={mm}
                                                        readOnly={mm === '--' ? true : false}
                                                        onChange={onTimeChange}
                                                        placeholder="00"
                                                    />
                                                    <p>???</p>
                                                </div>

                                                <ToggleSwitch
                                                    name={'timeAttack'}
                                                    toggle={toggleState['timeAttack']}
                                                    handleToggleChange={handleChange}
                                                    type={'drawer'}
                                                />
                                            </span>
                                        </div>
                                        <div className="drawer-select-warn">** ???????????? ?????????, ??????????????? ?????????????????????.</div>
                                        <div className="drawer-select-warn">
                                            ** ??????????????? ????????? ????????? ??? 1?????? ?????? ????????? ???????????????.{' '}
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
                                                placeholder="?????? ??????"
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
                                                placeholder="?????? ??? ??? ??????"
                                                onChange={onInputChange}
                                                onBlur={onInputOut}
                                            ></input>
                                            <div className="drawer-error">{description_error}</div>
                                        </div>
                                    </div>

                                    <div className="drawer-toggle">
                                        <span>
                                            <p>???????????? ??????</p>
                                            <ToggleSwitch
                                                name={'eyetrack'}
                                                toggle={toggleState['eyetrack']}
                                                handleToggleChange={handleChange}
                                                type={'drawer'}
                                            />
                                        </span>
                                        <span>
                                            <p>???????????? ??????</p>

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
                                                <p>??????</p>
                                                <input
                                                    style={{ backgroundColor: '#F6F8F9' }}
                                                    type="number"
                                                    name="mm"
                                                    value={mm}
                                                    readOnly={mm === '--' ? true : false}
                                                    onChange={onTimeChange}
                                                    placeholder="00"
                                                />
                                                <p>???</p>
                                            </div>

                                            <ToggleSwitch
                                                name={'timeAttack'}
                                                toggle={toggleState['timeAttack']}
                                                handleToggleChange={handleChange}
                                                type={'drawer'}
                                            />
                                        </span>
                                    </div>

                                    <div className="drawer-select-warn">** ???????????? ?????????, ??????????????? ?????????????????????.</div>
                                    <div className="drawer-select-warn">** ??????????????? ????????? ????????? ??? 1?????? ?????? ????????? ???????????????. </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="class-drawer-block">
                        {ver === 'draft' ? (
                            <>
                                <DrawerGroupBox
                                    title="?????? ?????? ??????"
                                    description="?????? ???????????? ?????? ?????? ????????? ???????????? ?????? 1?????? ????????? ???????????????."
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
                                            clicked={selectState}
                                            className={fileCreation ? 'disabled' : 'prepare'}
                                            // className={fileCreation ? 'disabled' : 'disabled'}
                                            // htmlFor={fileCreation ? null : 'file-click'}
                                        >
                                            <>
                                                <RestricRoute_1
                                                    onClick={() => {
                                                        setupload(true);
                                                    }}
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
                                                            <h4>?????? ?????? ???????????????</h4>
                                                            <p>hwp, word, pdf ????????? ???????????????, ????????? ?????????????????????.</p>
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
                                                            <h4>?????? ?????? ???????????????</h4>
                                                            <p>hwp, word, pdf ????????? ???????????????, ????????? ?????????????????????.</p>
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
                                                        <h4>?????? ????????????</h4>
                                                        <p>????????? ?????? ???????????? ???????????????, ?????? ???????????? ?????? ?????? ????????? ???????????????.</p>
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

                                                        <h4>?????? ????????????</h4>
                                                        <p>????????? ?????? ???????????? ???????????????, ?????? ???????????? ?????? ?????? ????????? ???????????????.</p>
                                                    </>
                                                )}
                                            </StyleLabel2>
                                        </>
                                    </div>
                                    <div className="drawer-select-warn">
                                        ** ?????? ?????? ???????????? ??????, ?????? ????????? ???????????? ?????? 1?????? ????????? ???????????????. <br />
                                        ** ?????? ????????? ??????, ????????? ????????? ??????????????????.
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

                                        <h4>??????????????? ?????? ????????????</h4>
                                        <p>????????? ????????? ??????????????? ?????? ?????? ???????????????.</p>
                                    </div>
                                </div>
                                <div className="drawer-select-warn">
                                    ** ???????????? ????????? ??????????????? ????????? ???????????????. <br /> ** ?????? ????????? ?????? ???????????? ????????????, ?????????
                                    ????????? ??????????????????.
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="drawer-selects">
                                    <div style={{ width: '100%', pointerEvents: 'none' }} className="drawer-select">
                                        <h3 style={{ color: '#969393' }}>?????? ?????? ???...</h3>
                                    </div>
                                </div>
                                <div className="drawer-select-warn">
                                    ** ?????? ????????????, ?????? ????????? ?????? ??? ???, ??????????????? ????????? ???????????????.
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="drawer-footer">
                    {ver === 'draft' ? (
                        <>
                            <DrawerActions>
                                <Button variant="filled" colors="purple" name="drawer-draft" onClick={onDrawerErrorCheck}>
                                    ????????????
                                </Button>
                            </DrawerActions>
                        </>
                    ) : (
                        <Button name="drawer-share" variant="filled" colors="purple" onClick={onDrawerErrorCheck}>
                            ????????????
                        </Button>
                    )}
                </div>
            </div>
            {/* </NewAssignment> */}
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
