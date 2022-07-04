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

export default function FrontView({card}) {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleClick = () => {
        setIsFlipped(!isFlipped);
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
                                Hello
                            </Typography>
                        </CardContent>
                        <CardActions
                            style={{
                                justifyContent: 'flex-end',
                            }}
                            >
                            <Button
                                variant="contained"
                                onClick={handleClick}
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
                                This is back
                            </Typography>
                        </CardContent>
                        <CardActions
                            style={{
                                justifyContent: 'flex-end',
                            }}
                            >
                            <Button
                                variant="contained"
                                onClick={handleClick}
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
                            <Button variant='contained'>again</Button>
                            <Button variant='contained'>hard</Button>
                            <Button variant='contained'>good</Button>
                            <Button variant='contained'>easy</Button>
                        </CardActions>
                    </AspectRatio>
                </Card>
            </ReactCardFlip>
        </Box>
    );
}