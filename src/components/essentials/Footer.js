import React from 'react';
import NavLogoBlack from '../../images/logos/nav_logo_black.png';

function Footer() {
    return (
        <footer>
            <div className="contents">
                <div className="left">
                    <div className="menus">
                        <div className="item">
                            <a href="https://eduityedu.com/">Eduity 소개</a>
                        </div>
                        <div className="item">
                            <a href="https://www.notion.so/Eduity-Help-Center-8e6f5fe90beb42f0a10cb9b11a84f22a">
                                이용 약관 및 개인정보 보호 정책
                            </a>
                        </div>
                    </div>
                    <div className="infos">
                        {/* 상호명 에듀이티(Eduity for Infinite Pioneer) | 사업자등록번호 309-30-62706{' '} */}
                        {/* | 통신판매신고번호 2020-서울강남-00000 */}
                        {/* <br />
                        대표 전광휘 | 전화 */}
                        전화<a href="tel:010-5912-1545"> 010-5912-1545</a> | 이메일
                        <a href="mailto:khjeon1994@gmail.com"> khjeon1994@gmail.com</a>
                        <br />
                        주소 서울시 관악구 관악로 1 32-1 2층 201호 (서울대학교 해동학술관)
                    </div>
                </div>
                <div className="right">
                    <div className="logo">
                        <img src={NavLogoBlack} alt="footer logo" />
                    </div>
                    <div className="copyright">© 2020 by Eduity for Infinite Pioneer all right reserved.</div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
