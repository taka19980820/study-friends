// Main.js
import React from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardHeader, CardContent, Button, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useRegisterInput } from '../../../../context/RegisterInputContext';


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


export default function Register({ open }) {
    const router = useRouter();
    const { registerInput } = useRegisterInput();

    const handleRegister = (event) => {
        // ここで実際の登録処理を行う
        // API呼び出しやデータベースへの保存など
        console.log('Registered:', registerInput);

        // 登録後、ホームページなどにリダイレクトする
        router.push('/');
    }

  return  (
    <MainContainer open={open}>
        <DrawerHeader />
        <Card>
            <CardHeader title="入力情報の確認" />
            <CardContent>
                <List>
                    <ListItem>
                        <ListItemText 
                            primary="名前" 
                            secondary={
                                <Typography variant='h6'>
                                    {registerInput.name}
                                </Typography>
                            } 
                            />
                    </ListItem>
                    <ListItem>
                        <ListItemText 
                            primary="メールアドレス" 
                            secondary={
                                <Typography variant='h6'>
                                    {registerInput.email}
                                </Typography>
                            }  
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText 
                            primary="パスワード" 
                            secondary={
                            <Typography variant='h6'>
                                {'*********'}
                            </Typography>} />
                    </ListItem>
                </List>  
                <Button 
                    onClick={handleRegister}
                    sx={{
                    mt: 2,
                    width: '100%',
                    "@media screen and (max-width:600px)": {
                        width: '100%',
                    },
                }} variant="contained"
                >
                    登録する
                </Button>
            </CardContent>
        </Card>
    </MainContainer>
    )
};