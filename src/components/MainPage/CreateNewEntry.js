import React, { useState } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import { Button, withStyles } from '@material-ui/core';

const CreateButton = withStyles((theme) => ({
    root: {
        color: '#474747',
        fontFamily: 'inherit',
        minWidth: 128,
        minHeight: 52,
    },
}))(Button);

function CreateNewEntry({ handleClose }) {
    const [createButtonEnabled, setCreateButtonEnabled] = useState(false);
    return (
        <div className="create-new-entry-root">
            <div className="close-icon" onClick={handleClose}>
                <CloseIcon />
            </div>
            <div className="title">
                <h2>클래스를 생성하여 시작해보세요 :)</h2>
            </div>
            <div className="form-container">
                <input className="error" type="text" name="entry_new_name" id="entry_new_name" placeholder="클래스 이름" />
                <input type="text" name="entry_new_description" id="entry_new_description" placeholder="클래스 한줄 설명" />
                <input type="text" name="entry_new_name2" id="entry_new_name2" placeholder="반 이름" />
                <input type="text" name="entry_new" id="entry_new" placeholder="반 인원" />
            </div>
            <div className="create-button">
                <CreateButton size="large" variant="contained" disabled={!createButtonEnabled}>
                    만들기
                </CreateButton>
            </div>
        </div>
    );
}

export default CreateNewEntry;
