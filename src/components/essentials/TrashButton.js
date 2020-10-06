import React from 'react';

function TrashButton() {
    return (
        <div>
            <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M35.625 7.5H29.0625L27.1875 5.625H17.8125L15.9375 7.5H9.375V11.25H35.625V7.5ZM11.25 13.125V35.625C11.25 37.6875 12.9375 39.375 15 39.375H30C32.0625 39.375 33.75 37.6875 33.75 35.625V13.125H11.25ZM26.25 26.25V33.75H18.75V26.25H15L22.5 18.75L30 26.25H26.25Z"
                    fill="#C4C4C4"
                />
            </svg>
        </div>
    );
}

export default TrashButton;
