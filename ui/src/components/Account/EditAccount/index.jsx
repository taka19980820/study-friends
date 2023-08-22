// Main.js
import React from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardHeader, CardContent, Button, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
// import { useRegisterInput } from '../../../../context/RegisterInputContext';


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


export default function EditAccount({ open }) {
    const router = useRouter();
    const [accountData, setAccountData] = React.useState(router.query);
    // const { registerInput } = useRegisterInput();

    const handleSubmit = (event) => {
        event.preventDefault();
        // ここで実際の登録処理を行う
        // API呼び出しやデータベースへの保存など
        console.log('Edited:', accountData);

        // 登録後、ホームページなどにリダイレクトする
        router.push({
            pathname: '/account',
            query: accountData,
        }, '/account');
    }
    
    const handleChange = (event) => {
        setAccountData({...accountData, [event.target.name]: event.target.value})
    }

  return  (
    <MainContainer open={open}>
        <DrawerHeader />
        <Card>
            <CardHeader title="アカウント情報編集" />
            <CardContent>
                    <form onSubmit={handleSubmit}>
                        <Typography>名前</Typography>
                        <TextField
                          value={accountData.name}
                          onChange={handleChange}
                          variant="outlined"
                          margin="normal"
                          required
                          fullWidth
                          id="name"
                          name="name"
                          autoComplete="name"
                          autoFocus
                        />
                        <Typography>メールアドレス</Typography>
                        <TextField
                          value={accountData.email}
                          onChange={handleChange}
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
                          value={accountData.password}
                          onChange={handleChange}
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
                          アカウント情報更新
                        </Button>
                    </form>
            </CardContent>
        </Card>
    </MainContainer>
    )
};