import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import ReactQuill from 'react-quill';
import { Button, Collapse, Grid, IconButton, InputAdornment, OutlinedInput, Tooltip, withStyles } from '@material-ui/core';
import QuillEditorToolbarOption from './QuillEditorToolbarOption';
import ProblemCategories from './ProblemCategories';
import * as $ from 'jquery';
import { Helmet } from 'react-helmet';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import { Add as AddIcon, DeleteForever as DeleteForeverIcon, RadioButtonChecked } from '@material-ui/icons';

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
        font-weight: 600;
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
const SelectorsContainer = styled.div`
    margin-top: 16px;
`;
const CreateButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 72px;
`;
const AutomaticFragment = styled.div`
    display: flex;
    position: relative;

    &.select-box + .select-box {
        margin-top: 18px;
    }
`;

const CreateButton = withStyles((theme) => ({
    root: {
        borderRadius: '10px',
        color: '#fff',
        fontFamily: 'Noto Sans CJK KR',
        fontSize: '0.9rem',
        fontWeight: 600,
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

const AddSelectionButton = withStyles((theme) => ({
    root: {
        backgroundColor: '#F6F7F9',
        borderRadius: 14,
        color: 'rgba(112, 112, 112, 0.8)',
        fontFamily: 'Noto Sans CJK KR',
        fontSize: '1rem',
        fontWeight: 600,
        justifyContent: 'flex-start',
        minHeight: 70,
        padding: '18px 24px',

        '&.primary': {
            backgroundColor: '#F6F7F9',
        },
    },
}))(Button);

const CategorySelect = styled.select`
    cursor: pointer;
    background: url(/bg_images/Vector.png) no-repeat 92% 50%;
    width: 100%;
    min-height: 40px;
    padding: 0 0.8rem;
    font-family: inherit;
    font-size: 1.001rem;
    border: none;
    border: 1px solid rgba(112, 112, 112, 0.79);
    border-radius: 0px;
    color: #707070;
    font-weight: 500;
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

const HeaderBox = styled.header`
    align-items: flex-end;
    border-bottom: 1px solid #707070;
    color: #707070;
    display: flex;
    flex-direction: row;
    font-weight: 500;
    justify-content: space-between;
    padding: 6px 0 6px 2px;

    & h5.title {
        font-size: 1rem;
        font-weight: 600;
    }

    & p.description {
        font-size: 0.875rem;
        margin-bottom: 2px;
    }

    & svg.open-commentary-dropdown-icon {
        cursor: pointer;
    }
`;

const SeletionInput = withStyles((theme) => ({
    root: {
        backgroundColor: '#F6F7F9',
        borderRadius: 14,
        color: 'rgba(112, 112, 112, 0.8)',
        fontFamily: 'Noto Sans CJK KR',
        fontSize: '1rem',
        fontWeight: 600,
        minHeight: 70,
        padding: '0 24px',

        '&:hover': {
            '& fieldset': {
                borderColor: 'rgb(112 112 112 / 33%) !important',
            },
        },

        '&.Mui-focused': {
            '& fieldset': {
                borderColor: 'rgb(112 112 112 / 33%) !important',
            },
        },

        '& fieldset': {
            borderColor: 'rgb(0 0 0 / 0%)',
        },
    },
}))(OutlinedInput);
const EdIconButton = withStyles((theme) => ({
    root: {
        '&:hover': {
            backgroundColor: '#ffffff00',
        },
    },
}))(IconButton);

