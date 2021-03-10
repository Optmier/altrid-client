import React from 'react';
import styled from 'styled-components';

const StyleWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    & #ment {
        font-size: 0.9rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        & svg {
            margin: 0 5px 0 0;
            height: 20px;
            width: 15.24px;
        }
    }
`;

function RestrictWrapper({ children, type, restricted }) {
    return (
        <>
            {restricted ? (
                <StyleWrapper>
                    <div id="ment">
                        <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M8 4H7.42857V2.85714C7.42857 1.28 6.14857 0 4.57143 0C2.99429 0 1.71429 1.28 1.71429 2.85714V4H1.14286C0.514286 4 0 4.51429 0 5.14286V10.8571C0 11.4857 0.514286 12 1.14286 12H8C8.62857 12 9.14286 11.4857 9.14286 10.8571V5.14286C9.14286 4.51429 8.62857 4 8 4ZM4.57143 9.14286C3.94286 9.14286 3.42857 8.62857 3.42857 8C3.42857 7.37143 3.94286 6.85714 4.57143 6.85714C5.2 6.85714 5.71429 7.37143 5.71429 8C5.71429 8.62857 5.2 9.14286 4.57143 9.14286ZM6.34286 4H2.8V2.85714C2.8 1.88 3.59429 1.08571 4.57143 1.08571C5.54857 1.08571 6.34286 1.88 6.34286 2.85714V4Z"
                                fill="black"
                            />
                        </svg>

                        {type === 'default' ? '현재 플랜 제한 기능입니다.' : '무료 버전에서 시선흐름 측정 과제는 단, 2회 게시 가능합니다.'}
                    </div>
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
};

export default RestrictWrapper;
