import React,{useEffect,useState} from 'react';
import Chart from 'react-apexcharts';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import Axios from 'axios';
import {apiUrl} from '../../configs/configs';

const StyleChartWrapper = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

function CommChart() {

 
    const sessions = useSelector((state) => state.RdxSessions);



    let state = {};

    state = {
        series: [
            {
                name:'재현 학생',
                data: [200,301,201]
            },
            {
                name:'반 평균',
                data:[250,310,250]
            },
        ],
        options: {
            chart: {
                width: '100%',
                height: '100%',
                type: 'bar',
            },
            dataLabels: {
                enabled: true,
            },

            plotOptions: {
                bar: {
                  horizontal: true,
                  columnWidth: '55%',
                  endingShape: 'rounded'
                },
              },
            title: {},
            colors: ['#351e85', '#68dea6'],
            markers: {
                size: 0,
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val;
                    },
                },
            },
            xaxis: {
                categories: ['평균 응시속도','응시 횟수','응시점 갯수'],
            
            },
            yaxis: {
                title: {
                  text: '번'
                }
              },
            legend: {
                show: true,
            },
        },
    };
    return (
        <>
        <StyleChartWrapper>
            <div id="chart">
                <Chart options={state.options} series={state.series} type="bar" height={'325px'} width={'325px'} />
            </div>
        </StyleChartWrapper>

        </>
    );
}

export default CommChart;
