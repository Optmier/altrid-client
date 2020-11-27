import { AppBar, Button, Dialog, Drawer, Snackbar, TextField, Toolbar, withStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
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
import { ArrowBack, ArrowForward, DeleteForever, PostAdd } from '@material-ui/icons';

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
    $problemContainer.height(rootHeight - headerHeight - 70);
};

const EdAppBar = withStyles((theme) => ({
    root: {
        backgroundColor: '#777777',
    },
}))(AppBar);

const EdToolbar = withStyles((theme) => ({
    root: {
        paddingLeft: 0,
    },
}))(Toolbar);

const EdTextField = withStyles((theme) => ({
    root: {
        '& .MuiInputBase-root': {
            color: '#ffffff',
            fontSize: '1.125rem',
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
    padding: 8px;
    width: 60%;
`;
const RightContainer = styled.div`
    border-left: 1px solid #adadad;
    padding: 8px;
    width: 40%;
`;
const AddButtonContainer = styled.div``;
const ProblemsContainer = styled.div`
    overflow: auto;
    padding-top: 4px;
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
    display: flex;
    justify-content: flex-end;
    padding: 8px;

    & .group {
        & + .group {
            margin-left: 16px;
        }
    }
`;

function useForceUpdate() {
    let [value, setState] = useState(true);
    return () => setState(!value);
}

function TOFELEditor({ id, datas, timeLimit, requestFile, mode, onChange, onClose, onEditFinish, history, children, ...rest }) {
    const quillRef = useRef();

    const [metadata, setMetadata] = useState(datas);
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
            return alert('과제 수정을 통해 에디터에서 문항을 추가해주세요 !');
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
        else setContentsProblemDatas([...contentsProblemDatas, { ...newData, setNum: setNum }]);
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
    }, []);

    useBeforeunload((e) => e.preventDefault());

    return (
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
                        <EdTextField
                            variant="outlined"
                            fullWidth
                            placeholder="컨텐츠 제목을 입력하세요."
                            name="contents_title"
                            value={contentsTitle}
                            onChange={onTextFieldChange}
                        />
                        {requestFile ? (
                            <Button
                                href={`${apiUrl}/files/${requestFile}`}
                                download={requestFile.substring(requestFile.indexOf('_') + 1).substring(requestFile.lastIndexOf('/') + 1)}
                                color="inherit"
                                style={{ minWidth: 128 }}
                            >
                                첨부파일(F)
                            </Button>
                        ) : null}
                        <Button color="inherit" onClick={handlePreviewOpen} style={{ minWidth: 128 }}>
                            미리보기(B)
                        </Button>
                        {mode ? (
                            <Button
                                color="inherit"
                                onClick={() => {
                                    onEditFinish(metadata);
                                    onClose();
                                }}
                            >
                                확인
                            </Button>
                        ) : (
                            <>
                                <Button color="inherit" style={{ minWidth: 72 }} onClick={handleSaveContents}>
                                    저장(S)
                                </Button>
                                <Button color="inherit" style={{ minWidth: 72 }} onClick={handleDeleteContents}>
                                    삭제(D)
                                </Button>
                            </>
                        )}
                    </EdToolbar>
                </EdAppBar>
            </Header>
            <Container>
                <LeftContainer>
                    <ReactQuill
                        id="new_tofel_passage"
                        ref={quillRef}
                        modules={{ toolbar: QuillEditorToolbarOption }}
                        placeholder="지문을 입력하세요."
                        // value={contentsPassage.editor}
                        onChange={onQuillEditorChange}
                    />
                </LeftContainer>
                <RightContainer>
                    <AddButtonContainer>
                        <Button variant="outlined" fullWidth startIcon={<AddIcon />} onClick={handleProblemCreate}>
                            새 문제 추가(P)
                        </Button>
                    </AddButtonContainer>
                    <ProblemsContainer className="problem-container">
                        {contentsProblemDatas.length > 0 ? (
                            <>
                                {contentsProblemDatas.map((data, idx) => (
                                    <ProblemCard
                                        key={idx}
                                        category={data.category}
                                        type={data.type}
                                        textForRender={data.textForRender}
                                        selections={data.selections}
                                        answer={data.answer}
                                        score={data.score}
                                        handleEdit={onProblemEdit(idx)}
                                        handleDelete={onProblemDelete(idx)}
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
                <div className="group">
                    <Button startIcon={<ArrowBack />} onClick={handlePrevSet}>
                        이전 세트
                    </Button>
                    <span style={{ margin: '0 8px' }}>
                        {setNum + 1} / {metadata.length}
                    </span>
                    <Button endIcon={<ArrowForward />} onClick={handleNextSet}>
                        다음 세트
                    </Button>
                </div>
                <div className="group">
                    <Button startIcon={<PostAdd />} onClick={addSet}>
                        세트 추가
                    </Button>
                    <Button color="secondary" startIcon={<DeleteForever />} onClick={removeCurrentSet}>
                        세트 삭제
                    </Button>
                </div>
            </BottomContainer>
        </Root>
    );
}

TOFELEditor.defaultProps = {
    id: 0,
    datas: [
        {
            title: '',
            passageForRender: '',
            passageForEditor: `{"ops":[{"insert":"\n"}]}`,
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
