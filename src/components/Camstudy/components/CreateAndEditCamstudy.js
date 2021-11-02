import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import DrawerGroupBox from '../../../AltridUI/Drawer/DrawerGroupBox';
import TextField from '../../../AltridUI/TextField/TextField';
import MuiTextField from '@material-ui/core/TextField';
import CheckIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorIcon from '@material-ui/icons/ErrorOutline';
import TextFieldHelperText from '../../../AltridUI/TextField/TextFieldHelperText';
import ReactQuill from 'react-quill';
import BulbIcon from '../../../AltridUI/Icons/drawer-groupbox-icon-bulb.svg';
import { Chip, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

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
`;
const GroupBoxContentsBasicInfoRoot = styled.div`
    display: flex;
    flex-direction: column;
`;

const GroupBoxContentsOtherInfoRoot = styled.div`
    display: flex;
    flex-direction: column;
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
function CreateAndEditCamstudy({ onCreate, children }) {
    const rulesEditorRef = useRef();
    const [publicState, setPublicState] = useState(2);
    // const [max]

    const actionOnChangePublicState = ({ target }) => {
        console.log(target);
        setPublicState(target.value);
    };

    const handleCrate = () => {
        const data = {};
        const editor = rulesEditorRef.current;
        data.rules = {
            renderContents: editor.getEditorContents(),
            deltaContents: editor.getEditor().getContents(),
        };
        onCreate();
    };

    useEffect(() => {}, []);

    return (
        <ContentsRoot>
            <TitleContainer>
                <Title>캠 스터디 만들기</Title>
            </TitleContainer>
            <DrawerGroupBox title="기본 정보" description="제목, 설명, 규칙을 설정하세요" descriptionAdornment={BulbIcon}>
                <GroupBoxContentsBasicInfoRoot>
                    <FormPlacer>
                        <MuiTextField variant="filled" required fullWidth label="캠 스터디 이름" />
                    </FormPlacer>
                    <FormPlacer>
                        <MuiTextField variant="filled" fullWidth label="한 줄 설명" />
                    </FormPlacer>
                    <FormPlacer>
                        <ReactQuill className="camstudy-rules-editor" ref={rulesEditorRef} placeholder="캠 스터디 규칙" />
                    </FormPlacer>
                </GroupBoxContentsBasicInfoRoot>
            </DrawerGroupBox>
            <DrawerGroupBox title="세부 설정" description="인원 수, 암호 등 설정" descriptionAdornment={BulbIcon}>
                <GroupBoxContentsOtherInfoRoot>
                    <FormPlacer>
                        <FormControl fullWidth variant="filled">
                            <InputLabel id="label-select-public-state">공개 설정</InputLabel>
                            <Select
                                labelId="label-select-public-state"
                                id="select-public-state"
                                defaultValue={0}
                                onChange={actionOnChangePublicState}
                            >
                                <MenuItem value={0}>오픈됨</MenuItem>
                                <MenuItem value={1}>암호 설정</MenuItem>
                                <MenuItem value={2}>초대된 인원만</MenuItem>
                            </Select>
                        </FormControl>
                    </FormPlacer>
                    <FormPlacer>
                        {((state) => {
                            switch (state) {
                                case 0:
                                    return (
                                        <MuiTextField
                                            variant="filled"
                                            fullWidth
                                            type="number"
                                            label="최대 인원 수"
                                            inputProps={{ min: 1, max: 64 }}
                                        />
                                    );
                                case 1:
                                    return <MuiTextField variant="filled" fullWidth type="password" label="암호" />;
                                case 2:
                                    return (
                                        <Autocomplete
                                            multiple
                                            limitTags={4}
                                            id="select-invitation"
                                            options={invitationsDummy}
                                            getOptionLabel={(option) => option.name}
                                            renderTags={(value, getTagProps) =>
                                                value.map((option, index) => (
                                                    <Chip variant="outlined" label={option.name} {...getTagProps({ index })} />
                                                ))
                                            }
                                            renderInput={(params) => <MuiTextField {...params} variant="filled" label="초대 인원 선택" />}
                                        />
                                    );
                                default:
                                    return null;
                            }
                        })(publicState)}
                    </FormPlacer>
                </GroupBoxContentsOtherInfoRoot>
            </DrawerGroupBox>
        </ContentsRoot>
    );
}

const invitationsDummy = [
    { name: '최세인', id: '12345', image: 'null' },
    { name: '홍길동', id: '98765', image: 'null' },
    { name: '아무개', id: '56789', image: 'null' },
];

CreateAndEditCamstudy.defaultProps = {
    onCreate(data) {
        console.log(data);
    },
};

export default CreateAndEditCamstudy;
