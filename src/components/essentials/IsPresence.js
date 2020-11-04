import React from 'react';

const OnOffCircle = ({ fill }) => {
    return <div style={{ width: '8px', height: '8px', borderRadius: '5px', backgroundColor: fill }}> </div>;
};
const BottomSpan = ({ color, fill, children, align, shareRef }) => {
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
    //align : 'left', 'right'

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
                <BottomSpan color="black" fill="#3b168a" align={align}>
                    공유중
                </BottomSpan>
            ) : (
                <BottomSpan align={align}>미공유</BottomSpan>
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
};

export default IsPresence;
