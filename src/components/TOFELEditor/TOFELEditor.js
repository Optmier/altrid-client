/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-control-regex */
import {
    AppBar,
    Button,
    ButtonGroup,
    ClickAwayListener,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Drawer,
    Grow,
    IconButton,
    MenuItem,
    MenuList,
    Paper,
    Popper,
    Snackbar,
    TextField,
    Toolbar,
    withStyles,
    Typography,
} from '@material-ui/core';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import ReactQuill from 'react-quill';
import React, { useEffect, useRef, useState } from 'react';
import * as $ from 'jquery';
import styled from 'styled-components';
import 'react-quill/dist/quill.snow.css';
import CreateNewProblem from './CreateNewProblem';
import QuillEditorToolbarOption from './QuillEditorToolbarOption';
import ProblemCard from './ProblemCard';
import SmartTOFELRender from '../TOFELRenderer/SmartTOFELRender';
import Axios from 'axios';
import { apiUrl, gcvApiKey } from '../../configs/configs';
import { withRouter } from 'react-router-dom';
import { Alert } from '@material-ui/lab';
import { useBeforeunload } from 'react-beforeunload';
import { ArrowBack, ArrowDropDown, ArrowForward, Delete, DeleteForever, PostAdd, TextFields } from '@material-ui/icons';
/** https://github.com/jeanlescure/short-unique-id
 * Copyright (c) 2018-2020 Short Unique ID Contributors.
 * Licensed under the Apache License 2.0.
 */
import ShortUniqueId from 'short-unique-id';
import CompanyLogo from '../../images/logos/nav_logo_white.png';
import { Helmet } from 'react-helmet';
import GoogleCloudVisionOCR from './assets/GoogleCloudVisionOCR';
import tip0Img from './assets/tip0.png';

$.fn.changeSize = function (handleFunction) {
    let element = this;
    let lastWidth = element.width();
    let lastHeight = element.height();

    setInterval(function () {
        if (lastWidth === element.width() && lastHeight === element.height()) return;
        if (typeof handleFunction == 'function') {
            handleFunction({ width: element.width(), height: element.height() });
            lastWidth = element.width();
            lastHeight = element.height();
        }
    }, 50);

    return element;
};

// const swapArray = (array, a, b) => {
//     const tmp = array[a];
//     array[a] = array[b];
//     array[b] = tmp;
// };

const fitEditorSize = (height) => {
    const rootHeight = height;
    const headerHeight = $('.tofel-editor-root > .header').height();
    const quillToolbarHeight = $('#new_tofel_passage').find('.ql-toolbar').height();
    const $quillContainer = $('#new_tofel_passage').find('.ql-container');
    const $problemContainer = $('.problem-container');
    $quillContainer.height(rootHeight - headerHeight - quillToolbarHeight - 36);
    $problemContainer.height(rootHeight - headerHeight - 60);
};

const EdAppBar = withStyles((theme) => ({
    root: {
        backgroundColor: '#3B168A',
        boxShadow: 'none',
    },
}))(AppBar);

const EdToolbar = withStyles((theme) => ({
    root: {
        paddingLeft: 32,
        minHeight: 80,
    },
}))(Toolbar);

const EdToolbarButton = withStyles((theme) => ({
    root: {
        borderRadius: 10,
        color: '#fff',
        fontFamily: 'Noto Sans CJK KR',
        minWidth: 96,
        minHeight: 44,
        '&.normal': {
            backgroundColor: '#572AB5',
        },
        '&.accent': {
            backgroundColor: '#6D2AFA',
        },
        '&.critical': {
            backgroundColor: 'rgba(255, 92, 92, 0.85)',
        },
        '& + &': {
            marginLeft: 24,
        },
    },
}))(Button);

const EdProblemAddButton = withStyles((theme) => ({
    root: {
        borderColor: 'rgba(59, 22, 138, 0.53)',
        borderRadius: 10,
        borderWidth: 2,
        color: '#5A5A5A',
        fontFamily: 'Noto Sans CJK KR',
        fontWeight: 500,
        minHeight: 52,

        '& + &': {
            marginLeft: 16,
        },
    },
}))(Button);

const EdProblemAddButtonEx = withStyles((theme) => ({
    root: {
        borderColor: 'rgba(59, 22, 138, 0.53)',
        borderRadius: 10,
        borderWidth: 2,
        color: '#5A5A5A',
        fontFamily: 'Noto Sans CJK KR',
        fontWeight: 500,
        minHeight: 52,
    },
}))(Button);

