import React from 'react';
import styled from 'styled-components';
import { getColorSets } from '../../../AltridUI/ThemeColors/ColorSets';
import Typography from '../../../AltridUI/Typography/Typography';

const Root = styled.div`
    align-items: center;
    color: ${getColorSets(600, 'gray')};
    display: flex;
    & div.altrid-typography {
        margin-left: 8px;
    }
`;

const Decoration = styled.svg`
    fill: ${getColorSets(600, 'gray')};
    margin-right: 0 !important;
`;

const LimitFuncWrapper = styled.div`
    border-radius: 8px;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: #ffffff5a;
    backdrop-filter: blur(4px);
    left: 0;
    top: 0;
    z-index: 12;
`;

function ReportWarningTags({ title, children }) {
    return (
        <Root>
            <Decoration width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 0C15.523 0 20 4.478 20 10C20 15.522 15.523 20 10 20C4.477 20 0 15.522 0 10C0 4.478 4.477 0 10 0ZM10.0018 13.0037C9.45025 13.0037 9.00314 13.4508 9.00314 14.0024C9.00314 14.5539 9.45025 15.001 10.0018 15.001C10.5533 15.001 11.0005 14.5539 11.0005 14.0024C11.0005 13.4508 10.5533 13.0037 10.0018 13.0037ZM9.99964 5C9.4868 5.00018 9.06427 5.38638 9.00669 5.88374L9 6.00036L9.0018 11.0012L9.00857 11.1179C9.06651 11.6152 9.48932 12.0011 10.0022 12.0009C10.515 12.0007 10.9375 11.6145 10.9951 11.1171L11.0018 11.0005L11 5.99964L10.9932 5.88302C10.9353 5.3857 10.5125 4.99982 9.99964 5Z" />
            </Decoration>
            <Typography type="label" size="xl" bold>
                {title}
            </Typography>
        </Root>
    );
}

ReportWarningTags.defaultProps = {
    title: '경고 메시지 예시 입니다.',
    type: 'warning',
};

export default ReportWarningTags;
export { LimitFuncWrapper };
