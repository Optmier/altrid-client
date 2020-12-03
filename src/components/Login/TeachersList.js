import { Checkbox, CircularProgress, TextField, withStyles } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import classNames from 'classnames';
import React from 'react';

const EdTextField = withStyles((theme) => ({
    root: {
        fontFamily: 'inherit',
        '& .MuiInputBase-root': {
            backgroundColor: '#f6f7f9',
            border: '1px solid #d6d6d6',
            borderRadius: 4,
            boxSizing: 'border-box',
            color: '#474747',
            fontFamily: 'inherit',
            fontSize: '1rem',
            lineHeight: '2.625rem',
            paddingRight: '9px !important',
            width: '100%',
            minHeight: 52,
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
                margin: '0 0 0 15px',
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

function TeachersList({ id, onChange, value, defaultValue, options, getOptionLabel, loading, error, placeholder }) {
    return (
        <Autocomplete
            multiple
            noOptionsText="선생님이 없습니다!"
            id={id}
            onChange={onChange}
            // defaultValue={defaultValue}
            //value={value}
            disableCloseOnSelect
            options={options}
            getOptionLabel={getOptionLabel}
            loading={loading}
            renderOption={(option, { selected }) => (
                <React.Fragment>
                    <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                    {option.name} 선생님
                </React.Fragment>
            )}
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

TeachersList.defaultProps = {
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
    getOptionLabel: (option) => {
        if (!option) return '';
        return option.name + ' 선생님';
    },
    onChange() {},
};

export default React.memo(TeachersList);
