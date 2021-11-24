import React from 'react';
import styled from 'styled-components';

const DrawerGrouBoxRoot = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 32px;
    width: 100%;
`;
const GroupBoxHeader = styled.div``;
const GroupBoxMain = styled.div`
    margin-top: 16px;
    min-height: 32px;
`;
const Title = styled.div`
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.75rem;
`;
const Description = styled.div`
    font-size: 1.125rem;
    font-weight: 400;
    line-height: 1.375rem;
    margin-top: 4px;
`;
const DescriptionAdornmentImage = styled.img`
    margin-right: 6px;
`;

function DrawerGroupBox({ title, description, descriptionAdornment, children }) {
    return (
        <DrawerGrouBoxRoot>
            <GroupBoxHeader>
                <Title>{title}</Title>
                <Description>
                    <DescriptionAdornmentImage alt="groupbox icon" src={descriptionAdornment} />
                    {description}
                </Description>
            </GroupBoxHeader>
            <GroupBoxMain>{children}</GroupBoxMain>
        </DrawerGrouBoxRoot>
    );
}

DrawerGroupBox.defaultProps = {
    title: '여기에 그룹박스 타이틀 입력',
    description: '여기에 그룹박스 설명 입력',
    descriptionAdornment: null,
};

export default DrawerGroupBox;
