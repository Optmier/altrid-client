import React, { useState } from 'react';
import styled from 'styled-components';

const HeaderMenuRoot = styled.div`
    font-family: inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji',
        'Segoe UI Emoji', 'Segoe UI Symbol';
    width: ${({ fullWidth }) => (fullWidth ? '100%' : null)};
`;
const ContainerTitle = styled.div`
    display: flex;
    font-family: inherit;
    justify-content: space-between;
`;
const RightComponentContainer = styled.div`
    margin-top: auto;
    margin-bottom: 8px;
`;
const ContainerMenus = styled.div`
    align-items: center;
    /* background-color: #f4f1fa; */
    background-color: #ffffff;
    /* border: 1px solid #e3ddf2; */
    border-radius: 8px;
    box-sizing: border-box;
    display: flex;
    font-family: inherit;
    justify-content: space-between;
    margin-top: ${({ type }) => (type === 1 ? '32px' : '16px')};
    padding: 4px;
    height: 44px;
`;
const HeaderTitle = styled.div`
    font-family: inherit;
    font-size: ${({ type }) => (type === 1 ? '3.5rem' : '3rem')};
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: ${({ type }) => (type === 1 ? '3.75rem' : '3.25rem')};
    text-align: ${({ type }) => (type === 1 ? 'center' : null)};
    @media all and (max-width: 799px) {
        font-size: 1.75rem;
        line-height: 2rem;
    }
`;
const MenuItem = styled.button`
    background-color: ${(props) => (props['m-selected'] ? '#3B1689' : 'transparent')};
    /* border-radius: 32px; */
    box-shadow: ${(props) => (props['m-selected'] ? '0px 1px 2px rgba(0, 0, 0, 0.2)' : 'none')};
    border-radius: 4px;
    color: ${(props) => (props['m-selected'] ? '#ffffff' : '#9AA5AF')};
    font-family: inherit;
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.25rem;
    padding: 0;
    height: 100%;
    width: calc(100%);
    transition: background-color 0.2s, color 0.2s, box-shadow 0.2s;
    & + & {
        /* margin-left: -32px; */
    }
`;

function HeaderMenu({ fullWidth, title, menuDatas, defaultMenuItemId, selectedMenuId, onItemClick, type, rightComponent, children }) {
    const onMenuItemClick = (mId, onClickFn) => () => {
        onItemClick(mId);
        if (onClickFn) onClickFn();
    };

    return (
        <HeaderMenuRoot fullWidth={fullWidth}>
            <ContainerTitle>
                <HeaderTitle type={type}>{title}</HeaderTitle>
                <RightComponentContainer>{rightComponent}</RightComponentContainer>
            </ContainerTitle>
            <ContainerMenus type={type}>
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
    fullWidth: true,
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
    type: 0,
    onItemClick() {},
};

export default HeaderMenu;
