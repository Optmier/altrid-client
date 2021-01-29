import React, { useState } from 'react';
import styled from 'styled-components';
import '../styles/mypage.scss';
import LeftNav from '../components/essentials/LeftNav';
import TopNav from '../components/essentials/TopNav';
import ClassWrapper from '../components/essentials/ClassWrapper';

const SlideWrapper = styled.div`
    transition: all 0.4s;

    @media (min-width: 903px) {
        padding: ${(props) => (props.leftNavState ? '95px 0 0 240px' : '95px 0 0 0')};
    }

    @media (min-width: 0) and (max-width: 902px) {
        padding: 95px 0 0 0;
    }
`;

const MyPageSwitcher = () => {};

function MyPage() {
    const [leftNavState, setLeftNavState] = useState(window.innerWidth > 902);

    const handleLeftNav = () => {
        setLeftNavState(!leftNavState);
    };

    return (
        <>
            <LeftNav leftNavState={leftNavState} handleLeftNav={handleLeftNav} setLeftNavState={setLeftNavState} />
            <SlideWrapper leftNavState={leftNavState} className="mypage-root">
                <TopNav leftNavState={leftNavState} handleLeftNav={handleLeftNav} />
                <ClassWrapper>{MyPageSwitcher}</ClassWrapper>
            </SlideWrapper>
        </>
    );
}

export default MyPage;
