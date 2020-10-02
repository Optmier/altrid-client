import React from 'react';
import '../../styles/class_draft.scss';
import ClassWrapper from '../essentials/ClassWrapper';
import ClassTitle from '../essentials/ClassTitle';
import DraftCardView from './DraftCardView';

function Draft() {
    return (
        <>
            <ClassWrapper>
                <div className="class-draft-root">
                    <ClassTitle>
                        <b>최준영</b>
                        선생님이 만든 과제는 총 <b>5개</b>입니다.
                    </ClassTitle>

                    <div className="class-cardView-wrapper">
                        <DraftCardView />
                    </div>
                </div>
            </ClassWrapper>
        </>
    );
}

export default Draft;
