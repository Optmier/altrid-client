import React, { useEffect, useRef, useState } from 'react';
import * as $ from 'jquery';
import * as PIXI from 'pixi.js';
import * as Heatmap from 'heatmap.js';
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
    position: initial !important;

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
    // 배속 목록 설정
    const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 4, 8, 16];
    // 시선흐름 시퀀스 데이터
    const sequences = data.sequences;
    // 시퀀스 데이터 길이 값
    const dataLength = data.sequences.length;
    // 시퀀스 데이터 인덱스
    const [seqIdx, setSeqIdx] = useState(goto);
    // 시퀀스 데이터 이전 인덱스
    const [lastSeqIdx, setLastSeqIdx] = useState(goto);
    // 플레이 상태 여부
    const [playing, setPlaying] = useState(false);
    // 재생 속도 계수(빈도 값: 1000분의 x)
    const [speedUnit, setSpeedUnit] = useState(100);
    // 현재 배속 값 지정(배속 목록 인덱스)
    const [speedStep, setSpeedStep] = useState(3);
    // 플레이 인터벌 객체
    const [playInterval, setPlayInterval] = useState(null);
    // 전체화면 설정
    const [fullScreen, setFullScreen] = useState(false);
    // 시선흐름 원 그래픽 요소 드로잉을 위한 픽시 애플리케이션
    const [pixiGraphics, setPixiGraphics] = useState(null);
    // 시선흐름 히트맵 애플리케이션
    const [heatmap, setHeatmap] = useState(null);
    // 토플 문제 렌더러용 상태 데이터
    const [renderUserData, setRenderUserData] = useState({
        selections: [],
        lastProblem: 0,
        logs: [],
    });
    /** 인터렉티브한 변수 지정 */
    // 현재 진행 시간
    const [elapsedTime, setElapsedTime] = useState(sequences[0].elapsedTime / 1000);
    // 사용자 선택 정답 다이렉트
    const [userAnswerDirect, setUserAnswerDirect] = useState(0);

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
        $vH.find('canvas').css({
            transform: 'translate(-50%, -50%) ' + 'scale(' + scale * 0.999 + ')',
        });

        if (!isFullScreen) $vP.height(scale * vContentHeight);
    };

    const toggleFullScreen = () => {
        setFullScreen(!fullScreen);
        window.fullScreen = !fullScreen;
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

    const drawFixation = (data) => {
        const { x, y, value } = data;
        const saccade = new PIXI.Graphics();
        saccade.lineStyle(1, 0x00b179, 1);
        saccade.beginFill(0x00cf8c, 0.666);
        saccade.drawCircle(x, y, 2);
        saccade.endFill();

        saccade.lineStyle(2, 0x00140e, 0.8);
        saccade.beginFill(0x00140e, 0.17);
        // saccade.drawCircle(x, y, 2 * logbase(duration + 1, 1.1) + 10);
        saccade.drawCircle(x, y, (value + 1) * 2.25 + 8);
        saccade.endFill();

        return saccade;
    };

    const drawLine = (from, to) => {
        const line = new PIXI.Graphics();
        line.lineStyle(2, 0x00140e, 0.9);
        line.moveTo(from.x, from.y);
        line.lineTo(to.x, to.y);
        line.endFill();

        return line;
    };

    useEffect(() => {
        // initialize heatmap
        setHeatmap((h) => {
            h = Heatmap.create({
                container: heatmapScreen.current,
            });
            window.heatmap = h;
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

            // 처음 거 그리기
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
        // 진행 시간 업데이트
        setElapsedTime(() => sequences[seqIdx].elapsedTime / 1000);
        // 사용자 데이터 렌더
        setRenderUserData({
            ...renderUserData,
            lastProblem: sequences[seqIdx].problemStep,
        });
        // 사용자 정답 다이렉트
        setUserAnswerDirect(sequences[seqIdx].userAnswer);
        // 시선흐름 데이터 드로잉
        if (pixiGraphics) {
            // 2 시퀀스 이상 건너뛸 경우 전부 지우고 새로 그림(성능 이슈로 인한 조치)
            if (
                Math.abs(seqIdx - lastSeqIdx) > 10 ||
                sequences[seqIdx].problemStep !== sequences[lastSeqIdx].problemStep ||
                seqIdx > lastSeqIdx !== forwardDirection ||
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
            // forwarding, backwarding 검사
            if (seqIdx > lastSeqIdx) {
                // forwarding
                // fixation 개수가 5개 이상인 경우 맨 첫번째거 하나 지우기
                if (fixations.length >= 5) {
                    const toDestroy = fixations.shift();
                    if (toDestroy && !toDestroy._destroyed) toDestroy.destroy();
                }
                // line 개수가 4개 이상인 경우 맨 첫번째거 하나 지우기
                if (lines.length >= 4) {
                    const toDestroy = lines.shift();
                    setTimeout(() => {
                        if (toDestroy && !toDestroy._destroyed) toDestroy.destroy();
                    }, 100);
                }
                forwardDirection = true;
            } else {
                // backwarding
                // fixation 개수가 5개 이상인 경우 맨 첫번째거 하나 지우기
                if (fixations.length >= 5) {
                    const toDestroy = fixations.shift();
                    if (toDestroy && !toDestroy._destroyed) toDestroy.destroy();
                }
                // line 개수가 4개 이상인 경우 맨 첫번째거 하나 지우기
                if (lines.length >= 4) {
                    const toDestroy = lines.shift();
                    setTimeout(() => {
                        if (toDestroy && !toDestroy._destroyed) toDestroy.destroy();
                    }, 100);
                }
                forwardDirection = false;
            }
            /** fixation, line 그리기 */
            // 이전과 같은 세트 번호의 객체이면 fixation 크기 증가해서 새로 그리기
            if (sequences[seqIdx].setNumber === sequences[lastSeqIdx].setNumber) {
                const toDestroy = fixations.pop();
                if (toDestroy && !toDestroy._destroyed) toDestroy.destroy();

                const fx = drawFixation(sequences[seqIdx]);
                fixations.push(fx);
                pixiGraphics.stage.addChild(fx);
                // 그렇지 않으면 그냥 새로 그리기
            } else {
                const fx = drawFixation(sequences[seqIdx]);
                fixations.push(fx);
                pixiGraphics.stage.addChild(fx);

                // 만일 fixation 배열 안에 객체가 2개 이상인 경우 이전거와 현재걸로 line 그리기
                if (fixations.length > 1) {
                    const ln = drawLine(sequences[lastSeqIdx], sequences[seqIdx]);
                    lines.push(ln);
                    pixiGraphics.stage.addChild(ln);
                }
            }
        }
        // 스크롤 컨트롤
        $('.player-root').find('.passages')[0].scrollTop = sequences[seqIdx].passageScrollPosition;
        $('.player-root').find('.problems')[0].scrollTop = sequences[seqIdx].problemScrollPosition;
        // 마지막 시퀀스 인덱스 저장
        setLastSeqIdx(seqIdx);
    }, [seqIdx]);

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
                        timer={elapsedTime}
                        timeLimit={99999}
                        title={testContent.title}
                        passageForRender={testContent.passageForRender}
                        problemDatas={testContent.problemDatas}
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
                        <IconButton size="small" onClick={handleSpeedDown}>
                            <ChevronLeftIcon style={{ fontSize: 16 }} />
                        </IconButton>
                        <Tooltip title="Click to reset" placement="top">
                            <SpeedIndecator onClick={handleSpeedReset}>{speeds[speedStep]}x</SpeedIndecator>
                        </Tooltip>
                        <IconButton size="small" onClick={handleSpeedUp}>
                            <ChevronRightIcon style={{ fontSize: 16 }} />
                        </IconButton>
                        <IconButton size="small" onClick={toggleFullScreen} style={{ marginLeft: 12, marginRight: 6 }}>
                            {fullScreen ? <FullscreenExitIcon style={{ fontSize: 16 }} /> : <FullscreenIcon style={{ fontSize: 16 }} />}
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
