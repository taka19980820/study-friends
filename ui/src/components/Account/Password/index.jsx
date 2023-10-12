import React from 'react';
import { Card, CardContent, Button, TextField, Typography } from '@mui/material';
import { useSnackbar } from '@/context/SnackbarContext';
import { useState } from 'react';
import * as RestAccess from '@/utils/RestAccess';
import { useForm } from 'react-hook-form';

export default function Password() {
    const { showSnackbar } = useSnackbar(); 

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