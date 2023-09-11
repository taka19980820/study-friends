// Main.js
import React from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardHeader, CardContent, Button, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { AuthContext } from '@/context/Auth/AuthContext';
import { useSnackbar } from '@/context/SnackbarContext';
import { useState, useContext, useEffect } from 'react';
import * as RestAccess from '@/utils/RestAccess';
import { useForm } from 'react-hook-form';
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


export default function Password() {
    const { authUser, setAuthUser } = useContext(AuthContext);
    const { showSnackbar } = useSnackbar(); 
    const [ display, setDisplay ] = useState(false);
    const router = useRouter();

    const onSubmit = async (data) => {
        const response = await RestAccess.post('/change-password', data, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if(response.status === 200) {
          setValue('current_password', '');
          setValue('new_password', '');
          setValue('new_password_confirmation', '');
          showSnackbar('パスワードを更新しました');
        } else if (response.status === 422) {
          showSnackbar('認証に失敗しました', 'error');
        } else {
          showSnackbar('エラーが発生しました', 'error');
        }
    }
    
    const handleChange = (event) => {
        setFormData({...formData, [event.target.name]: event.target.value})
    }
  
  const [ formData, setFormData ] = useState({
      current_password: "",
      new_password: "",
      new_password_confirmation: ""
  })

  const { register, setValue, handleSubmit, formState: { errors }, watch } = useForm();

    const new_password = watch("new_password");

  return  (
        <Card>
            <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Typography>現在のパスワード</Typography>
                        <TextField
                          variant="outlined"
                          margin="normal"
                          fullWidth
                          type="password"
                          {...register("current_password", {
                            required: "このフィールドは必須です。"
                          })}
                          error={Boolean(errors.current_password)}
                          helperText={errors.current_password && errors.current_password.message}
                        />
                        <Typography>新しいパスワード</Typography>
                        <TextField
                          fullWidth
                          type="password"
                          {...register("new_password", {
                            required: "パスワードは必須です。",
                            minLength: {
                              value: 8,
                              message: "パスワードは8文字以上にしてください"
                            }
                          })}
                          error={Boolean(errors.new_password)}
                          helperText={errors.new_password && errors.new_password.message}
                        />
                        <Typography>パスワード確認</Typography>
                        <TextField
                          fullWidth
                          type="password"
                          {...register("new_password_confirmation", {
                            required: "確認のためパスワードを再入力してください",
                            validate: (value) =>
                              value === new_password || "パスワードが一致しません"
                          })}
                          error={Boolean(errors.new_password_confirmation)}
                          helperText={errors.new_password_confirmation && errors.new_password_confirmation.message}
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
                          パスワード更新
                        </Button>
                    </form>
            </CardContent>
        </Card>
    )
};