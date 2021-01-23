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
                    해당 서비스 <br />
                    데스크탑 브라우저에서만 <br />
                    지원하고 있습니다 :(
                </h1>

                <p>
                    데스크탑 디바이스를 이용해주세요.
                    <br />
                    알트리드 서비스는 크롬 브라우저에 최적화되어있습니다. :)
                </p>
            </div>
        </div>
    );
}

export default MobileBody;
