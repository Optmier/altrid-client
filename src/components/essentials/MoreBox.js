import React from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import styled from 'styled-components';

const StyleMoreBox = styled.div`
    width: 100%;
    box-sizing: border-box;
    padding: 1rem;
    border-radius: 12px;
    background-image: url('/bg_images/moreEyetrack.png');
    background-repeat: no-repeat;
    background-size: cover;
    color: white;

    & .more-eyetrack-ment {
        font-size: 1.15rem;
        font-weight: 500;
    }
    & .more-eyetrack-button {
        & > a {
            text-decoration: none;
        }
        & > a:link {
            color: white;
        }
        & > a:visited {
            color: white;
        }
        font-size: 0.8rem;
        font-weight: 600;
        text-align: right;
        transition: all 0.5s;
        cursor: pointer;
    }

    & .more-eyetrack-button:hover {
        margin-right: -5px;
    }
`;
function MoreBox() {
    return (
        <StyleMoreBox>
            <div className="more-eyetrack-ment">
                알트리드는 문제 풀이 중 <br />
                모든 것을 관찰하고 기록합니다.
            </div>
            <div className="more-eyetrack-button">
                <a href="https://www.notion.so/optmier/a4daf8676b2b4460b75613f25249abf3" alt="more_eyetrack" target="_blank">
                    <IoIosArrowForward style={{ marginRight: '5px' }} />더 알아보기
                </a>
            </div>
        </StyleMoreBox>
    );
}

export default MoreBox;
