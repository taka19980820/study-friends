import React from 'react';
import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Link from 'next/link'
import { AuthContext } from '../../context/Auth/AuthContext';
import { useSnackbar } from '../../context/SnackbarContext';
import { useRouter } from 'next/router';
import * as RestAccess from '../../utils/RestAccess';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function Header({ open, handleDrawerOpen}) {
  const { authUser, setAuthUser } = React.useContext(AuthContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const { showSnackbar } = useSnackbar(); 
  const router = useRouter();

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    const response = await RestAccess.post('/logout');
    if(response.status == 200) {
      setAuthUser(null);
      showSnackbar('ログアウトしました');
      router.push('/login');
    } else {
      showSnackbar('エラーが発生しました', 'error')
    }
  }

  const menuId = 'primary-search-account-menu';
 
  return (
  <>
    { authUser && 
      <>
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              スタ友
            </Typography>


            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'flex' } }}>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                {authUser.profileimg != null ? 
                  <Avatar
                    alt={authUser.name.slice(0, 1)}
                    src={process.env.NEXT_PUBLIC_API_ENDPOINT + '/' + authUser.profileimg}
                    sx={{ bgcolor: red[500] }}
                    aria-label="recipe"
                  />
                  :
                  <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                    {authUser.name.slice(0, 1)}
                  </Avatar>
                }
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {/* ヘッダーメニュー */}
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          id={menuId}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}><Link href={"/users/" + authUser.id}>プロフィール</Link></MenuItem>
          <MenuItem onClick={handleMenuClose}><Link href="/account">アカウント</Link></MenuItem>
          <MenuItem onClick={handleLogout}>ログアウト</MenuItem>
        </Menu>
      </>
    }
  </>
)};
