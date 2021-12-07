import React from 'react';
import { Helmet } from 'react-helmet';

function BackgroundTheme({ colors, children }) {
    return (
        <Helmet>
            <style>{`
                    html, body {
                        background-color: ${colors};
                    }
            `}</style>
        </Helmet>
    );
}

BackgroundTheme.defaultProps = {
    colors: '#ffffff',
};

export default BackgroundTheme;
