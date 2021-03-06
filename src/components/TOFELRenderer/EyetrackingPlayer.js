/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-concat */
import React, { useEffect, useRef, useState } from 'react';
import * as $ from 'jquery';
import * as PIXI from 'pixi.js';
import Heatmap from 'heatmap.js';
import classNames from 'classnames';
import styled from 'styled-components';
import SmartTOFELRender from './SmartTOFELRender';
import { Button, IconButton, Slider, Tooltip, withStyles } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import ReplayIcon from '@material-ui/icons/Replay';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import TrackChangesIcon from '@material-ui/icons/TrackChanges';
import BlurOnIcon from '@material-ui/icons/BlurOn';

$.fn.changeSize = function (handleFunction) {
    let element = this;
    let lastWidth = element.width();
    let lastHeight = element.height();

    setInterval(function () {
        if (lastWidth === element.width() && lastHeight === element.height()) return;
        if (typeof handleFunction == 'function') {
            handleFunction({ width: element.width(), height: element.height() });
            lastWidth = element.width();
            lastHeight = element.height();
        }
    }, 50);

    return element;
};

const PlayerRoot = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 120px;
    min-height: 80px;

    &.full-screen {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        background-color: #ffffff;
        z-index: 99999;

        & .contents-wrapper {
            height: calc(100vh - 53px) !important;
            margin: auto 0;
        }
    }
`;
const ContentsWrapper = styled.div`
    resize: both;
    position: relative;
    background-color: #f7f9f8;
    height: 360px;
`;
const ContentsRoot = styled.div`
    background-color: #ffffff;
    width: 1280px;
    height: 750px;
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    transform-origin: center center;
`;
const OverlayRoot = styled.canvas`
    width: 1280px;
    height: 750px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    transform-origin: center center;
`;
const OverlayHeatmap = styled.div`
    width: 1280px;
    height: 750px;
    position: absolute !important;
    left: 50% !important;
    top: 50% !important;
    transform: translate(-50%, -50%);
    transform-origin: center center;

    & canvas {
        width: 1280px;
        height: 750px;
        position: absolute;
        left: 50% !important;
        top: 50% !important;
        transform: translate(-50%, -50%);
        transform-origin: center center;
    }
`;
const ControlsWrapper = styled.div``;
const PlayerBar = styled.div``;
const PlayerButtons = styled.div`
    display: flex;
`;
const SpeedIndecator = styled.div`
    cursor: pointer;
    font-size: 14px;
    text-align: center;
    width: 2.75rem;
    user-select: none;
