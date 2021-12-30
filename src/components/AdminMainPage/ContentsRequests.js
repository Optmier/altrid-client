import {
    fade,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    withStyles,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { apiUrl } from '../../configs/configs';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    detailsRoot: {
        marginTop: 8,
    },
    detailsAppBar: {
        '&.MuiAppBar-positionSticky': {
            top: 74,
        },
    },
    detailsPaper: {
        // maxHeight: 'calc(100vh - 280px)',
        // overflow: 'auto',
    },
    detailsPreview: {
        '&.MuiPaper-elevation1': {
            boxShadow: '0px -4px 4px -1px rgba(0,0,0,0.2), 0px 0px 1px 0px rgba(0,0,0,0.14), 0px 0px 3px 0px rgba(0,0,0,0.12)',
        },
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
    formControl: {
        margin: theme.spacing(3),
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    table: {
        minWidth: 650,
    },
    tableContainer: {
        maxHeight: 'calc(100vh - 380px)',
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}));

const EdTableRow = withStyles((theme) => ({
    root: {
        '&.Mui-selected': {
            backgroundColor: '#13e2a157',
            '&:hover': {
                backgroundColor: '#12d39657',
            },
        },
    },
}))(TableRow);

// const EdFabPrimary = withStyles((theme) => ({
//     root: {
//         backgroundColor: '#13e2a1',
//         margin: '6px 16px',
//         position: 'absolute',
//         zIndex: 99,

//         '&:hover': {
//             backgroundColor: '#12d396',
//         },
//     },
//     extended: {
//         '&.MuiFab-extended.MuiFab-sizeSmall': {
//             paddingRight: 14,
//         },
//     },
// }))(Fab);

function createData(idx, title, teacher_name, academy_name, has_contents, has_file, created, updated) {
    return { idx, title, teacher_name, academy_name, has_contents, has_file, created, updated };
}

const headCells = [
    { id: 'idx', align: 'center', disablePadding: false, label: '컨텐츠 번호' },
    { id: 'title', align: 'left', disablePadding: false, label: '과제명' },
    { id: 'teacher_name', align: 'left', disablePadding: false, label: '선생님 성함' },
    { id: 'academy_name', align: 'left', disablePadding: false, label: '학원 이름' },
    { id: 'has_contents', align: 'left', disablePadding: false, label: '컨텐츠 여부' },
    { id: 'has_file', align: 'left', disablePadding: false, label: '첨부 파일' },
    { id: 'created', align: 'left', disablePadding: false, label: '생성일' },
    { id: 'updated', align: 'left', disablePadding: false, label: '마지막 수정일' },
];

const EnhancedTableHead = React.memo(function EnhancedTableHead(props) {
    const { classes, order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
});

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function ContentsRequests({ history }) {
    const classes = useStyles();
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('started');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [rowSelected, setRowSelected] = useState('');
    const [rowDatas, setRowDatas] = useState([]);
    // const [selectedContentId, setSelectedContentId] = useState(null);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRowDoubleClick = (idx) => {
        setRowSelected(idx);
        // setSelectedContentId(idx);
        // window.open(`/admins/contents-requests/${idx}`);
        history.push(`/admins/contents-requests/${idx}`);
    };

    const getRequestLists = () => {
        Axios.get(`${apiUrl}/assignment-admin`, { withCredentials: true })
            .then((res) => {
                setRowDatas(
                    res.data.map(({ idx, title, teacher_name, academy_name, contents_data, file_url, created, updated }) =>
                        createData(
                            idx,
                            title || '',
                            teacher_name || '',
                            academy_name || '',
                            contents_data ? 'Y' : 'N',
                            file_url ? 'Y' : 'N',
                            moment(created).format('YYYY-MM-DD / HH:mm:ss'),
                            moment(updated).format('YYYY-MM-DD / HH:mm:ss'),
                        ),
                    ),
                );
            })
            .catch((err) => {
                console.error(err);
            });
    };

    useEffect(() => {
        getRequestLists();
    }, []);

    return (
        <>
            <TableContainer className={classes.tableContainer} /* component={Paper} */>
                <Table stickyHeader className={classes.table} aria-label="simple table">
                    <EnhancedTableHead
                        classes={classes}
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                        rowCount={rowDatas.length}
                    />
                    <TableBody>
                        {stableSort(rowDatas, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => (
                                <EdTableRow
                                    className={classes.tableRow}
                                    data-id={row.idx}
                                    hover
                                    key={index}
                                    selected={row.idx === rowSelected}
                                    onDoubleClick={() => {
                                        handleRowDoubleClick(row.idx);
                                    }}
                                >
                                    <TableCell align="center" component="th" scope="row">
                                        {row.idx}
                                    </TableCell>
                                    <TableCell align="left">{row.title}</TableCell>
                                    <TableCell align="left">{row.teacher_name}</TableCell>
                                    <TableCell align="left">{row.academy_name}</TableCell>
                                    <TableCell align="left">{row.has_contents}</TableCell>
                                    <TableCell align="left">{row.has_file}</TableCell>
                                    <TableCell align="left">{row.created}</TableCell>
                                    <TableCell align="left">{row.updated}</TableCell>
                                </EdTableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* <EdFabPrimary color="primary" variant="extended" aria-label="add" size="small" onClick={handleAddContent}>
                <AddIcon /> 컨텐츠 추가
            </EdFabPrimary> */}
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rowDatas.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </>
    );
}

export default ContentsRequests;
