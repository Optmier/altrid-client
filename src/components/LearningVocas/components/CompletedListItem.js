import React from 'react';
import styled from 'styled-components';
import VerifiedIcon from '@material-ui/icons/CheckCircle';

const ItemRoot = styled.div`
    background-color: ${({ idx }) => (idx % 2 === 1 ? '#ffffff' : '#F6F8F9')};
    border-radius: 8px;
    color: #11171c;
    display: flex;
    font-size: 18px;
    letter-spacing: -0.02em;
    line-height: 22px;
    min-height: 46px;
    width: 100%;
    & + & {
        /* margin-top: 4px; */
    }
    @media all and (max-width: 799px) {
        background-color: #ffffff;
        & + & {
            margin-top: 8px;
        }
    }
`;
const LabelColor = styled.div`
    border-radius: 8px;
    background-color: ${(props) =>
        props['label-color'] === 1
            ? '#cbcbcb'
            : props['label-color'] === 2
            ? '#ffcf70'
            : props['label-color'] >= 3
            ? '#e85c4a'
            : '#ffffff'};
    margin-top: auto;
    margin-bottom: auto;
    height: 36px;
    width: 5px;
    @media all and (max-width: 799px) {
        margin-top: 8px;
    }
`;
const ContentsContainer = styled.div`
    align-items: center;
    display: flex;
    flex-direction: row;
    overflow: hidden;
    padding: 8px;
    width: 100%;
    @media all and (max-width: 799px) {
        flex-direction: column;
        padding: 16px 16px 16px 11px;
    }
`;
const Word = styled.div`
    flex-basis: 35%;
    font-size: 18px;
    font-weight: 700;
    line-height: 22px;
    margin-left: 28px;
    @media all and (max-width: 799px) {
        margin-left: 0;
    }
`;
const Means = styled.div`
    flex-basis: 65%;
    font-weight: 400;
    margin-left: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;
const Notes = styled.div`
    font-weight: 400;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    @media all and (max-width: 799px) {
        flex-basis: 90%;
    }
`;
const Verified = styled.div`
    align-items: center;
    color: #05944f;
    display: flex;
    margin-left: 4px;
    min-width: 26px;
`;
const LayoutContainer = styled.div`
    align-items: center;
    display: flex;
    overflow: hidden;
    &:first-child {
        width: 80%;
    }
    &:last-child {
        margin-left: 16px;
        width: 20%;
        justify-content: space-between;
    }
    @media all and (max-width: 799px) {
        font-size: 16px;
        font-weight: 400;
        justify-content: space-between;
        line-height: 20px;
        &:first-child {
            margin: 0;
            width: 100%;
        }
        &:last-child {
            margin: 0;
            margin-top: 8px;
            width: 100%;
        }
    }
`;

function CompletedListItem({ idx, word, means, notes, label, verified, children }) {
    return (
        <ItemRoot idx={idx}>
            <LabelColor label-color={label} />
            <ContentsContainer>
                <LayoutContainer>
                    <Word>{word}</Word>
                    <Means>{means}</Means>
                </LayoutContainer>
                <LayoutContainer>
                    <Notes>{'과제 1'}</Notes>
                    <Verified>{verified ? <VerifiedIcon /> : null}</Verified>
                </LayoutContainer>
            </ContentsContainer>
        </ItemRoot>
    );
}

CompletedListItem.defaultProps = {
    word: 'word',
    means: '뜻',
    notes: '메모',
    label: 1,
    verified: true,
};

export default CompletedListItem;
