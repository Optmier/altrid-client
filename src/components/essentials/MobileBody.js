import React from 'react';
import LogoWhite from '../../images/logos/nav_logo_white.png';

function MobileBody() {
    return (
        <div className="mobile-body-root">
            <div className="mobile-logo">
                <img src={LogoWhite} alt="logo_white"></img>
            </div>
            <div className="mobile-body">
                <h1>
                    Altrid 서비스 <br />
                    데스크탑과 테블릿 브라우저만 <br />
                    지원하고 있습니다 :(
                </h1>

                <p>
                    데스크탑 또는 테블릿 디바이스를 이용해주세요.
                    <br />
                    추후, 모바일 앱이 개발될 예정입니다 :)
                </p>
            </div>
        </div>
    );
}

export default MobileBody;
