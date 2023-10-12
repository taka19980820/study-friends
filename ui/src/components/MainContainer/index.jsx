import React from 'react';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create(['margin', 'transform'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    transform: open ? `translateX(${drawerWidth}px)` : 'none',
  }),
);


const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  })); 


export default function MainContainer({ open, children }) {

  return  (
    <Container maxWidth="sm">
        <Main open={open}>
            <DrawerHeader />
            {children}
        </Main>
    </Container>
    )
};