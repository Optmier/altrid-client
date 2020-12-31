import React from 'react';
import GooroomeeService from '../components/Gooroomee/GooroomeeService';

function initGooroomeeMeetings() {
    GooroomeeService.init(
        undefined,
        (res) => {
            console.log(res);
        },
        (err) => {
            console.error(err);
        },
    );
}

function GooroomeeTest() {
    return (
        <>
            <div>구루미 화상강의 테스트</div>
            <button onClick={initGooroomeeMeetings}>초기화 하기</button>
        </>
    );
}

export default GooroomeeTest;
