import { Checkbox, CircularProgress, TextField, withStyles } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import classNames from 'classnames';
import React, { useState } from 'react';

const EdTextField = withStyles((theme) => ({
    root: {
        fontFamily: 'inherit',
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
                height: '2rem',
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

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function MultipleAutocomplete({
    id,
    onOpen,
    onClose,
    onChange,
    value,
    defaultValue,
    options,
    getOptionLabel,
    loading,
    error,
    placeholder,
}) {
    const [selectedValue, setSelectedValue] = useState(value);
    const selectedChange = (e, value) => {
        onChange(e, value);
        setSelectedValue(value);
    };
    return (
        <Autocomplete
            multiple
            noOptionsText="남은 학생이 없습니다!"
            id={id}
            onOpen={onOpen}
            onClose={onClose}
            onChange={selectedChange}
            defaultValue={defaultValue}
            disableCloseOnSelect
            filterSelectedOptions
            value={selectedValue}
            options={options.filter((option) => selectedValue.filter((selected) => selected.student_id === option.student_id).length < 1)}
            getOptionLabel={getOptionLabel}
            loading={loading}
            renderOption={(option, state) => <React.Fragment>{option.name}</React.Fragment>}
            renderInput={(params) => (
                <EdTextField
                    {...params}
                    className={classNames(error ? 'error' : '')}
                    variant="outlined"
                    placeholder={placeholder}
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
    );
}

MultipleAutocomplete.defaultProps = {
    id: 'multiple_auto_complete',
    value: '',
    defaultValue: '',
    options: [
        { name: '전광희', email: 'khjeon1994' },
        { name: '최준영', email: 'junyoung094' },
        { name: '최세인', email: 'chyh1900' },
    ],
    loading: false,
    error: false,
    placeholder: '다중 선택',
    getOptionLabel: (option) => option.name + ' - ' + option.email,
    onChange() {},
};

export default React.memo(MultipleAutocomplete);
