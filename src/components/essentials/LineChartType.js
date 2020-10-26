import React from 'react';
import Chart from 'react-apexcharts';

function LineChartType() {
    let state = {};

    state = {
        series: [
            {
                name: '정답률',
                data: [59, 32, 68, 36, 82, 18, 70, 50, 33, 74],
            },
            // {
            //     name: 'Low - 2013',
            //     data: [12, 11, 14, 18, 17, 13, 13],
            // },
        ],
        options: {
            chart: {
                height: 350,
                type: 'line',
                dropShadow: {
                    enabled: true,
                    color: '#000',
                    top: 18,
                    left: 7,
                    blur: 10,
                    opacity: 0.2,
                },
                toolbar: {
                    show: false,
                },
            },
            colors: ['#13e2a1'],
            dataLabels: {
                enabled: true,
            },
            stroke: {
                curve: 'smooth',
            },
            grid: {
                borderColor: '#e7e7e7',
                row: {
                    colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                    opacity: 0.5,
                },
            },
            markers: {
                size: 1,
            },
            xaxis: {
                categories: [
                    '세부내용찾기',
                    '세부내용찾기',
                    '세부내용찾기',
                    '세부내용찾기',
                    '세부내용찾기',
                    '세부내용찾기',
                    '세부내용찾기',
                    '세부내용찾기',
                    '세부내용찾기',
                    '세부내용찾기',
                ],
            },
            yaxis: {
                min: 0,
                max: 100,
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                floating: true,
                offsetY: -25,
                offsetX: -5,
            },
        },
    };
    return (
        <div id="chart">
            <Chart options={state.options} series={state.series} type="line" height={350} />
        </div>
    );
}

export default LineChartType;
