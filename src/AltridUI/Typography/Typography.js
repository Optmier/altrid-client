import React from 'react';
import styled from 'styled-components';

const Display = styled.div`
    color: inherit;
    font-family: inherit;
    font-size: ${({ size }) => {
            switch (size) {
                case 'xxl':
                    return 144;
                case 'xl':
                    return 128;
                case 'l':
                    return 112;
                case 'm':
                    return 96;
                case 's':
                    return 84;
                default:
                    return 112;
            }
        }}${'px'};
    font-weight: ${({ bold }) => (bold ? 700 : 400)};
    line-height: ${({ size }) => {
            switch (size) {
                case 'xxl':
                    return 148;
                case 'xl':
                    return 132;
                case 'l':
                    return 116;
                case 'm':
                    return 100;
                case 's':
                    return 88;
                default:
                    return 116;
            }
        }}${'px'};
    letter-spacing: ${({ size }) => {
            switch (size) {
                case 'xxl':
                case 'xl':
                    return -0.04;
                case 'l':
                case 'm':
                case 's':
                    return -0.02;
                default:
                    return -0.02;
            }
        }}${'em'};
    /** sizes for tablet */
    @media (max-width: 960px) {
        font-size: ${({ size }) => {
                switch (size) {
                    case 'xxl':
                        return 84;
                    case 'xl':
                        return 80;
                    case 'l':
                        return 72;
                    case 'm':
                        return 64;
                    case 's':
                        return 60;
                    default:
                        return 72;
                }
            }}${'px'};
        line-height: ${({ size }) => {
                switch (size) {
                    case 'xxl':
                        return 88;
                    case 'xl':
                        return 84;
                    case 'l':
                        return 76;
                    case 'm':
                        return 68;
                    case 's':
                        return 64;
                    default:
                        return 76;
                }
            }}${'px'};
    }
    /** sizes for mobile phone */
    @media (max-width: 640px) {
        font-size: ${({ size }) => {
                switch (size) {
                    case 'xxl':
                        return 56;
                    case 'xl':
                        return 52;
                    case 'l':
                        return 48;
                    case 'm':
                        return 44;
                    case 's':
                        return 40;
                    default:
                        return 48;
                }
            }}${'px'};
        line-height: ${({ size }) => {
                switch (size) {
                    case 'xxl':
                        return 60;
                    case 'xl':
                        return 56;
                    case 'l':
                        return 52;
                    case 'm':
                        return 48;
                    case 's':
                        return 44;
                    default:
                        return 52;
                }
            }}${'px'};
    }
`;
///////////////////////////////////////////////////////////
const HeadingXXL = styled.h1`
    color: inherit;
    font-family: inherit;
    font-size: 72px;
    font-weight: ${({ bold }) => (bold ? 700 : 400)};
    line-height: 76px;
    letter-spacing: -0.02em;
    /** sizes for tablet */
    @media (max-width: 960px) {
        font-size: 54px;
        line-height: 60px;
    }
    @media (max-width: 640px) {
        font-size: 40px;
        line-height: 44px;
    }
`;
const HeadingXL = styled.h2`
    color: inherit;
    font-family: inherit;
    font-size: 64px;
    font-weight: ${({ bold }) => (bold ? 700 : 400)};
    line-height: 68px;
    letter-spacing: -0.03em;
    /** sizes for tablet */
    @media (max-width: 960px) {
        font-size: 48px;
        line-height: 52px;
    }
    @media (max-width: 640px) {
        font-size: 36px;
        line-height: 40px;
    }
`;
const HeadingL = styled.h3`
    color: inherit;
    font-family: inherit;
    font-size: 56px;
    font-weight: ${({ bold }) => (bold ? 700 : 400)};
    line-height: 60px;
    letter-spacing: -0.03em;
    /** sizes for tablet */
    @media (max-width: 960px) {
        font-size: 40px;
        line-height: 44px;
    }
    @media (max-width: 640px) {
        font-size: 32px;
        line-height: 36px;
    }
`;
const HeadingM = styled.h4`
    color: inherit;
    font-family: inherit;
    font-size: 48px;
    font-weight: ${({ bold }) => (bold ? 700 : 400)};
    line-height: 52px;
    letter-spacing: -0.03em;
    /** sizes for tablet */
    @media (max-width: 960px) {
        font-size: 36px;
        line-height: 40px;
    }
    @media (max-width: 640px) {
        font-size: 28px;
        line-height: 32px;
    }
`;
const HeadingS = styled.h5`
    color: inherit;
    font-family: inherit;
    font-size: 44px;
    font-weight: ${({ bold }) => (bold ? 700 : 400)};
    line-height: 48px;
    letter-spacing: -0.03em;
    /** sizes for tablet */
    @media (max-width: 960px) {
        font-size: 32px;
        line-height: 36px;
    }
    @media (max-width: 640px) {
        font-size: 24px;
        line-height: 28px;
    }
`;
const HeadingXS = styled.h6`
    color: inherit;
    font-family: inherit;
    font-size: 40px;
    font-weight: ${({ bold }) => (bold ? 700 : 400)};
    line-height: 44px;
    letter-spacing: -0.03em;
    /** sizes for tablet */
    @media (max-width: 960px) {
        font-size: 28px;
        line-height: 32px;
    }
    @media (max-width: 640px) {
        font-size: 20px;
        line-height: 24px;
    }
`;
///////////////////////////////////////////////////////////
const HeadingNotHeadingComponent = styled.div`
    color: inherit;
    font-family: inherit;
    font-size: ${({ size }) => {
            switch (size) {
                case 'xxl':
                    return 72;
                case 'xl':
                    return 64;
                case 'l':
                    return 56;
                case 'm':
                    return 48;
                case 's':
                    return 44;
                case 'xs':
                    return 40;
                default:
                    return 56;
            }
        }}${'px'};
    font-weight: ${({ bold }) => (bold ? 700 : 400)};
    line-height: ${({ size }) => {
            switch (size) {
                case 'xxl':
                    return 76;
                case 'xl':
                    return 68;
                case 'l':
                    return 60;
                case 'm':
                    return 52;
                case 's':
                    return 48;
                case 'xs':
                    return 44;
                default:
                    return 60;
            }
        }}${'px'};
    letter-spacing: ${({ size }) => {
            switch (size) {
                case 'xxl':
                    return -0.02;
                case 'xl':
                    return -0.03;
                case 'l':
                case 'm':
                case 's':
                default:
                    return -0.03;
            }
        }}${'em'};
    /** sizes for tablet */
    @media (max-width: 960px) {
        font-size: ${({ size }) => {
                switch (size) {
                    case 'xxl':
                        return 54;
                    case 'xl':
                        return 48;
                    case 'l':
                        return 40;
                    case 'm':
                        return 36;
                    case 's':
                        return 32;
                    case 'xs':
                        return 28;
                    default:
                        return 40;
                }
            }}${'px'};
        line-height: ${({ size }) => {
                switch (size) {
                    case 'xxl':
                        return 60;
                    case 'xl':
                        return 52;
                    case 'l':
                        return 44;
                    case 'm':
                        return 40;
                    case 's':
                        return 36;
                    case 'xs':
                        return 32;
                    default:
                        return 44;
                }
            }}${'px'};
    }
    /** sizes for mobile phone */
    @media (max-width: 640px) {
        font-size: ${({ size }) => {
                switch (size) {
                    case 'xxl':
                        return 40;
                    case 'xl':
                        return 36;
                    case 'l':
                        return 32;
                    case 'm':
                        return 28;
                    case 's':
                        return 24;
                    case 'xs':
                        return 20;
                    default:
                        return 32;
                }
            }}${'px'};
        line-height: ${({ size }) => {
                switch (size) {
                    case 'xxl':
                        return 44;
                    case 'xl':
                        return 40;
                    case 'l':
                        return 36;
                    case 'm':
                        return 32;
                    case 's':
                        return 28;
                    case 'xs':
                        return 24;
                    default:
                        return 36;
                }
            }}${'px'};
    }
`;
//////////////////////////////////////////////////////////
const Label = styled.div`
    color: inherit;
    font-family: inherit;
    font-size: ${({ size }) => {
            switch (size) {
                case 'xxxl':
                    return 32;
                case 'xxl':
                    return 24;
                case 'xl':
                    return 18;
                case 'l':
                    return 16;
                case 'm':
                    return 14;
                case 's':
                    return 12;
                default:
                    return 16;
            }
        }}${'px'};
    font-weight: ${({ bold }) => (bold ? 700 : 400)};
    line-height: ${({ size }) => {
            switch (size) {
                case 'xxxl':
                    return 36;
                case 'xxl':
                    return 28;
                case 'xl':
                    return 22;
                case 'l':
                    return 20;
                case 'm':
                    return 18;
                case 's':
                    return 16;
                default:
                    return 20;
            }
        }}${'px'};
    letter-spacing: ${({ size }) => {
            switch (size) {
                case 'xxxl':
                case 'xxl':
                case 'xl':
                case 'l':
                case 'm':
                    return -0.02;
                case 's':
                    return -0.01;
                default:
                    return -0.02;
            }
        }}${'em'};
    /** sizes for tablet */
    @media (max-width: 960px) {
        font-size: ${({ size }) => {
                switch (size) {
                    case 'xxxl':
                        return 24;
                    case 'xxl':
                        return 20;
                    case 'xl':
                        return 18;
                    case 'l':
                        return 16;
                    case 'm':
                        return 14;
                    case 's':
                        return 12;
                    default:
                        return 16;
                }
            }}${'px'};
        line-height: ${({ size }) => {
                switch (size) {
                    case 'xxxl':
                        return 28;
                    case 'xxl':
                        return 24;
                    case 'xl':
                        return 22;
                    case 'l':
                        return 20;
                    case 'm':
                        return 18;
                    case 's':
                        return 16;
                    default:
                        return 20;
                }
            }}${'px'};
    }
    /** sizes for mobile phone */
    @media (max-width: 640px) {
        font-size: ${({ size }) => {
                switch (size) {
                    case 'xxxl':
                        return 22;
                    case 'xxl':
                        return 20;
                    case 'xl':
                        return 18;
                    case 'l':
                        return 16;
                    case 'm':
                        return 14;
                    case 's':
                        return 12;
                    default:
                        return 16;
                }
            }}${'px'};
        line-height: ${({ size }) => {
                switch (size) {
                    case 'xxxl':
                        return 26;
                    case 'xxl':
                        return 24;
                    case 'xl':
                        return 22;
                    case 'l':
                        return 20;
                    case 'm':
                        return 18;
                    case 's':
                        return 16;
                    default:
                        return 20;
                }
            }}${'px'};
    }
`;

