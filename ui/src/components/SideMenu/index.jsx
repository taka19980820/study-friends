import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import IconButton from '@mui/material/IconButton';
import TimelineIcon from '@mui/icons-material/Timeline';
import DoorFrontIcon from '@mui/icons-material/DoorFront';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import InfoIcon from '@mui/icons-material/Info';
import Link from 'next/link';
import { AuthContext } from '../../context/Auth/AuthContext';

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

export default function SideMenu({ open, handleDrawerClose }) {
  const { authUser } = React.useContext(AuthContext);
  const theme = useTheme();
  const menuItem = [
    {
      display: 'タイムライン',
      icon: <TimelineIcon />,
      url: '/',
    },
    {
      display: 'ルーム一覧',
      icon: <DoorFrontIcon />,
      url: '/rooms',
    },
    {
      display: '教材一覧',
      icon: <BorderColorIcon />,
      url: '/materials',
    },
    {
      display: 'スタ友について',
      icon: <InfoIcon />,
      url: '/about'
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
          
          <ListItem key={value.display} style={{ padding: 0 }}>
                <Link href={value.url} style={{ display: 'block', width: '100%' }}>
                  <ListItemButton>
                          <ListItemIcon>
                            {value.icon}
                          </ListItemIcon>
                          <ListItemText primary={value.display} />
                  </ListItemButton>
                </Link>
          </ListItem>
        ))}
        {authUser.is_admin && 
           <Link href="/admin" style={{ display: 'block', width: '100%' }}>
            <ListItemButton>
                    <ListItemIcon>
                      <SupervisorAccountIcon />
                    </ListItemIcon>
                    <ListItemText primary="管理者ページ" />
            </ListItemButton>
          </Link> 
        }
      </List>
    </StyledDrawer>
  );
};