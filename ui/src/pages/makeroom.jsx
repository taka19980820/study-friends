// import Head from 'next/head'
// import Image from 'next/image'
// import { Inter } from 'next/font/google'
// import styles from '@/styles/Home.module.css'
// import * as React from 'react';
// import { Header } from '../components/Header';
// import { styled } from '@mui/material/styles';
// import Typography from '@mui/material/Typography';

import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Header from '../components/Header'
import SideMenu from '../components/SideMenu';
import MakeRoom from '../components/Room/MakeRoom';
import Container from '@mui/material/Container';

// const inter = Inter({ subsets: ['latin'] })

const drawerWidth = 240;

export default function Home() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header open={open} handleDrawerOpen={handleDrawerOpen} />
      <SideMenu open={open} handleDrawerClose={handleDrawerClose} />
      <Container maxWidth="sm">
        <MakeRoom open={open} />
      </Container>
      
    </Box>
  )
}
