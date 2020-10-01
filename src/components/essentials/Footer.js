import React from 'react';

function Footer() {
    return (
        <div className="footer-contents">
            <p>
                {/* <span>대표 전광휘</span> | <span>사업자등록번호 309-30-62706</span>
        <br></br> */}
                서울시 관악구 관악로 1 32-1 2층 201호 (서울대학교 해동학술관)
                <br></br>
                <span>
                    전화: <a href="tel:123-456-7890">010-5912-1545</a>
                </span>
                {' | '}
                <span>
                    이메일: <a href="mailto:khjeon1994@gmail.com">khjeon1994@gmail.com</a>
                </span>
            </p>
            <p>© 2020 by Eduity for Infinite Pioneer all right reserved.</p>
        </div>
    );
}

export default Footer;
