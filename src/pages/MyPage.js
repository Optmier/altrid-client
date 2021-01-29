import React, { useState } from 'react';
import styled from 'styled-components';
import '../styles/mypage.scss';
import TopNav from '../components/essentials/TopNav';
import ClassWrapper from '../components/essentials/ClassWrapper';
import LeftNavMyPage from '../components/essentials/LeftNavMyPage';
import Error from './Error';
import Profile from '../components/MyPage/Profile';
import Plan from '../components/MyPage/Plan';
import DeleteAccount from '../components/MyPage/DeleteAccount';

const SlideWrapper = styled.div`
    transition: all 0.4s;

    @media (min-width: 903px) {
        padding: ${(props) => (props.leftNavState ? '95px 0 0 240px' : '95px 0 0 0')};
    }

    @media (min-width: 0) and (max-width: 902px) {
        padding: 95px 0 0 0;
    }
`;

const MyPageSwitcher = (menu) => {
    switch (menu) {
        case 'profile':
            return <Profile />;
        case 'manage-plan':
            return <Plan />;
        case 'delete-account':
            return <DeleteAccount />;

        default:
            return <Error />;
    }
};

function MyPage({ match }) {
    const [leftNavState, setLeftNavState] = useState(window.innerWidth > 902);

    const handleLeftNav = () => {
        setLeftNavState(!leftNavState);
    };

    return (
        <>
            <LeftNavMyPage leftNavState={leftNavState} handleLeftNav={handleLeftNav} setLeftNavState={setLeftNavState} />
            <SlideWrapper leftNavState={leftNavState} className="mypage-root">
                <TopNav leftNavState={leftNavState} handleLeftNav={handleLeftNav} />
                <ClassWrapper>{MyPageSwitcher(match.params.menu)}</ClassWrapper>
            </SlideWrapper>
        </>
    );
}

export default MyPage;
