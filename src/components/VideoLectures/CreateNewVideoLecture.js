import {
    Button,
    Switch,
    IconButton,
    OutlinedInput,
    withStyles,
    FormControlLabel,
    makeStyles,
    TextField,
    Collapse,
} from '@material-ui/core';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import moment from 'moment-timezone';
import CloseIcon from '@material-ui/icons/Close';
import { useSelector } from 'react-redux';
import RestrictWrapper from '../essentials/RestrictWrapper';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
}));

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

        '& textarea.MuiOutlinedInput-input': {
            padding: '18.5px 14px',
            '&::placeholder': {
                paddingTop: '48px',
            },
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

const StyleToggle = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;

    & .toggle-on-ment {
        font-size: 14px;
        font-weight: 500;
        color: white;
        margin-left: 8px;
    }
    & .toggle-on-ment-right {
        font-size: 14px;
        font-weight: 500;
        color: white;
        margin-right: 8px;
    }
    & .toggle-off-ment {
        font-size: 14px;
        font-weight: 500;
        color: white;
        margin-left: 8px;
    }
    & .toggle-off-ment-right {
        font-size: 14px;
        font-weight: 500;
        color: #707070;
        margin-right: 8px;
    }
`;

const DrawerSwitch = withStyles((theme) => ({
    root: {
        width: 28,
        height: 16,
        padding: 0,
        display: 'flex',
    },
    switchBase: {
        padding: 2,
        color: 'white',
        '&$checked': {
            transform: 'translateX(12px)',
            color: 'white',
            '& + $track': {
                opacity: 1,
                backgroundColor: '#13E2A1',
                border: 'none',
            },
        },

        '& + $track': {
            backgroundColor: '#C4C4C4',
            border: 'none',
        },
    },
    thumb: {
        width: 12,
        height: 12,
        boxShadow: 'none',
    },
    track: {
        border: `1px solid ${theme.palette.grey[500]}`,
        borderRadius: 16 / 2,
        opacity: 1,
        backgroundColor: theme.palette.common.white,
    },
    checked: {},
}))(Switch);

const DateTextField = withStyles((theme) => ({
    root: {
        border: '1px solid #707070',
        fontFamily: 'inherit',

        outline: 'none',
        margin: '8px 0 4px 0',
        '& .MuiInputBase-root': {
            color: '#707070',
            fontSize: '1rem',
            outline: 'none',

            '&.Mui-focused': {
                backgroundColor: '#f2f3f6',
                boxShadow: '0 0 0 2px #8f8f8f',
            },
            '&.MuiInput-underline:before': {
                border: 'none',
            },

            '&.MuiInput-underline:after': {
                border: 'none',
            },
            '& input': {
                padding: 12,
                outline: 'none !important',
            },
        },
    },
}))(TextField);

function CreateNewVideoLecture({ onCreate, handleClose }) {
    const classes = useStyles();
    const rootRef = useRef();
    const [formFields, setFormFields] = useState({
        title: '',
        description: '',
        hasStartDate: false,
        startDate: moment().format('YYYY-MM-DDTHH:mm'),
        endDate: moment().add('days', 1).format('YYYY-MM-DDTHH:mm'),
        hasEyetrack: false,
    });
    const [formFieldsError, setFormFieldsError] = useState({
        title: false,
        description: false,
        endDate: false,
    });

    const { videoLecture } = useSelector((state) => state.planInfo.restricted);

    const handleFormChange = ({ target }, val2) => {
        const { name } = target;
        const value = target.value || val2;
        switch (name) {
            case 'hasStartDate':
                setFormFields({ ...formFields, [name]: value, startDate: moment().format('YYYY-MM-DDTHH:mm') });
                break;
            case 'startDate':
            case 'endDate':
                if (moment(value).format('YYMMDDHHmmss') > moment().format('YYMMDDHHmmss')) {
                    setFormFieldsError({ ...formFieldsError, [name]: false });
                    setFormFields({ ...formFields, [name]: moment(value).format('YYYY-MM-DDTHH:mm') });
                }
                break;
            default:
                setFormFieldsError({ ...formFieldsError, [name]: false });
                setFormFields({ ...formFields, [name]: value });
                break;
        }
    };

    const handleCreate = () => {
        onCreate(formFields);
    };

    return (
        <>
            <Root ref={rootRef} className="create-new-problem-root">
                <TitleContainer className="title">
                    <h2>화상 강의 생성하기</h2>
                    <CloseIconRoot>
                        <CloseIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
                    </CloseIconRoot>
                </TitleContainer>

                <FormBox>
                    <RestrictWrapper type="default" restricted={videoLecture} minWidth='300px'>
                        <GroupBoxContents title="기본 정보">
                            <SelectorsContainer>
                                <SeletionInput
                                    size="small"
                                    placeholder="강의 제목"
                                    fullWidth
                                    id="title"
                                    name="title"
                                    type="text"
                                    autoFocus
                                    error={formFieldsError.title}
                                    onChange={handleFormChange}
                                />
                                <SeletionInput
                                    size="small"
                                    placeholder="강의 설명"
                                    fullWidth
                                    multiline
                                    rows={6}
                                    id="description"
                                    name="description"
                                    type="text"
                                    error={formFieldsError.description}
                                    onChange={handleFormChange}
                                    style={{ marginTop: 18 }}
                                />
                            </SelectorsContainer>
                        </GroupBoxContents>
                        <GroupBoxContents
                            title="날짜 및 시간"
                            style={{ marginTop: 28 }}
                            rightComponent={
                                <div style={{ alignItems: 'center', display: 'flex' }}>
                                    <p style={{ marginRight: 16 }}>시작 예약 설정</p>
                                    <DrawerSwitch checked={formFields.hasStartDate} onChange={handleFormChange} name="hasStartDate" />
                                </div>
                            }
                        >
                            <SelectorsContainer style={{ padding: '0 8px' }}>
                                <Collapse in={formFields.hasStartDate}>
                                    <div
                                        style={{
                                            alignItems: 'center',
                                            color: 'rgba(112, 112, 112, 0.8)',
                                            display: 'flex',
                                            fontWeight: 600,
                                        }}
                                    >
                                        <p style={{ marginRight: 16, minWidth: '4rem' }}>시작 날짜</p>
                                        <DateTextField
                                            onChange={handleFormChange}
                                            value={formFields.startDate}
                                            id="startDate"
                                            name="startDate"
                                            type="datetime-local"
                                            className={classes.textField}
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </div>
                                </Collapse>
                                <div style={{ alignItems: 'center', color: 'rgba(112, 112, 112, 0.8)', display: 'flex', fontWeight: 600 }}>
                                    <p style={{ marginRight: 16, minWidth: '4rem' }}>종료 날짜</p>
                                    <DateTextField
                                        onChange={handleFormChange}
                                        value={formFields.endDate}
                                        id="endDate"
                                        name="endDate"
                                        type="datetime-local"
                                        className={classes.textField}
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </div>
                            </SelectorsContainer>
                        </GroupBoxContents>
                        <GroupBoxContents title="강의 설정" style={{ marginTop: 28 }}>
                            <SelectorsContainer style={{ padding: '0 8px' }}>
                                <div style={{ alignItems: 'center', color: '#707070', display: 'flex', fontWeight: 500 }}>
                                    <p style={{ marginRight: 16 }}>시선흐름 측정</p>
                                    <DrawerSwitch checked={formFields.hasEyetrack} onChange={handleFormChange} name="hasEyetrack" />
                                </div>
                            </SelectorsContainer>
                        </GroupBoxContents>
                        <CreateButtonContainer>
                            <CreateButton className="primary" size="large" variant="contained" onClick={handleCreate}>
                                생성하기
                            </CreateButton>
                        </CreateButtonContainer>
                    </RestrictWrapper>
                </FormBox>
            </Root>
        </>
    );
}

export default React.memo(CreateNewVideoLecture);
