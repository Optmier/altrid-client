import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ReactQuill from 'react-quill';
import {
    Button,
    Collapse,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
    Tooltip,
    withStyles,
} from '@material-ui/core';
import QuillEditorToolbarOption from './QuillEditorToolbarOption';
import ProblemCategories from './ProblemCategories';
import * as $ from 'jquery';
import { Helmet } from 'react-helmet';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import { RadioButtonChecked } from '@material-ui/icons';

const Root = styled.div`
    padding: 36px 48px;
    max-width: 600px;

    @media all and (max-width: 768px) {
        padding: 32px;
    }
`;
const CloseIconRoot = styled.div`
    margin-top: 4px;
`;
const TitleContainer = styled.div`
    display: flex;
    justify-content: space-between;
    color: rgba(0, 0, 0, 0.9);

    & h2 {
        font-size: 1.625rem;
        font-weight: 700;
    }

    @media all and (max-width: 768px) {
        & h2 {
            font-size: 1.5rem;
        }
    }
`;
const FormBox = styled.div`
    margin-top: 48px;
`;
const CategoryMenuItemContents = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;

    & span {
        color: #999999;
        font-size: 0.875rem;
    }
`;
const SelectorsContainer = styled.div`
    margin-top: 16px;
`;
const CreateButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 72px;
`;

const CreateButton = withStyles((theme) => ({
    root: {
        borderRadius: '10px',
        color: '#fff',
        fontFamily: 'inherit',
        fontSize: '0.9rem',
        fontWeight: 700,
        width: '96px',
        height: '45px',
        '&.primary': {
            backgroundColor: '#13e2a1',
        },
        '& > span': {
            pointerEvents: 'none',
        },
    },
}))(Button);

const UCOutlinedInput = withStyles((theme) => ({
    root: {
        '& input': {
            textTransform: 'uppercase',
        },
    },
}))(OutlinedInput);

const CategorySelect = styled.select`
    cursor: pointer;
    background: url(/bg_images/Vector.png) no-repeat 92% 50%;
    width: 100%;
    min-height: 40px;
    padding: 0.4rem 0.8rem;
    font-family: inherit;
    font-size: 1.001rem;
    border: none;
    border: 1px solid rgba(112, 112, 112, 0.79);
    border-radius: 0px;
    color: #707070;
    font-weight: 700;
    -webkit-appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    outline: none;

    &.small {
        width: 120px;
    }

    &.tiny {
        width: 90px;
        height: 32px;
        min-height: initial;
    }
`;

function GroupBoxContents({ title, description, rightComponent, onClick, children, ...rest }) {
    const HeaderBox = styled.header`
        align-items: flex-end;
        border-bottom: 1px solid #707070;
        color: #707070;
        display: flex;
        flex-direction: row;
        font-weight: 500;
        justify-content: space-between;
        padding: 6px 0 6px 2px;
        ${onClick === undefined ? null : 'cursor: pointer;'}

        & h5.title {
            font-size: 1rem;
            font-weight: 700;
        }

        & p.description {
            font-size: 0.875rem;
            margin-bottom: 2px;
        }

        & svg.open-commentary-dropdown-icon {
            cursor: pointer;
        }
    `;
    return (
        <div {...rest}>
            <HeaderBox onClick={onClick}>
                <h5 className="title">{title}</h5>
                <p className="description">{description}</p>
                {rightComponent}
            </HeaderBox>
            {children}
        </div>
    );
}

GroupBoxContents.defaultProps = {
    title: '제목',
    description: '',
    rightComponent: <></>,
    onClick: undefined,
};

