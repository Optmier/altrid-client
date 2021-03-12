import React, { memo } from 'react';
import styled from 'styled-components';

const StyleWrapper = styled.div`
    width: 100%;
    height: 100%;
    min-width: ${(props) => props.minWidth};
    min-height: ${(props) => props.minHeight};

    display: flex;
    flex-direction: column;
    align-items: ${(props) => (props.type === 'default' ? 'center' : 'flex-start')};
    justify-content: center;

    & #ment {
        color: black;
        font-size: ${(props) => (props.size === 'small' ? '0.75rem' : '0.9rem')};
        font-weight: ${(props) => (props.size === 'small' ? '500' : '600')};
        display: flex;
        align-items: center;
        & svg {
            margin: 0 9px 0 0;
            height: ${(props) => (props.size === 'small' ? '15px' : '20px')};
            width: ${(props) => (props.size === 'small' ? '10.5px' : '15.5px')};
        }
    }
    & #sub-ment {
        margin-top: 0.45rem;
        font-size: 0.85rem;
        font-weight: 400;
        color: gray;
    }
`;

function RestrictWrapper({ children, size, minWidth, minHeight, type, restricted }) {
    return (
        <>
            {restricted ? (
                <StyleWrapper type={type} size={size} minWidth={minWidth} minHeight={minHeight}>
                    {type === 'default' ? (
                        <div id="ment">
                            <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M8 4H7.42857V2.85714C7.42857 1.28 6.14857 0 4.57143 0C2.99429 0 1.71429 1.28 1.71429 2.85714V4H1.14286C0.514286 4 0 4.51429 0 5.14286V10.8571C0 11.4857 0.514286 12 1.14286 12H8C8.62857 12 9.14286 11.4857 9.14286 10.8571V5.14286C9.14286 4.51429 8.62857 4 8 4ZM4.57143 9.14286C3.94286 9.14286 3.42857 8.62857 3.42857 8C3.42857 7.37143 3.94286 6.85714 4.57143 6.85714C5.2 6.85714 5.71429 7.37143 5.71429 8C5.71429 8.62857 5.2 9.14286 4.57143 9.14286ZM6.34286 4H2.8V2.85714C2.8 1.88 3.59429 1.08571 4.57143 1.08571C5.54857 1.08571 6.34286 1.88 6.34286 2.85714V4Z"
                                    fill="black"
                                />
                            </svg>
                            현재 플랜 제한 기능입니다.
                        </div>
                    ) : (
                        <>
                            <div id="ment">
                                <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M8 4H7.42857V2.85714C7.42857 1.28 6.14857 0 4.57143 0C2.99429 0 1.71429 1.28 1.71429 2.85714V4H1.14286C0.514286 4 0 4.51429 0 5.14286V10.8571C0 11.4857 0.514286 12 1.14286 12H8C8.62857 12 9.14286 11.4857 9.14286 10.8571V5.14286C9.14286 4.51429 8.62857 4 8 4ZM4.57143 9.14286C3.94286 9.14286 3.42857 8.62857 3.42857 8C3.42857 7.37143 3.94286 6.85714 4.57143 6.85714C5.2 6.85714 5.71429 7.37143 5.71429 8C5.71429 8.62857 5.2 9.14286 4.57143 9.14286ZM6.34286 4H2.8V2.85714C2.8 1.88 3.59429 1.08571 4.57143 1.08571C5.54857 1.08571 6.34286 1.88 6.34286 2.85714V4Z"
                                        fill="black"
                                    />
                                </svg>
                                무료 버전에서 시선흐름 측정 과제는 단, 2회 게시 가능합니다.
                            </div>
                            <div id="sub-ment">시선흐름이 미포함된 과제는 무제한 게시 가능합니다.</div>
                        </>
                    )}
                </StyleWrapper>
            ) : (
                children
            )}
        </>
    );
}
RestrictWrapper.defaultProps = {
    type: 'default',
    restricted: false,
    size: 'medium',
    minWidth: '100%',
    minHeight: '100%',
};

export default memo(RestrictWrapper);
