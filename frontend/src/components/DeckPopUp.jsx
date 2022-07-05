import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


export default function DetailDeck({deck}) {
  if (deck === null) {
    return (<></>)
  }
  
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Detail deck view
        </Typography>
        <Typography variant="h5" component="div">
          {deck.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {deck.calories} cards
        </Typography>
        <Typography variant="body2">
          Deck created: {'date'}
          <br />
          Last modified: {'date'}
          <br />
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Edit Deck</Button>
      </CardActions>
    </Card>
  );
}
