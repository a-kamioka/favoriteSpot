import * as React from 'react';
import { Box, Typography, AppBar, Toolbar, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/material/Menu';
import IconButton from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';

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
          </Menu>  
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;