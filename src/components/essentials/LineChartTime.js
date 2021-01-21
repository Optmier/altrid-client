import React from 'react';
import Chart from 'react-apexcharts';
import { SecondtoMinute } from '../essentials/TimeChange';
import styled from 'styled-components';

const StyleWrapper = styled.div`
    position: relative;
    overflow-x: auto;
    overflow-y: hidden;
    width: 100%;

    & #chart {
        min-width: 700px;
    }
`;

function LineChartTime({ currents, averages, totalProblems }) {
    let state = {};
    let currentsArr = [];
    let averagesArr = [];
    let maxNum = 0;

    for (let i = 0; i < totalProblems; i++) {
        currentsArr[i] = 0;
        averagesArr[i] = 0;
    }
    for (let i = 0; i < currents.length; i++) {
        currentsArr[i] = Math.round(currents[i]);
        maxNum = maxNum < currentsArr[i] ? currentsArr[i] : maxNum;
    }
    for (let i = 0; i < averages.length; i++) {
        averagesArr[i] = Math.round(averages[i]);
        maxNum = maxNum < averagesArr[i] ? averagesArr[i] : maxNum;
    }

    state = {
        series: [
            {
                name: '평균 시간',
                data: !averages || !averagesArr.length ? [32, 42, 76, 45, 32, 56, 21, 55, 22, 88] : averagesArr,
            },
            {
                name: '학생 시간',
                data: !currents || !currentsArr.length ? [59, 32, 68, 36, 82, 18, 70, 50, 33, 74] : currentsArr,
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
            colors: ['#68DEA6', '#351E85'],
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    let arr;
                    arr = SecondtoMinute(Math.round(val));

                    if (!arr[0]) {
                        return arr[1] + '초';
                    }
                    return arr[0] + '분 ' + arr[1] + '초';
                },
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
                categories: averagesArr.map((d, i) => i + 1 + '번'),
            },
            yaxis: {
                min: 0,
                max: maxNum + 5,
                tickAmount: 5,
                labels: {
                    formatter: (value) => {
                        let arr;
                        arr = SecondtoMinute(Math.floor(value));

                        if (!arr[0]) {
                            return arr[1] + '초';
                        }
                        return arr[0] + '분 ' + arr[1] + '초';
                    },
                },
            },
            legend: {
                show: false,
            },
        },
    };
    return (
        <StyleWrapper>
            <div id="chart">
                <Chart options={state.options} series={state.series} type="line" height={350} />
            </div>
        </StyleWrapper>
    );
}

LineChartTime.defaultProps = {
    currents: [59, 32, 68, 36, 82, 18, 70, 50, 33, 74],
    averages: [32, 42, 76, 45, 32, 56, 21, 55, 22, 88],
};

export default LineChartTime;
