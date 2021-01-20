import React from 'react';

const OnOffCircle = ({ fill }) => {
    return <div style={{ width: '13px', height: '13px', borderRadius: '10px', backgroundColor: fill }}> </div>;
};
const BottomSpan = ({ color, fill, children, align, fontSize }) => {
    return (
        <span className="card-bottom-p" style={{ color: color, display: 'flex', alignItems: 'center', fontSize: fontSize }}>
            {align === 'right' ? (
                <>
                    <OnOffCircle fill={fill} />
                    <span style={{ marginRight: '5px' }}></span>
                </>
            ) : (
                ''
            )}
            {children}
            {align === 'left' ? (
                <>
                    <span style={{ marginLeft: '5px' }}></span>
                    <OnOffCircle fill={fill} />
                </>
            ) : (
                ''
            )}
        </span>
    );
};
function IsPresence({ type, able, align, fontSize }) {
    //type : 'eye' 'analysis'
    //able : text...
    //align : 'left', 'right'

    return (
        <>
            {type === 'eye' ? (
                able ? (
                    <BottomSpan fontSize={fontSize} color="black" fill="red" align={align}>
                        시선흐름 분석 포함
                    </BottomSpan>
                ) : (
                    <BottomSpan fontSize={fontSize} align={align}>
                        시선흐름 분석 미포함
                    </BottomSpan>
                )
            ) : !(able < 100) ? (
                <BottomSpan fontSize={fontSize} color="black" fill="#39A0FE" align={align}>
                    유형별 분석 가능
                </BottomSpan>
            ) : (
                <BottomSpan fontSize={fontSize} align={align}>
                    유형별 분석 불가능
                </BottomSpan>
            )}
        </>
    );
}

BottomSpan.defaultProps = {
    color: '#989696',
    fill: '#989696',
};

IsPresence.defaultProps = {
    align: 'right',
    fontSize: '0.75rem',
};

export default IsPresence;
