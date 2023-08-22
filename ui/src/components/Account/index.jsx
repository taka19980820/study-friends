// Main.js
import React from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardHeader, CardContent, Button, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useRouter } from 'next/router';
// import { useRegisterInput } from '../../../../context/RegisterInputContext';
import Link from 'next/link'

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


export default function Account({ open }) {
    const router = useRouter();
    console.log(router)
    // const { registerInput } = useRegisterInput();
    console.log(Object.keys(router.query).length)
    const [accountData, setAccountData] = React.useState(
        Object.keys(router.query).length > 0 ?
        {
            name: router.query.name,
            email: router.query.email,
            password: router.query.password
        }
        :
        {
            name: '堀越貴也',
            email: 'takaya.b.b0820@gmail.com',
            password: '////////'
        }
    );

    const handleEditAccount = () => {
        // ここで実際の登録処理を行う
        // API呼び出しやデータベースへの保存など

        // 登録後、ホームページなどにリダイレクトする
        router.push({
            pathname: '/editaccount',
            query: accountData,
        }, '/editaccount');
    }

  return  (
    <MainContainer open={open}>
        <DrawerHeader />
        <Card>
            <CardHeader title="アカウント情報" />
            <CardContent>
                <List>
                    <ListItem>
                        <ListItemText 
                            primary="名前" 
                            secondary={
                                <Typography variant='h6'>
                                    {accountData.name}
                                </Typography>
                            } 
                            />
                    </ListItem>
                    <ListItem>
                        <ListItemText 
                            primary="メールアドレス" 
                            secondary={
                                <Typography variant='h6'>
                                    {accountData.email}
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
                        sx={{ fontWeight: 'bold' }}
                        onClick={handleEditAccount}
                    >
                        アカウント編集
                    </Button>
                    <Button color='error' sx={{ fontWeight: 'bold' }}>アカウント削除</Button>
            </CardContent>
        </Card>
    </MainContainer>
    )
};