import React from 'react';
const stepDatas = {
    1: {
        title: '1번 풀이 진행',
        answer: 'a번/b번',
        route: 'a,b,a',
        time: '08:52',
    },
    2: {
        title: '1번 풀이 진행',
        answer: 'a번/b번',
        route: 'a,b,a',
        time: '08:52',
    },
    3: {
        title: '1번 풀이 진행',
        answer: 'a번/b번',
        route: 'a,b,a',
        time: '08:52',
    },
};
function StepBox() {
    return (
        <div className="eyetrack-step-box">
            <div className="eyetrack-step-header"></div>
        </div>
    );
}

export default StepBox;
