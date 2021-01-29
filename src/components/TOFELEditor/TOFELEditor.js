import { AppBar, Button, Dialog, Drawer, IconButton, Snackbar, TextField, Toolbar, withStyles } from '@material-ui/core';
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
import { apiUrl } from '../../configs/configs';
import { withRouter } from 'react-router-dom';
import { Alert } from '@material-ui/lab';
import { useBeforeunload } from 'react-beforeunload';
import { ArrowBack, ArrowForward, Delete, DeleteForever, PostAdd } from '@material-ui/icons';
import { useCallback } from 'react';
import { updateSession } from '../../redux_modules/sessions';
import { useDispatch, useSelector } from 'react-redux';
import RefreshToken from '../essentials/Authentication';
/** https://github.com/jeanlescure/short-unique-id
 * Copyright (c) 2018-2020 Short Unique ID Contributors.
 * Licensed under the Apache License 2.0.
 */
import ShortUniqueId from 'short-unique-id';
import CompanyLogo from '../../images/logos/nav_logo_white.png';
import { Helmet } from 'react-helmet';

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

const swapArray = (array, a, b) => {
    const tmp = array[a];
    array[a] = array[b];
    array[b] = tmp;
};

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
    width: calc(40% - 16px);
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

function TOFELEditor({ id, datas, timeLimit, requestFile, mode, onChange, onClose, onEditFinish, history, children, ...rest }) {
    const quillRef = useRef();
    const generateUid = useRef();

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
    window.deleteIdxs = deleteIdxs;

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
        // console.log(newData);
        if (problemEditmode)
            setContentsProblemDatas(
                contentsProblemDatas.map((origData, idx) =>
                    idx === problemEditIdx ? { ...newData, setNum: setNum } : { ...origData, setNum: setNum },
                ),
            );
        else setContentsProblemDatas([...contentsProblemDatas, { ...newData, setNum: setNum, uuid: generateUid.current(8) }]);
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
            if (e.keyCode === 80 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
                e.preventDefault();
                setOpenCreateNewDrawer(true);
            } else if (e.keyCode === 66 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
                e.preventDefault();
                setOpenPreview(!openPreview);
            } else if (e.keyCode === 49 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
                e.preventDefault();
                // addPassageSplitter();
            } else if (e.keyCode === 50 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
                e.preventDefault();
                // addParagraphSplitter();
            }
        });

        // assign ShortUniqueId function
        generateUid.current = new ShortUniqueId();

        const unblock = history.block('편집을 취소 하시겠습니까?\n저장되지 않은 사항들은 삭제됩니다.');
        return () => {
            unblock();
        };
    }, []);

    useBeforeunload((e) => e.preventDefault());

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
                            <EdProblemAddButton variant="outlined" fullWidth startIcon={<PlaylistAddIcon />} onClick={handleProblemCreate}>
                                새 문제 추가하기
                            </EdProblemAddButton>
                            <EdProblemAddButton variant="outlined" fullWidth startIcon={<Delete />} onClick={onMultipleProlemsDelete}>
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
