import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import DrawerGroupBox from '../../../AltridUI/Drawer/DrawerGroupBox';
import TextField from '../../../AltridUI/TextField/TextField';
import FormControl from '../../../AltridUI/TextField/FormControl';
import ReactQuill from 'react-quill';
import BulbIcon from '../../../AltridUI/Icons/drawer-groupbox-icon-bulb.svg';
import { Avatar, CircularProgress, InputLabel, MenuItem, Select } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import Axios from 'axios';
import { apiUrl } from '../../../configs/configs';
import moment from 'moment-timezone';
import Drawer from '../../../AltridUI/Drawer/Drawer';
import DrawerActions from '../../../AltridUI/Drawer/DrawerActions';
import Button from '../../../AltridUI/Button/Button';
import { useSelector } from 'react-redux';
import ArrowDropDownIcon from '../../../AltridUI/Icons/ArrowDropDownIcon';
import CalendarIcon from '../../../AltridUI/Icons/CalendarIcon';
import Chip from '../../../AltridUI/Accounts/Chip';
import ChipDeleteIcon from '../../../AltridUI/Icons/ChipDeleteIcon';

const ContentsRoot = styled.div``;
const TitleContainer = styled.div`
    display: flex;
    justify-content: space-between;
    color: rgba(0, 0, 0, 0.9);
`;
const Title = styled.h2`
    font-size: 2.25rem;
    font-weight: 600;
    line-height: 2.25rem;

    @media all and (max-width: 768px) {
        font-size: 1.5rem;
    }
`;
const FormPlacer = styled.div`
    & + & {
        margin-top: 16px;
    }
    & .quill.camstudy-rules-editor {
        & .ql-toolbar {
            background-color: #e9edef;
            border: none;
            border-top-left-radius: 16px;
            border-top-right-radius: 16px;
        }
        & .ql-container {
            background-color: #f6f8f9;
            border: none;
            border-bottom-left-radius: 16px;
            border-bottom-right-radius: 16px;
        }
    }
`;
const GroupBoxContentsBasicInfoRoot = styled.div`
    display: flex;
    flex-direction: column;
`;

const GroupBoxContentsOtherInfoRoot = styled.div`
    display: flex;
    flex-direction: column;
`;
const InvitationChipsContainer = styled.div`
    display: inline;
    & div.MuiChip-root {
        margin: 4px;
    }
`;

/** 데이터 받아야 할 것...
 * 1. 방 제목
 * 2. 방 설명
 * 3. 방 규칙
 * 4. 최대 인원 수
 * 5. 공개 설정 (오픈됨, 암호 설정, 초대된 인원만)
 * 6. 비밀번호 설정란
 * 7. 초대 인원 선택란
 * 8. 세션 종료일
 */
