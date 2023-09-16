import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import IconButton from '@mui/material/IconButton';
import TimelineIcon from '@mui/icons-material/Timeline';
import DoorFrontIcon from '@mui/icons-material/DoorFront';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import LoginIcon from '@mui/icons-material/Login';
import InfoIcon from '@mui/icons-material/Info';
import Link from 'next/link'


const drawerWidth = 240;

const StyledDrawer = styled(Drawer)({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function NoLoginSideMenu({ open, handleDrawerClose }) {
  const theme = useTheme();
  const menuItem = [
    {
      display: '新規登録',
      icon: <AppRegistrationIcon />,
      link: '/register'
    },
    {
      display: 'ログイン',
      icon: <LoginIcon />,
      link: '/login'
    },
    {
      display: 'スタ友について',
      icon: <InfoIcon />,
      link: '/about'
    },
  ];

  return (
    <StyledDrawer variant="persistent" anchor="left" open={open}>
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {menuItem.map((value, index) => (
          <ListItem key={value.display} disablePadding>
            <Link href={value.link}>
                <ListItemButton>
                <ListItemIcon>
                    {value.icon}
                </ListItemIcon>
                <ListItemText primary={value.display} />
                </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </StyledDrawer>
  );
};