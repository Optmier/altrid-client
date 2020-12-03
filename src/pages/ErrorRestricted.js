import React from 'react';
import ClassWrapper from '../components/essentials/ClassWrapper';
import LeftNav from '../components/essentials/LeftNav';
import '../styles/error_page.scss';
import { withRouter } from 'react-router-dom';

function ErrorRestricted({ history, match }) {
    return (
        <>
            <div className="error-root">
                <ClassWrapper>
                    <div className="error-wrapper">
                        <h1>403 Error :(</h1>

                        <p>이 페이지를 볼 권한이 없습니다.</p>

                        <button
                            onClick={() => {
                                history.replace('/');
                            }}
                        >
                            홈으로 이동
                            <svg xmlns="http://www.w3.org/2000/svg" width="30.414" height="9.978" viewBox="0 0 30.414 9.978">
                                <path
                                    id="icon"
                                    d="M0 0h28l-8.27 8.27"
                                    fill="none"
                                    stroke="#fff"
                                    strokeWidth="2px"
                                    transform="translate(0 1)"
                                />
                            </svg>
                        </button>
                    </div>
                </ClassWrapper>
            </div>
        </>
    );
}

export default withRouter(ErrorRestricted);