`;

const EdPlayerBar = withStyles({
    root: {
        color: '#00cf8c',
        height: 2,
        padding: '8px 0',
    },
    thumb: {
        width: 2,
        height: 4,
        marginTop: 0,
        marginLeft: -1,
        borderRadius: 2,
        '&:focus, &:hover, &$active': {
            width: 4,
            height: 8,
            marginTop: -2,
            marginLeft: -1,
            boxShadow: 'none',
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
                width: 2,
                height: 4,
                marginTop: 0,
                marginLeft: -1,
                boxShadow: 'none',
            },
        },
    },
    active: {},
    track: {
        height: 4,
    },
    rail: {
        height: 4,
    },
    mark: {
        height: 4,
        width: 1,
    },
    markActive: {
        height: 4,
        width: 1,
    },
})(Slider);

const EdButton = withStyles({
    root: {
        color: 'rgba(0, 0, 0, 0.54)',
        width: 96,
    },
})(Button);

const fixations = [];
const lines = [];
window.fs = fixations;
window.ls = lines;
let forwardDirection = true;

function EyetrackingPlayer({ data, testContent, goto, stopTrig }) {
    // ?????? ?????? ??????
    const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 4, 8, 16];
    // ???????????? ????????? ?????????
    const sequences = data.sequences;
    // ????????? ????????? ?????? ???
    const dataLength = data.sequences.length;
    // ????????? ????????? ?????????
    const [seqIdx, setSeqIdx] = useState(goto);
    // ????????? ????????? ?????? ?????????
    const [lastSeqIdx, setLastSeqIdx] = useState(goto);
    // ????????? ?????? ??????
    const [playing, setPlaying] = useState(false);
    // ?????? ?????? ??????(?????? ???: 1000?????? x)
    const [speedUnit, setSpeedUnit] = useState(100);
    // ?????? ?????? ??? ??????(?????? ?????? ?????????)
    const [speedStep, setSpeedStep] = useState(3);
    // ????????? ????????? ??????
    const [playInterval, setPlayInterval] = useState(null);
    // ???????????? ??????
    const [fullScreen, setFullScreen] = useState(false);
    // ???????????? ??? ????????? ?????? ???????????? ?????? ?????? ??????????????????
    const [pixiGraphics, setPixiGraphics] = useState(null);
    // ???????????? ????????? ??????????????????
    const [heatmap, setHeatmap] = useState(null);
    // ?????? ?????? ???????????? ?????? ?????????
    const [renderUserData, setRenderUserData] = useState({
        selections: [],
        lastProblem: 0,
        logs: [],
    });
    /** ?????????????????? ?????? ?????? */
    // ?????? ?????? ??????
    const [elapsedTime, setElapsedTime] = useState(sequences[0].elapsedTime / 1000);
    // ????????? ?????? ?????? ????????????
    const [userAnswerDirect, setUserAnswerDirect] = useState(0);
    /** ????????????, ????????? ?????? */
    // true: tracer / false: heatmap
    const [tracerOrHeatmap, setTracerOrHeatmap] = useState(true);

    const playerRoot = useRef();
    const sliderRoot = useRef();
    const traceScreen = useRef();
    const heatmapScreen = useRef();

    const variableSizeTo = ($vC, $vO, $vH, $vP, isFullScreen) => {
        const vContentWidth = $vC.outerWidth();
        const vContentHeight = $vC.outerHeight();
        const scale = isFullScreen
            ? Math.min($vP.width() / vContentWidth, $vP.height() / vContentHeight)
            : Math.min($vP.width() / vContentWidth);

        $vC.css({
            transform: 'translate(-50%, -50%) ' + 'scale(' + scale * 0.999 + ')',
        });
        $vO.css({
            transform: 'translate(-50%, -50%) ' + 'scale(' + scale * 0.999 + ')',
        });
        $vH.css({
            transform: 'translate(-50%, -50%) ' + 'scale(' + scale * 0.999 + ')',
        });
        // $vH.find('canvas').css({
        //     transform: 'translate(-50%, -50%) ' + 'scale(' + scale * 0.999 + ')',
        // });

        if (!isFullScreen) $vP.height(scale * vContentHeight);
    };

    const toggleFullScreen = () => {
        setFullScreen(!fullScreen);
        window.fullScreen = !fullScreen;
    };

    const toggleTracerOrHeatmap = () => {
        setTracerOrHeatmap(!tracerOrHeatmap);
    };

    const handleOnSequenceChange = (event, value) => {
        setSeqIdx(value);
    };

    const handlePlay = () => {
        if (!playing) {
            if (seqIdx >= dataLength - 1) {
                handleReset();
            }
            if (!playInterval) {
                setPlayInterval(
                    (interval) =>
                        (interval = setInterval(() => {
                            setSeqIdx((seqIdx) => {
                                if (seqIdx + 1 >= dataLength - 1) {
                                    clearInterval(interval);
                                    setPlaying(false);
                                    setPlayInterval(null);
                                    return dataLength - 1;
                                }
                                return seqIdx + 1;
                            });
                        }, speedUnit / speeds[speedStep])),
                );
            }
        } else {
            if (playInterval) {
                clearInterval(playInterval);
                setPlayInterval(null);
            }
        }
        setPlaying(!playing);
    };

    const handleReset = () => {
        if (playInterval) {
            clearInterval(playInterval);
            setPlayInterval(null);
        }
        setSeqIdx(0);
        setPlaying(false);
    };

    const handleSpeedUp = () => {
        speeds.length - 1 > speedStep && setSpeedStep((s) => refreshInterval(s + 1));
        // refreshInterval();
    };

    const handleSpeedDown = () => {
        speedStep > 0 && setSpeedStep((s) => refreshInterval(s - 1));
    };

    const handleSpeedReset = () => {
        setSpeedStep(refreshInterval(3));
    };

    const refreshInterval = (speedStep) => {
        if (playing) {
            if (playInterval) {
                clearInterval(playInterval);
                setPlayInterval(
                    (interval) =>
                        (interval = setInterval(() => {
                            setSeqIdx((seqIdx) => {
                                if (seqIdx + 1 >= dataLength - 1) {
                                    clearInterval(interval);
                                    setPlaying(false);
                                    setPlayInterval(null);
                                }
                                return seqIdx + 1;
                            });
                        }, speedUnit / speeds[speedStep])),
                );
            }
        }
        return speedStep;
    };

    const handleArrowKey = ({ which }) => {
        if (which === 37) {
            setSeqIdx((s) => {
                if (s > 10) return s - 10;
                else return 0;
            });
        } else if (which === 39) {
            setSeqIdx((s) => {
                if (s < dataLength - 10) return s + 10;
                else return dataLength - 1;
            });
        }
    };

    function EdValueLabel(props) {
        const { children, open, value } = props;
        return (
            <Tooltip
                open={open}
                placement="top"
                title={
                    <>
                        <p>Step: {value}</p>
                    </>
                }
            >
                {children}
            </Tooltip>
        );
    }

    const moderator = (x, y) => {
        let _x,
            _y = 0;
        let _moderated = false;

        if (x < 0) {
            _x = 0;
            _moderated = true;
        } else if (x > 1280) {
            _x = 1280;
            _moderated = true;
        } else _x = x;

        if (y < 0) {
            _y = 0;
            _moderated = true;
        } else if (y > 750) {
            _y = 750;
            _moderated = true;
        } else _y = y;

        return { mX: _x, mY: _y, isModerated: _moderated };
    };

    const drawFixation = (data) => {
        const { x, y, value } = data;
        const { mX, mY, isModerated } = moderator(x, y);
        const saccade = new PIXI.Graphics();
        saccade.lineStyle(1, isModerated ? 0xff0000 : 0x00b179, 1);
        saccade.beginFill(isModerated ? 0xff0000 : 0x00cf8c, 0.666);
        saccade.drawCircle(mX, mY, value ? 2 : 0);
        saccade.endFill();

        saccade.lineStyle(2, isModerated ? 0xff0000 : 0x00140e, 0.8);
        saccade.beginFill(isModerated ? 0xff0000 : 0x00140e, 0.17);
        // saccade.drawCircle(x, y, 2 * logbase(duration + 1, 1.1) + 10);
        saccade.drawCircle(mX, mY, value * 2.25 + 8);
        saccade.endFill();

        return saccade;
    };

    const drawLine = (from, to) => {
        const line = new PIXI.Graphics();
        const mFrom = moderator(from.x, from.y);
        const mTo = moderator(to.x, to.y);

        line.lineStyle(2, mTo.isModerated ? 0xff0000 : 0x00140e, 0.9);
        line.moveTo(mFrom.mX, mFrom.mY);
        line.lineTo(mTo.mX, mTo.mY);
        line.endFill();

        return line;
    };

    useEffect(() => {
        // initialize heatmap
        setHeatmap((h) => {
            h = Heatmap.create({
                container: heatmapScreen.current,
                radius: 50,
                // maxOpacity: 0.5,
                // minOpacity: 0,
                // blur: 0.75,
            });
            window.heatmap = h;
            h.setDataMin(1);
            h.setDataMax(50);
            return h;
        });

        // initialize pixi
        setPixiGraphics((t) => {
            t = new PIXI.Application({
                antialias: true,
                // backgroundColor: '0xffffff',
                view: traceScreen.current,
                transparent: true,
                width: 1280,
                height: 750,
            });

            window.pixiApp = t;

            // ?????? ??? ?????????
            const first = drawFixation(sequences[0]);
            fixations.push(first);
            t.stage.addChild(first);
            return t;
        });

        const $variableContent = $('.contents-root');
        const $variableOverlay = $('.overlay-root');
        const $variableHeatmap = $('.overlay-heatmap');
        const $vContentParent = $variableContent.parent();

        variableSizeTo($variableContent, $variableOverlay, $variableHeatmap, $vContentParent, window.fullScreen);

        $vContentParent.changeSize((dt) => {
            variableSizeTo($variableContent, $variableOverlay, $variableHeatmap, $vContentParent, window.fullScreen);
        });

        $(document).bind('mousedown', ({ target }) => {
            if ($(target).closest(sliderRoot.current)[0] === sliderRoot.current) {
                $(document).unbind('keydown', handleArrowKey);
            } else if ($(target).closest('.player-root')[0] === playerRoot.current) {
                $(document).unbind('keydown', handleArrowKey).bind('keydown', handleArrowKey);
            } else {
                $(document).unbind('keydown', handleArrowKey);
            }
        });
        $(playerRoot.current).mousedown();
        return () => {};
    }, []);

    useEffect(() => {
        // console.log(seqIdx, lastSeqIdx);
        // ?????? ?????? ????????????
        setElapsedTime(() => sequences[seqIdx].elapsedTime);
        // ????????? ????????? ??????
        setRenderUserData({
            ...renderUserData,
            lastProblem: sequences[seqIdx].problemStep,
        });
        // ????????? ?????? ????????????
        setUserAnswerDirect(sequences[seqIdx].userAnswer);
        // ???????????? ????????? ?????????
        if (pixiGraphics) {
            // 2 ????????? ?????? ????????? ?????? ?????? ????????? ?????? ??????(?????? ????????? ?????? ??????)
            if (
                Math.abs(seqIdx - lastSeqIdx) > 10 ||
                sequences[seqIdx].problemStep !== sequences[lastSeqIdx].problemStep ||
                seqIdx > lastSeqIdx != forwardDirection ||
                seqIdx < lastSeqIdx === forwardDirection
            ) {
                while (fixations.length > 0) {
                    const toDestroy = fixations.pop();
                    if (!toDestroy._destroyed) toDestroy.destroy();
                }
                while (lines.length > 0) {
                    const toDestroy = lines.pop();
                    if (!toDestroy._destroyed) toDestroy.destroy();
                }
            }
            // forwarding, backwarding ??????
            if (seqIdx > lastSeqIdx) {
                // forwarding
                // fixation ????????? 5??? ????????? ?????? ??? ???????????? ?????? ?????????
                if (fixations.length >= 5) {
                    const toDestroy = fixations.shift();
                    if (toDestroy && !toDestroy._destroyed) toDestroy.destroy();
                }
                // line ????????? 4??? ????????? ?????? ??? ???????????? ?????? ?????????
                if (lines.length >= 4) {
                    const toDestroy = lines.shift();
                    setTimeout(() => {
                        if (toDestroy && !toDestroy._destroyed) toDestroy.destroy();
                    }, 100);
                }
                forwardDirection = true;
            } else {
                // backwarding
                // fixation ????????? 5??? ????????? ?????? ??? ???????????? ?????? ?????????
                if (fixations.length >= 5) {
                    const toDestroy = fixations.shift();
                    if (toDestroy && !toDestroy._destroyed) toDestroy.destroy();
                }
                // line ????????? 4??? ????????? ?????? ??? ???????????? ?????? ?????????
                if (lines.length >= 4) {
                    const toDestroy = lines.shift();
                    setTimeout(() => {
                        if (toDestroy && !toDestroy._destroyed) toDestroy.destroy();
                    }, 100);
                }
                forwardDirection = false;
            }
            /** fixation, line ????????? */
            // ?????? ????????? ????????? ????????? ???????????? ????????????
            if (sequences[seqIdx].code) return;
            // ????????? ?????? ?????? ????????? ???????????? fixation ?????? ???????????? ?????? ?????????
            if (sequences[seqIdx].setNumber === sequences[lastSeqIdx].setNumber) {
                const toDestroy = fixations.pop();
                if (toDestroy && !toDestroy._destroyed) toDestroy.destroy();

                const fx = drawFixation(sequences[seqIdx]);
                fixations.push(fx);
                pixiGraphics.stage.addChild(fx);
                // ????????? ????????? ?????? ?????? ?????????
            } else {
                const fx = drawFixation(sequences[seqIdx]);
                fixations.push(fx);
                pixiGraphics.stage.addChild(fx);

                // ?????? fixation ?????? ?????? ????????? 2??? ????????? ?????? ???????????? ???????????? line ?????????
                if (fixations.length > 1) {
                    const ln = drawLine(sequences[lastSeqIdx], sequences[seqIdx]);
                    lines.push(ln);
                    pixiGraphics.stage.addChild(ln);
                }
            }
            // ????????? ?????????
            if (heatmap) {
                if (Math.abs(seqIdx - lastSeqIdx) > 10 || sequences[seqIdx].problemStep !== sequences[lastSeqIdx].problemStep) {
                    heatmap.setData({ data: [] });
                }
                const { x, y, value } = sequences[seqIdx];
                const heatmapData = { x: x, y: y === 800 ? 799 : y, value: value ? 10 : 0 };
                heatmap.addData(heatmapData);
            }
        }
        // ????????? ?????????
        $('.player-root').find('.passages')[0].scrollTop = sequences[seqIdx].passageScrollPosition;
        $('.player-root').find('.problems')[0].scrollTop = sequences[seqIdx].problemScrollPosition;
        // ????????? ????????? ????????? ??????
        setLastSeqIdx(seqIdx);
    }, [seqIdx]);

    useEffect(() => {
        // alt to tracer
        if (tracerOrHeatmap) {
            traceScreen.current.style.display = 'block';
            heatmapScreen.current.style.display = 'none';
        }
        // alt to heatmap
        else {
            traceScreen.current.style.display = 'none';
            heatmapScreen.current.style.display = 'block';
        }
    }, [tracerOrHeatmap]);

    useEffect(() => {
        setSeqIdx(goto);
    }, [goto]);

    useEffect(() => {
        handleReset();
    }, [stopTrig]);

    return (
        <PlayerRoot className={classNames('player-root', fullScreen ? 'full-screen' : '')} ref={playerRoot}>
            <ContentsWrapper className="contents-wrapper" onClick={handlePlay}>
                <ContentsRoot className="contents-root">
                    <SmartTOFELRender
                        preview
                        timer={elapsedTime}
                        timeLimit={99999}
                        title={testContent.map((m) => m.title)}
                        pUUIDs={testContent.map((m) => m.uuid)}
                        passageForRender={testContent.map((m) => m.passageForRender)}
                        problemDatas={testContent.flatMap((m) => m.problemDatas)}
                        userDatas={renderUserData}
                        userAnswerDirect={userAnswerDirect}
                    />
                </ContentsRoot>
                <OverlayRoot className="overlay-root" ref={traceScreen} />
                <OverlayHeatmap className="overlay-heatmap" ref={heatmapScreen} />
            </ContentsWrapper>
            <ControlsWrapper>
                <PlayerBar>
                    <EdPlayerBar
                        ref={sliderRoot}
                        defaultValue={0}
                        max={dataLength - 1}
                        value={seqIdx}
                        ValueLabelComponent={playing ? ({ children }) => children : EdValueLabel}
                        onChange={handleOnSequenceChange}
                    />
                </PlayerBar>
                <PlayerButtons>
                    <div className="left" style={{ marginRight: 'auto' }}>
                        <EdButton
                            size="small"
                            variant="outlined"
                            endIcon={playing ? <PauseIcon /> : <PlayArrowIcon />}
                            onClick={handlePlay}
                        >
                            {playing ? 'Pause' : 'Play'}
                        </EdButton>
                        <Tooltip title="Reset" placement="top">
                            <IconButton style={{ marginLeft: 12 }} size="small" onClick={handleReset}>
                                <ReplayIcon style={{ fontSize: 16 }} />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <div className="right" style={{ marginLeft: 'auto', height: 30, display: 'flex', alignItems: 'center' }}>
                        <IconButton size="small" onClick={toggleTracerOrHeatmap} style={{ marginLeft: 'auto', marginRight: 12 }}>
                            <Tooltip title={tracerOrHeatmap ? 'Switch to heatmap' : 'Switch to tracer'} placement="top">
                                {tracerOrHeatmap ? <BlurOnIcon style={{ fontSize: 16 }} /> : <TrackChangesIcon style={{ fontSize: 16 }} />}
                            </Tooltip>
                        </IconButton>
                        <IconButton size="small" onClick={handleSpeedDown}>
                            <Tooltip title="Speed down" placement="top">
                                <ChevronLeftIcon style={{ fontSize: 16 }} />
                            </Tooltip>
                        </IconButton>
                        <Tooltip title="Click to reset" placement="top">
                            <SpeedIndecator onClick={handleSpeedReset}>{speeds[speedStep]}x</SpeedIndecator>
                        </Tooltip>
                        <IconButton size="small" onClick={handleSpeedUp}>
                            <Tooltip title="Speed up" placement="top">
                                <ChevronRightIcon style={{ fontSize: 16 }} />
                            </Tooltip>
                        </IconButton>
                        <IconButton size="small" onClick={toggleFullScreen} style={{ marginLeft: 12, marginRight: 6 }}>
                            <Tooltip title={fullScreen ? 'Exit full screen' : 'Set full screen'} placement="top">
                                {fullScreen ? <FullscreenExitIcon style={{ fontSize: 16 }} /> : <FullscreenIcon style={{ fontSize: 16 }} />}
                            </Tooltip>
                        </IconButton>
                    </div>
                </PlayerButtons>
            </ControlsWrapper>
        </PlayerRoot>
    );
}

EyetrackingPlayer.defaultProps = {
    goto: 0,
    onFullScreen: () => {},
};

export default React.memo(EyetrackingPlayer);
