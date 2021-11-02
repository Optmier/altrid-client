import React, { useState } from 'react';
import styled from 'styled-components';
import Groupbox from '../../_tempComponents/Groupbox';
import HeaderMenu from '../../_tempComponents/HeaderMenu';
import ClassWrapper from '../essentials/ClassWrapper';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CamstudyListItem from './components/CamstudyListItem';
import CreateAndEditCamstudy from './components/CreateAndEditCamstudy';
import Drawer from '../../AltridUI/Drawer/Drawer';

const CamstudyMainRoot = styled.div``;
const HeaderContainer = styled.div`
    display: flex;
    width: 100%;
`;
const Contents = styled.div`
    margin-top: 54px;
    width: 100%;
`;

const StyledButton = styled.button`
    &.video-lecture {
        background-color: #707070;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: inherit;
        font-size: 0.9rem;
        font-weight: 500;
        color: white;
        padding: 12px 0;
        border-radius: 11px;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.25);
        width: 96px;

        &.main {
            background-color: #3f1990;
            width: 96px;
        }
        &.sub {
            background-color: #6d2bf5;
            width: 190px;
        }

        & svg.MuiSvgIcon-root {
            margin-right: 12px;
            font-size: 1rem;
        }

        @media (min-width: 0) and (max-width: 767px) {
            &,
            &.main,
            &.sub {
                width: 100%;
            }
        }
    }
`;

const camstudyCandidatedDummy = [];
const camstudyListsDummy = [];

function CamStudyMainLists() {
    const [menuStatus, setMenuStatus] = useState(0);
    const headerMenus = [
        {
            mId: 0,
            mName: '나의 캠스터디',
        },
        {
            mId: 1,
            mName: '전체 목록',
        },
    ];
    const [openCreateNewDrawer, setOpenCreateNewDrawer] = useState(true);

    const actionClickHeaderMenuItem = (menuId) => {
        setMenuStatus(menuId);
    };

    const actionToggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpenCreateNewDrawer(open);
    };

    const submitNewCamstudy = ({}) => {
        console.log();
    };

    const renderContentsByMenu = (menuId) => {
        switch (menuId) {
            // 나의 캠스터디 항목 보여주기(초대됨, 내 항목)
            case 0:
                return (
                    <>
                        <Groupbox title="초대됨"></Groupbox>
                        <Groupbox title="내가 생성함">
                            <CamstudyListItem />
                        </Groupbox>
                    </>
                );
            case 1:
                return (
                    <>
                        <Groupbox title="전체 목록"></Groupbox>
                    </>
                );
            default:
                return null;
        }
    };
    return (
        <CamstudyMainRoot>
            <Drawer anchor="right" open={openCreateNewDrawer} handleClose={actionToggleDrawer(false)}>
                <CreateAndEditCamstudy onCreate={submitNewCamstudy} />
            </Drawer>
            <ClassWrapper col="col">
                <HeaderContainer>
                    <HeaderMenu
                        title="캠 스터디"
                        menuDatas={headerMenus}
                        selectedMenuId={menuStatus}
                        onItemClick={actionClickHeaderMenuItem}
                        setMenuId
                    />
                    <StyledButton className="video-lecture sub" onClick={actionToggleDrawer(true)}>
                        <AddCircleOutlineIcon fontSize="small" />
                        캠스터디 만들기
                    </StyledButton>
                </HeaderContainer>

                <Contents>{renderContentsByMenu(menuStatus)}</Contents>
            </ClassWrapper>
        </CamstudyMainRoot>
    );
}

export default CamStudyMainLists;
