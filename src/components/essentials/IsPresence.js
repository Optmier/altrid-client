import React from 'react';

const OnOffCircle = ({ fill }) => {
    return <div style={{ width: '8px', height: '8px', borderRadius: '5px', backgroundColor: fill }}> </div>;
};
const BottomSpan = ({ color, fill, children, align }) => {
    return (
        <span className="card-bottom-p" style={{ color: color, display: 'flex', alignItems: 'center' }}>
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
function IsPresence({ type, able, align }) {
    //type : 'eye' 'share'
    //able : true, false
    //align : left, right
    return (
        <>
            {type === 'eye' ? (
                able ? (
                    <BottomSpan color="black" fill="red" align={align}>
                        시선흐름 포함
                    </BottomSpan>
                ) : (
                    <BottomSpan align={align}>시선흐름 미포함</BottomSpan>
                )
            ) : able ? (
                <BottomSpan color="#13E2A1" fill="#FFBE2F" align={align}>
                    공유 완료
                </BottomSpan>
            ) : (
                <BottomSpan align={align}>미공유</BottomSpan>
            )}
        </>
    );
}

BottomSpan.defaultProps = {
    color: '#BFBEBC',
    fill: '#BFBEBC',
};

IsPresence.defaultProps = {
    align: 'right',
};

export default IsPresence;
