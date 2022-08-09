import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Moment from 'moment';
import { deleteDeck } from '../features/dataSlice';
import { useDispatch } from 'react-redux';

export default function DetailDeck({ deck }) {
  const dispatch = useDispatch();
  if (deck === null) {
    return (<></>)
  }
  const handleDelete = (deck) => {
    dispatch(deleteDeck(deck._id));
  }
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          The following deck will be deleted :
        </Typography>
        <Typography variant="h5" component="div">
          {deck.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {deck.cards.length} {deck.cards.length == 1 ? <>card</> : <>cards</>}
        </Typography>
        <Typography variant="body2">
          Deck created: {Moment(deck.dateCreated).format('MMM D, YYYY')}
          <br />
          Deck Visibility: {deck.public? 'Public': 'Private'}
          <br />
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={() => handleDelete(deck)} sx={{ color: 'red' }} size="small">Delete Deck</Button>
      </CardActions>
    </Card>
  );
}
