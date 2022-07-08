import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { visuallyHidden } from '@mui/utils';
import { Button, ButtonGroup } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import DeckPopUp from './DeckPopUp';
import { useParams,useNavigate,Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { IoMdAddCircle } from 'react-icons/io'
import Moment from 'moment';
import {getDecks,reset,removeCard} from '../features/dataSlice';
import { useState, useEffect } from 'react';


function createData(name, calories, fat, carbs, protein) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
  };
}

let rows = [
  createData('Words', 305, 3.7, 67, 4.3),
  createData('Python', 452, 25.0, 51, 4.9),
  createData('Java', 262, 16.0, 24, 6.0),
  createData('CS 5500', 159, 6.0, 24, 4.0),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Bees', 408, 3.2, 87, 6.5),
  createData('Ice cream sandwichs', 237, 9.0, 37, 4.3),
  createData('Jelly Beans', 375, 0.0, 94, 0.0),
  createData('Leetcode', 518, 26.0, 65, 7.0),
  createData('JS', 392, 0.2, 98, 0.0),
  createData('MERN Stack', 318, 0, 81, 2.0),
  createData('Deck Name', 360, 19.0, 9, 37.0),
  createData('Hello', 437, 18.0, 63, 4.0),
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};
function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};
// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};
const headCells = [
  {
    id: 'front',
    numeric: false,
    disablePadding: true,
    label: 'Front of Card',
  },
  {
    id: 'back',
    numeric: true,
    disablePadding: false,
    label: 'Back of Card',
  },
  {
    id: 'date',
    numeric: true,
    disablePadding: false,
    label: 'Date Created',
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected } = props;
  const params = useParams()
  const deckID = params.deckid
  const deck = useSelector((state) => state.data.decks.find((deck) => deck._id === deckID));

  return (

    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        // ...(numSelected > 0 && {
        //   bgcolor: (theme) =>
        //     alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        // }),
      }}
    >
      <Typography
        sx={{ flex: '1 1 100%' }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        <>Amgi Deck: <em>{deck.name}</em></>
      </Typography>

    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = React.useState(false);
  const [selectedDeck, setSelectedDeck] = React.useState(null);
  Moment.locale('en');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.data
  )


  const closeBackdrop = () => {
    setOpen(false);
  };
  const handleEdit = (e) => {
    
  };
  const handleDelete = (e) => {
    
    const cardData  ={
      cardID : e._id,
      deckID : deckID
    }
    dispatch(removeCard(cardData));
  }
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const params = useParams();
  const deckID = params.deckid;
  const deck = useSelector((state) => state.data.decks.find((deck) => deck._id === deckID));
  rows = deck.cards;
  useEffect(()=> {
    dispatch(reset());
    dispatch(getDecks());
    
  },[navigate]);
  useEffect(()=> {
    dispatch(reset());    
  },[deck]);
  return (

    <Box sx={{
      width: '100%',
      display: "flex",
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: '100px'
    }} >

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={closeBackdrop}
      >
        {open ? (<DeckPopUp deck={selectedDeck} />) : (<></>)}
      </Backdrop>
      <Paper sx={{ width: { sm: '100%', md: '50%' }, mb: 2 }} >
        <EnhancedTableToolbar numSelected={selected.length} />
        <Button sx={{marginLeft: '20px'}} component={Link} to={"/create-card/" + deck._id} variant="contained" size="large"> <IoMdAddCircle /> &nbsp; Add new Card </Button>
        <TableContainer >
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.name)}

                      tabIndex={-1}
                      key={row._id}
                    >
                      <TableCell >
                        <ButtonGroup variant="contained" aria-label="outlined primary button group">
                          <Button onClick={() => handleDelete(row)}>Delete</Button>
                          <Button onClick={() => handleEdit(row)}>Edit</Button>
                        </ButtonGroup>
                      </TableCell>
                      <TableCell
                        component="th"
                        id={row._id}
                        scope="row"
                        padding="none"
                      >
                        {row.front}
                      </TableCell>
                      <TableCell align="right">{row.back}</TableCell>
                      <TableCell align="right">
                        {Moment(row.dateCreated).format('MMM D, YYYY')}
                      
                    </TableCell>

                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />


    </Box>
  );
}