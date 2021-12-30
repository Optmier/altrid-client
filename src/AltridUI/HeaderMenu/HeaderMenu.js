import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Typography from '../Typography/Typography';

const HeaderMenuRoot = styled.div`
    background-color: ${({ backgroundColor, fixed }) => (backgroundColor && fixed ? backgroundColor : null)};
    font-family: inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji',
        'Segoe UI Emoji', 'Segoe UI Symbol';
    padding: 32px 32px 2px 32px;
    margin: -32px -32px -2px -32px;
    position: ${({ fixed }) => (fixed ? 'fixed' : null)};
    max-width: ${({ fixed }) => (fixed ? '960px' : null)};
    width: ${({ fullWidth }) => (fullWidth ? '100%' : null)};
    width: ${({ fixed, leftNavState }) => {
        if (fixed) {
            return leftNavState ? 'calc(100% - 64px - 392px)' : 'calc(100% - 64px)';
        } else {
            return null;
        }
    }};
    transition: ${({ fixed }) => (fixed ? 'width 0.4s' : null)};
    z-index: ${({ fixed }) => (fixed ? 100 : null)};
    @media all and (max-width: 902px) {
        width: ${({ fixed }) => (fixed ? 'calc(100% - 64px)' : null)};
    }
    @media all and (max-width: 640px) {
        padding: 16px 16px 2px 16px;
        margin: -16px -16px -2px -16px;
        width: ${({ fixed }) => (fixed ? 'calc(100% - 32px)' : null)};
    }
`;
const HeaderFixedDummy = styled.div`
    padding: 32px 32px 2px 32px;
    margin: -32px -32px -2px -32px;
    min-height: 112px;
    min-height: ${({ noMenus }) => (noMenus ? '52px' : null)};
    max-width: ${({ fixed }) => (fixed ? '960px' : null)};
    width: 100%;
    transition: ${({ fixed }) => (fixed ? 'width 0.4s' : null)};
    z-index: 99;
    @media all and (max-width: 960px) {
        min-height: 100px;
        min-height: ${({ noMenus }) => (noMenus ? '40px' : null)};
    }
    @media all and (max-width: 799px) {
        min-height: 92px;
        min-height: ${({ noMenus }) => (noMenus ? '32px' : null)};
    }
    @media all and (max-width: 640px) {
        padding: 16px 16px 2px 16px;
        margin: -16px -16px -2px -16px;
        min-height: 92px;
        min-height: ${({ noMenus }) => (noMenus ? '32px' : null)};
    }
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
    text-align: ${({ type }) => (type === 1 ? 'center' : null)};
    width: ${({ type }) => (type === 1 ? '100%' : null)};
`;
const MenuItem = styled.button`
    background-color: ${(props) => (props['m-selected'] ? '#3B1689' : 'transparent')};
    /* border-radius: 32px; */
    box-shadow: ${(props) => (props['m-selected'] ? '0px 1px 2px rgba(0, 0, 0, 0.2)' : 'none')};
    border-radius: 4px;
    color: ${(props) => (props['m-selected'] ? '#ffffff' : '#9AA5AF')};
    font-family: inherit;
    padding: 0;
    height: 100%;
    width: calc(100%);
    transition: background-color 0.2s, color 0.2s, box-shadow 0.2s;
    & + & {
        /* margin-left: -32px; */
    }
`;

function HeaderMenu({
    fullWidth,
    title,
    menuDatas,
    defaultMenuItemId,
    selectedMenuId,
    onItemClick,
    type,
    rightComponent,
    fixed,
    backgroundColor,
    children,
}) {
    const { leftNavGlobal } = useSelector((state) => state.RdxGlobalLeftNavState);
    const onMenuItemClick = (mId, onClickFn) => () => {
        onItemClick(mId);
        if (onClickFn) onClickFn();
    };

    return (
        <>
            {fixed ? <HeaderFixedDummy noMenus={!menuDatas} fixed={fixed} leftNavState={leftNavGlobal} /> : null}
            <HeaderMenuRoot fullWidth={fullWidth} fixed={fixed} leftNavState={leftNavGlobal} backgroundColor={backgroundColor}>
                <ContainerTitle>
                    <HeaderTitle type={type}>
                        <Typography type="heading" size={type === 1 ? 'l' : 'm'} bold>
                            {title}
                        </Typography>
                    </HeaderTitle>
                    <RightComponentContainer>{rightComponent}</RightComponentContainer>
                </ContainerTitle>
                {menuDatas ? (
                    <ContainerMenus type={type}>
                        {menuDatas
                            ? menuDatas.map((data) => (
                                  <MenuItem
                                      key={data.mId}
                                      title={!data.mDesc ? null : data.mDesc}
                                      m-selected={data.mId === selectedMenuId}
                                      onClick={onMenuItemClick(data.mId, data.onClick)}
                                  >
                                      <Typography type="label" size="l" bold>
                                          {data.mName}
                                          {!isNaN(parseInt(data.mCounts)) ? `(${data.mCounts})` : null}
                                      </Typography>
                                  </MenuItem>
                              ))
                            : null}
                    </ContainerMenus>
                ) : null}
            </HeaderMenuRoot>
        </>
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
    fixed: false,
    backgroundColor: 'transparent',
    onItemClick() {},
};

export default HeaderMenu;
