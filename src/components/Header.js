import * as React from 'react';
import { Box, Typography, AppBar, Toolbar, Menu, MenuItem, Backdrop, CircularProgress } from '@mui/material';
import MenuIcon from '@mui/material/Menu';
import IconButton from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import { axiosClient } from '../hooks/axiosClient';
import axios from 'axios';

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const auth = useAuth();
  const signOut = async () => {
    const result = await auth.signOut();
    alert(result.message);
  };

  const { accessToken } = useAuth();
  axiosClient.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
      return config
    }
  })

  const [isLoading, setIsLoading] = React.useState(false);
  const onExportClick = async () => {
    setIsLoading(true);
    await axiosClient.post("/export")
    // .then(res => {axios.get(res.data.url)})
    .then(res => window.open(res.data.url, "_blank"))
    .catch((e) => {alert("失敗しました")});
    setIsLoading(false);
    setAnchorEl(null);
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ alignItems: "center" }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            お気に入りスポット
          </Typography>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleClick}
            sx={{ mr: 2, color: "#fff" }}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={signOut}>ログアウト</MenuItem>
            <MenuItem onClick={handleClose} component={Link} to="/view">マップ</MenuItem>
            <MenuItem onClick={handleClose} component={Link} to="/list">リスト</MenuItem>
            <MenuItem onClick={onExportClick}>エクスポート</MenuItem>
          </Menu>  
        </Toolbar>
      </AppBar>
      <Backdrop
        sx={{ color: '#fff', zIndex: 1100 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}

export default Header;