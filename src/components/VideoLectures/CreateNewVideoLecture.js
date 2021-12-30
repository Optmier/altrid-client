import { Switch, OutlinedInput, withStyles } from '@material-ui/core';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import moment from 'moment-timezone';
import { useSelector } from 'react-redux';
import RestrictWrapper from '../essentials/RestrictWrapper';
import DrawerGroupBox from '../../AltridUI/Drawer/DrawerGroupBox';
import BulbIcon from '../../AltridUI/Icons/drawer-groupbox-icon-bulb.svg';
import DrawerActions from '../../AltridUI/Drawer/DrawerActions';
import Button from '../../AltridUI/Button/Button';
import TextField from '../../AltridUI/TextField/TextField';
import CalendarIcon from '../../AltridUI/Icons/CalendarIcon';

const Root = styled.div`
    padding: 36px 48px;
    max-width: 600px;

    @media all and (max-width: 768px) {
        padding: 32px;
    }
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
const SelectorsContainer = styled.div``;
const CreateButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 72px;
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
        // minHeight: 70,
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

function CreateNewVideoLecture({ onCreate, handleClose }) {
    const rootRef = useRef();
    const [formFields, setFormFields] = useState({
        title: '',
        description: '',
        hasStartDate: true,
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
        // console.log(formFields);
        onCreate(formFields);
    };

    return (
        <>
            <Root ref={rootRef} className="create-new-problem-root">
                <TitleContainer className="title">
                    <svg onClick={handleClose} width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="48" rx="16" fill="#F6F8F9" />
                        <path
                            d="M24 22.5862L28.95 17.6362L30.364 19.0502L25.414 24.0002L30.364 28.9502L28.95 30.3642L24 25.4142L19.05 30.3642L17.636 28.9502L22.586 24.0002L17.636 19.0502L19.05 17.6362L24 22.5862Z"
                            fill="#77818B"
                        />
                    </svg>
                </TitleContainer>

                <FormBox>
                    <RestrictWrapper type="default" restricted={videoLecture} minWidth="300px">
                        <h2>화상강의를 생성하세요</h2>
                        <DrawerGroupBox title="기본 정보" description="클래스 소개를 입력하세요" descriptionAdornment={BulbIcon}>
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
                        </DrawerGroupBox>
                        {/* <GroupBoxContents
                            title="날짜 및 시간"
                            style={{ marginTop: 28 }}
                            rightComponent={
                                <div style={{ alignItems: 'center', display: 'flex' }}>
                                    <p style={{ marginRight: 16 }}>시작 예약 설정</p>
                                    <DrawerSwitch checked={formFields.hasStartDate} onChange={handleFormChange} name="hasStartDate" />
                                </div>
                            }
                        > */}
                        <DrawerGroupBox
                            title="날짜 및 시간"
                            description="시작 날짜 및 종료 날짜를 정해주세요"
                            descriptionAdornment={BulbIcon}
                        >
                            <SelectorsContainer>
                                {/* <div
                                    style={{
                                        alignItems: 'center',
                                        color: 'rgba(112, 112, 112, 0.8)',
                                        display: 'flex',
                                        fontWeight: 600,
                                    }}
                                ><p style={{ marginRight: 16, minWidth: '4rem' }}>시작 날짜</p> */}
                                <TextField
                                    onChange={handleFormChange}
                                    value={formFields.startDate}
                                    label="시작 날짜"
                                    id="startDate"
                                    name="startDate"
                                    type="datetime-local"
                                    fullWidth
                                    variant="filled"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        disableUnderline: true,
                                        endAdornment: <CalendarIcon style={{ position: 'absolute', right: 18 }} />,
                                    }}
                                />
                                {/* </div> */}
                                {/* <div style={{ alignItems: 'center', color: 'rgba(112, 112, 112, 0.8)', display: 'flex', fontWeight: 600 }}> */}
                                {/* <p style={{ marginRight: 16, minWidth: '4rem' }}>종료 날짜</p> */}
                                <TextField
                                    onChange={handleFormChange}
                                    value={formFields.endDate}
                                    label="종료 날짜"
                                    id="endDate"
                                    name="endDate"
                                    type="datetime-local"
                                    fullWidth
                                    variant="filled"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        disableUnderline: true,
                                        endAdornment: <CalendarIcon style={{ position: 'absolute', right: 18 }} />,
                                    }}
                                    style={{ marginTop: 16 }}
                                />
                                {/* </div> */}
                            </SelectorsContainer>
                        </DrawerGroupBox>

                        <DrawerGroupBox title="강의 설정" description="시선추적 여부를 설정해주세요" descriptionAdornment={BulbIcon}>
                            <SelectorsContainer>
                                <div
                                    className="toggle"
                                    style={{
                                        display: 'flex',
                                        backgroundColor: '#F6F8F9',
                                        height: '56px',
                                        borderRadius: '16px',
                                        alignItems: 'center',
                                    }}
                                >
                                    <p style={{ marginRight: 16, marginLeft: 16 }}>시선흐름 측정</p>
                                    <DrawerSwitch checked={formFields.hasEyetrack} onChange={handleFormChange} name="hasEyetrack" />
                                </div>
                            </SelectorsContainer>
                        </DrawerGroupBox>

                        <CreateButtonContainer>
                            <DrawerActions>
                                <Button variant="filled" colors="purple" onClick={handleCreate}>
                                    생성하기
                                </Button>
                            </DrawerActions>
                            {/* <CreateButton className="primary" size="large" variant="contained" onClick={handleCreate}>
                                생성하기
                            </CreateButton>*/}
                        </CreateButtonContainer>
                    </RestrictWrapper>
                </FormBox>
            </Root>
        </>
    );
}

export default React.memo(CreateNewVideoLecture);
