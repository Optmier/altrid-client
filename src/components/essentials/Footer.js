import React from 'react';
import NavLogoBlack from '../../images/logos/nav_logo_white.png';

function Footer() {
    return (
        <footer>
            <div className="contents">
                <div className="left">
                    <div className="menus">
                        <div className="item">
                            <a href="https://altridedge.com/" style={{ fontWeight: 600 }}>
                                ALTRID
                            </a>
                        </div>
                        <div className="item">
                            <a href="http://optmier.com/">Optmier 소개</a>
                        </div>
                        <div className="item">
                            <a href="https://www.altridedge.com/customer-service/faq">고객센터</a>
                        </div>
                        <div className="item">
                            <a href="https://www.notion.so/optmier/Optmier-Help-Center-8e6f5fe90beb42f0a10cb9b11a84f22a">
                                이용 약관 및 개인정보 보호 정책
                            </a>
                        </div>
                    </div>
                    <div className="infos">
                        옵트미어(Optmier)
                        <br />
                        대표 전광휘 | 전화<a href="tel:02-469-9703"> 02-469-9703</a> | 이메일
                        <a href="mailto:rikjeon94@optmier.com"> rikjeon94@optmier.com</a> | 사업자등록번호 309-30-62706 <br />
                        기술 지원 <a href="mailto:chsi1995@optmier.com"> chsi1995@optmier.com(최세인)</a> |{' '}
                        <a href="mailto:jun094@optmier.com"> jun094@optmier.com(최준영)</a>
                        <br />
                        주소 서울시 광진구 광나루로19길 23 1층 104호(세종대학교 캠퍼스타운 가온누리1)
                    </div>
                </div>
                <div className="right">
                    <div className="logo">
                        <img src={NavLogoBlack} alt="footer logo" />
                    </div>
                    <div className="copyright">© 2020 by Optmier all right reserved.</div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
