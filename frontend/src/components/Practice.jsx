import * as React from 'react';
import {useState} from 'react';
import Box from '@mui/material/Box';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ReactCardFlip from "react-card-flip";
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { practiceCards, nextCard, updateRecallability } from '../features/dataSlice';
import { useEffect } from 'react';

export default function Practice() {
  const params = useParams();
  const dispatch = useDispatch();
  const deckId = params.deckid;
  const { card } = useSelector((state) => state.data);
  const deckData = {
    deckId: deckId
  }

  const [firstCardCalled, setFirstCardCalled] = useState(false);
  //const [next, setNext] = useState(false);

  if (!firstCardCalled) {
    dispatch(practiceCards(deckData));
    setFirstCardCalled(true);
  }

  //useEffect(() => {
  //  if (!next) dispatch(practiceCards(deckData));
  //  else dispatch(nextCard(deckData))
  //}, [])

  const [isFlipped, setIsFlipped] = useState(false);
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  }

  const handleRecallability = (e, recallability) => {
    if (card) {
      const cardData = {
        cardId: card._id
      }
      const newRecallability = {
        recallability: recallability
      }
      dispatch(updateRecallability({ deckData, cardData, newRecallability }));
    }
  }
  
  return (
    <Box
      sx={{
        width: '100%',
        display: "flex",
        flexDirection: 'column',
        marginTop: '100px'
      }}
      alignItems='center'
    >
        <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
          <Card
            variant="outlined"
            sx={{
              width: 500,
              borderRadius: 5,
            }}
          >
            <AspectRatio>
              <CardContent>
                <Typography
                  variant="h3"
                  component="div"
                  align='center'
                >
                  { card ? card.front : "" }
                </Typography>
              </CardContent>
              <CardActions
                style={{
                justifyContent: 'flex-end',
                }}
              >
                <Button
                  variant="contained"
                  onClick={handleFlip}
                >
                  See Back
                </Button>
              </CardActions>
              <CardActions
                style={{
                  justifyContent: 'flex-end',
                  marginTop: 170
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => /*setNext(true)*/ dispatch(nextCard(deckData))}
                >
                  Next Card
                </Button>
              </CardActions>
            </AspectRatio>
          </Card>
          <Card
            variant="outlined"
            sx={{
              minWidth: 500,
              borderRadius: 5,
            }}
          >
            <AspectRatio>
              <CardContent>
                <Typography
                  variant="h3"
                  component="div"
                  align='center'
                >
                  { card ? card.back : "" }
                </Typography>
              </CardContent>
              <CardActions
                style={{
                  justifyContent: 'flex-end',
                }}
              >
                <Button
                  variant="contained"
                  onClick={handleFlip}
                >
                  Front
                </Button>
              </CardActions>
              <CardActions
                style={{
                  justifyContent: 'space-evenly',
                  marginTop: 150
                }}
              >
                <Button
                  variant='contained'
                  onClick={ () => { handleRecallability(deckData, "again") } }
                >
                    again
                </Button>
                <Button
                  variant='contained'
                  onClick={ () => { handleRecallability(deckData, "hard") } }
                >
                    hard
                </Button>
                <Button
                  variant='contained'
                  onClick={ () => { handleRecallability(deckData, "good") } }
                >
                    good
                </Button>
                <Button
                  variant='contained'
                  onClick={ () => { handleRecallability(deckData, "easy") } }
                >
                    easy
                </Button>
              </CardActions>
            </AspectRatio>
          </Card>
        </ReactCardFlip>
      </Box>
    );
  }