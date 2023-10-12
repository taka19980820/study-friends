import React from 'react';
import { Card, CardContent, Button, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { AuthContext } from '@/context/Auth/AuthContext';
import { useSnackbar } from '@/context/SnackbarContext';
import { useContext } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import * as RestAccess from '@/utils/RestAccess';
import { useForm } from 'react-hook-form';

export default function EditAccount({ accountData, changeEmail }) {
    const { setAuthUser } = useContext(AuthContext);
    const { showSnackbar } = useSnackbar(); 
    const router = useRouter();
    const { register, handleSubmit, formState: { errors }} = useForm({
      mode: "onChange",
      defaultValues: {
        email: accountData.email
      },
    });
    const onSubmit = (data) => {
        changeEmail(data);
    }
    
    //削除確認ダイアログ
    const [dialogOpen, setDialogOpen] = React.useState(false);

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };
    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const deleteAccount = async () => {
        const response = await RestAccess.del('/delete-accoount');
        if(response.status === 200) {
            setDialogOpen(false);
            setAuthUser(null);
            router.push('/');
            showSnackbar('アカウントを削除しました');
        } else {
            setDialogOpen(false);
            showSnackbar('エラーが発生しました', 'error');
        }
    }

    const renderDialog = (
      <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}
      >
          <DialogContent>
          <DialogContentText id="alert-dialog-description">
              本当に削除しますか？
          </DialogContentText>
          </DialogContent>
          <DialogActions>
          <Button onClick={handleDialogClose}>キャンセル</Button>
          <Button onClick={deleteAccount}>
              削除
          </Button>
          </DialogActions>
      </Dialog>
    );

  return  (
        <>
          <Card>
              <CardContent>
                      <form onSubmit={handleSubmit(onSubmit)}>
                          <Typography>名前</Typography>
                          <TextField
                            value={accountData.name}
                            variant="outlined"
                            margin="normal"
                            disabled
                            fullWidth
                            id="name"
                            name="name"
                          />
                          <Typography>メールアドレス</Typography>
                          <TextField
                            fullWidth
                            sx={{ mb: 2 }}
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
                          <Button type='submit' variant="contained" sx={{ fontWeight: 'bold', ml: 2 }}>メールアドレス更新</Button>
                          <Button onClick={handleDialogOpen} variant="contained" color='error' sx={{ fontWeight: 'bold', ml: 2 }}>アカウント削除</Button>
                      </form>
              </CardContent>
          </Card>
          {renderDialog}
        </>
    )
};