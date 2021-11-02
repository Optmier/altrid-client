import React, { useState } from 'react';
import styled from 'styled-components';

const HeaderMenuRoot = styled.div`
    align-items: center;
    display: flex;
    width: 100%;
`;
const ContainerTitle = styled.div``;
const ContainerMenus = styled.div`
    margin-left: 50px;
`;
const HeaderTitle = styled.div`
    font-size: 1.75rem;
    font-weight: 600;
`;
const MenuItem = styled.button`
    color: ${(props) => (props['m-selected'] ? '#3B168A' : '#b2b2b2')};
    border-bottom: ${(props) => (props['m-selected'] ? '2px solid #3B168A' : 'none')};
    font-size: 1.12rem;
    font-weight: 500;
    background-color: transparent;
    padding: 5px;
    & + & {
        margin-left: 25px;
    }
`;

function HeaderMenu({ title, menuDatas, defaultMenuItemId, selectedMenuId, onItemClick, children }) {
    const onMenuItemClick = (mId, onClickFn) => () => {
        onItemClick(mId);
        if (onClickFn) onClickFn();
    };

    return (
        <HeaderMenuRoot>
            <ContainerTitle>
                <HeaderTitle>{title}</HeaderTitle>
            </ContainerTitle>
            <ContainerMenus>
                {menuDatas
                    ? menuDatas.map((data) => (
                          <MenuItem
                              key={data.mId}
                              title={!data.mDesc ? null : data.mDesc}
                              m-selected={data.mId === selectedMenuId}
                              onClick={onMenuItemClick(data.mId, data.onClick)}
                          >
                              {data.mName}
                              {!isNaN(parseInt(data.mCounts)) ? `(${data.mCounts})` : null}
                          </MenuItem>
                      ))
                    : null}
            </ContainerMenus>
        </HeaderMenuRoot>
    );
}

HeaderMenu.defaultProps = {
    title: '헤더 제목',
    defaultMenuItemId: 0,
    menuDatas: [
        {
            mId: 0,
            mName: '메뉴 1',
            mDesc: '메뉴 설명 1',
            mCounts: null,
            onClick() {
                console.log('메뉴 1 선택했습니다.');
            },
        },
        {
            mId: 1,
            mName: '메뉴 2',
            mDesc: '메뉴 설명 2',
            mCounts: 5,
            onClick() {
                console.log('메뉴 2 선택했습니다.');
            },
        },
        {
            mId: 2,
            mName: '메뉴 3',
            mDesc: '메뉴 설명 3',
            mCounts: 0,
            onClick() {
                console.log('메뉴 3 선택했습니다.');
            },
        },
    ],
    onItemClick() {},
};

export default HeaderMenu;
