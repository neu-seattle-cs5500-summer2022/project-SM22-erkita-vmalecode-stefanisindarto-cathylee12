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
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { IoMdAddCircle } from 'react-icons/io';
import { AiOutlineDoubleRight } from 'react-icons/ai';
import { MdPublic } from 'react-icons/md';
import Moment from 'moment';
import { getDecks, reset, removeCard, getCards, updateVisibility } from '../features/dataSlice';
import { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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
  }
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
  const deckId = params.deckid
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [deck, setDeck] = useState(null);
  const deckData = {
    deckId: deckId
  }

  const deck = useSelector((state) => state.data.decks.find((deck) => deck._id === deckId));
  useEffect(() => {
    dispatch(getCards(deckData));

  }, [navigate])

  return (

    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <Typography
        variant="h6"
        id="tableTitle"
        component="div"
      >
        <div>Amgi Deck: <em>{deck.name}</em></div>
        <Typography
          id="tableTitle"
          component="div"
        >
          <div>Visiblity: <em>{deck.public ? 'Public' : 'Private'}</em></div>
        </Typography>
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
  const [err, setErr] = React.useState(false);
  const [eMsg, setEmsg] = React.useState('');

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

    const cardData = {
      cardId: e._id,
      deckId: deckId
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
  const handleVisiblityToggle = (e) => {
    const deckData = {
      public: !deck.public,
      deckId: deckId
    }
    dispatch(updateVisibility(deckData));
  };
  const handlePractice = () => {
    if(deck.cards.length > 0) {
      navigate("/practice/" + deck._id);
    }
    else {
      setEmsg('Please add cards to practice');
      setErr(true);
    }

  };
  
  const handleClose = (e) => {
    setErr(false);
  }
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
  const deckId = params.deckid;
  const deck = useSelector((state) => state.data.decks.find((deck) => deck._id === deckId));
  const cards = useSelector((state) => state.data.activeDeck);
  const rows = cards;
  useEffect(() => {
    dispatch(reset());
    dispatch(getDecks());

  }, []);
  useEffect(() => {
    dispatch(reset());
  }, [deck]);
  return (
    
    <Box sx={{
      width: '100%',
      display: "flex",
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: '100px'
    }} >
      <Snackbar open={err} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {eMsg}
        </Alert>
      </Snackbar>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={closeBackdrop}
      >
        {open ? (<DeckPopUp deck={selectedDeck} />) : (<></>)}
      </Backdrop>

      <Paper sx={{ width: { sm: '100%', md: '50%' }, mb: 2 }} >
        <EnhancedTableToolbar numSelected={selected.length} />
        <Button sx={{ marginLeft: '20px' }} component={Link} to={"/create-card/" + deck._id} variant="contained" size="large"> <IoMdAddCircle /> &nbsp; Add new Card </Button>
        <Button sx={{ marginLeft: '20px' }} onClick = {handlePractice} variant="contained" size="large"> <AiOutlineDoubleRight /> &nbsp; Practice </Button>
        <Button sx={{ marginLeft: '20px' }} onClick = {handleVisiblityToggle} variant="contained" size="large"> <MdPublic /> &nbsp; {!deck.public ? 'Make public' : 'Make Private'} </Button>

        
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
                        <ButtonGroup sx={{
                              marginLeft: '20px',
                              marginRight: '20px'
                            }}
                            variant="contained" aria-label="outlined primary button group">
                          <Button onClick={() => handleDelete(row)}> Delete </Button>
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