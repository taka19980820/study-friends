// Main.js
import React from 'react';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardContent, TextField, Button, Grid } from '@mui/material';
import Typography from '@mui/joy/Typography';
import { useRouter } from 'next/router';
import * as RestAccess from '@/utils/RestAccess';
import { useSnackbar } from '@/context/SnackbarContext';
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


export default function Register({ open }) {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const { register, handleSubmit, formState: { errors }, watch } = useForm();

    const password = watch("password");
    
    const onSubmit = async (data) => {
      const response = await RestAccess.post('/register', data, {
          headers: {
            'Content-Type': 'application/json'
          }
      });
      if(response.status === 201) {
        showSnackbar('ユーザー登録が完了しました。')
        router.push('/login');
      } else {
        showSnackbar('エラーが発生しました', 'error');
      }
    }
    
  return  (
    <MainContainer open={open}>
        <DrawerHeader />
        <Card>
            <CardHeader title="ユーザー登録" />
            <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Typography>名前</Typography>
                        <TextField
                          fullWidth
                          {...register("name", {
                            required: "名前は必須です。",
                          })}
                          error={Boolean(errors.name)}
                          helperText={errors.name && errors.name.message}
                        />
                        <Typography>メールアドレス</Typography>
                        <TextField
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
                          fullWidth
                          type="password"
                          {...register("password", {
                            required: "パスワードは必須です。",
                            minLength: {
                              value: 8,
                              message: "パスワードは8文字以上にしてください"
                            }
                          })}
                          error={Boolean(errors.password)}
                          helperText={errors.password && errors.password.message}
                        />
                        <Typography>パスワード確認</Typography>
                        <TextField
                          fullWidth
                          type="password"
                          {...register("password_confirmation", {
                            required: "確認のためパスワードを再入力してください",
                            validate: (value) =>
                              value === password || "パスワードが一致しません"
                          })}
                          error={Boolean(errors.password_confirmation)}
                          helperText={errors.password_confirmation && errors.password_confirmation.message}
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
                          登録する
                        </Button>
                    </form>
                    <Button sx={{fontWeight: 'bold', mt: 2}}><Link href="/login">ログインはこちら</Link></Button>
            </CardContent>
        </Card>
    </MainContainer>
    )
};