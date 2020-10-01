import React, { useEffect, useState } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import { Button, CircularProgress, TextField, withStyles } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import classNames from 'classnames';
import * as $ from 'jquery';

const testData = [
    { name: '전광희', email: 'khjeon1994' },
    { name: '최준영', email: 'junyoung094' },
    { name: '최세인', email: 'chyh1900' },
    { name: '전광희', email: 'khjeon1994' },
    { name: '최준영', email: 'junyoung094' },
    { name: '최세인', email: 'chyh1900' },
    { name: '전광희', email: 'khjeon1994' },
    { name: '최준영', email: 'junyoung094' },
    { name: '최세인', email: 'chyh1900' },
    { name: '전광희', email: 'khjeon1994' },
    { name: '최준영', email: 'junyoung094' },
    { name: '최세인', email: 'chyh1900' },
    { name: '전광희', email: 'khjeon1994' },
    { name: '최준영', email: 'junyoung094' },
    { name: '최세인', email: 'chyh1900' },
    { name: '전광희', email: 'khjeon1994' },
    { name: '최준영', email: 'junyoung094' },
    { name: '최세인', email: 'chyh1900' },
    { name: '전광희', email: 'khjeon1994' },
    { name: '최준영', email: 'junyoung094' },
    { name: '최세인', email: 'chyh1900' },
];

const CreateButton = withStyles((theme) => ({
    root: {
        color: '#474747',
        fontFamily: 'inherit',
        minWidth: 128,
        minHeight: 52,
    },
}))(Button);

const EdTextField = withStyles((theme) => ({
    root: {
        fontFamily: 'inherit',
        marginTop: 24,
        '& .MuiInputBase-root': {
            backgroundColor: '#f6f7f9',
            border: 'none',
            borderRadius: 10,
            boxSizing: 'border-box',
            color: '#474747',
            fontFamily: 'inherit',
            fontSize: '1rem',
            lineHeight: '2.625rem',
            paddingRight: '9px !important',
            width: '100%',
            minHeight: 60,
            outline: 'none',
            '&.Mui-focused': {
                backgroundColor: '#f2f3f6',
                border: 'none',
                boxShadow: '0 0 0 2px #8f8f8f',
                outline: 'none',
            },
            '& .MuiChip-root.MuiAutocomplete-tag.MuiChip-deletable': {
                fontFamily: 'inherit',
            },
            '& .MuiAutocomplete-endAdornment': {
                display: 'none',
            },
            '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
            },
            '& .MuiInputBase-input.MuiOutlinedInput-input.MuiAutocomplete-input.MuiAutocomplete-inputFocused.MuiInputBase-inputAdornedEnd.MuiOutlinedInput-inputAdornedEnd': {
                color: '#474747',
                fontFamily: 'inherit',
                padding: 0,
                margin: '0 0 0 21px',
                '&::placeholder': {
                    color: '#000000',
                },
            },
        },
        '&.error': {
            '& .MuiInputBase-root': {
                '&.Mui-focused': {
                    boxShadow: '0 0 0 2px #ff8383',
                },
                '& .MuiInputBase-input.MuiOutlinedInput-input.MuiAutocomplete-input.MuiAutocomplete-inputFocused.MuiInputBase-inputAdornedEnd.MuiOutlinedInput-inputAdornedEnd': {
                    color: '#ff4646',
                    '&::placeholder': {
                        color: '#ff0000',
                    },
                },
            },
        },
    },
}))(TextField);

function CreateNewEntry({ handleClose }) {
    const [createButtonEnabled, setCreateButtonEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [inputState, setInputState] = useState({
        entry_new_name: '',
        entry_new_description: '',
        entry_new_students: [],
    });
    const [inputError, setInputError] = useState(false);

    const handleInputChange = (e, value) => {
        if ($(e.target).hasClass('default')) {
            setInputState({
                ...inputState,
                [e.target.name]: e.target.value,
            });
        } else {
            setInputState({
                ...inputState,
                entry_new_students: value,
            });
        }
    };

    const handleClickCreate = () => {
        if (!inputState['entry_new_name'].trim()) {
            setInputError(true);
        } else {
            setInputError(false);
        }
    };

    useEffect(() => {
        if (!inputState['entry_new_name'].trim()) {
            setCreateButtonEnabled(false);
        } else {
            setCreateButtonEnabled(true);
        }

        // 중복 체크하기
    }, [inputState]);

    return (
        <div className="create-new-entry-root">
            <div className="close-icon" onClick={handleClose}>
                <CloseIcon />
            </div>
            <div className="title">
                <h2>클래스를 생성하여 시작해보세요 :)</h2>
            </div>
            <div className="form-container">
                <input
                    className={classNames('default', inputError ? 'error' : '')}
                    type="text"
                    name="entry_new_name"
                    id="entry_new_name"
                    placeholder="클래스 이름"
                    onChange={handleInputChange}
                    value={inputState['entry_new_name']}
                />
                <input
                    className="default"
                    type="text"
                    name="entry_new_description"
                    id="entry_new_description"
                    placeholder="클래스 한줄 설명"
                    onChange={handleInputChange}
                    value={inputState['entry_new_description']}
                />
                <Autocomplete
                    multiple
                    id="entry_new_students"
                    onChange={handleInputChange}
                    value={inputState['entry_new_students']}
                    options={testData}
                    getOptionLabel={(option) => option.name + ' - ' + option.email}
                    filterSelectedOptions
                    loading={loading}
                    renderInput={(params) => (
                        <EdTextField
                            {...params}
                            variant="outlined"
                            placeholder="수강생 선택"
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                            }}
                        />
                    )}
                />
            </div>
            <div className="create-button">
                <CreateButton size="large" variant="contained" disabled={!createButtonEnabled} onClick={handleClickCreate}>
                    만들기
                </CreateButton>
            </div>
        </div>
    );
}

export default CreateNewEntry;
