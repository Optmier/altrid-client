import { withStyles, Dialog } from '@material-ui/core';
import React from 'react';
import SmartTOFELRender from './SmartTOFELRender';

const PreviewDialog = withStyles((theme) => ({
    root: {
        '& .MuiPaper-root.MuiDialog-paper.MuiDialog-paperScrollPaper.MuiDialog-paperWidthSm.MuiPaper-rounded': {
            maxWidth: 1280,
        },
    },
}))(Dialog);

function CardProblemPreview({ openPreview, metadata, timeLimit, handlePreviewClose }) {
    console.log(metadata);
    return (
        <PreviewDialog open={openPreview} onClose={handlePreviewClose}>
            <div>
                <SmartTOFELRender
                    preview
                    title={metadata.map((m) => m.title)}
                    passageForRender={metadata.map((m) => m.passageForRender)}
                    problemDatas={metadata.flatMap((m) => m.problemDatas)}
                    timer={timeLimit}
                    onEnd={handlePreviewClose}
                />
            </div>
        </PreviewDialog>
    );
}

export default CardProblemPreview;
