import React from 'react';
import classNames from 'classnames';
/** Card Entry for class */
function CardEntry({ title, description, assignmentOnProgress, teacherName, totalStudents, totalAssignment, ...rest }) {
    return (
        <div className="main-card-entry-root" onClick={rest.onClick}>
            <div className="header">
                <div className="title">
                    <h4 title={title}>{title}</h4>
                </div>
                <div className={classNames('on-progress', assignmentOnProgress ? 'on' : '')}>
                    {assignmentOnProgress ? '게시과제 진행 중' : '게시과제 미진행 중'}
                    <div className="indicator"></div>
                </div>
            </div>
            <div className="descriptor">
                <h5 title={description}>{description}</h5>
            </div>
            <div className="footer-info" title={`${teacherName} 선생님 / ${totalStudents}명 / 게시 과제 ${totalAssignment}`}>
                {teacherName} 선생님 / {totalStudents}명 / 게시 과제 {totalAssignment}
            </div>
        </div>
    );
}

CardEntry.defaultProps = {
    title: 'Class01',
    description: '에듀이티학원 토플 700점 목표 집중 반 입니다.',
    assignmentOnProgress: true,
    teacherName: '에듀이티',
    totalStudents: 30,
    totalAssignment: 0,
};

export default CardEntry;
