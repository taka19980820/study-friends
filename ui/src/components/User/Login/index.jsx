import React from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardHeader, CardContent, TextField, Button, Grid } from '@mui/material';
import Typography from '@mui/joy/Typography';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { AuthContext } from '../../../context/Auth/AuthContext';
import * as RestAccess from '../../../utils/RestAccess';
import { useSnackbar } from '../../../context/SnackbarContext';
import Link from 'next/link';
import { useForm } from 'react-hook-form';


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


export default function Login({ open }) {
    const router = useRouter();
    const { setAuthUser } = useContext(AuthContext);
    const { showSnackbar } = useSnackbar();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
      // CSRFトークンを取得
      await RestAccess.get('/sanctum/csrf-cookie');

      // ログイン処理
      const response = await RestAccess.post('/login', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 200) {
        const { data: user } = response;
        setAuthUser(user);
        showSnackbar('ログインしました');
      } else if (response.status === 422) {
        showSnackbar('認証に失敗しました', 'error');
      } else {
        showSnackbar('ログインに失敗しました', 'error');
      }
  
    }
    

  return  (
    <MainContainer open={open}>
        <DrawerHeader />
        <Card>
            <CardHeader title="ログイン" />
            <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Typography>メールアドレス</Typography>
                        <TextField
                          variant="outlined"
                          margin="normal"
                          fullWidth
                          {...register("email", {
                            required: "メールアドレスは必須です。",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                              message: "無効なメールアドレスです。"
                            }
                          })}
                          error={Boolean(errors.email)}
                          helperText={errors.email && errors.email.message}
                        />
                        <Typography>パスワード</Typography>
                        <TextField
                          variant="outlined"
                          margin="normal"
                          type="password"
                          fullWidth
                          {...register("password", {
                            required: "パスワードは必須です。"
                          })}
                          error={Boolean(errors.password)}
                          helperText={errors.password && errors.password.message}
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
                    <Button sx={{fontWeight: 'bold', mt: 2}}><Link href="/register">新規登録はこちら</Link></Button>
                    
            </CardContent>
        </Card>
    </MainContainer>
    )
};