import React, { useState, useEffect, useRef } from 'react';
import Chart from 'react-apexcharts';

function ColumnChartProblem({ datas }) {
    let state = {};
    const ref = useRef(null);
    const resize = useResize(ref);

    state = {
        series: [
            {
                name: '정답률',
                data: datas.map((d) => d.toFixed()),
            },
        ],
        options: {
            chart: {
                type: 'bar',
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                },
            },
            colors: ['#6D2AFA'],
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent'],
            },
            xaxis: {
                categories: datas && datas.length ? datas.map((d, i) => i + 1 + '번') : [],
            },
            yaxis: {
                min: 0,
                max: 100,
            },
            fill: {
                opacity: 1,
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val + '%';
                    },
                },
            },
        },
    };
    return (
        <div id="chart-wrapper">
            <div id="chart">
                <Chart options={state.options} series={state.series} type="bar" width="100%" height="300px" />
            </div>
        </div>
    );
}
function useResize(element = null) {
    let [{ screenWidth, screenHeight, ratiowh, ratiohw, rect }, setState] = useState({
        screenWidth: 0,
        screenHeight: 0,
        ratiowh: 0,
        ratiohw: 0,
        rect: undefined,
    });

    const onResize = (event) => {
        screenWidth = window.innerWidth;
        screenHeight = window.innerHeight;
        ratiowh = screenWidth / screenHeight;
        ratiohw = screenHeight / screenWidth;

        if (element && element.current) {
            //rect = element.current.getBoundingClientRect();
            const clientRect = element.current.getBoundingClientRect();
            // DOM API does not allow for a shallow copy, so we have to manually set them
            rect = {
                width: clientRect.width,
                height: clientRect.height,
                left: clientRect.left,
                right: clientRect.right,
                top: clientRect.top,
                bottom: clientRect.bottom,
            };
        }

        setState({ screenWidth, screenHeight, ratiowh, ratiohw, rect });
    };

    useEffect(() => {
        window.addEventListener('resize', onResize, false);
        onResize();
        return () => {
            window.removeEventListener('resize', onResize, false);
        };
        // [] ==> let only resize:event handle state update
    }, []);

    return { screenWidth, screenHeight, ratiowh, ratiohw, rect };
}

ColumnChartProblem.defaultProps = {
    datas: [],
};

export default ColumnChartProblem;