function CreateNewProblem({ problemDatas, handleClose, onCreate, editmode }) {
    const rootRef = useRef();
    const [createButtonEnabled, setCreateButtonEnabled] = useState(false);
    const [metadata, setMetadata] = useState(problemDatas);
    const [problemCategory, setProblemCategory] = useState(problemDatas.category);
    const [problemType, setProblemType] = useState(problemDatas.type);
    const [problemTexts, setProblemTexts] = useState({ render: problemDatas.textForRender, editor: problemDatas.textForEditor });
    const [problemComments, setProblemComments] = useState({
        render: problemDatas.commentsForRender,
        editor: problemDatas.commentsForEditor,
    });
    const [problemAnswer, setProblemAnswer] = useState(problemDatas.answer);
    const [problemScore, setProblemScore] = useState(problemDatas.score);
    const [problemSelections, setProblemSelections] = useState(problemDatas.selections);
    const [commentOpen, setCommentOpen] = useState(false);

    const handleChangeCategory = (e) => {
        const cat = e.target.value;
        setProblemCategory(cat);
        // switch (cat) {
        //     case 9:
        //         setProblemType('short-answer');
        //         break;
        //     default:
        //         setProblemType('multiple-choice');
        //         break;
        // }
    };

    const handleChangeType = (e) => {
        const type = e.target.value;
        setProblemType(type);
    };

    const handleChangeScore = (e) => {
        const score = e.target.value;
        setProblemScore(parseInt(score));
    };

    const onSelectionButtonClick = (id) => (event) => {
        setProblemAnswer(id);
    };

    const onTextFieldChange = ({ target }) => {
        const { name, value } = target;
        switch (name) {
            case 'short_answer_input':
                if (typeof value === 'string' && problemType === 'short-answer') setProblemAnswer(value.toUpperCase());
                else setProblemAnswer(value);
                break;
            case 'score_input':
                setProblemScore(parseInt(value));
                break;
            default:
                setProblemSelections({
                    ...problemSelections,
                    [name.replace('selection_', '')]: value,
                });
                break;
        }
    };

    const onQuillEditorChange = (id) => (content, delta, source, editor) => {
        // console.log(id, content, delta, source, editor);
        if (id === 'texts_editor') setProblemTexts({ render: content, editor: JSON.stringify(editor.getContents()) });
        else if (id === 'comments_editor') setProblemComments({ render: content, editor: JSON.stringify(editor.getContents()) });
    };

    const handleOnCreate = () => {
        if (!metadata.score) metadata.score = 0;
        /** 유효성 검사 */
        // 문제 텍스트 비어있는지 검사
        if (!metadata.textForRender.trim()) return alert('문제 내용을 입력해 주세요.');
        // 선택지 입력 검사
        if (metadata.type === 'multiple-choice' && !Object.keys(metadata.selections).filter((s) => metadata.selections[s]).length)
            return alert('선택지를 하나 이상 입력해 주세요.');
        // 정답 입력 여부 검사
        if ((metadata.type === 'multiple-choice' && !metadata.answer) || (metadata.type === 'short-answer' && !metadata.answer.trim()))
            return alert('정답을 선택 또는 입력해 주세요.');

        onCreate(metadata);
        handleClose(false);
    };

    const handleCommentOpen = () => {
        setCommentOpen(!commentOpen);
    };

    useEffect(() => {
        setMetadata({
            ...metadata,
            category: problemCategory,
            type: problemType,
        });
    }, [problemCategory, problemType]);

    useEffect(() => {
        setMetadata({
            ...metadata,
            textForRender: problemTexts.render,
            textForEditor: problemTexts.editor,
        });
    }, [problemTexts]);

    useEffect(() => {
        setMetadata({
            ...metadata,
            commentsForRender: problemComments.render,
            commentsForEditor: problemComments.editor,
        });
    }, [problemComments]);

    useEffect(() => {
        setMetadata({
            ...metadata,
            answer: problemAnswer,
        });
    }, [problemAnswer]);

    useEffect(() => {
        setMetadata({
            ...metadata,
            score: problemScore,
        });
    }, [problemScore]);

    useEffect(() => {
        setMetadata({
            ...metadata,
            selections: problemSelections,
        });
    }, [problemSelections]);

    useEffect(() => {
        // console.log(metadata);
    }, [metadata]);

    useEffect(() => {
        const $quillContainer = $(rootRef.current).find('.ql-container');
        $quillContainer.css({ 'min-height': '128px', 'max-height': '192px' });
        $quillContainer.find('.ql-editor').css({ 'min-height': '128px', 'max-height': '192px' });
    }, []);
    return (
        <>
            <Helmet>
                <style>{`
                    .quill.problem-editor > .ql-toolbar.ql-snow {
                        border: none;
                        padding: 4px;
                    }
                    .quill.problem-editor > .ql-container.ql-snow {
                        background-color: #F6F7F9;
                        border: none;
                        font-family: Noto Sans CJK KR;
                    }
                    .quill.problem-editor > .ql-container.ql-snow > .ql-editor {
                        color: #707070;
                        font-family: Noto Sans CJK KR;
                        font-weight: 500;
                        padding: 16px;
                    }
                    .quill.problem-editor > .ql-container.ql-snow > .ql-editor > p > strong, b {
                        // filter: brightness(0.667);
                    }
                    .quill.problem-editor > .ql-container.ql-snow > .ql-editor.ql-blank::before {
                        left: initial;
                        right: initial;
                        top: 50px;
                        left: 24px;
                        color: #707070;
                        font-family: Noto Sans CJK KR;
                        font-size: 1rem;
                        font-style: normal;
                        font-weight: 600;
                        opacity: 0.7;
                    }
            `}</style>
            </Helmet>
            <Root ref={rootRef} className="create-new-problem-root">
                <TitleContainer className="title">
                    <h2>{editmode ? '문제 수정하기' : '새 문제 추가하기'}</h2>
                    <CloseIconRoot>
                        <CloseIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
                    </CloseIconRoot>
                </TitleContainer>
                <FormBox>
                    <Grid container spacing={2}>
                        <Grid item xs={8} sm={5}>
                            {/* <FormControl variant="outlined" fullWidth> */}
                            {/* <InputLabel id="problem_category-label">영역 선택</InputLabel> */}
                            <CategorySelect
                                labelId="problem_category-label"
                                id="problem_category"
                                defaultValue=""
                                onChange={handleChangeCategory}
                                label="category"
                            >
                                <option value="" disabled>
                                    영역 선택
                                    {/* <em style={{ color: '#999999' }}>없음 (기타)</em> */}
                                </option>
                                {ProblemCategories.map(({ id, name, eng, desc, nums }) => (
                                    <option value={id} key={id}>
                                        {name}
                                        {/* <Tooltip
                                            enterDelay={2000}
                                            title={
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    {desc}
                                                    <span style={{ paddingTop: '0.5rem', fontWeight: 600 }}>지문 당 문항 수: {nums}</span>
                                                </div>
                                            }
                                            key={id}
                                        >
                                            <CategoryMenuItemContents>
                                                {name}
                                                <span>{eng}</span>
                                            </CategoryMenuItemContents>
                                        </Tooltip> */}
                                    </option>
                                ))}
                            </CategorySelect>
                            {/* </FormControl> */}
                        </Grid>
                        <Grid item xs={4} sm={3}>
                            {/* <FormControl variant="outlined" fullWidth> */}
                            {/* <InputLabel id="problem_type-label">문제 유형</InputLabel> */}
                            {/* <CategorySelect
                                className="small"
                                labelId="problem_type-label"
                                id="problem_type"
                                value={problemType}
                                onChange={handleChangeType}
                                label="type"
                            >
                                <option value="multiple-choice">선택형</option>
                                <option value="short-answer">단답형</option>
                            </CategorySelect> */}
                            <CategorySelect
                                labelId="score_point-label"
                                id="score_point"
                                defaultValue={problemScore}
                                onChange={handleChangeScore}
                                label="score"
                            >
                                <option value="" disabled>
                                    배점
                                </option>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                            </CategorySelect>
                            {/* </FormControl> */}
                        </Grid>
                        {/* <Grid item xs={12} sm={2}>
                        <TextField
                            type="number"
                            variant="outlined"
                            label="배점"
                            fullWidth
                            value={problemScore}
                            name="score_input"
                            onChange={onTextFieldChange}
                        />
                    </Grid> */}
                    </Grid>
                    <GroupBoxContents title="문제" style={{ marginTop: 28 }}>
                        <ReactQuill
                            id="texts_editor"
                            className="problem-editor"
                            modules={{ toolbar: QuillEditorToolbarOption }}
                            placeholder="문제를 입력하세요. (번호는 제외)"
                            defaultValue={JSON.parse(
                                problemDatas.textForEditor
                                    .replace(/\\n/g, '\\n')
                                    .replace(/\\'/g, "\\'")
                                    .replace(/\\"/g, '\\"')
                                    .replace(/\\&/g, '\\&')
                                    .replace(/\\r/g, '\\r')
                                    .replace(/\\t/g, '\\t')
                                    .replace(/\\b/g, '\\b')
                                    .replace(/\\f/g, '\\f')
                                    .replace(/[\u0000-\u0019]+/g, ''),
                            )}
                            onChange={onQuillEditorChange('texts_editor')}
                        />
                    </GroupBoxContents>
                    <GroupBoxContents
                        title="보기"
                        description="*보기를 입력하고 정답을 선택해 주세요."
                        rightComponent={
                            <CategorySelect
                                className="tiny"
                                labelId="problem_type-label"
                                id="problem_type"
                                value={problemType}
                                onChange={handleChangeType}
                                label="type"
                            >
                                <option value="multiple-choice">선택형</option>
                                <option value="short-answer">단답형</option>
                            </CategorySelect>
                        }
                        style={{ marginTop: 48 }}
                    >
                        <SelectorsContainer>
                            {problemType === 'short-answer' ? (
                                <>
                                    <UCOutlinedInput
                                        variant="outlined"
                                        size="small"
                                        placeholder="정답 입력 (띄어쓰기 제외: 예] ABC)"
                                        fullWidth
                                        value={problemAnswer}
                                        name="short_answer_input"
                                        onChange={onTextFieldChange}
                                    />
                                </>
                            ) : (
                                <>
                                    <OutlinedInput
                                        variant="outlined"
                                        size="small"
                                        placeholder="선택 1"
                                        fullWidth
                                        name="selection_1"
                                        value={problemSelections[1]}
                                        onChange={onTextFieldChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <Tooltip title="1번 선택지를 정답으로 선택">
                                                    <IconButton onClick={onSelectionButtonClick(1)} edge="end" disableRipple>
                                                        {problemAnswer === 1 ? (
                                                            <>
                                                                <span style={{ fontSize: '1rem' }}>정답</span> <RadioButtonChecked />
                                                            </>
                                                        ) : (
                                                            <RadioButtonUncheckedIcon />
                                                        )}
                                                    </IconButton>
                                                </Tooltip>
                                            </InputAdornment>
                                        }
                                    />
                                    <OutlinedInput
                                        variant="outlined"
                                        size="small"
                                        placeholder="선택 2"
                                        fullWidth
                                        style={{ marginTop: 8 }}
                                        name="selection_2"
                                        value={problemSelections[2]}
                                        onChange={onTextFieldChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <Tooltip title="2번 선택지를 정답으로 선택">
                                                    <IconButton onClick={onSelectionButtonClick(2)} edge="end">
                                                        {problemAnswer === 2 ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                                                    </IconButton>
                                                </Tooltip>
                                            </InputAdornment>
                                        }
                                    />
                                    <OutlinedInput
                                        variant="outlined"
                                        size="small"
                                        placeholder="선택 3"
                                        fullWidth
                                        style={{ marginTop: 8 }}
                                        name="selection_3"
                                        value={problemSelections[3]}
                                        onChange={onTextFieldChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <Tooltip title="3번 선택지를 정답으로 선택">
                                                    <IconButton onClick={onSelectionButtonClick(3)} edge="end">
                                                        {problemAnswer === 3 ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                                                    </IconButton>
                                                </Tooltip>
                                            </InputAdornment>
                                        }
                                    />
                                    <OutlinedInput
                                        variant="outlined"
                                        size="small"
                                        placeholder="선택 4"
                                        fullWidth
                                        style={{ marginTop: 8 }}
                                        name="selection_4"
                                        value={problemSelections[4]}
                                        onChange={onTextFieldChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <Tooltip title="4번 선택지를 정답으로 선택">
                                                    <IconButton onClick={onSelectionButtonClick(4)} edge="end">
                                                        {problemAnswer === 4 ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                                                    </IconButton>
                                                </Tooltip>
                                            </InputAdornment>
                                        }
                                    />
                                    <OutlinedInput
                                        variant="outlined"
                                        size="small"
                                        placeholder="선택 5"
                                        fullWidth
                                        style={{ marginTop: 8 }}
                                        name="selection_5"
                                        value={problemSelections[5]}
                                        onChange={onTextFieldChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <Tooltip title="5번 선택지를 정답으로 선택">
                                                    <IconButton onClick={onSelectionButtonClick(5)} edge="end">
                                                        {problemAnswer === 5 ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                                                    </IconButton>
                                                </Tooltip>
                                            </InputAdornment>
                                        }
                                    />
                                </>
                            )}
                        </SelectorsContainer>
                    </GroupBoxContents>
                    <GroupBoxContents
                        title={
                            <>
                                해설<span style={{ fontSize: '0.875rem', fontWeight: 500 }}> (선택)</span>
                            </>
                        }
                        rightComponent={
                            commentOpen ? (
                                <ArrowDropUpIcon className="open-commentary-dropdown-icon" viewBox="7 8 12 12" fontSize="inherit" />
                            ) : (
                                <ArrowDropDownIcon className="open-commentary-dropdown-icon" viewBox="7 8 12 12" fontSize="inherit" />
                            )
                        }
                        onClick={handleCommentOpen}
                        style={{ marginTop: 48 }}
                    >
                        <Collapse in={commentOpen}>
                            <ReactQuill
                                id="comments_editor"
                                className="problem-editor"
                                modules={{ toolbar: QuillEditorToolbarOption }}
                                placeholder="해설을 입력하세요."
                                defaultValue={JSON.parse(
                                    problemDatas.commentsForEditor
                                        .replace(/\\n/g, '\\n')
                                        .replace(/\\'/g, "\\'")
                                        .replace(/\\"/g, '\\"')
                                        .replace(/\\&/g, '\\&')
                                        .replace(/\\r/g, '\\r')
                                        .replace(/\\t/g, '\\t')
                                        .replace(/\\b/g, '\\b')
                                        .replace(/\\f/g, '\\f')
                                        .replace(/[\u0000-\u0019]+/g, ''),
                                )}
                                onChange={onQuillEditorChange('comments_editor')}
                                style={{ marginTop: 8 }}
                            />
                        </Collapse>
                    </GroupBoxContents>
                    <CreateButtonContainer>
                        <CreateButton
                            className="primary"
                            size="large"
                            variant="contained"
                            disabled={createButtonEnabled}
                            onClick={handleOnCreate}
                        >
                            {editmode ? '수정하기' : '추가하기'}
                        </CreateButton>
                    </CreateButtonContainer>
                </FormBox>
            </Root>
        </>
    );
}

CreateNewProblem.defaultProps = {
    problemDatas: {
        category: '',
        type: 'multiple-choice',
        textForRender: '',
        textForEditor: `{"ops":[{"insert":"\n"}]}`,
        commentsForRender: '',
        commentsForEditor: `{"ops":[{"insert":"\n"}]}`,
        selections: {
            1: '',
            2: '',
            3: '',
            4: '',
            5: '',
        },
        answer: '',
        score: '',
    },
    editmode: false,
};

export default CreateNewProblem;
