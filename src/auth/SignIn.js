import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import { Box, Button, Container, Grid, Link, TextField, Typography } from '@mui/material';

export function SignIn() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const executeSignIn = async (event) => {
    setIsSubmitting(true);
    event.preventDefault();
    const result = await auth.signIn(username, password);
    if (result.success) {
      navigate({ pathname: '/view' });
    } else {
      alert(result.message);
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexGrow: 1,
        minHeight: '100%'
      }}
    >
      <Container maxWidth="sm">
        <form onSubmit={executeSignIn}>
          <Box sx={{ my: 3 }}>
            {/* <Typography
              color="textPrimary"
              variant="h4"
            >
              ログイン
            </Typography>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="body2"
            >
              Sign in on the favorite spot app
            </Typography> */}
          </Box>
          <TextField
            fullWidth
            label="Username"
            margin="normal"
            name="username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Password"
            margin="normal"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            value={password}
            variant="outlined"
          />
          <Box sx={{ py: 2 }}>
            <Button
              color="primary"
              disabled={isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              ログイン
            </Button>
          </Box>
        </form>
      </Container>
    </Box>
  );
}