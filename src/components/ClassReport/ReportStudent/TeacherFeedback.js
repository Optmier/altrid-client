import Axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import HtmlParser from 'react-html-parser';
import ReactQuill from 'react-quill';
import styled from 'styled-components';
import { apiUrl } from '../../../configs/configs';

// 루트 페이퍼 스타일
const RootContainer = styled.div`
    background-color: #ffffff;
    border-radius: 11px;
    width: 100%;
    padding: 30px 32px;
    box-sizing: border-box;
    & .quill.feedback-editor {
        & .ql-toolbar {
            border-top-left-radius: 11px;
            border-top-right-radius: 11px;
        }
        & .ql-container {
            border-bottom-left-radius: 11px;
            border-bottom-right-radius: 11px;
        }
    }
`;
// 피드백 에디터 액션 버튼 컨테이너 스타일
const EditorActionsContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 24px;
    width: 100%;
`;
// 피드백 에디터 액션 버튼 스타일
const ActionButton = styled.button`
    background-color: #ffffff;
    border: 1px solid #3e3e3e;
    border-radius: 11px;
    min-height: 24px;
    & + & {
        margin-left: 8px;
    }
`;

/** 선생님 피드백 뷰어 컴포넌트
 * @param {string} contents HTML DOM string
 */
function TeacherFeedbackViewer({ contents }) {
    return <RootContainer>{HtmlParser(contents)}</RootContainer>;
}
// 선생님 피드백 뷰어 컴포넌트 기본 프로퍼티
TeacherFeedbackViewer.defaultProps = {
    contents: '<header><h1>Default teacher feedback contents</h1></header>',
};

/** 선생님 피드백 에디터
 * @param {object} deltaContents Quill Editor delta object
 * @param {function} actionUpdateClick function whent update button click
 */
function TeacherFeedbackWriter({ deltaContents, actionUpdateClick }) {
    // 에디터 Ref
    const editorRef = useRef();
    // 에디터 변경 여부
    const [isModified, setIsModified] = useState(false);
    // 에디터 변경 이벤트 시
    const onEditorChange = () => {
        if (!isModified) setIsModified(true);
    };
    // 업데이트 버튼 클릭 시
    const onUpdateClick = () => {
        const editor = editorRef.current;
        actionUpdateClick({ renderContents: editor.getEditorContents(), deltaContents: editor.getEditor().getContents() });
        setIsModified(false);
    };
    // 취소 버튼 클릭 시
    const onCancelClick = () => {
        setIsModified(false);
        editorRef.current.getEditor().setContents(deltaContents);
    };
    // 초기 에디터 값 세팅
    useEffect(() => {
        if (!deltaContents || !editorRef.current) return;
        editorRef.current.getEditor().setContents(deltaContents);
        setIsModified(false);
    }, [deltaContents]);
    return (
        <RootContainer>
            <ReactQuill className="feedback-editor" ref={editorRef} onChange={onEditorChange} />
            {isModified ? (
                <EditorActionsContainer>
                    <ActionButton onClick={onCancelClick}>취소</ActionButton>
                    <ActionButton onClick={onUpdateClick}>업데이트</ActionButton>
                </EditorActionsContainer>
            ) : null}
        </RootContainer>
    );
}
// 선생님 피드백 에디터 기본 프로퍼티
TeacherFeedbackWriter.defaultProps = {
    deltaContents: null,
    actionUpdateClick(contentsData) {
        console.log(contentsData);
    },
};

/** 피드백 업데이트 인터페이스
 * @param {number} assignmentNum
 * @param {string} studentId
 * @param {object} contentsData
 * @param {function} callback.onSuccess
 * @param {function} callback.onFailure
 */
const updateTeacherFeedbackInterface = (
    assignmentNum,
    studentId,
    contentsData,
    callback = { onSuccess: (response) => {}, onFailure: (error) => {} },
) => {
    Axios.patch(
        `${apiUrl}/assignment-result/teacher-feedback`,
        { assignmentNum: assignmentNum, studentId: studentId, contentsData: JSON.stringify(contentsData) },
        { withCredentials: true },
    )
        .then((response) => {
            callback.onSuccess(response);
        })
        .catch((error) => {
            callback.onFailure(error);
        });
};

/** 피드백 가져오기 인터페이스
 * @param {number} assignmentNum
 * @param {string} studentId
 * @param {function} callback.onSuccess
 * @param {function} callback.onFailure
 */
const getTeacherFeedbackInterface = (assignmentNum, studentId, callback = { onSuccess: (response) => {}, onFailure: (error) => {} }) => {
    Axios.get(`${apiUrl}/assignment-result/teacher-feedback/${parseInt(assignmentNum)}/${studentId}`, { withCredentials: true })
        .then((response) => {
            let results = { renderContents: '', deltaContents: null };
            try {
                response.data = response.data
                    .replace(/\\n/g, '\\n')
                    .replace(/\\'/g, "\\'")
                    .replace(/\\"/g, '\\"')
                    .replace(/\\&/g, '\\&')
                    .replace(/\\r/g, '\\r')
                    .replace(/\\t/g, '\\t')
                    .replace(/\\b/g, '\\b')
                    .replace(/\\f/g, '\\f');
                response.data = response.data.replace(/[\u0000-\u0019]+/g, '');
                results = JSON.parse(response.data);
            } catch (parseError) {
                console.error(parseError);
            }
            callback.onSuccess(results);
        })
        .catch((error) => {
            callback.onFailure(error);
        });
};

export { TeacherFeedbackViewer, TeacherFeedbackWriter, getTeacherFeedbackInterface, updateTeacherFeedbackInterface };
