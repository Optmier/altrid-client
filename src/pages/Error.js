import React from 'react';
import ClassWrapper from '../components/essentials/ClassWrapper';
import LeftNav from '../components/essentials/LeftNav';
import '../styles/error_page.scss';
import { withRouter } from 'react-router-dom';

function Error({ history, match }) {
    return (
        <>
            <div className="error-root">
                <ClassWrapper>
                    <div className="error-wrapper">
                        <h1>404 Error :(</h1>

                        <p>
                            존재하지 않는 주소를 입력하셨거나, <br />
                            요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.
                        </p>

                        <button
                            onClick={() => {
                                history.replace('/');
                            }}
                        >
                            홈으로 이동
                        </button>
                    </div>
                </ClassWrapper>
            </div>
        </>
    );
}

export default withRouter(Error);
