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

const jsonParse = (string) => {
    return eval('(' + string.replace(/[\n\r]/gi, '\\n') + ')')
        ? eval('(' + string.replace(/[\n\r]/gi, '\\n') + ')')
        : { ops: [{ insert: '\n' }] };
};

const Root = styled.div`
    padding: 72px 84px;
    max-width: 600px;

    @media all and (max-width: 768px) {
        padding: 32px;
    }
`;
const CloseIconRoot = styled.div`
    width: calc(100vw - 64px);
`;
const TitleContainer = styled.div`
    margin-top: 48px;

    @media all and (max-width: 768px) {
        margin-top: 24px;
    }
`;
const FormBox = styled.div`
    margin-top: 36px;
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
    margin-top: 24px;
`;
const CreateButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 42px;
`;

const CreateButton = withStyles((theme) => ({
    root: {
        color: '#474747',
        fontFamily: 'inherit',
        minWidth: 128,
        minHeight: 52,
    },
}))(Button);

const UCOutlinedInput = withStyles((theme) => ({
    root: {
        '& input': {
            textTransform: 'uppercase',
        },
    },
}))(OutlinedInput);

function CreateNewProblem({ problemDatas, handleClose, onCreate, editmode }) {
    const rootRef = useRef();
    const [createButtonEnabled, setCreateButtonEnabled] = useState(false);

    const [metadata, setMetadata] = useState(problemDatas);
    const [problemCategory, setProblemCategory] = useState(problemDatas.category);
    const [problemType, setProblemType] = useState(problemDatas.type);
    const [problemTexts, setProblemTexts] = useState({ render: problemDatas.textForRender, editor: problemDatas.textForEditor });
    const [problemAnswer, setProblemAnswer] = useState(problemDatas.answer);
    const [problemSelections, setProblemSelections] = useState(problemDatas.selections);

    const handleChangeCategory = (e) => {
        const cat = e.target.value;
        setProblemCategory(cat);
        switch (cat) {
            case 9:
                setProblemType('short-answer');
                break;
            default:
                setProblemType('multiple-choice');
                break;
        }
    };

    const onSelectionButtonClick = (id) => (event) => {
        setProblemAnswer(id);
    };

    const onTextFieldChange = ({ target }) => {
        const { name, value } = target;
        switch (name) {
            case 'short_answer_input':
                if (typeof value === 'string' && problemCategory === 9) setProblemAnswer(value.toUpperCase());
                else setProblemAnswer(value);
                break;
            default:
                setProblemSelections({
                    ...problemSelections,
                    [name.replace('selection_', '')]: value,
                });
                break;
        }
    };

    const onQuillEditorChange = (content, delta, source, editor) => {
        setProblemTexts({ render: content, editor: JSON.stringify(editor.getContents()) });
    };

    const handleOnCreate = () => {
        onCreate(metadata);
        handleClose(false);
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
            answer: problemAnswer,
        });
    }, [problemAnswer]);

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
        $quillContainer.css({ 'min-height': '128px', 'max-height': '240px' });
        $quillContainer.find('.ql-editor').css({ 'max-height': '240px' });
    }, []);
    return (
        <Root ref={rootRef} className="create-new-problem-root">
            <CloseIconRoot>
                <CloseIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
            </CloseIconRoot>
            <TitleContainer className="title">
                <h2>{editmode ? '문제 수정' : '새 문제 만들기'}</h2>
            </TitleContainer>
            <FormBox>
                <FormControl variant="outlined" fullWidth size="small">
                    <InputLabel id="problem_category-label">문제유형 선택</InputLabel>
                    <Select
                        labelId="problem_category-label"
                        id="problem_category"
                        value={problemCategory}
                        onChange={handleChangeCategory}
                        label="category"
                    >
                        <MenuItem value={0}>
                            <em style={{ color: '#999999' }}>없음 (기타)</em>
                        </MenuItem>
                        {ProblemCategories.map(({ id, name, eng, desc, nums }) => (
                            <MenuItem value={id} key={id}>
                                <Tooltip
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
                                </Tooltip>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Collapse in={problemCategory !== ''} style={{ marginTop: 24 }}>
                    <ReactQuill
                        modules={{ toolbar: QuillEditorToolbarOption }}
                        placeholder="여기에 문제 내용을 입력해 주세요."
                        defaultValue={jsonParse(problemDatas.textForEditor)}
                        onChange={onQuillEditorChange}
                    />
                    <SelectorsContainer>
                        {problemCategory === 9 ? (
                            <>
                                <UCOutlinedInput
                                    variant="outlined"
                                    size="small"
                                    placeholder="정답 입력 (띄어쓰기 제외: ABC)"
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
                                            <Tooltip title="정답으로 선택">
                                                <IconButton onClick={onSelectionButtonClick(1)} edge="end">
                                                    {problemAnswer === 1 ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
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
                                            <Tooltip title="정답으로 선택">
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
                                            <Tooltip title="정답으로 선택">
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
                                            <Tooltip title="정답으로 선택">
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
                                            <Tooltip title="정답으로 선택">
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
                    <CreateButtonContainer>
                        <CreateButton size="large" variant="contained" disabled={createButtonEnabled} onClick={handleOnCreate}>
                            {editmode ? '수정' : '만들기'}
                        </CreateButton>
                    </CreateButtonContainer>
                </Collapse>
            </FormBox>
        </Root>
    );
}

CreateNewProblem.defaultProps = {
    problemDatas: {
        category: '',
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
        answer: '',
    },
    editmode: false,
};

export default CreateNewProblem;
