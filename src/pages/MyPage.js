import React, { useState } from 'react';
import styled from 'styled-components';
import '../styles/mypage.scss';
import TopNav from '../components/essentials/TopNav';
import ClassWrapper from '../components/essentials/ClassWrapper';
import LeftNavMyPage from '../components/essentials/LeftNavMyPage';
import Error from './Error';
import Profile from '../components/MyPage/Profile';
import Plans from '../components/MyPage/Plans';
import DeleteAccount from '../components/MyPage/DeleteAccount';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import '../styles/mypage.scss';
import HeaderBar from '../components/essentials/HeaderBar';
import Footer from '../components/essentials/Footer';

const SlideWrapper = styled.div`
    transition: all 0.4s;

    @media (min-width: 903px) {
        padding: ${(props) => (props.leftNavState ? '95px 0 50px 0' : '95px 0 50px 0')};
    }

    @media (min-width: 0) and (max-width: 902px) {
        padding: 95px 0 50px 0;
    }
`;

const MyPageSwitcher = (menu, userType) => {
    switch (menu) {
        // case 'profile':
        //     return <Profile />;
        case 'manage-plan':
            if (userType === 'teachers') {
                return <Plans />;
            } else {
                return <Error />;
            }
        case 'delete-account':
            return <DeleteAccount />;

        default:
            return <Error />;
    }
};

function MyPage({ match }) {
    const [leftNavState, setLeftNavState] = useState(window.innerWidth > 902);
    const sessions = useSelector((state) => state.RdxSessions);

    const handleLeftNav = () => {
        setLeftNavState(!leftNavState);
    };

    return (
        <>
            <HeaderBar />
            <Helmet>
                <style>{`
                    main#main {
                        background-color: #ffffff;
                    }
            `}</style>
            </Helmet>

            {/* <LeftNavMyPage leftNavState={leftNavState} handleLeftNav={handleLeftNav} setLeftNavState={setLeftNavState} /> */}
            <SlideWrapper leftNavState={leftNavState} className="mypage-root">
                {/* <TopNav leftNavState={leftNavState} handleLeftNav={handleLeftNav} /> */}
                <ClassWrapper>{MyPageSwitcher(match.params.menu, sessions.userType)}</ClassWrapper>
            </SlideWrapper>
            <Footer />
        </>
    );
}

export default MyPage;
