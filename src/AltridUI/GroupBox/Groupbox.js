import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const GropboxRoot = styled.div`
    width: ${({ fullWidth }) => (fullWidth ? '100%' : null)};
    & + & {
        margin-top: 32px;
    }
`;
const HeaderBox = styled.header`
    align-items: flex-end;
    /* border-bottom: 1px solid rgba(112, 112, 112, 0.7); */
    color: #000;
    display: flex;
    flex-direction: row;
    font-family: inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji',
        'Segoe UI Emoji', 'Segoe UI Symbol';
    font-weight: 700;
    justify-content: space-between;
    /* padding: 6px 2px 6px 2px; */
    margin-bottom: 16px;
    letter-spacing: -0.02em;
    & h5.title {
        font-size: 24px;
        font-weight: 700;
        line-height: 28px;
    }
    & div.right-comp {
        margin-left: auto;
    }
    & svg.open-commentary-dropdown-icon {
        cursor: pointer;
    }
    @media all and (max-width: 799px) {
        margin-bottom: 8px;
        & h5.title {
            font-size: 20px;
            line-height: 24px;
        }
    }
`;

const LimitedContainer = styled.main`
    height: ${(props) => props['max-height-css']};
    min-height: 64px;
    overflow: scroll;
    ${(props) =>
        props['break-point']
            ? `{
        @media all and (max-width: ${props['break-point']}px) {
            height: ${props['break-point-max-height-css']};
        }
    }`
            : null}
`;

const GroupBox = React.memo(function ({
    fullWidth,
    title,
    rightComponent,
    limited,
    maxHeightCss,
    breakPoint,
    breakPointMaxHeightCss,
    onClick,
    onScrollBottomEdge,
    children,
    ...rest
}) {
    const containerRef = useRef();
    const [scrollTop, setScrollTop] = useState(null);
    const [isScrollBottomEdge, setIsScrollBottomEdge] = useState(false);
    const [loading, setLoading] = useState(true);

    const actionScrollEnd = () => {
        onScrollBottomEdge();
    };

    useEffect(() => {
        if (!containerRef || !containerRef.current) return;
        let mounted = true;
        containerRef.current.addEventListener('scroll', () => {
            if (mounted) {
                setScrollTop(containerRef.current.scrollTop);
                setLoading(false);
            }
        });
        return () => {
            mounted = false;
        };
    }, [containerRef]);

    useEffect(() => {
        if (!containerRef || !containerRef.current || scrollTop === null) return;
        const { clientHeight, scrollHeight } = containerRef.current;
        if (clientHeight === scrollHeight - scrollTop) {
            setIsScrollBottomEdge(true);
        } else {
            setIsScrollBottomEdge(false);
        }
    }, [scrollTop, containerRef]);

    useEffect(() => {
        if (isScrollBottomEdge) actionScrollEnd();
    }, [isScrollBottomEdge]);

    return (
        <GropboxRoot fullWidth={fullWidth} {...rest}>
            <HeaderBox onClick={onClick}>
                <h5 className="title">{title}</h5>
                <div className="right-comp">{rightComponent}</div>
            </HeaderBox>
            {limited ? (
                <LimitedContainer
                    ref={containerRef}
                    max-height-css={maxHeightCss}
                    break-point={breakPoint}
                    break-point-max-height-css={breakPointMaxHeightCss}
                >
                    {children}
                </LimitedContainer>
            ) : (
                children
            )}
        </GropboxRoot>
    );
});

GroupBox.defaultProps = {
    title: '제목',
    rightComponent: <></>,
    limited: false,
    fullWidth: false,
    onClick() {},
    onScrollBottomEdge() {},
};

// clientHeight === (scrollHeight - scrollTop)

export default React.memo(GroupBox);