function CreateAndEditCamstudy({ open, handleClose, defaultData, onAfterCreateOrModify, children }) {
    const sessions = useSelector((state) => state.RdxSessions);

    const titleFieldRef = useRef();
    const descriptionFieldRef = useRef();
    const rulesEditorRef = useRef();
    const publicStateFieldRef = useRef();
    const maxJoinsFieldRef = useRef();
    const passwordFieldRef = useRef();
    const sessionEndDateFieldRef = useRef();

    const [publicState, setPublicState] = useState(0);
    const [invitationOptions, setInvitationOptions] = useState([]);
    const [invitationOptionOpen, setInvitationOptionOpen] = useState(false);
    const [invitationsLoading, setInvitationLoading] = useState(false);
    const [selectedInvitations, setSelectedInvitations] = useState([]);
    window.selectedInvitations = selectedInvitations;
    window.setSelectedInvitations = setSelectedInvitations;
    const [rulesData, setRulesData] = useState({
        renderContents: null,
        deltaContents: null,
    });

    // Default datas for edit
    const [defaultTitle, setDefaultTitle] = useState(null);
    const [defaultDescription, setDefaultDescription] = useState(null);
    const [defaultRulesDeltaContents, setDefaultRulesRenderContents] = useState(null);
    const [defaultPublicState, setDefaultPublicState] = useState(0);
    const [defaultMaxJoins, setDefaultMaxJoins] = useState(4);
    const [defaultSessionEndDate, setDefaultSessionEndDate] = useState(null);

    const [fieldErrorControl, setFieldErrorControl] = useState({
        title: {
            error: false,
            errorText: '',
        },
        publicState: {
            error: false,
            errorText: '',
        },
        maxJoins: {
            error: false,
            errorText: '',
        },
        password: {
            error: false,
            errorText: '',
        },
        invitations: {
            error: false,
            errorText: '',
        },
        sessionEndDate: {
            error: false,
            errorText: '',
        },
    });

    const actionOnChangePublicState = ({ target }) => {
        if (fieldErrorControl.publicState.error)
            setFieldErrorControl({ ...fieldErrorControl, publicState: { error: false, errorText: '' } });
        setPublicState(target.value);
    };

    const actionOnChangeInvitationSelect = (event, value) => {
        if (fieldErrorControl.invitations.error)
            setFieldErrorControl({ ...fieldErrorControl, invitations: { error: false, errorText: '' } });
        if (value.length > 64) {
            setFieldErrorControl({ ...fieldErrorControl, invitations: { error: false, errorText: '초대 인원은 최대 64명까지 입니다.' } });
            return;
        }
        setSelectedInvitations(value);
    };

    const fieldOnChange = ({ target }) => {
        const { name } = target;
        if (fieldErrorControl[name].error) setFieldErrorControl({ ...fieldErrorControl, [name]: { error: false, errorText: '' } });
    };

    const onRulesEditorChange = (contents, delta) => {
        setRulesData({
            renderContents: contents,
            deltaContents: delta,
        });
    };

    const handleCrate = () => {
        const title = titleFieldRef.current.value;
        const description = descriptionFieldRef.current.value;
        const rules = rulesData;
        const publicState = publicStateFieldRef.current.value;
        const invitationIds = publicState === 2 ? selectedInvitations.map(({ id }) => id) : [];
        const maxJoins = publicState === 2 ? invitationIds.length + 1 : parseInt(maxJoinsFieldRef.current.value);
        const password = publicState === 1 ? passwordFieldRef.current.value : null;
        const sessionEndDate = sessionEndDateFieldRef.current.value;

        setFieldErrorControl({
            title: {
                error: !Boolean(title.trim()),
                errorText: !Boolean(title.trim()) ? '방 제목을 입력해 주세요.' : '',
            },
            publicState: {
                error: isNaN(publicState),
                errorText: isNaN(publicState) ? '공개 여부 설정을 해주세요.' : '',
            },
            maxJoins: {
                error: maxJoins < 1 || maxJoins > 64,
                errorText: maxJoins < 1 || maxJoins > 64 ? '최소 1, 최대 64인까지 입력해 주세요.' : '',
            },
            password: {
                error: publicState === 1 && !Boolean(password.trim()),
                errorText: publicState === 1 && !Boolean(password.trim()) ? '암호를 설정해 주세요.' : '',
            },
            invitations: {
                error: publicState === 2 && invitationIds.length < 1,
                errorText: publicState === 2 && invitationIds.length < 1 ? '최소 1명 이상 초대 인원을 선택하셔야 합니다.' : '',
            },
            sessionEndDate: {
                error: !Boolean(sessionEndDate.trim()),
                errorText: !Boolean(sessionEndDate.trim()) ? '세션 종료 날짜를 선택해 주세요.' : '',
            },
        });

        if (!Boolean(title.trim())) return;
        if (isNaN(publicState)) return;
        if (maxJoins < 1 || maxJoins > 64) return;
        if (publicState === 1 && !Boolean(password.trim())) return;
        if (publicState === 2 && invitationIds.length < 1) return;
        if (!Boolean(sessionEndDate.trim())) return;

        Axios.post(
            `${apiUrl}/cam-study`,
            {
                title: title,
                description: description,
                rules: JSON.stringify(rules),
                publicState: publicState,
                invitationIds: JSON.stringify(invitationIds),
                maxJoins: maxJoins,
                password: password,
                sessionEndDate: sessionEndDate,
            },
            { withCredentials: true },
        )
            .then((res) => {
                onDrawerClose();
                onAfterCreateOrModify();
                alert('개설 완료되었습니다.');
            })
            .catch((err) => {});

        // data.rules = {
        //     renderContents: rules.getEditorContents(),
        //     deltaContents: rules.getEditor().getContents(),
        // };
    };

    const handleUpdate = () => {
        const description = descriptionFieldRef.current.value;
        const rules = rulesData;

        if (!defaultData.room_id) {
            console.error('세션 아이디를 알 수 없습니다.');
            return;
        }

        Axios.patch(
            `${apiUrl}/cam-study/${defaultData.room_id}`,
            {
                description: description,
                rules: JSON.stringify(rules),
            },
            { withCredentials: true },
        )
            .then((res) => {
                onDrawerClose();
                onAfterCreateOrModify();
                alert('수정 완료되었습니다.');
            })
            .catch((err) => {
                console.error(err);
            });
    };

    // 초대 인원 로딩
    useEffect(() => {
        let active = true;
        if (!invitationOptionOpen || selectedInvitations.length || !sessions.authId) {
            return undefined;
        }
        setInvitationLoading(true);
        Axios.get(`${apiUrl}/students/current-academy`, { withCredentials: true })
            .then((res) => {
                setInvitationLoading(false);
                if (!res.data || !res.data.length) return;
                const data = res.data
                    .map(({ auth_id, name, image }) => ({ id: auth_id, name: name, image: image }))
                    .filter(({ id }) => id !== sessions.authId);
                if (active) setInvitationOptions(data);
            })
            .catch((err) => {
                console.error(err);
            });

        return () => {
            active = false;
        };
    }, [invitationOptionOpen, selectedInvitations, sessions]);

    // 디폴트 데이터 셋
    useEffect(() => {
        let active = true;
        if (!defaultData || !sessions.authId) {
            setDefaultTitle(null);
            setDefaultDescription(null);
            setDefaultRulesRenderContents(null);
            setDefaultPublicState(0);
            setDefaultMaxJoins(4);
            setDefaultSessionEndDate(null);
            setFieldErrorControl({
                title: {
                    error: false,
                    errorText: '',
                },
                publicState: {
                    error: false,
                    errorText: '',
                },
                maxJoins: {
                    error: false,
                    errorText: '',
                },
                password: {
                    error: false,
                    errorText: '',
                },
                invitations: {
                    error: false,
                    errorText: '',
                },
                sessionEndDate: {
                    error: false,
                    errorText: '',
                },
            });
            return;
        }

        if (defaultData.title) setDefaultTitle(defaultData.title);
        if (defaultData.description) setDefaultDescription(defaultData.description);
        if (defaultData.rules.renderContents) {
            setDefaultRulesRenderContents(defaultData.rules.renderContents);
            setRulesData({
                renderContents: defaultData.rules.renderContents,
                deltaContents: defaultData.rules.deltaContents,
            });
        }
        if (defaultData.public_state) {
            setDefaultPublicState(defaultData.public_state);
            setPublicState(defaultData.public_state);
        }
        if (defaultData.max_joins) setDefaultMaxJoins(defaultData.max_joins);
        if (defaultData.invitation_ids) {
            Axios.get(`${apiUrl}/students/current-academy`, { withCredentials: true })
                .then((res) => {
                    if (!res.data || !res.data.length) return;
                    const data = res.data
                        .map(({ auth_id, name, image }) => ({ id: auth_id, name: name, image: image }))
                        .filter(({ id }) => id !== sessions.authId);
                    if (active) {
                        setInvitationOptions(data);
                        setSelectedInvitations(convertDefaultInvitations(data, defaultData.invitation_ids));
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        }
        if (defaultData.session_enddate) setDefaultSessionEndDate(moment(defaultData.session_enddate).format('yyyy-MM-DDTHH:mm'));

        return () => {
            active = false;
        };
    }, [defaultData, sessions]);

    const convertDefaultInvitations = (invitationOptions, ids) => {
        const defValues = [];
        for (const id of ids) {
            const index = invitationOptions.findIndex((data) => data.id === id);
            defValues.push(invitationOptions[index]);
        }
        return defValues;
    };

    const onDrawerClose = () => {
        // console.log('set to default');
        titleFieldRef.current.value = '';
        descriptionFieldRef.current.value = '';
        rulesEditorRef.current.value = null;
        setPublicState(0);
        maxJoinsFieldRef.current && (maxJoinsFieldRef.current.value = 0);
        passwordFieldRef.current && (passwordFieldRef.current.value = '');
        sessionEndDateFieldRef.current && (sessionEndDateFieldRef.current.value = moment().add('day', 3).format('yyyy-MM-DDTHH:mm'));
        setInvitationOptions([]);
        setInvitationOptionOpen(false);
        setInvitationLoading(false);
        setSelectedInvitations([]);
        setRulesData({
            renderContents: null,
            deltaContents: null,
        });
        handleClose(true);
    };

    const actionDeleteInvitation = (deleteId) => (e) => {
        setSelectedInvitations(selectedInvitations.filter(({ id }) => id !== deleteId));
    };

    return (
        <ContentsRoot>
            <Drawer anchor="right" open={open} handleClose={onDrawerClose}>
                <TitleContainer>
                    <Title>캠 스터디 만들기</Title>
                </TitleContainer>
                <DrawerGroupBox title="기본 정보" description="제목, 설명, 규칙을 설정하세요" descriptionAdornment={BulbIcon}>
                    <GroupBoxContentsBasicInfoRoot>
                        <FormPlacer>
                            <TextField
                                autoFocus
                                variant="filled"
                                required
                                fullWidth
                                label="캠 스터디 이름"
                                defaultValue={defaultTitle}
                                disabled={Boolean(defaultData)}
                                inputRef={titleFieldRef}
                                InputProps={{ disableUnderline: true }}
                                status={fieldErrorControl['title'].error ? 'error' : null}
                                helperText={fieldErrorControl['title'].errorText}
                                name="title"
                                onChange={fieldOnChange}
                            />
                        </FormPlacer>
                        <FormPlacer>
                            <TextField
                                variant="filled"
                                fullWidth
                                label="한 줄 설명"
                                defaultValue={defaultDescription}
                                inputRef={descriptionFieldRef}
                                InputProps={{ disableUnderline: true }}
                            />
                        </FormPlacer>
                        <FormPlacer>
                            <ReactQuill
                                className="camstudy-rules-editor"
                                ref={rulesEditorRef}
                                placeholder="캠 스터디 규칙"
                                defaultValue={defaultRulesDeltaContents}
                                onChange={onRulesEditorChange}
                            />
                        </FormPlacer>
                    </GroupBoxContentsBasicInfoRoot>
                </DrawerGroupBox>
                <DrawerGroupBox title="세부 설정" description="인원 수, 암호 등 설정" descriptionAdornment={BulbIcon}>
                    <GroupBoxContentsOtherInfoRoot>
                        <FormPlacer>
                            <FormControl
                                required
                                fullWidth
                                variant="filled"
                                disabled={Boolean(defaultData)}
                                status={fieldErrorControl['publicState'].error ? 'error' : null}
                            >
                                <InputLabel id="label-select-public-state">공개 설정</InputLabel>
                                <Select
                                    labelId="label-select-public-state"
                                    id="select-public-state"
                                    value={publicState}
                                    inputRef={publicStateFieldRef}
                                    onChange={actionOnChangePublicState}
                                    IconComponent={ArrowDropDownIcon}
                                >
                                    <MenuItem value={0}>오픈됨</MenuItem>
                                    <MenuItem value={1}>암호 설정</MenuItem>
                                    <MenuItem value={2}>초대된 인원만</MenuItem>
                                </Select>
                            </FormControl>
                        </FormPlacer>
                        {((state) => {
                            switch (state) {
                                case 0:
                                case 1:
                                    return (
                                        <>
                                            <FormPlacer>
                                                <TextField
                                                    required
                                                    id="input_max_joins"
                                                    variant="filled"
                                                    fullWidth
                                                    type="number"
                                                    label="최대 인원 수"
                                                    inputProps={{ min: 1, max: 64 }}
                                                    defaultValue={defaultData ? defaultMaxJoins : 4}
                                                    disabled={Boolean(defaultData)}
                                                    inputRef={maxJoinsFieldRef}
                                                    InputProps={{ disableUnderline: true }}
                                                    status={fieldErrorControl['maxJoins'].error ? 'error' : null}
                                                    helperText={fieldErrorControl['maxJoins'].errorText}
                                                    name="maxJoins"
                                                    onChange={fieldOnChange}
                                                />
                                            </FormPlacer>
                                            {state === 1 ? (
                                                <FormPlacer>
                                                    <TextField
                                                        required
                                                        id="input_password"
                                                        variant="filled"
                                                        fullWidth
                                                        type="password"
                                                        label="암호"
                                                        defaultValue={defaultData ? '****' : null}
                                                        disabled={Boolean(defaultData)}
                                                        inputRef={passwordFieldRef}
                                                        InputProps={{ disableUnderline: true }}
                                                        status={fieldErrorControl['password'].error ? 'error' : null}
                                                        helperText={fieldErrorControl['password'].errorText}
                                                        name="password"
                                                        onChange={fieldOnChange}
                                                    />
                                                </FormPlacer>
                                            ) : null}
                                        </>
                                    );
                                case 2:
                                    return (
                                        <>
                                            <FormPlacer>
                                                {!Boolean(defaultData) || (Boolean(defaultData) && invitationOptions.length) ? (
                                                    <Autocomplete
                                                        multiple
                                                        open={invitationOptionOpen}
                                                        loading={invitationsLoading}
                                                        onOpen={() => {
                                                            setInvitationOptionOpen(true);
                                                        }}
                                                        onClose={() => {
                                                            setInvitationOptionOpen(false);
                                                        }}
                                                        onChange={actionOnChangeInvitationSelect}
                                                        limitTags={3}
                                                        id="select-invitations"
                                                        options={invitationOptions}
                                                        getOptionLabel={(option) => option.name}
                                                        renderOption={(option) => (
                                                            <React.Fragment>
                                                                <Avatar
                                                                    alt={`${option.name}'s profile image'`}
                                                                    src={option.image}
                                                                    sizes="small"
                                                                >
                                                                    {Boolean(option.image) ? null : option.name[0]}
                                                                </Avatar>
                                                                <span style={{ marginLeft: 10 }}>{option.name}</span>
                                                            </React.Fragment>
                                                        )}
                                                        renderTags={() => null}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                required
                                                                variant="filled"
                                                                label="초대 인원 선택"
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                    disableUnderline: true,
                                                                    endAdornment: (
                                                                        <>
                                                                            {invitationsLoading ? (
                                                                                <CircularProgress color="inherit" size={20} />
                                                                            ) : null}
                                                                            {params.InputProps.endAdornment}
                                                                        </>
                                                                    ),
                                                                }}
                                                                status={fieldErrorControl['invitations'].error ? 'error' : null}
                                                                helperText={fieldErrorControl['invitations'].errorText}
                                                            />
                                                        )}
                                                        popupIcon={<ArrowDropDownIcon style={{ padding: 10 }} />}
                                                        value={selectedInvitations}
                                                        disabled={Boolean(defaultData)}
                                                    />
                                                ) : null}
                                            </FormPlacer>
                                            {selectedInvitations.length ? (
                                                <FormPlacer
                                                    style={{
                                                        marginTop: 12,
                                                        marginBottom: -4,
                                                        marginLeft: -4,
                                                        marginRight: -4,
                                                    }}
                                                >
                                                    <InvitationChipsContainer>
                                                        {selectedInvitations.map((d) => (
                                                            <Chip
                                                                key={d.id}
                                                                variant="default"
                                                                avatar={
                                                                    <Avatar alt={`${d.name}'s profile image'`} src={d.image}>
                                                                        {Boolean(d.image) ? null : d.name[0]}
                                                                    </Avatar>
                                                                }
                                                                label={d.name}
                                                                deleteIcon={<ChipDeleteIcon />}
                                                                onDelete={actionDeleteInvitation(d.id)}
                                                            />
                                                        ))}
                                                    </InvitationChipsContainer>
                                                </FormPlacer>
                                            ) : null}
                                        </>
                                    );
                                default:
                                    return null;
                            }
                        })(publicState)}
                        <FormPlacer>
                            <TextField
                                required
                                fullWidth
                                variant="filled"
                                label="세션 종료일"
                                defaultValue={defaultData ? defaultSessionEndDate : moment().add('day', 3).format('yyyy-MM-DDTHH:mm')}
                                id="datetime-local"
                                type="datetime-local"
                                data-date-inline-picker="true"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                disabled={Boolean(defaultData)}
                                inputRef={sessionEndDateFieldRef}
                                InputProps={{
                                    disableUnderline: true,
                                    endAdornment: <CalendarIcon style={{ position: 'absolute', right: 18 }} />,
                                }}
                                status={fieldErrorControl['sessionEndDate'].error ? 'error' : null}
                                helperText={fieldErrorControl['sessionEndDate'].errorText}
                                name="sessionEndDate"
                                onChange={fieldOnChange}
                            />
                        </FormPlacer>
                    </GroupBoxContentsOtherInfoRoot>
                </DrawerGroupBox>
                <DrawerActions>
                    {Boolean(defaultData) ? (
                        <Button colors="purple" onClick={handleUpdate}>
                            수정하기
                        </Button>
                    ) : (
                        <Button colors="purple" onClick={handleCrate}>
                            만들기
                        </Button>
                    )}
                </DrawerActions>
            </Drawer>
        </ContentsRoot>
    );
}

// const invitationsDummy = [
//     { name: '최세인', id: '12345', image: 'null' },
//     { name: '홍길동', id: '98765', image: 'null' },
//     { name: '아무개', id: '56789', image: 'null' },
// ];

CreateAndEditCamstudy.defaultProps = {
    defaultData: null,
    onCreate(data) {
        console.log(data);
    },
    onUpdate(data) {
        console.log(data);
    },
    onAfterCreateOrModify() {},
};

export default CreateAndEditCamstudy;
