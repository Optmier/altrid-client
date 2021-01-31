import React from 'react';

function Profile() {
    return (
        <div className="profile-root">
            <div className="mypage-title">프로필 설정</div>
            <section>
                <div className="mypage-header">프로필 사진</div>
                <div className="mypage-contents profile-image">
                    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M16.9999 0.333984C7.79992 0.333984 0.333252 7.80065 0.333252 17.0007C0.333252 26.2007 7.79992 33.6673 16.9999 33.6673C26.1999 33.6673 33.6666 26.2007 33.6666 17.0007C33.6666 7.80065 26.1999 0.333984 16.9999 0.333984ZM16.9999 5.33398C19.7666 5.33398 21.9999 7.56732 21.9999 10.334C21.9999 13.1007 19.7666 15.334 16.9999 15.334C14.2333 15.334 11.9999 13.1007 11.9999 10.334C11.9999 7.56732 14.2333 5.33398 16.9999 5.33398ZM16.9999 29.0007C12.8333 29.0007 9.14992 26.8673 6.99992 23.634C7.04992 20.3173 13.6666 18.5007 16.9999 18.5007C20.3166 18.5007 26.9499 20.3173 26.9999 23.634C24.8499 26.8673 21.1666 29.0007 16.9999 29.0007Z"
                            fill="#707070"
                        />
                    </svg>

                    <div className="profile-image-right">
                        <button className="btn-purple">사진 변경</button>
                        <button className="btn-gray">삭제하기</button>
                    </div>
                </div>
            </section>

            <section>
                <div className="mypage-header">이름 / 학원명</div>
                <div className="mypage-contents white-box profile-info">
                    <div className="row">
                        <div className="row-title">이름</div>
                        <div className="row-desc">
                            <input placeholder="최준영" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="row-title">학원명</div>
                        <div className="row-desc">옵트미어 학원</div>
                    </div>
                    <div className="row">
                        <div className="row-title">학원코드</div>
                        <div className="row-desc">adsf </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Profile;