function Typography({ type, size, isHeadingComponent, bold, children, ...rest }) {
    switch (type) {
        case 'display':
            return (
                <Display className="altrid-typography display" size={size} bold={bold} {...rest}>
                    {children}
                </Display>
            );
        case 'heading':
            if (!isHeadingComponent)
                return (
                    <HeadingNotHeadingComponent
                        className="altrid-typography heading not-heading-component"
                        size={size}
                        bold={bold}
                        {...rest}
                    >
                        {children}
                    </HeadingNotHeadingComponent>
                );
            if (size === 'xxl')
                return (
                    <HeadingXXL className="altrid-typography heading" bold={bold} {...rest}>
                        {children}
                    </HeadingXXL>
                );
            else if (size === 'xl')
                return (
                    <HeadingXL className="altrid-typography heading" bold={bold} {...rest}>
                        {children}
                    </HeadingXL>
                );
            else if (size === 'l')
                return (
                    <HeadingL className="altrid-typography heading" bold={bold} {...rest}>
                        {children}
                    </HeadingL>
                );
            else if (size === 'm')
                return (
                    <HeadingM className="altrid-typography heading" bold={bold} {...rest}>
                        {children}
                    </HeadingM>
                );
            else if (size === 's')
                return (
                    <HeadingS className="altrid-typography heading" bold={bold} {...rest}>
                        {children}
                    </HeadingS>
                );
            else if (size === 'xs')
                return (
                    <HeadingXS className="altrid-typography heading" bold={bold} {...rest}>
                        {children}
                    </HeadingXS>
                );
            else
                return (
                    <HeadingL className="altrid-typography heading" bold={bold} {...rest}>
                        {children}
                    </HeadingL>
                );
        case 'label':
            return (
                <Label className="altrid-typography label" size={size} bold={bold} {...rest}>
                    {children}
                </Label>
            );
        default:
            return (
                <Display className="altrid-typography display" size={size} bold={bold} {...rest}>
                    {children}
                </Display>
            );
    }
}

Typography.defaultProps = {
    type: 'heading',
    isHeadingComponent: false,
    size: 'l',
    bold: false,
};

export default Typography;
