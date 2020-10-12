import { AppBar, Button, Dialog, Drawer, TextField, Toolbar, withStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import ReactQuill from 'react-quill';
import React, { useEffect, useRef, useState } from 'react';
import * as $ from 'jquery';
import styled from 'styled-components';
import 'react-quill/dist/quill.snow.css';
import TofelEditorTemp from '../../pages/TofelEditorTemp';
import CreateNewProblem from './CreateNewProblem';
import QuillEditorToolbarOption from './QuillEditorToolbarOption';
import ProblemCard from './ProblemCard';

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

const jsonParse = (string) => {
    return eval('(' + string.replace(/[\n\r]/gi, '\\n') + ')')
        ? eval('(' + string.replace(/[\n\r]/gi, '\\n') + ')')
        : { ops: [{ insert: '\n' }] };
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

const Root = styled.div`
    /* padding: 16px; */
`;
const Header = styled.div`
    width: 100%;
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

function TOFELEditor({ id, datas, children, ...rest }) {
    const quillRef = useRef();

    const [metadata, setMetadata] = useState(datas);
    const [contentsTitle, setContentsTitle] = useState(datas.title);
    const [contentsPassage, setContentsPassage] = useState({ render: datas.passageForRender, editor: datas.passageForEditor });
    const [contentsTimeLimit, setContentsTimeLimit] = useState(datas.timeLimit);
    const [contentsProblemDatas, setContentsProblemDatas] = useState(datas.problemDatas);
    const [currentProblemData, setCurrentProblemData] = useState(undefined);
    const [problemEditmode, setProblemEditmode] = useState(false);
    const [problemEditIdx, setProblemEditIdx] = useState(0);

    const [openCreateNewDrawer, setOpenCreateNewDrawer] = useState(false);
    const [openPreview, setOpenPreview] = React.useState(false);

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

    const handleSwapProblemPosition = (a, b) => {
        let arr = contentsProblemDatas.slice();
        swapArray(arr, a, b);
        setContentsProblemDatas(arr);
    };

    window.testChangePosition = handleSwapProblemPosition;

    const onProblemCreate = (newData) => {
        console.log(newData);
        if (problemEditmode)
            setContentsProblemDatas(contentsProblemDatas.map((origData, idx) => (idx === problemEditIdx ? newData : origData)));
        else setContentsProblemDatas([...contentsProblemDatas, newData]);
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

    useEffect(() => {
        setMetadata({
            ...metadata,
            title: contentsTitle,
        });
    }, [contentsTitle]);

    useEffect(() => {
        setMetadata({
            ...metadata,
            timeLimit: contentsTimeLimit,
        });
    }, [contentsTimeLimit]);

    useEffect(() => {
        setMetadata({
            ...metadata,
            passageForRender: contentsPassage.render,
            passageForEditor: contentsPassage.editor,
        });
    }, [contentsPassage]);

    useEffect(() => {
        setMetadata({
            ...metadata,
            problemDatas: contentsProblemDatas,
        });
    }, [contentsProblemDatas]);

    useEffect(() => {
        console.log('최종 컨텐츠 데이터:: ', metadata);
    }, [metadata]);

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

    return (
        <Root className="tofel-editor-root">
            <Dialog open={openPreview} onClose={handlePreviewClose}>
                여기에 미리보기가 표시될 예정입니다.
            </Dialog>
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
                        <Button color="inherit" onClick={handlePreviewOpen} style={{ minWidth: 128 }}>
                            미리보기(B)
                        </Button>
                        <Button color="inherit" style={{ minWidth: 72 }}>
                            저장(S)
                        </Button>
                        <Button color="inherit" style={{ minWidth: 72 }}>
                            삭제(D)
                        </Button>
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
                        defaultValue={jsonParse(datas.passageForEditor)}
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
        </Root>
    );
}

TOFELEditor.defaultProps = {
    datas: {
        title: '',
        passageForRender: '',
        passageForEditor: `{"ops":[{"insert":"\n"}]}`,
        timeLimit: 60,
        problemDatas: [
            {
                category: 2,
                type: 'multiple-choice',
                textForRender: '',
                textForEditor: `{"ops":[{"insert":"\n"}]}`,
                selections: {
                    1: '',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                },
                answer: 3,
            },
        ],
    },
};

export default React.memo(TOFELEditor);
