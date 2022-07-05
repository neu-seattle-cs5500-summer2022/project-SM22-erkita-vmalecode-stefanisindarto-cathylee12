import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
const CreateDeck = () => {
  const handleSubmit = () => {

  }
  return (
      <>
      <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          
          <Typography component="h1" variant="h5">
            Create New Deck
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="New Deck Name"
              name="email"
              autoComplete="email"
              autoFocus
            />
            
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Make deck public"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Create Deck!
            </Button>
            
            
          </Box>
        </Box>
      
      
      </>
      
    
  )
}

export default CreateDeck