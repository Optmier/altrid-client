import Button from '../../AltridUI/Button/Button';
import ToggleButton from '../../AltridUI/Button/ToggleButton';
import { CheckCircle } from '@material-ui/icons';
import React, { useState } from 'react';
import styled from 'styled-components';
import { CircularProgress, FormControlLabel, RadioGroup } from '@material-ui/core';
import Checkbox from '../../AltridUI/Checkbox/Checkbox';
import Radio from '../../AltridUI/Radio/Radio';
import RadioLabel from '../../AltridUI/Radio/RadioLabel';
import Switch from '../../AltridUI/Switch/Switch';
import SwitchLabel from '../../AltridUI/Switch/SwitchLabel';
import HeaderMenu from '../../AltridUI/HeaderMenu/HeaderMenu';

const Root = styled.div`
    background-color: #ffffff;
    padding: 32px;
    /* & button + button {
        margin-top: 8px;
    } */

    & .alt-checkbox + .alt-checkbox {
        margin-top: 8px;
    }
`;

const Group = styled.div`
    border: 1px solid #686868;
    border-radius: 16px;
    padding: 16px;

    & + & {
        margin-top: 8px;
    }
`;

function ComponentTest({ children }) {
    const headerMenus = [
        {
            mId: 0,
            mName: '나의 단어',
        },
        {
            mId: 1,
            mName: '시험',
        },
    ];
    const [testChecked, setTestChecked] = useState(false);
    const [menuStatus, setMenuStatus] = useState(0);
    const actionClickHeaderMenuItem = (menuId) => {
        setMenuStatus(menuId);
    };
    const actionChange = (res) => {
        setTestChecked(res.checked);
        console.log(res);
    };
    return (
        <Root>
            <Group>
                <HeaderMenu
                    title="프로필 설정"
                    menuDatas={headerMenus}
                    selectedMenuId={menuStatus}
                    onItemClick={actionClickHeaderMenuItem}
                    type={1}
                />
            </Group>
            <Group>
                <HeaderMenu title="단어 학습" menuDatas={headerMenus} selectedMenuId={menuStatus} onItemClick={actionClickHeaderMenuItem} />
            </Group>
            <Group>
                <SwitchLabel control={<Switch name="asdfsdaf" />} label="iOS style" />
                <SwitchLabel control={<Switch name="checkedB" />} label="iOS style" />
            </Group>
            <Group>
                <RadioGroup defaultValue="disabled" aria-label="gender" name="customized-radios">
                    <RadioLabel value="Lined" control={<Radio />} label="Lined" />
                    <RadioLabel value="Filled" control={<Radio />} label="Filled" />
                    <RadioLabel value="other" control={<Radio />} label="Other" />
                    <RadioLabel value="disabled" disabled control={<Radio disabled />} label="(Disabled option)" />
                </RadioGroup>
            </Group>
            <Group>
                <Radio label="Filled" variant="filled" onChange={actionChange}></Radio>
                <Radio label="Filled" variant="filled" defaultChecked={true} onChange={actionChange}></Radio>
            </Group>
            <Group>
                <Checkbox label="Lined" checked={testChecked} onChange={actionChange}></Checkbox>
                <Checkbox label="Lined" disabled checked onChange={actionChange}></Checkbox>
            </Group>
            <Group>
                <Checkbox label="Filled" variant="filled" onChange={actionChange}></Checkbox>
                <Checkbox label="Filled" variant="filled" defaultChecked={true} onChange={actionChange}></Checkbox>
            </Group>
            <Group>
                <Button colors="purple">Label</Button>
                <Button colors="purple" leftIcon={<CheckCircle />}>
                    Label
                </Button>
                <Button colors="purple">
                    <CircularProgress disableShrink />
                </Button>
            </Group>
        </Root>
    );
}

ComponentTest.defaultProps = {};

export default ComponentTest;
