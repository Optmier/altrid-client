import React from 'react';
import Chart from 'react-apexcharts';

function LineChartTime() {
    let state = {};

    state = {
        series: [
            {
                name: '학생 시간',
                data: [59, 32, 68, 36, 82, 18, 70, 50, 33, 74],
            },
            {
                name: '평균 시간',
                data: [32, 42, 76, 45, 32, 56, 21, 55, 22, 88],
            },
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
            colors: ['#13e2a1', '#706d6d'],
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
                categories: ['1번', '2번', '3번', '4번', '5번', '6번', '7번', '8번', '9번', '10번'],
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

export default LineChartTime;