/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import {
    TableHead as MuiTableHead,
    Table as MuiTable,
    TableBody as MuiTableBody,
    TableCell as MuiTableCell,
    TableContainer as MuiTableContainer,
    TableRow as MuiTableRow,
    withStyles,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Axios from 'axios';
import { apiUrl } from '../../configs/configs';

function createData(name: string, time: number, achive: number) {
    return { name, time: `${Math.floor(time / 60000)}분 ${Math.floor((time % 60000) / 1000)}초`, achive };
}

// const dummyRow = [
//     createData('jaehyeon', '541', '90.7'),
//     createData('학생2', '342', '86.2'),
//     createData('학생3', '111', '60.1'),
//     createData('학생4', '841', '100'),
//     createData('학생5', '123', '62.4'),
//     createData('학생6', '321', '85.3'),
// ];

const TableContainer = withStyles((theme) => ({
    root: {
        color: '#11171C',
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
    },
}))(MuiTableContainer);

const Table = withStyles((theme) => ({
    root: {
        fontFamily: 'inherit',
        fontSize: 18,
        fontWeight: 400,
        letterSpacing: '-0.02em',
        lineHeight: '22px',
    },
}))(MuiTable);

const TableHead = withStyles((theme) => ({
    root: {
        fontFamily: 'inherit',
        fontSize: 14,
        fontWeight: 'inherit',
        letterSpacing: 'inherit',
        lineHeight: '18px',
    },
}))(MuiTableHead);

const TableRow = withStyles((theme) => ({
    root: {
        backgroundColor: ({ idx }) => (idx % 2 === 0 ? '#ffffff' : null),
        borderRadius: 8,
        fontFamily: 'inherit',
        fontSize: 'inherit',
        fontWeight: 'inherit',
        letterSpacing: 'inherit',
        lineHeight: 'inherit',
        '& td:first-child': {
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
        },
        '& td:last-child': {
            borderTopRightRadius: 8,
            borderBottomRightRadius: 8,
        },
    },
}))(MuiTableRow);

const TableCell = withStyles((theme) => ({
    root: {
        border: 'none',
        fontFamily: 'inherit',
        fontSize: 'inherit',
        fontWeight: 'inherit',
        letterSpacing: 'inherit',
        lineHeight: 'inherit',
    },
}))(MuiTableCell);

const TableBody = withStyles((theme) => ({
    root: {
        fontFamily: 'inherit',
        fontSize: 18,
        fontWeight: 400,
        letterSpacing: '-0.02em',
        lineHeight: '22px',
    },
}))(MuiTableBody);

const NumberSpan = styled.span`
    display: inline-block;
    font-weight: 700;
    color: ${({ idx }) => (idx === 0 ? '#3B1689' : null)};
    width: 24px;
`;

function Leaderboard({ classNum }) {
    const [row, setRow] = useState([]);
    useEffect(() => {
        Axios.get(`${apiUrl}/optimer/${classNum}`, { withCredentials: true })
            .then((res) => {
                if (!res.data || !res.data.length) return;
                setRow(res.data.map((d) => createData(d.name, d.time_total)));
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    return (
        <div className="Leaderboard">
            <div className="class-manage-root" style={{ width: '100%' }}>
                {/* <div>
                    <div className="manage-inputs">
                        <div className="manage-inputs-header">리더 보드</div>
                    </div>
                </div> */}
                <div className="score">
                    <TableContainer>
                        <Table stickyHeader sx={{ minwidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">순위</TableCell>
                                    <TableCell align="left">학생 이름</TableCell>
                                    <TableCell align="right">총 학습시간</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {row.map((row, index) => (
                                    <TableRow key={index} idx={index}>
                                        <TableCell align="left">
                                            <NumberSpan idx={index}>{index + 1}</NumberSpan>
                                            {index + 1 == 1 ? (
                                                <svg
                                                    width="16"
                                                    height="13"
                                                    viewBox="0 0 16 13"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M1.86692 2.4664L4.66692 4.33306L7.45758 0.426396C7.51925 0.339976 7.60067 0.269533 7.69506 0.220931C7.78945 0.172329 7.89408 0.146973 8.00025 0.146973C8.10642 0.146973 8.21105 0.172329 8.30544 0.220931C8.39983 0.269533 8.48125 0.339976 8.54292 0.426396L11.3336 4.33306L14.1336 2.4664C14.2396 2.39589 14.3635 2.3572 14.4907 2.35489C14.618 2.35257 14.7433 2.38674 14.8517 2.45334C14.9602 2.51995 15.0473 2.61621 15.1028 2.73075C15.1583 2.8453 15.1799 2.97333 15.1649 3.09973L14.0696 12.4111C14.0505 12.5732 13.9725 12.7227 13.8505 12.8313C13.7285 12.9398 13.5709 12.9997 13.4076 12.9997H2.59292C2.42963 12.9997 2.27202 12.9398 2.15 12.8313C2.02798 12.7227 1.95002 12.5732 1.93092 12.4111L0.835582 3.09906C0.820782 2.97272 0.842439 2.84478 0.897996 2.73034C0.953553 2.61591 1.04069 2.51975 1.14912 2.45324C1.25756 2.38672 1.38275 2.35261 1.50994 2.35495C1.63713 2.35728 1.76099 2.39595 1.86692 2.4664ZM8.00025 8.99973C8.35387 8.99973 8.69301 8.85925 8.94306 8.60921C9.19311 8.35916 9.33358 8.02002 9.33358 7.6664C9.33358 7.31277 9.19311 6.97364 8.94306 6.72359C8.69301 6.47354 8.35387 6.33306 8.00025 6.33306C7.64663 6.33306 7.30749 6.47354 7.05744 6.72359C6.80739 6.97364 6.66692 7.31277 6.66692 7.6664C6.66692 8.02002 6.80739 8.35916 7.05744 8.60921C7.30749 8.85925 7.64663 8.99973 8.00025 8.99973Z"
                                                        fill="#FFC043"
                                                    />
                                                </svg>
                                            ) : null}
                                            {index + 1 == 2 ? (
                                                <svg
                                                    width="16"
                                                    height="13"
                                                    viewBox="0 0 16 13"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M1.86692 2.4664L4.66692 4.33306L7.45758 0.426396C7.51925 0.339976 7.60067 0.269533 7.69506 0.220931C7.78945 0.172329 7.89408 0.146973 8.00025 0.146973C8.10642 0.146973 8.21105 0.172329 8.30544 0.220931C8.39983 0.269533 8.48125 0.339976 8.54292 0.426396L11.3336 4.33306L14.1336 2.4664C14.2396 2.39589 14.3635 2.3572 14.4907 2.35489C14.618 2.35257 14.7433 2.38674 14.8517 2.45334C14.9602 2.51995 15.0473 2.61621 15.1028 2.73075C15.1583 2.8453 15.1799 2.97333 15.1649 3.09973L14.0696 12.4111C14.0505 12.5732 13.9725 12.7227 13.8505 12.8313C13.7285 12.9398 13.5709 12.9997 13.4076 12.9997H2.59292C2.42963 12.9997 2.27202 12.9398 2.15 12.8313C2.02798 12.7227 1.95002 12.5732 1.93092 12.4111L0.835582 3.09906C0.820782 2.97272 0.842439 2.84478 0.897996 2.73034C0.953553 2.61591 1.04069 2.51975 1.14912 2.45324C1.25756 2.38672 1.38275 2.35261 1.50994 2.35495C1.63713 2.35728 1.76099 2.39595 1.86692 2.4664ZM8.00025 8.99973C8.35387 8.99973 8.69301 8.85925 8.94306 8.60921C9.19311 8.35916 9.33358 8.02002 9.33358 7.6664C9.33358 7.31277 9.19311 6.97364 8.94306 6.72359C8.69301 6.47354 8.35387 6.33306 8.00025 6.33306C7.64663 6.33306 7.30749 6.47354 7.05744 6.72359C6.80739 6.97364 6.66692 7.31277 6.66692 7.6664C6.66692 8.02002 6.80739 8.35916 7.05744 8.60921C7.30749 8.85925 7.64663 8.99973 8.00025 8.99973Z"
                                                        fill="#BFC6CD"
                                                    />
                                                </svg>
                                            ) : null}
                                            {index + 1 == 3 ? (
                                                <svg
                                                    width="16"
                                                    height="13"
                                                    viewBox="0 0 16 13"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M1.86692 2.4664L4.66692 4.33306L7.45758 0.426396C7.51925 0.339976 7.60067 0.269533 7.69506 0.220931C7.78945 0.172329 7.89408 0.146973 8.00025 0.146973C8.10642 0.146973 8.21105 0.172329 8.30544 0.220931C8.39983 0.269533 8.48125 0.339976 8.54292 0.426396L11.3336 4.33306L14.1336 2.4664C14.2396 2.39589 14.3635 2.3572 14.4907 2.35489C14.618 2.35257 14.7433 2.38674 14.8517 2.45334C14.9602 2.51995 15.0473 2.61621 15.1028 2.73075C15.1583 2.8453 15.1799 2.97333 15.1649 3.09973L14.0696 12.4111C14.0505 12.5732 13.9725 12.7227 13.8505 12.8313C13.7285 12.9398 13.5709 12.9997 13.4076 12.9997H2.59292C2.42963 12.9997 2.27202 12.9398 2.15 12.8313C2.02798 12.7227 1.95002 12.5732 1.93092 12.4111L0.835582 3.09906C0.820782 2.97272 0.842439 2.84478 0.897996 2.73034C0.953553 2.61591 1.04069 2.51975 1.14912 2.45324C1.25756 2.38672 1.38275 2.35261 1.50994 2.35495C1.63713 2.35728 1.76099 2.39595 1.86692 2.4664ZM8.00025 8.99973C8.35387 8.99973 8.69301 8.85925 8.94306 8.60921C9.19311 8.35916 9.33358 8.02002 9.33358 7.6664C9.33358 7.31277 9.19311 6.97364 8.94306 6.72359C8.69301 6.47354 8.35387 6.33306 8.00025 6.33306C7.64663 6.33306 7.30749 6.47354 7.05744 6.72359C6.80739 6.97364 6.66692 7.31277 6.66692 7.6664C6.66692 8.02002 6.80739 8.35916 7.05744 8.60921C7.30749 8.85925 7.64663 8.99973 8.00025 8.99973Z"
                                                        fill="#E9EDEF"
                                                    />
                                                </svg>
                                            ) : null}
                                        </TableCell>
                                        <TableCell align="left">{row.name} 님</TableCell>
                                        <TableCell align="right">{row.time}</TableCell>
                                    </TableRow>

                                    // map 함수 function 으로 만들고
                                    // sort 를 먼저 한 다음 다시 map 함수를 사용?
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </div>
    );
}

export default Leaderboard;
