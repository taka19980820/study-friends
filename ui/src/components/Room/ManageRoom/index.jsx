// Main.js
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { Card, CardHeader, CardContent, TextField, Button, Grid } from '@mui/material';
import Typography from '@mui/joy/Typography';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { AuthContext } from '../../../context/Auth/AuthContext';
import * as RestAccess from '../../../utils/RestAccess';
import { useSnackbar } from '../../../context/SnackbarContext';
import TagManager from '../../Tag/TagManager';



import Stack from '@mui/material/Stack';


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

export default function ManageRoom({ open, roomId }) {
    //タグ選択
    const theme = useTheme();
    const { authUser } = useContext(AuthContext);
    const { showSnackbar } = useSnackbar();    
    const [ display, setDisplay ] = React.useState(false);
    const [ formData, setFormData ] = React.useState({
        room_name: '',
        description: '',
        image: null,
        tags: []
    })
    const router = useRouter();

    //削除確認ダイアログ
    const [dialogOpen, setDialogOpen] = React.useState(false);

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };
    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    //ルーム削除
    const deleteRoom = async () => {
        const response = await RestAccess.del('/rooms/' + roomId + '/delete');
        if(response.status === 200) {
            showSnackbar('ルームを削除しました');
            router.push('/rooms');
        } else {
            showSnackbar('エラーが発生しました', 'error');
        }
    }
    
    const renderDialog = (
        <Dialog
            open={dialogOpen}
            onClose={handleDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                本当に削除しますか？
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleDialogClose}>キャンセル</Button>
            <Button onClick={deleteRoom} autoFocus>
                削除
            </Button>
            </DialogActions>
        </Dialog>
    );

    React.useEffect(() => {
        const getRoomData = async () => {
            const room = await RestAccess.get('/rooms/' + roomId);
            if(room.status === 200) {
                const roomData = room.data.room;
                const roomTags = roomData.tags.map((tag) => tag.tag_name);
                setFormData({
                    room_name: roomData.room_name,
                    description: roomData.description,
                    tags: roomTags
                })
                setDisplay(true);
            } else {
                showSnackbar('ルーム情報の取得に失敗しました', 'error')
                router.push('/rooms');
            }
        }
        getRoomData();
    }, [])

    //タグ選択コールバック
    const handleSetTags = (newTags) => {
        setFormData({
          ...formData,
          tags: newTags
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const requestData = {...formData};
        requestData['_method'] = 'PUT';
        // console.log(requestData);
        // return ;
        const response = await RestAccess.post('/rooms/' + roomId + '/edit',  requestData, {
          headers: {
          'Content-Type': 'multipart/form-data'
        }})
        if(response.status === 200) {
          showSnackbar('ルーム情報を更新しました', 'success');
          router.back();
        } else if(response.data.errors.image) {
          showSnackbar('画像サイズが大きすぎます。', 'error');
        } else {
          showSnackbar('ルーム情報の更新に失敗しました', 'error');
        }
  
    }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  //画像アップロード
  const [ fileName, setFileName ] = React.useState('');
  const handleImgUpload = async (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
    setFileName(files[0]['name']);
    e.target.value='';
  }
  
    
    
    
  return  (
    <MainContainer open={open}>
        <DrawerHeader />
        { display &&
        <>
        <Card>
            <CardHeader title="ルーム管理" />
            <CardContent>
                    <form onSubmit={handleSubmit}>
                        <Box>
                            <Typography>ルーム名</Typography>
                            <TextField
                                required
                                id="room_name"
                                name="room_name"
                                value={formData.room_name}
                                onChange={handleChange}
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                            <Typography>ルームアイコン</Typography>
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="img-upload"
                                type="file"
                                name="image"
                                onChange={handleImgUpload}
                            />
                            <Typography>{fileName}</Typography>
                            <label htmlFor="img-upload">
                                <Button variant="contained" component="span">
                                    画像を選択
                                </Button>
                            </label>
                            <Typography sx={{ mt: 2 }}>タグ選択</Typography>
                            <TagManager 
                                callBack={handleSetTags}
                                tagSet={formData.tags}
                            />
                            <Typography>ルーム説明</Typography>
                            <TextField
                                required
                                multiline
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                        </Box>
                        <Stack direction="row" spacing={2}>
                            <Button 
                                sx={{
                                    width: '100%',
                                    "@media screen and (max-width:600px)": {
                                        width: '100%',
                                    },
                                }} 
                                variant="contained"
                                color="error"
                                onClick={handleDialogOpen}
                            >
                                    ルーム削除
                            </Button>
                            <Button 
                                sx={{
                                    width: '100%',
                                    "@media screen and (max-width:600px)": {
                                        width: '100%',
                                    },
                                }} 
                                variant="contained"
                                type="submit"
                            >
                                更新する
                            </Button>                      
                        </Stack>
                    </form>
            </CardContent>
        </Card>
        {renderDialog}
        </>
        }       
    </MainContainer>
    )
};