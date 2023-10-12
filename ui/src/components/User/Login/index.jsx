import React from 'react';
import { Card, CardHeader, CardContent, TextField, Button } from '@mui/material';
import Typography from '@mui/joy/Typography';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { AuthContext } from '../../../context/Auth/AuthContext';
import * as RestAccess from '../../../utils/RestAccess';
import { useSnackbar } from '../../../context/SnackbarContext';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

export default function Login() {
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

  const guestLogin = async () => {
    const requestData = {
      email: "guest@gmail.com",
      password: "guestuser"
    };
    // CSRFトークンを取得
    await RestAccess.get('/sanctum/csrf-cookie');

    // ログイン処理
    const response = await RestAccess.post('/login', requestData, {
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
                  <Button sx={{fontWeight: 'bold', mt: 2}} onClick={guestLogin}>ゲストユーザーでログインする</Button>
                  
          </CardContent>
      </Card>
    )
};