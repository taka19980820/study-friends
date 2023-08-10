import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import * as React from 'react';
import { Header } from '../components/Header';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';


// const inter = Inter({ subsets: ['latin'] })


export default function Home() {

  return (
    <>
      <Header />
    </>
  )
}
