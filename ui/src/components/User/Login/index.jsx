// Main.js
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, CardHeader, CardContent, TextField, Button, Grid } from '@mui/material';
import Typography from '@mui/joy/Typography';
import Box from '@mui/material/Box';
import { useRouter } from 'next/router';
import { useRegisterInput } from '../../../context/RegisterInputContext';


const drawerWidth = 240;

const MainContainer = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  })); 

//   const ExpandMore = styled((props) => {
//     const { expand, ...other } = props;
//     return <IconButton {...other} />;
//   })(({ theme, expand }) => ({
//     transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
//     marginLeft: 'auto',
//     transition: theme.transitions.create('transform', {
//       duration: theme.transitions.duration.shortest,
//     }),
//   }));

//タグ選択用スタイル
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }


export default function Login({ open }) {
    //登録ボタン押下
    const router = useRouter();
    // const { registerInput, setRegisterInput } = useRegisterInput();
    // const [userInput, setUserInput] = useState();
    const handleSubmit = (event) => {
      const userInput = {
        email: event.target.email.value,
        password: event.target.password.value
      }
      event.preventDefault();
    //   setRegisterInput({
    //       name: event.target.name.value,
    //       email: event.target.email.value,
    //       password: event.target.password.value,
    //   })
      console.log('login完了:', userInput);
      router.push('/');
    }
    

  return  (
    <MainContainer open={open}>
        <DrawerHeader />
        <Card>
            <CardHeader title="ログイン" />
            <CardContent>
                    <form onSubmit={handleSubmit}>
                        <Typography>メールアドレス</Typography>
                        <TextField
                          variant="outlined"
                          margin="normal"
                          required
                          fullWidth
                          id="email"
                          name="email"
                          autoComplete="email"
                        />
                        <Typography>パスワード</Typography>
                        <TextField
                          variant="outlined"
                          margin="normal"
                          required
                          fullWidth
                          name="password"
                          type="password"
                          id="password"
                          autoComplete="current-password"
                        />
                        <Button 
                            type='submit'
                            sx={{
                            mt: 2,
                            width: '100%',
                            "@media screen and (max-width:600px)": {
                                width: '100%',
                            },
                        }} variant="contained"
                        >
                          ログイン
                        </Button>
                    </form>
            </CardContent>
        </Card>
    </MainContainer>
    )
};