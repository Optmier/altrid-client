/* eslint-disable react-hooks/exhaustive-deps */
import {
    AppBar,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grow,
    makeStyles,
    Toolbar,
    Typography,
} from '@material-ui/core';
import Split from 'react-split';
import Cropper from 'cropperjs';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Button from '../../../AltridUI/Button/Button';
import OCRSwapIcon from '../../../AltridUI/Icons/OCRSwapIcon';
import OCRExtractIcon from '../../../AltridUI/Icons/OCRExtractIcon';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'cropperjs/dist/cropper.css';
import tip0Img from './tip0.png';
import { useDispatch } from 'react-redux';
import { closeAlertDialog, openAlertDialog, openAlertSnackbar } from '../../../redux_modules/alertMaker';

const useStyles = makeStyles((theme) => ({
    appBar: {
        backgroundColor: '#3B1689',
        position: 'relative',
        height: 48,
    },
    toolBar: {
        minHeight: 48,
        '& button + button': {
            marginLeft: 16,
        },
    },
    title: {
        fontFamily: [
            'inter',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ],
        fontSize: '1.5rem',
        fontWeight: 700,
        letterSpacing: '-0.02em',
        lineHeight: '1.75rem',
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    sendButtonProgress: {
        color: 'white',
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
        '& svg': {
            margin: '0 !important',
        },
    },
    dialogContentNoPadding: {
        padding: 0,
        '&:first-child': {
            padding: 0,
        },
    },
}));

// ?????? ????????????
const MainContainer = styled.div`
    font-family: inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji',
        'Segoe UI Emoji', 'Segoe UI Symbol';
    height: calc(100% - 106px);

    & .split {
        height: 100%;
    }

    & .gutter {
        background-color: #e9edef;
        background-repeat: no-repeat;
        background-position: 50%;
        /* box-shadow: 0px 0px 8px #00000029; */
        /* border-left: 1px solid #cccccc30; */
        /* border-right: 1px solid #cccccc30; */
        transition: all 0.25s;

        &:hover {
            background-color: #e9edef;
            /* box-shadow: 0px 0px 10px #00000029; */
        }

        &:active {
            background-color: #bfc6cd;
        }
    }

    & .gutter.gutter-vertical {
        background-image: url('/bg_images/ic-gutter-horizontal.png');
        background-size: contain;
        cursor: row-resize;
    }

    & div.image-adjustment-container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        position: relative;

        & div.adjustment-container {
            position: absolute;
            width: 100%;
            height: 100%;

            & .split {
                display: flex;
                flex-direction: row;
                height: 100%;
                color: #000;
                font-size: 1.5rem;
                font-weight: 700;
                /* text-shadow: 0 0 12px black; */

                & div.aria {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    padding-bottom: 36px;
                    transition: background-color 0.25s;

                    &.texts {
                        background-color: #f6f8f9ad;
                    }

                    &.problems {
                        background-color: #f6f8f9ad;
                    }
                }
            }

            & .gutter {
                background-color: #e9edef;
                background-repeat: no-repeat;
                background-position: 50%;
                /* box-shadow: 0px 0px 8px #00000029; */
                /* border-left: 1px solid #cccccc30; */
                /* border-right: 1px solid #cccccc30; */
                transition: all 0.25s;

                &:hover {
                    background-color: #e9edef;
                    /* box-shadow: 0px 0px 10px #00000029; */
                }

                &:active {
                    background-color: #bfc6cd;
                }
            }

            & .gutter.gutter-horizontal {
                background-image: url('/bg_images/ic-gutter-vertical.png');
                background-size: contain;
                cursor: col-resize;
            }
        }

        & img {
            width: 100%;
            height: 100%;
            max-width: fit-content;
        }
    }

    & div.editor-container {
        display: flex;
        align-items: center;
        justify-content: center;

        & .editor {
            height: 100%;
            width: 50%;
            & .quill {
                & .ql-toolbar {
                    border-color: #e9edef;
                    font-family: inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif,
                        'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
                    font-size: 18px;
                    font-weight: 700;
                    letter-spacing: -0.02em;
                    line-height: 22px;
                }
                & .ql-container {
                    border-color: #e9edef;
                }
            }
        }
    }
`;
const ActionsContainer = styled.div`
    position: absolute;
    z-index: 999;
    & button + button {
        margin-top: 8px;
    }
`;
// ??????, ?????? ?????? ???????????? ??????
const SwapButton = styled.button`
    align-items: center;
    background-color: #ffffff;
    border: 1px solid #e9edef;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    padding: 0;
    width: 56px;
    height: 56px;
    transition: all 0.25s;
    &:hover {
        background-color: #f6f8f9;
    }
    &:disabled {
        background: #7b718f;
        color: #bebcbc92;
        cursor: none;
        pointer-events: none;
    }
    & svg {
    }
`;

// ???????????? ??????
const SendButton = styled.button`
    align-items: center;
    background-color: #ffffff;
    border: 1px solid #e9edef;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    padding: 0;
    width: 56px;
    height: 56px;
    transition: all 0.25s;
    &:hover {
        background-color: #f6f8f9;
    }
    &:disabled {
        background: #7b718f;
        color: #bebcbc92;
        cursor: none;
        pointer-events: none;
    }
    & svg {
    }
`;
const CloseButton = styled.button`
    align-items: center;
    background-color: #ffffff;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    padding: 0;
    margin-left: 24px !important;
    height: 24px;
    width: 24px;
`;
// ????????? ?????? ????????? Transition
const DialogTransition = React.forwardRef(function DialogTransition(props, ref) {
    return <Grow ref={ref} {...props} />;
});

function GoogleCloudVisionOCR({ testMode, apiKey, maxImgSize, onApply, applyButtonText, children }) {
    const classes = useStyles();

    const fileInputRef = useRef();
    const imageTaskAreaRef = useRef();
    const imageAdjustmentCoreRef = useRef();
    const ariaTextsRef = useRef();
    const ariaProblemsRef = useRef();
    const previewRef = useRef();
    const textsQuillRef = useRef();
    const problemsQuillRef = useRef();
    const cropImagePreview = useRef();
    const cropper = useRef();

    const [taskDialogOpenState, setTaskDialogOpenState] = useState(false);
    const [imageFileData, setImageFileData] = useState(null);
    const [imageFileBase64, setImageFileBase64] = useState(null);
    const [currentImageWidth, setCurrentImageWidth] = useState(0);
    const [applyEnabled, setApplyEnabled] = useState(false);
    const [horizontalSplitSizes, setHorizontalSplitSizes] = useState([50, 50]);
    const [verticalSplitSizes, setVerticalSplitSizes] = useState([100, 0]);
    const [detectionData, setDetectionData] = useState(testMode ? sampleData : null);
    const [detectionDataLoading, setDetectionDataLoading] = useState(false);
    const [areaSwapped, setAreaSwapped] = useState(false);
    const [cropImageDialogOpenState, setCropImageDialogOpenState] = useState(false);
    const [prevImageStack, setPrevImageStack] = useState([]);
    const [nextImageStack, setNextImageStack] = useState([]);
    const [imageTaskAreaFocused, setImageTaskAreaFocused] = useState(false);
    const [isImgChanged, setIsImgChanged] = useState(true);
    const [tipDialogOpenState, setTipDialogOpenState] = useState(false);

    const dispatch = useDispatch();

    // ??????????????? ????????? ?????????
    const dataInit = () => {
        setImageFileData(null);
        setImageFileBase64(null);
        setCurrentImageWidth(0);
        setApplyEnabled(false);
        setHorizontalSplitSizes([50, 50]);
        setVerticalSplitSizes([100, 0]);
        setDetectionData(testMode ? sampleData : null);
        setDetectionDataLoading(false);
        setAreaSwapped(false);
        setIsImgChanged(true);
        textsQuillRef.current.getEditor().setText('');
        problemsQuillRef.current.getEditor().setText('');
    };

    // ?????? ??? ???????????? ????????? ??????
    const classifyTexts = (data, left) => {
        const x = currentImageWidth * 0.01 * (left > 95 ? 100 : left < 5 ? 0 : left);
        if (!data.responses || data.responses.length < 1) {
            dispatch(openAlertSnackbar('???????????? ????????????.', 'error'));
            return;
        }

        const { textAnnotations, fullTextAnnotations } = data.responses[0];
        const mTextAnnotations = textAnnotations.slice().map((d) => Object.assign({}, d));
        const info = mTextAnnotations.shift();

        let strTexts = '';
        let strProblems = '';
        textsQuillRef.current.getEditor().setText('');
        problemsQuillRef.current.getEditor().setText('');

        for (let { description, boundingPoly } of mTextAnnotations) {
            const opt = info.description[description.length];
            info.description = info.description.substr(description.length + 1, info.description.length);

            // console.log(1, info.description, description, opt);

            if (opt !== undefined && (opt === '\n' || opt === ' ' || opt === '\t')) description += opt;
            else description += '';

            boundingPoly.vertices = boundingPoly.vertices.map((d) => {
                const obj = {};
                if (!d.x) obj.x = 0;
                else obj.x = d.x;
                if (!d.y) obj.y = 0;
                else obj.y = d.y;
                return obj;
            });

            const splitCondition = areaSwapped ? boundingPoly.vertices[0].x >= x : boundingPoly.vertices[0].x < x;

            if (splitCondition) {
                strTexts += description;
            } else {
                strProblems += description;
            }
        }

        textsQuillRef.current.getEditor().setText(strTexts.replace(/\n/gi, ' '));
        problemsQuillRef.current.getEditor().setText(strProblems);
        setApplyEnabled(true);
    };

    // ?????? ?????? ????????? ?????? API ??????
    const callGoogleVisionTextDetectionAPI = (forceFetch = false) => {
        if (imageFileData === null || imageFileBase64 === null) {
            dispatch(openAlertSnackbar('???????????? ????????????', 'error'));
            return;
        }

        if (!forceFetch && detectionData) {
            classifyTexts(detectionData, horizontalSplitSizes[0]);
        } else {
            setDetectionDataLoading(true);
            axios
                .post(
                    `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
                    {
                        requests: [
                            {
                                image: {
                                    content: imageFileBase64,
                                },
                                features: [
                                    {
                                        type: 'TEXT_DETECTION',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                        },
                    },
                )
                .then(({ data }) => {
                    setDetectionData(data);
                    classifyTexts(data, horizontalSplitSizes[0]);
                    setDetectionDataLoading(false);
                })
                .catch((e) => {
                    console.error(e);
                });
        }
        setVerticalSplitSizes([30, 70]);
        setIsImgChanged(false);
    };

    /**
     * ?????? ?????? ?????? ????????? ??????
     */
    const openImageFile = () => {
        const fileInput = fileInputRef.current;
        console.log('Opening the dialog...');
        fileInput.click();
    };

    /**
     * ?????? ?????? ?????? ?????? ??? ?????? ?????????
     * @param {React.ChangeEvent<HTMLInputElement>} e DOM ?????????
     */
    const onFileChange = (e) => {
        const fileList = e.target.files;
        if (fileList.length < 1) {
            setImageFileData(null);
            dispatch(openAlertSnackbar('????????? ????????? ?????????????????????.', 'info'));
            return;
        }
        if (!/^image\//.test(fileList[0].type)) {
            dispatch(openAlertSnackbar('????????? ????????? ????????? ???????????????.', 'error'));
            return;
        }

        const fileReader = new FileReader();
        /** @param {ProgressEvent<FileReader>} fileReaderEvent */
        fileReader.onload = function (fileReaderEvent) {
            console.log('fileReader');
            const mImg = document.createElement('img');
            mImg.src = fileReaderEvent.target.result;
            /** @param {Event} onLoadEvent */
            mImg.onload = function (onLoadEvent) {
                const mCanvas = document.createElement('canvas');
                const mCtx = mCanvas.getContext('2d');
                mCtx.drawImage(mImg, 0, 0);

                let width = mImg.width;
                let height = mImg.height;

                if (width > height) {
                    if (width > maxImgSize) {
                        height *= maxImgSize / width;
                        width = maxImgSize;
                    }
                } else {
                    if (height > maxImgSize) {
                        width *= maxImgSize / height;
                        height = maxImgSize;
                    }
                }

                mCanvas.width = width;
                mCanvas.height = height;
                mCanvas.getContext('2d').drawImage(mImg, 0, 0, width, height);
                const dataUrl = mCanvas.toDataURL(fileList[0].type);
                const base64 = dataUrl.replace(/^data:image\/(png|jpg|jpeg|PNG|JPG|JPEG);base64,/, '');
                setImageFileData(dataUrl);
                setImageFileBase64(base64);
                pushPrevImageStack({
                    data: dataUrl,
                    base64: base64,
                });
                openTaskDialog();
                /** @param {Event} e */
                previewRef.current.onload = (e) => {
                    imageAdjustmentCoreRef.current.style.maxWidth = mCanvas.width + 'px';
                    setCurrentImageWidth(mCanvas.width);
                    const editorTextsTitleArea = document.querySelector('.editor.texts > .quill > .ql-toolbar > .ql-formats');
                    const editorProblemsTitleArea = document.querySelector('.editor.problems > .quill > .ql-toolbar > .ql-formats');
                    editorTextsTitleArea.style.paddingLeft = '6px';
                    editorProblemsTitleArea.style.paddingLeft = '6px';
                    editorTextsTitleArea.innerHTML = '?????? ??????';
                    editorProblemsTitleArea.innerHTML = '?????? ??????';
                };
                if (!localStorage.getItem('cv_tip_never_again')) openTipDialog();
            };
        };
        fileReader.readAsDataURL(fileList[0]);
    };

    /**
     * ????????? ?????? ??? ??????
     */
    const openTaskDialog = () => {
        setTaskDialogOpenState(true);
    };

    /**
     * ????????? ?????? ??? ??????
     */
    const closeTaskDialog = () => {
        dispatch(
            openAlertDialog(
                'warning',
                '??????',
                '????????? ????????? ??????????????????????\n????????? ???????????? ????????????.',
                'no|yes',
                '?????????|???',
                'red|light',
                'white|light',
                'defaultClose',
                () => {
                    dispatch(closeAlertDialog());
                    closeTasks();
                },
            ),
        );
    };

    const closeTasks = () => {
        fileInputRef.current.value = null;
        setTaskDialogOpenState(false);
        dataInit();
    };

    /**
     * ????????? ?????? ??? ?????? ?????? ?????? ??????
     */
    // const toggleTaskDialog = () => {
    //     setTaskDialogOpenState(!taskDialogOpenState);
    // };

    /**
     * ?????? ?????? ??? ????????? ?????? ??? ?????????
     * @param {Array} sizes ?????? ??? ??????
     */
    const horizontalSplitOnDragStart = (sizes) => {
        ariaTextsRef.current.style.backgroundColor = '#f6f8f9ad';
        ariaProblemsRef.current.style.backgroundColor = '#f6f8f9ad';
    };

    /**
     * ?????? ?????? ??? ????????? ?????????
     * @param {Array} sizes ?????? ??? ??????
     */
    const horizontalSplitOnDrag = (sizes) => {
        const [left, right] = sizes;
        setHorizontalSplitSizes([left, right]);
        if (left < 1) {
            // ariaProblemsRef.current.innerHTML = '?????? ????????? ??????';
        } else {
            // ariaProblemsRef.current.innerHTML = '?????? ??????';
        }

        if (right < 1) {
            // ariaTextsRef.current.innerHTML = '?????? ????????? ??????';
        } else {
            // ariaTextsRef.current.innerHTML = '?????? ??????';
        }
    };

    /**
     * ?????? ?????? ??? ????????? ?????? ??? ?????????
     * @param {Array} sizes ?????? ??? ??????
     */
    const horizontalSplitOnDragEnd = (sizes) => {
        ariaTextsRef.current.style.backgroundColor = null;
        ariaProblemsRef.current.style.backgroundColor = null;
    };

    /**
     * ?????? ?????? ??? ????????? ?????????
     * @param {Array} sizes ?????? ??? ??????
     */
    const verticalSplitOnDrag = (sizes) => {
        const [top, bottom] = sizes;
        setVerticalSplitSizes([top, bottom]);
    };

    /** ?????? ?????? ?????? ??? */
    const applyOnClick = () => {
        const textsResult = textsQuillRef.current.getEditor().getText();
        let problemsResult = problemsQuillRef.current.getEditor().getText();
        window.testData = problemsQuillRef.current;
        problemsResult = problemsResult.split('\n\n');
        problemsResult = problemsResult.map((pn) => {
            const ps = pn.split('\t');
            return {
                problem: ps.shift(),
                selections: ps.map((s) => s.replace('\n', '')),
            };
        });
        onApply({ texts: textsResult, problems: problemsResult });
        closeTasks();
    };

    /** ??????, ?????? ?????? ?????? */
    const swapArea = () => {
        setAreaSwapped(!areaSwapped);
    };

    // ????????? ????????? ????????? ??????
    const openCropDialog = () => {
        setCropImageDialogOpenState(true);
        // cropImagePreview.current.onload = (e) => {};
        const refCheck = setInterval(() => {
            if (cropImagePreview.current) {
                console.log(cropImagePreview);
                cropImagePreview.current.src = previewRef.current.src;
                /** @param {Event} e */
                cropImagePreview.current.onload = (e) => {
                    cropper.current = new Cropper(cropImagePreview.current, {
                        viewMode: 2,
                    });
                };
                clearInterval(refCheck);
            }
        }, 500);
    };

    /**
     * ????????? ????????? ????????? ??????
     * @param {import("react").BaseSyntheticEvent} event
     * @param {string} reason
     */
    const closeCropDialog = (event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
        setCropImageDialogOpenState(false);
    };

    // ????????? ????????? ????????? ??????
    // const toggleCropDialog = () => {
    //     setCropImageDialogOpenState(!cropImageDialogOpenState);
    // };

    // ????????? ????????? ????????? ?????? ??????
    const applyCropDialog = () => {
        if (cropper.current) {
            const dataUrl = cropper.current.getCroppedCanvas().toDataURL();
            const base64 = dataUrl.replace(/^data:image\/(png|jpg|jpeg|PNG|JPG|JPEG);base64,/, '');
            setImageFileData(dataUrl);
            setImageFileBase64(base64);
            setIsImgChanged(true);
            pushPrevImageStack({
                data: dataUrl,
                base64: base64,
            });
            setNextImageStack([]);
            closeCropDialog();
        }
    };

    /************* ????????? ?????? ?????? ?????? ***************/
    // ?????? ??????
    const stackLimits = 10;

    // Prev ????????? ????????? push
    const pushPrevImageStack = (data) => {
        if (prevImageStack.length >= stackLimits) {
            setPrevImageStack(prevImageStack.filter((d, idx) => idx > 0));
        }
        setPrevImageStack([...prevImageStack, data]);
    };

    // Next ????????? ????????? push
    const pushNextImageStack = (data) => {
        if (nextImageStack.length >= stackLimits) {
            setNextImageStack(nextImageStack.filter((d, idx) => idx > 0));
        }
        setNextImageStack([...nextImageStack, data]);
    };

    // ????????? ?????? ?????? ??????
    const undoImageTask = () => {
        const prevTaskLength = prevImageStack.length;
        if (prevTaskLength < 2) return;
        const prevImageTask = prevImageStack[prevTaskLength - 1];
        const { data, base64 } = prevImageStack[prevTaskLength - 2];
        setImageFileData(data);
        setImageFileBase64(base64);
        pushNextImageStack(prevImageTask);
        setPrevImageStack(prevImageStack.filter((d, idx) => idx < prevTaskLength - 1));
        setIsImgChanged(true);
    };

    // ????????? ?????? ?????? ??????
    const redoImageTask = () => {
        const nextTaskLength = nextImageStack.length;
        if (nextTaskLength < 1) return;
        const nextImageTask = nextImageStack[nextTaskLength - 1];
        const { data, base64 } = nextImageStack[nextTaskLength - 1];
        setImageFileData(data);
        setImageFileBase64(base64);
        pushPrevImageStack(nextImageTask);
        setNextImageStack(nextImageStack.filter((d, idx) => idx < nextTaskLength - 1));
        setIsImgChanged(true);
    };

    // ????????? ????????? ?????? ?????????
    const croppingImageDialog = (
        <Dialog fullWidth maxWidth={false} open={cropImageDialogOpenState} onClose={closeCropDialog}>
            <DialogContent className={classes.dialogContentNoPadding} dividers>
                <img alt="crop preview" ref={cropImagePreview} style={{ display: 'block', width: '100%' }} />
            </DialogContent>
            <DialogActions>
                <Button autoFocus color="primary" onClick={applyCropDialog}>
                    ??????
                </Button>
                <Button color="secondary" onClick={closeCropDialog}>
                    ??????
                </Button>
            </DialogActions>
        </Dialog>
    );

    // ??? ????????? ??????
    const openTipDialog = () => {
        setTipDialogOpenState(true);
    };

    // ??? ????????? ??????
    const closeTipDialog = () => {
        setTipDialogOpenState(false);
    };

    // ??? ????????? ?????? ??????
    const tipDialogOkBtn = () => {
        closeTipDialog();
    };

    // ??? ????????? ?????? ?????? ?????? ??????
    const tipDialogNeverSeeAgainBtn = () => {
        localStorage.setItem('cv_tip_never_again', true);
        closeTipDialog();
    };

    // ??? ?????????
    const TipDialog = (
        <Dialog open={tipDialogOpenState} maxWidth={false} onClose={closeTipDialog}>
            <DialogTitle onClose={closeTipDialog}>?????? ????????? ???</DialogTitle>
            <DialogContent dividers>
                <img src={tip0Img} width="768px" alt="tip_image" />
                <Typography>?????? ????????? ?????? ?????? ??? ???????????? ???????????? ???????????????.</Typography>
                <Typography>
                    ?????? ????????? ????????? ????????? ????????????, ?????? ???????????? ?????? ??????, ?????? ??? ????????? ?????? ?????? ????????? ???????????????.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={tipDialogNeverSeeAgainBtn}>
                    ?????? ?????? ??????
                </Button>
                <Button color="primary" onClick={tipDialogOkBtn}>
                    ??????
                </Button>
            </DialogActions>
        </Dialog>
    );

    // ????????? ?????? ?????????
    const TaskDialog = (
        <Dialog fullScreen open={taskDialogOpenState} onClose={closeTaskDialog} TransitionComponent={DialogTransition}>
            <AppBar className={classes.appBar}>
                <Toolbar className={classes.toolBar}>
                    <Typography variant="h6" className={classes.title}>
                        OCR ????????? ?????????
                    </Typography>
                    <Button colors="purple" sizes="small" variant="filled" onClick={openCropDialog}>
                        ????????? ?????????
                    </Button>
                    <Button colors="purple" sizes="small" variant="filled" disabled={!applyEnabled} onClick={applyOnClick}>
                        {applyButtonText}
                    </Button>
                    <CloseButton onClick={closeTaskDialog}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M4.99999 4.05781L8.29999 0.757812L9.24266 1.70048L5.94266 5.00048L9.24266 8.30048L8.29999 9.24315L4.99999 5.94315L1.69999 9.24315L0.757324 8.30048L4.05732 5.00048L0.757324 1.70048L1.69999 0.757812L4.99999 4.05781Z"
                                fill="#3B1689"
                            />
                        </svg>
                    </CloseButton>
                </Toolbar>
            </AppBar>

            <MainContainer>
                <Split
                    className="split"
                    direction="vertical"
                    gutterSize={12}
                    minSize={[200, 144]}
                    snapOffset={10}
                    sizes={verticalSplitSizes}
                    onDrag={verticalSplitOnDrag}
                >
                    <div
                        tabIndex={1}
                        className="image-adjustment-container"
                        ref={imageTaskAreaRef}
                        onBlur={() => {
                            setImageTaskAreaFocused(false);
                        }}
                        onFocus={() => {
                            setImageTaskAreaFocused(true);
                        }}
                    >
                        <ActionsContainer>
                            <SwapButton onClick={swapArea} disabled={detectionDataLoading}>
                                <OCRSwapIcon />
                                {/* ?????? ????????? */}
                            </SwapButton>
                            <SendButton onClick={() => callGoogleVisionTextDetectionAPI(isImgChanged)} disabled={detectionDataLoading}>
                                <OCRExtractIcon />
                                {/* ???????????? */}
                                {detectionDataLoading && <CircularProgress size={24} className={classes.sendButtonProgress} />}
                            </SendButton>
                        </ActionsContainer>
                        <div className="adjustment-container" ref={imageAdjustmentCoreRef}>
                            <Split
                                className="split"
                                gutterSize={7}
                                minSize={0}
                                snapOffset={100}
                                sizes={horizontalSplitSizes}
                                onDragStart={horizontalSplitOnDragStart}
                                onDrag={horizontalSplitOnDrag}
                                onDragEnd={horizontalSplitOnDragEnd}
                            >
                                {areaSwapped ? (
                                    <>
                                        <div className="aria problems" ref={ariaProblemsRef}>
                                            ?????? ??????
                                        </div>
                                        <div className="aria texts" ref={ariaTextsRef}>
                                            ?????? ??????
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="aria texts" ref={ariaTextsRef}>
                                            ?????? ??????
                                        </div>
                                        <div className="aria problems" ref={ariaProblemsRef}>
                                            ?????? ??????
                                        </div>
                                    </>
                                )}
                            </Split>
                        </div>
                        <img src={imageFileData} alt="image_file_data" ref={previewRef} />
                    </div>
                    <div className="editor-container">
                        <div className="editor texts">
                            <ReactQuill
                                style={{ height: '100%', width: '100%' }}
                                theme="snow"
                                ref={textsQuillRef}
                                modules={{ toolbar: ocrEditorToolbarEmpty }}
                            />
                        </div>
                        <div className="editor problems">
                            <ReactQuill
                                style={{ height: '100%' }}
                                theme="snow"
                                ref={problemsQuillRef}
                                modules={{ toolbar: ocrEditorToolbarEmpty }}
                            />
                        </div>
                    </div>
                </Split>
            </MainContainer>
        </Dialog>
    );

    /** On initialized */
    useEffect(() => {
        /** @param {KeyboardEvent} e */
        window.onkeypress = (e) => {
            if (imageTaskAreaFocused) {
                if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                    undoImageTask();
                } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Z') {
                    redoImageTask();
                }
            }
        };
    }, [imageTaskAreaFocused, prevImageStack, nextImageStack]);

    useEffect(() => {}, []);

    return (
        <>
            {TipDialog}
            {TaskDialog}
            {croppingImageDialog}
            <div>
                {children ? (
                    React.cloneElement(children, { onClick: openImageFile })
                ) : (
                    <Button type="file" onClick={openImageFile}>
                        ????????? ??????
                    </Button>
                )}
                <input
                    hidden
                    type="file"
                    // accept="image/*"
                    onChange={onFileChange}
                    ref={fileInputRef}
                />
            </div>
        </>
    );
}

GoogleCloudVisionOCR.defaultProps = {
    maxImgSize: 1280,
    onApply: (data) => {
        console.log(data);
    },
    applyButtonText: '??????',
};

const ocrEditorToolbarEmpty = [];
// const ocrEditorToolbar = [
//     [{ size: ['small', false, 'large', 'huge'] }],
//     // [{ header: [1, 2, 3, 4, 5, 6, false] }],
//     ['bold', 'italic', 'underline', 'strike'], // toggled buttons
//     [
//         {
//             color: [
//                 '#000000',
//                 '#e60000',
//                 '#ff9900',
//                 '#ffff00',
//                 '#008a00',
//                 '#0066cc',
//                 '#9933ff',
//                 '#ffffff',
//                 '#facccc',
//                 '#ffebcc',
//                 '#ffffcc',
//                 '#cce8cc',
//                 '#cce0f5',
//                 '#edb6ff',
//                 '#bbbbbb',
//                 '#f06666',
//                 '#ffc266',
//                 '#ffff66',
//                 '#66b966',
//                 '#66a3e0',
//                 '#c285ff',
//                 '#707070',
//                 '#a10000',
//                 '#b26b00',
//                 '#b2b200',
//                 '#006100',
//                 '#0047b2',
//                 '#6b24b6',
//                 '#444444',
//                 '#5c0000',
//                 '#663d00',
//                 '#666600',
//                 '#003700',
//                 '#002966',
//                 '#3d1466',
//             ],
//         },
//         { background: [] },
//     ], // dropdown with defaults from theme
//     [{ align: [] }],
//     ['blockquote'],
//     [{ list: 'ordered' }, { list: 'bullet' }],
//     [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
//     ['clean'], // remove formatting button
// ];

export default React.memo(GoogleCloudVisionOCR);

/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

const sampleData = {};
