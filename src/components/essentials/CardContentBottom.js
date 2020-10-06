import React from 'react';

const OnOffCircle = ({ fill }) => {
    return <div style={{ width: '8px', height: '8px', borderRadius: '5px', backgroundColor: fill, marginRight: '5px' }}> </div>;
};
const BottomSpan = ({ color, fill, children, align }) => {
    console.log(align);
    return (
        <span className="card-bottom-p" style={{ color: color, display: 'flex', alignItems: 'center' }}>
            {align === 'right' ? <OnOffCircle fill={fill} /> : ''}
            {children}
            {align === 'left' ? <OnOffCircle fill={fill} /> : ''}
        </span>
    );
};
function CardContentBottom({ type, able, align }) {
    return (
        <>
            {type === 'eye' ? (
                able ? (
                    <BottomSpan color="black" fill="red" align={align}>
                        시선흐름 포함
                    </BottomSpan>
                ) : (
                    <BottomSpan align={align}>시선흐름 포함</BottomSpan>
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

CardContentBottom.defaultProps = {
    align: 'right',
};

export default CardContentBottom;
