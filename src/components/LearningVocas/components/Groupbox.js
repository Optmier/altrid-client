import React from 'react';
import styled from 'styled-components';

const GropboxRoot = styled.div`
    & + & {
        margin-top: 90px;
    }
`;
const HeaderBox = styled.header`
    align-items: flex-end;
    border-bottom: 1px solid rgba(112, 112, 112, 0.7);
    color: #000;
    display: flex;
    flex-direction: row;
    font-weight: 500;
    justify-content: space-between;
    padding: 6px 2px 6px 2px;
    margin-bottom: 16px;

    & h5.title {
        font-size: 1.25rem;
        font-weight: 500;
    }

    & div.right-comp {
        margin-left: auto;
    }

    & svg.open-commentary-dropdown-icon {
        cursor: pointer;
    }
`;

const LimitedContainer = styled.main`
    height: ${(props) => props['max-height-css']};
    overflow: scroll;
`;

const GroupBox = React.memo(function ({ title, rightComponent, limited, maxHeightCss, onClick, children, ...rest }) {
    return (
        <GropboxRoot {...rest}>
            <HeaderBox onClick={onClick}>
                <h5 className="title">{title}</h5>
                <div className="right-comp">{rightComponent}</div>
            </HeaderBox>
            {limited ? <LimitedContainer max-height-css={maxHeightCss}>{children}</LimitedContainer> : children}
        </GropboxRoot>
    );
});

GroupBox.defaultProps = {
    title: '제목',
    rightComponent: <></>,
    limited: false,
    onClick: undefined,
};

export default React.memo(GroupBox);