const EdSetCtrlButton = withStyles((theme) => ({
    root: {
        borderColor: '#707070',
        borderRadius: 10,
        borderWidth: 1,
        color: '#707070',
        fontFamily: 'Noto Sans CJK KR',
        fontWeight: 500,
        padding: '2px 8px',
        // position: 'absolute',
        minHeight: 34,
        minWidth: 120,

        '& + &': {
            marginLeft: 8,
        },
    },
}))(Button);

const EdTextField = withStyles((theme) => ({
    root: {
        '& .MuiInputBase-root': {
            color: '#707070',
            fontFamily: 'Noto Sans CJK KR',
            fontSize: '1.25rem',
            fontWeight: 600,
            '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
            },
        },
    },
}))(TextField);

const PreviewDialog = withStyles((theme) => ({
    root: {
        '& .MuiPaper-root.MuiDialog-paper.MuiDialog-paperScrollPaper.MuiDialog-paperWidthSm.MuiPaper-rounded': {
            maxWidth: 1280,
        },
    },
}))(Dialog);

const Root = styled.div`
    /* padding: 16px; */
`;
const Header = styled.div`
    width: 100%;
    position: relative;
`;
const Container = styled.div`
    display: flex;
    /* padding-top: 16px; */
    width: 100%;
`;
const LeftContainer = styled.div`
    /* padding: 8px; */
    overflow: hidden;
    width: 55%;
`;
const TitleBox = styled.div`
    background-color: #f6f7f9;
    /* border-bottom: 1px solid #e5e5e5; */
    box-shadow: 1px 1px 5px #00000029;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0 34px;
    min-height: 72px;
`;
const RightContainer = styled.div`
    border-left: 1px solid #e5e5e5;
    /* padding: 8px; */
    width: 45%;
`;
const AddButtonContainer = styled.div`
    border-bottom: 1px solid rgba(112, 112, 112, 0.2);
    box-sizing: content-box;
    display: flex;
    align-items: center;
    min-height: 72px;
    padding: 0 24px;
`;
const ProblemsContainer = styled.div`
    overflow: auto;
    padding: 24px;
    padding-left: 12px;
`;
const NoContentsProblemWarning = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    text-align: center;
    top: calc(50% + 32px);
    width: calc(45% - 25px);
    font-size: 1.25rem;
    font-weight: 600;
    color: #0000004d;
    user-select: none;

    & .MuiSvgIcon-root {
        font-size: 1.75rem;
        margin-right: 4px;
    }
`;
const PreviewContainer = styled.div`
    max-width: 1280px;
    max-height: 750px;
    width: 1280px;
    height: 750px;
`;
const BottomContainer = styled.div`
    align-items: center;
    border-top: 1px solid #e5e5e5;
    display: flex;
    justify-content: center;
    padding: 8px;
    min-height: 64px;
    position: relative;
`;

const BottomContainerWrapper = styled.div`
    display: inherit;
    align-items: center;
    width: 55%;

    & .group {
        & + .group {
            margin-left: 8%;
        }
    }