function GroupBoxContents({ title, description, rightComponent, onClick, children, ...rest }) {
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

const SelectionBox = React.memo(function ({
    key,
    displayNumberType,
    number,
    contents,
    answer,
    onTextFieldChange,
    onSelectAsAnswer,
    onDelete,
}) {
    const alphabets = ['a', 'b', 'c', 'd', 'e'];
    const [itemHovered, setItemHovered] = useState(false);
    const handleOnTextFieldChange = ({ target }) => {
        const { value } = target;
        onTextFieldChange(value, number);
    };
    const handleOnSelectAsAnswer = () => {
        onSelectAsAnswer(number + 1);
    };
    const handleOnDelete = () => {
        onDelete(number);
    };
    return (
        <AutomaticFragment
            key={key}
            className="select-box"
            onMouseOver={() => {
                setItemHovered(true);
            }}
            onMouseLeave={() => {
                setItemHovered(false);
            }}
        >
            {itemHovered ? (
                <EdIconButton disableRipple style={{ position: 'absolute', left: -42, height: '100%' }} onClick={handleOnDelete}>
                    <DeleteForeverIcon fontSize="small" />
                </EdIconButton>
            ) : null}
            <SeletionInput
                size="small"
                placeholder="보기를 입력해주세요."
                fullWidth
                name={'selection_' + number}
                value={contents}
                onChange={handleOnTextFieldChange}
                startAdornment={
                    <span style={{ marginRight: 24 }}>{(displayNumberType === 'number' ? number : alphabets[number]) + '.'}</span>
                }
                endAdornment={
                    <InputAdornment position="end">
                        <Tooltip title={`${displayNumberType === 'number' ? number : alphabets[number]}번 선택지를 정답으로 선택`}>
                            <EdIconButton onClick={handleOnSelectAsAnswer} edge="end" disableRipple>
                                {number + 1 === answer ? (
                                    <>
                                        <span style={{ fontSize: '1rem', fontWeight: 600, marginRight: 8 }}>정답</span>{' '}
                                        <RadioButtonChecked />
                                    </>
                                ) : (
                                    <RadioButtonUncheckedIcon />
                                )}
                            </EdIconButton>
                        </Tooltip>
                    </InputAdornment>
                }
            />
        </AutomaticFragment>
    );
});
SelectionBox.defaultProps = {
    displayNumberType: 'number',
    number: 0,
    contents: '',
    answer: null,
    onTextFieldChange() {},
    onSelectAsAnswer() {},
    onDelete() {},
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
    const [selectionsArr, setSelectionsArr] = useState(
        Object.keys(problemSelections)
            .map((d) => problemSelections[d])
            .filter((d) => d !== null),
    );
    const [commentOpen, setCommentOpen] = useState(false);

    const handleChangeCategory = (e) => {
        const cat = e.target.value;
        setProblemCategory(parseInt(cat));
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

    const onSelectionButtonClick = (id) => {
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
        // 문제 유형 선택했는지 검사
        if (metadata.category === '' || metadata.category === null) return alert('문제 유형을 선택해 주세요.');
        // 배점 선택했는지 검사
        if (!metadata.score) return alert('배점을 선택해 주세요.');
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

    const onSelectionTextChanged = (value, idx) => {
        setSelectionsArr(selectionsArr.map((d, i) => (i === idx ? value : d)));
    };

    const handleAddSelection = () => {
        const limit = 5;
        if (selectionsArr.length >= limit) return;
        setSelectionsArr([...selectionsArr, String.fromCharCode(65 + selectionsArr.length)]);
    };

    const handleDeleteSelection = (idx) => {
        const limit = 1;
        if (selectionsArr.length <= limit) return;
        console.log(selectionsArr.filter((d, i) => i !== idx));
        setSelectionsArr(selectionsArr.filter((d, i) => i !== idx));
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
        const mapToObj = {};
        const selectionsLength = selectionsArr.length;
        for (let i = 0; i < selectionsLength; i++) {
            if (selectionsArr[i].trim()) mapToObj[i + 1] = selectionsArr[i];
        }
        setProblemSelections(mapToObj);
    }, [selectionsArr]);

    useEffect(() => {
        setMetadata({
            ...metadata,
            selections: problemSelections,
        });
    }, [problemSelections]);

    useEffect(() => {}, [metadata]);

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
                            <CategorySelect
                                labelId="problem_category-label"
                                id="problem_category"
                                defaultValue={problemCategory}
                                onChange={handleChangeCategory}
                                label="category"
                            >
                                <option value="" disabled>
                                    영역 선택
                                </option>
                                {ProblemCategories.map(({ id, name, eng, desc, nums }) => (
                                    <option value={id} key={id}>
                                        {name}
                                    </option>
                                ))}
                            </CategorySelect>
                        </Grid>
                        <Grid item xs={4} sm={3}>
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
                                <option value={1}>1점</option>
                                <option value={2}>2점</option>
                                <option value={3}>3점</option>
                                <option value={4}>4점</option>
                                <option value={5}>5점</option>
                            </CategorySelect>
                        </Grid>
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
                                    <SeletionInput
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
                                    {selectionsArr.map((contents, idx) => (
                                        <SelectionBox
                                            key={idx}
                                            displayNumberType="alphabetics"
                                            number={idx}
                                            contents={contents}
                                            answer={problemAnswer}
                                            onTextFieldChange={onSelectionTextChanged}
                                            onSelectAsAnswer={onSelectionButtonClick}
                                            onDelete={handleDeleteSelection}
                                        />
                                    ))}
                                    <AddSelectionButton
                                        className="primary"
                                        fullWidth
                                        startIcon={<AddIcon fontSize="large" style={{ marginRight: 4 }} />}
                                        style={{ marginTop: 18 }}
                                        onClick={handleAddSelection}
                                    >
                                        보기 추가
                                    </AddSelectionButton>
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
            1: 'A',
            2: null,
            3: null,
            4: null,
            5: null,
        },
        answer: '',
        score: 1,
    },
    editmode: false,
};

export default React.memo(CreateNewProblem);
