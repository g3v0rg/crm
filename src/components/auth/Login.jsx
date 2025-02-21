import React, { useState } from 'react';
import { Card, TextField, Button, Box } from '@mui/material';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (credentials.username === 'setup' && credentials.password === 'setup') {
      onLogin(true);
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <Box 
      sx={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: '#FDFDFD'
      }}
    >
      <Card sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            margin="normal"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            error={!!error}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            error={!!error}
            helperText={error}
          />
          <Button 
            fullWidth 
            variant="contained" 
            type="submit" 
            sx={{ 
              mt: 3,
              bgcolor: '#000000',
              '&:hover': {
                bgcolor: '#333333'
              }
            }}
          >
            Log in
          </Button>
        </form>
      </Card>
    </Box>
  );
};

export default Login;