`;

function useForceUpdate() {
    let [value, setState] = useState(true);
    return () => setState(!value);
}

function TOFELEditor({ id, datas, timeLimit, requestFile, mode, subject, onChange, onClose, onEditFinish, history, children, ...rest }) {
    const quillRef = useRef();
    const generateUid = useRef();
    const addProblemButtonExRef = useRef();
    const hiddenQuillRef = useRef();
    const addProblemTextFieldRef = useRef();

    const [metadata, setMetadata] = useState(datas);
    window.contentsMeta = metadata;
    const [contentsSetData, setContentsSetData] = useState(datas[0]);
    const [contentsTitle, setContentsTitle] = useState(datas[0].title);
    const [contentsPassage, setContentsPassage] = useState({ render: datas[0].passageForRender, editor: datas[0].passageForEditor });
    const [contentsTimeLimit, setContentsTimeLimit] = useState(timeLimit);
    const [contentsProblemDatas, setContentsProblemDatas] = useState(datas[0].problemDatas);
    const [currentProblemData, setCurrentProblemData] = useState(undefined);
    const [problemEditmode, setProblemEditmode] = useState(false);
    const [problemEditIdx, setProblemEditIdx] = useState(0);

    const [openCreateNewDrawer, setOpenCreateNewDrawer] = useState(false);
    const [openPreview, setOpenPreview] = useState(false);

    const [alertBarOpen, setAlertBarOpen] = useState(false);
    const [alertBarOption, setAlertBarOption] = useState({
        message: '',
        severity: 'success',
    });
    const [setNum, setSetNum] = useState(0);
    const [deleteIdxs, setDeleteIdxs] = useState([]);

    const [addProblemButtonExOpen, setAddProblemButtonExOpen] = useState(false);
    const [tipDialogOpenState, setTipDialogOpenState] = useState(false);
    const [addProblemTextDialogOpenState, setAddProblemTextDialogOpenState] = useState(false);

    let forceUpdate = useForceUpdate();

    const handleAlertBarOpen = () => {
        setAlertBarOpen(true);
    };

    const handleAlertBarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertBarOpen(false);
    };

    const onTextFieldChange = ({ target }) => {
        const { name, value } = target;
        switch (name) {
            case 'contents_title':
                setContentsTitle(value);
                break;
            case 'contents_time_limit':
                setContentsTimeLimit(value);
                break;
            default:
                break;
        }
    };

    const onQuillEditorChange = (content, delta, source, editor) => {
        setContentsPassage({ render: content, editor: JSON.stringify(editor.getContents()) });
    };

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpenCreateNewDrawer(open);
    };

    const handlePreviewOpen = () => {
        if (metadata.flatMap((m) => m.problemDatas).length === 0) {
            return alert('문항이 없습니다!\n에디터에서 문항을 하나 이상 추가해야 합니다.');
        }
        setOpenPreview(true);
    };

    const handlePreviewClose = () => {
        setOpenPreview(false);
    };

    const handleProblemCreate = (event) => {
        setCurrentProblemData(undefined);
        setProblemEditmode(false);
        toggleDrawer(true)(event);
    };

    // const handleSwapProblemPosition = (a, b) => {
    //     let arr = contentsProblemDatas.slice();
    //     swapArray(arr, a, b);
    //     setContentsProblemDatas(arr);
    // };

    // window.testChangePosition = handleSwapProblemPosition;

    const onProblemCreate = (newData) => {
        if (problemEditmode)
            setContentsProblemDatas(
                contentsProblemDatas.map((origData, idx) =>
                    idx === problemEditIdx
                        ? { ...newData, passageUid: contentsSetData.uuid }
                        : { ...origData, passageUid: contentsSetData.uuid },
                ),
            );
        else
            setContentsProblemDatas([
                ...contentsProblemDatas,
                { ...newData, passageUid: contentsSetData.uuid, uuid: generateUid.current(8) },
            ]);
    };

    const onProblemEdit = (editIdx) => (event) => {
        setProblemEditmode(true);
        setCurrentProblemData(contentsProblemDatas[editIdx]);
        setProblemEditIdx(editIdx);
        toggleDrawer(true)(event);
    };

    const onProblemDelete = (delIdx) => (event) => {
        const confirmDialog = window.confirm('정말로 삭제하시겠어요?');
        if (confirmDialog) setContentsProblemDatas(contentsProblemDatas.filter((origData, idx) => idx !== delIdx));
    };

    const onMultipleProlemsDelete = () => {
        const confirmDialog = window.confirm('선택한 항목들을 삭제하시겠어요?');
        if (confirmDialog) setContentsProblemDatas(contentsProblemDatas.filter((origData, idx) => !deleteIdxs.includes(idx)));
    };

    const onProblemCardCheckChanged = (number, checked) => {
        if (checked) {
            setDeleteIdxs([...deleteIdxs, number]);
        } else {
            setDeleteIdxs(deleteIdxs.filter((idx) => idx !== number));
        }
    };

    const handleSaveContents = () => {
        if (id)
            Axios.patch(
                `${apiUrl}/assignment-admin/${id}`,
                {
                    contentsData: JSON.stringify(metadata),
                },
                { withCredentials: true },
            )
                .then((res) => {
                    setAlertBarOption({ message: '저장되었습니다.', severity: 'success' });
                    handleAlertBarOpen();
                })
                .catch((err) => {
                    setAlertBarOption({ message: '저장에 실패했습니다.', severity: 'error' });
                    handleAlertBarOpen();
                    console.error(err);
                });
    };

    const handleDeleteContents = () => {
        const conf = window.confirm('정말로 삭제하시겠습니까?\n삭제 후에는 복구가 불가합니다.');
        if (!conf) return;
        if (id)
            Axios.delete(`${apiUrl}/assignment-admin/${id}`, { withCredentials: true })
                .then((res) => {
                    setAlertBarOption({ message: '삭제되었습니다.', severity: 'success' });
                    handleAlertBarOpen();
                    history.replace('/admins/contents-requests');
                })
                .catch((err) => {
                    setAlertBarOption({ message: '삭제에 실패했습니다.', severity: 'error' });
                    handleAlertBarOpen();
                    console.error(err);
                });
    };

    const handlePrevSet = () => {
        if (setNum <= 0) return;
        setSetNum(setNum - 1);
    };

    const handleNextSet = () => {
        if (setNum >= metadata.length - 1) return;
        if (!metadata[setNum + 1].uuid) {
            setMetadata((metadata) => metadata.map((d, i) => (i === setNum + 1 ? { ...d, uuid: generateUid.current(7) } : d)));
        }
        setSetNum(setNum + 1);
    };

    const addSet = () => {
        setMetadata([
            ...metadata,
            {
                title: '',
                passageForRender: '',
                passageForEditor: `{"ops":[{"insert":"\n"}]}`,
                uuid: generateUid.current(7),
                problemDatas: [],
            },
        ]);
        setSetNum(metadata.length);
    };

    const removeCurrentSet = () => {
        const conf = window.confirm('정말로 내용을 삭제하시겠습니까?');
        if (!conf) return;
        if (metadata.length < 2) {
            setContentsSetData({
                title: '',
                passageForRender: '',
                passageForEditor: `{"ops":[{"insert":"\n"}]}`,
                uuid: generateUid.current(7),
                problemDatas: [],
            });
            setContentsTitle('');
            setContentsPassage({ render: '', editor: `{"ops":[{"insert":"\n"}]}` });
            setContentsProblemDatas([]);
            let s = `{"ops":[{"insert":"\n"}]}`
                .replace(/\\n/g, '\\n')
                .replace(/\\'/g, "\\'")
                .replace(/\\"/g, '\\"')
                .replace(/\\&/g, '\\&')
                .replace(/\\r/g, '\\r')
                .replace(/\\t/g, '\\t')
                .replace(/\\b/g, '\\b')
                .replace(/\\f/g, '\\f');
            s = s.replace(/[\u0000-\u0019]+/g, '');
            quillRef.current.editor.setContents(JSON.parse(s));
        }
        setMetadata((arr) => {
            if (arr.length < 2) return arr;
            const f = arr.filter((d, i) => i !== setNum);
            if (setNum < 1) {
                setContentsSetData(f[0]);
                setContentsTitle(f[0].title);
                setContentsPassage({ render: f[0].passageForRender, editor: f[0].passageForEditor });
                setContentsProblemDatas(f[0].problemDatas);
                if (f[0].passageForEditor) {
                    let s = f[0].passageForEditor
                        .replace(/\\n/g, '\\n')
                        .replace(/\\'/g, "\\'")
                        .replace(/\\"/g, '\\"')
                        .replace(/\\&/g, '\\&')
                        .replace(/\\r/g, '\\r')
                        .replace(/\\t/g, '\\t')
                        .replace(/\\b/g, '\\b')
                        .replace(/\\f/g, '\\f');
                    s = s.replace(/[\u0000-\u0019]+/g, '');
                    quillRef.current.editor.setContents(JSON.parse(s));
                }
            } else {
                setSetNum(setNum - 1);
            }
            return f;
        });
        forceUpdate();
    };

    useEffect(() => {
        setContentsSetData({
            ...contentsSetData,
            title: contentsTitle,
        });
    }, [contentsTitle]);

    useEffect(() => {
        setContentsSetData({
            ...contentsSetData,
            passageForRender: contentsPassage.render,
            passageForEditor: contentsPassage.editor,
        });
    }, [contentsPassage]);

    useEffect(() => {
        setContentsSetData({
            ...contentsSetData,
            problemDatas: contentsProblemDatas,
        });
    }, [contentsProblemDatas]);

    useEffect(() => {
        setMetadata(metadata.map((d, i) => (i === setNum ? contentsSetData : d)));
    }, [contentsSetData]);

    useEffect(() => {
        // console.log('최종 컨텐츠 데이터:: ', metadata);
        onChange(metadata);
    }, [metadata]);

    useEffect(() => {
        if (!datas[0].uuid) datas[0].uuid = new ShortUniqueId().randomUUID(7);
        setMetadata(datas);
        setContentsSetData(datas[0]);
        setContentsTitle(datas[0].title);
        setContentsPassage({ render: datas[0].passageForRender, editor: datas[0].passageForEditor });
        setContentsProblemDatas(datas[0].problemDatas);
        if (datas[0].passageForEditor) {
            let s = datas[0].passageForEditor
                .replace(/\\n/g, '\\n')
                .replace(/\\'/g, "\\'")
                .replace(/\\"/g, '\\"')
                .replace(/\\&/g, '\\&')
                .replace(/\\r/g, '\\r')
                .replace(/\\t/g, '\\t')
                .replace(/\\b/g, '\\b')
                .replace(/\\f/g, '\\f');
            s = s.replace(/[\u0000-\u0019]+/g, '');
            quillRef.current.editor.setContents(JSON.parse(s));
        }
    }, [datas]);

    useEffect(() => {
        setContentsTimeLimit(timeLimit);
    }, [timeLimit]);

    useEffect(() => {
        setContentsSetData(metadata[setNum]);
        setContentsTitle(metadata[setNum].title);
        setContentsPassage({ render: metadata[setNum].passageForRender, editor: metadata[setNum].passageForEditor });
        setContentsProblemDatas(metadata[setNum].problemDatas);
        if (metadata[setNum].passageForEditor) {
            let s = metadata[setNum].passageForEditor
                .replace(/\\n/g, '\\n')
                .replace(/\\'/g, "\\'")
                .replace(/\\"/g, '\\"')
                .replace(/\\&/g, '\\&')
                .replace(/\\r/g, '\\r')
                .replace(/\\t/g, '\\t')
                .replace(/\\b/g, '\\b')
                .replace(/\\f/g, '\\f');
            s = s.replace(/[\u0000-\u0019]+/g, '');
            quillRef.current.editor.setContents(JSON.parse(s));
        }
    }, [setNum]);

    useEffect(() => {
        const $root = $('.tofel-editor-root');
        $root.parent().changeSize(({ height }) => {
            fitEditorSize(height);
        });
        fitEditorSize($root.parent().height());

        $(window).unbind('keydown');
        $(window).bind('keydown', (e) => {
            // if (e.keyCode === 80 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
            //     e.preventDefault();
            //     setOpenCreateNewDrawer(true);
            // } else if (e.keyCode === 66 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
            //     e.preventDefault();
            //     setOpenPreview(!openPreview);
            // } else if (e.keyCode === 49 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
            //     e.preventDefault();
            //     // addPassageSplitter();
            // } else if (e.keyCode === 50 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
            //     e.preventDefault();
            //     // addParagraphSplitter();
            // }
        });

        // assign ShortUniqueId function
        generateUid.current = new ShortUniqueId();

        const unblock = history.block('편집을 취소 하시겠습니까?\n저장되지 않은 사항들은 삭제됩니다.');
        return () => {
            unblock();
        };
    }, []);

    useBeforeunload((e) => e.preventDefault());

    const addProblemExMenuItemClick = (event, index) => {
        if (!localStorage.getItem('cv_tip_never_again')) openTipDialog();
        else openAddProblemTextDialog();
        setAddProblemButtonExOpen(false);
    };

    const toggleAddProblemEx = () => {
        setAddProblemButtonExOpen((openState) => !openState);
    };

    const closeAddProblemEx = (event) => {
        if (addProblemButtonExRef.current && addProblemButtonExRef.current.contains(event.target)) return;
        setAddProblemButtonExOpen(false);
    };

    const getConvertedQuillContents = (text = '', hiddenEditor = hiddenQuillRef.current) => {
        hiddenEditor.getEditor().setText(text);
        const delta = hiddenEditor.getEditor().getContents();
        const render = hiddenEditor.getEditor().scroll.domNode.innerHTML;
        return { textForEditor: JSON.stringify(delta), textForRender: render };
    };

    /** @param {object[]} problems */
    const addProblemsFromTexts = (problems) => {
        const newDatas = [];
        const problemsLength = problems.length;
        for (let i = 0; i < problemsLength; i++) {
            const basicData = {
                category: '',
                type: 'multiple-choice',
                textForRender: '',
                textForEditor: `{"ops":[{"insert":"\n"}]}`,
                commentsForRender: '',
                commentsForEditor: `{"ops":[{"insert":"\n"}]}`,
                selections: {
                    1: '',
                    2: null,
                    3: null,
                    4: null,
                    5: null,
                },
                answer: '',
                score: 1,
            };
            const { textForEditor, textForRender } = getConvertedQuillContents(problems[i].problem);
            basicData.textForEditor = textForEditor;
            basicData.textForRender = textForRender;

            const selectionLength = problems[i].selections.length;
            for (let j = 0; j < selectionLength; j++) {
                basicData.selections[j + 1] = problems[i].selections[j];
            }

            basicData.passageUid = contentsSetData.uuid;
            basicData.uuid = generateUid.current(8);
            newDatas.push(basicData);
        }

        setContentsProblemDatas([...contentsProblemDatas, ...newDatas]);
    };
    // window.addProblemsFromTexts = addProblemsFromTexts;
    // window.quillRef = quillRef;

    const applyGCV = ({ texts, problems }) => {
        console.log(texts, problems);
        addProblemsFromTexts(problems);
        quillRef.current.getEditor().setText(texts);
        setTimeout(() => {
            setContentsPassage({
                render: quillRef.current.getEditor().scroll.domNode.innerHTML,
                editor: JSON.stringify(quillRef.current.getEditor().getContents()),
            });
        });
    };

    const openAddProblemTextDialog = () => {
        setAddProblemTextDialogOpenState(true);
    };

    const closeAddProblemTextDialog = () => {
        setAddProblemTextDialogOpenState(false);
    };

    const okAddProblemTextDialog = () => {
        let problemsResult = addProblemTextFieldRef.current.value;
        problemsResult = problemsResult.split('\n\n');
        problemsResult = problemsResult.map((pn) => {
            const ps = pn.split('\t');
            return {
                problem: ps.shift(),
                selections: ps.map((s) => s.replace('\n', '')),
            };
        });
        addProblemsFromTexts(problemsResult);
        addProblemTextFieldRef.current.value = '';
        closeAddProblemTextDialog();
    };

    // 팁 대화창 열기
    const openTipDialog = () => {
        setTipDialogOpenState(true);
    };

    // 팁 대화창 닫기
    const closeTipDialog = () => {
        openAddProblemTextDialog();
        setTipDialogOpenState(false);
    };

    // 팁 대화창 확인 버튼
    const tipDialogOkBtn = () => {
        closeTipDialog();
    };

    // 팁 대화창 다시 보지 않기 버튼
    const tipDialogNeverSeeAgainBtn = () => {
        localStorage.setItem('cv_tip_never_again', true);
        closeTipDialog();
    };

    // 팁 대화창
    const TipDialog = (
        <Dialog open={tipDialogOpenState} maxWidth={false} onClose={closeTipDialog}>
            <DialogTitle onClose={closeTipDialog}>문제 만들기 팁</DialogTitle>
            <DialogContent dividers>
                <img src={tip0Img} width="768px" alt="tip_image" />
                <Typography>위의 형식에 따라 문제 및 선택지가 자동으로 생성됩니다.</Typography>
                <Typography>
                    현재 객관식 문제만 생성이 가능하며, 생성 이후에는 문제 유형, 정답 및 해설에 대해 추가 수정이 필요합니다.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={tipDialogNeverSeeAgainBtn}>
                    다시 보지 않기
                </Button>
                <Button color="primary" onClick={tipDialogOkBtn}>
                    확인
                </Button>
            </DialogActions>
        </Dialog>
    );

    const AddProblemFromTextDialog = (
        <Dialog open={addProblemTextDialogOpenState} maxWidth={false}>
            <DialogTitle>텍스트로 문제 추가</DialogTitle>
            <DialogContent>
                <TextField
                    inputRef={addProblemTextFieldRef}
                    multiline
                    variant="outlined"
                    rows={24}
                    style={{ minWidth: 480 }}
                    onKeyDown={(e) => {
                        if (e.key === 'Tab') {
                            e.preventDefault();
                            const start = e.target.selectionStart;
                            const end = e.target.selectionEnd;
                            e.target.value = e.target.value.substring(0, start) + '\t' + e.target.value.substring(end);
                            e.target.selectionStart = e.target.selectionEnd = start + 1;
                        }
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={closeAddProblemTextDialog}>
                    취소
                </Button>
                <Button color="primary" onClick={okAddProblemTextDialog}>
                    확인
                </Button>
            </DialogActions>
        </Dialog>
    );

    return (
        <>
            <Helmet>
                <style>{`
                    .quill.passage-editor > .ql-toolbar.ql-snow {
                        border: none;
                        border-bottom: 1px solid rgba(112, 112, 112, 0.2);
                        padding: 12px 48px;
                    }
                    .quill.passage-editor > .ql-container.ql-snow {
                        border: none;
                        font-family: Noto Sans CJK KR;
                    }
                    .quill.passage-editor > .ql-container.ql-snow > .ql-editor {
                        color: #707070;
                        font-family: Noto Sans CJK KR;
                        font-weight: 500;
                        padding: 16px 48px;
                    }
                    .quill.passage-editor > .ql-container.ql-snow > .ql-editor > p > strong, b {
                        // filter: brightness(0.667);
                    }
                    .quill.passage-editor > .ql-container.ql-snow > .ql-editor.ql-blank::before {
                        left: initial;
                        right: initial;
                        top: 18px;
                        color: #707070;
                        font-family: Noto Sans CJK KR;
                        font-size: 1.2rem;
                        font-style: normal;
                        opacity: 0.7;
                    }
            `}</style>
            </Helmet>
            <ReactQuill style={{ display: 'none' }} ref={hiddenQuillRef} />
            {TipDialog}
            {AddProblemFromTextDialog}
            <Root className="tofel-editor-root">
                <Snackbar open={alertBarOpen} autoHideDuration={5000} onClose={handleAlertBarClose}>
                    <Alert onClose={handleAlertBarClose} severity={alertBarOption.severity}>
                        {alertBarOption.message}
                    </Alert>
                </Snackbar>
                <PreviewDialog open={openPreview} onClose={handlePreviewClose}>
                    <PreviewContainer>
                        <SmartTOFELRender
                            preview
                            title={metadata.map((m) => m.title)}
                            pUUIDs={metadata.map((m) => m.uuid)}
                            passageForRender={metadata.map((m) => m.passageForRender)}
                            problemDatas={metadata.flatMap((m) => m.problemDatas)}
                            timer={contentsTimeLimit}
                            onEnd={handlePreviewClose}
                        />
                    </PreviewContainer>
                </PreviewDialog>
                <Drawer anchor="right" open={openCreateNewDrawer}>
                    <CreateNewProblem
                        subject={subject}
                        problemDatas={currentProblemData}
                        editmode={problemEditmode}
                        handleClose={toggleDrawer(false)}
                        onCreate={onProblemCreate}
                    />
                </Drawer>
                <Header className="header">
                    <EdAppBar position="static">
                        <EdToolbar>
                            <img src={CompanyLogo} alt="로고" height={60} style={{ marginRight: 'auto' }} />
                            {requestFile ? (
                                <EdToolbarButton
                                    className="normal"
                                    href={`${apiUrl}/files/${requestFile}`}
                                    download={requestFile
                                        .substring(requestFile.indexOf('_') + 1)
                                        .substring(requestFile.lastIndexOf('/') + 1)}
                                    style={{ minWidth: 128 }}
                                >
                                    첨부파일(F)
                                </EdToolbarButton>
                            ) : null}
                            <GoogleCloudVisionOCR apiKey={gcvApiKey} applyButtonText="본문에 추가" onApply={applyGCV}>
                                <EdToolbarButton className="normal" style={{ minWidth: 128, marginRight: 16, marginLeft: 16 }}>
                                    이미지로 추가
                                </EdToolbarButton>
                            </GoogleCloudVisionOCR>
                            <EdToolbarButton className="normal" onClick={handlePreviewOpen} style={{ minWidth: 128 }}>
                                미리보기(B)
                            </EdToolbarButton>
                            {mode ? (
                                <EdToolbarButton
                                    className="accent"
                                    onClick={() => {
                                        onEditFinish(metadata);
                                        onClose();
                                    }}
                                >
                                    확인
                                </EdToolbarButton>
                            ) : (
                                <>
                                    <EdToolbarButton className="accent" onClick={handleSaveContents}>
                                        저장(S)
                                    </EdToolbarButton>
                                    <EdToolbarButton className="critical" onClick={handleDeleteContents}>
                                        삭제(D)
                                    </EdToolbarButton>
                                </>
                            )}
                        </EdToolbar>
                    </EdAppBar>
                </Header>
                <Container>
                    <LeftContainer>
                        <TitleBox>
                            <EdTextField
                                variant="outlined"
                                fullWidth
                                placeholder="지문 제목을 입력하세요."
                                name="contents_title"
                                value={contentsTitle}
                                onChange={onTextFieldChange}
                            />
                        </TitleBox>
                        <ReactQuill
                            id="new_tofel_passage"
                            className="passage-editor"
                            ref={quillRef}
                            modules={{ toolbar: QuillEditorToolbarOption }}
                            placeholder="지문을 입력하세요."
                            // value={contentsPassage.editor}
                            onChange={onQuillEditorChange}
                        />
                    </LeftContainer>
                    <RightContainer>
                        <AddButtonContainer>
                            {/* <EdProblemAddButton variant="outlined" fullWidth startIcon={<PlaylistAddIcon />} onClick={handleProblemCreate}>
                                새 문제 추가하기
                            </EdProblemAddButton> */}
                            <ButtonGroup fullWidth ref={addProblemButtonExRef}>
                                <EdProblemAddButtonEx
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<PlaylistAddIcon />}
                                    onClick={handleProblemCreate}
                                >
                                    새 문제 추가하기
                                </EdProblemAddButtonEx>
                                <EdProblemAddButtonEx
                                    style={{ maxWidth: 36 }}
                                    size="small"
                                    aria-controls={addProblemButtonExOpen ? 'split-button-menu' : undefined}
                                    aria-expanded={addProblemButtonExOpen ? 'true' : undefined}
                                    aria-haspopup="menu"
                                    onClick={toggleAddProblemEx}
                                >
                                    <ArrowDropDown />
                                </EdProblemAddButtonEx>
                            </ButtonGroup>
                            <Popper
                                open={addProblemButtonExOpen}
                                anchorEl={addProblemButtonExRef.current}
                                role={undefined}
                                transition
                                disablePortal
                                placement="bottom-end"
                            >
                                {({ TransitionProps, placement }) => (
                                    <Grow
                                        {...TransitionProps}
                                        style={{ transformOrigin: placement === 'bottom' ? 'right top' : 'right top' }}
                                    >
                                        <Paper>
                                            <ClickAwayListener onClickAway={closeAddProblemEx}>
                                                <MenuList id="split-button-menu">
                                                    <MenuItem onClick={(event) => addProblemExMenuItemClick(event, 0)}>
                                                        <TextFields fontSize="small" style={{ marginRight: 8 }} />
                                                        텍스트로 추가
                                                    </MenuItem>
                                                </MenuList>
                                            </ClickAwayListener>
                                        </Paper>
                                    </Grow>
                                )}
                            </Popper>
                            <EdProblemAddButton
                                variant="outlined"
                                fullWidth
                                startIcon={<Delete />}
                                style={{ marginLeft: 16 }}
                                onClick={onMultipleProlemsDelete}
                            >
                                문제 삭제하기
                            </EdProblemAddButton>
                        </AddButtonContainer>
                        <ProblemsContainer className="problem-container">
                            {contentsProblemDatas.length > 0 ? (
                                <>
                                    {contentsProblemDatas.map((data, idx) => (
                                        <ProblemCard
                                            key={idx}
                                            orderNumber={idx}
                                            category={data.category}
                                            type={data.type}
                                            textForRender={data.textForRender}
                                            selections={data.selections}
                                            answer={data.answer}
                                            score={data.score}
                                            handleEdit={onProblemEdit(idx)}
                                            handleDelete={onProblemDelete(idx)}
                                            handleProblemCardCheckChanged={onProblemCardCheckChanged}
                                        />
                                    ))}
                                </>
                            ) : (
                                <NoContentsProblemWarning>
                                    <SentimentDissatisfiedIcon />
                                    아직 추가하신 문제가 없습니다!
                                </NoContentsProblemWarning>
                            )}
                        </ProblemsContainer>
                    </RightContainer>
                </Container>
                <BottomContainer>
                    <BottomContainerWrapper>
                        <div className="group">
                            <IconButton onClick={handlePrevSet} size="small">
                                <ArrowBack fontSize="small" />
                            </IconButton>
                            <span style={{ margin: '0px 4px', color: '#707070', fontWeight: 500, paddingTop: 2 }}>
                                {setNum + 1} / {metadata.length}
                            </span>
                            <IconButton onClick={handleNextSet} size="small">
                                <ArrowForward fontSize="small" />
                            </IconButton>
                        </div>
                        <div className="group">
                            <EdSetCtrlButton variant="outlined" startIcon={<PostAdd />} onClick={addSet}>
                                세트 추가
                            </EdSetCtrlButton>
                            <EdSetCtrlButton
                                variant="outlined"
                                startIcon={<DeleteForever />}
                                onClick={removeCurrentSet}
                                style={{ right: 0 }}
                            >
                                세트 삭제
                            </EdSetCtrlButton>
                        </div>
                    </BottomContainerWrapper>
                </BottomContainer>
            </Root>
        </>
    );
}

TOFELEditor.defaultProps = {
    id: 0,
    datas: [
        {
            title: '',
            passageForRender: '',
            passageForEditor: `{"ops":[{"insert":"\n"}]}`,
            uuid: '',
            problemDatas: [],
        },
    ],
    timeLimit: 60,
    requestFile: undefined,
    mode: false,
    onChange: (metadata) => {},
    onClose: () => {},
};

export default withRouter(TOFELEditor);
