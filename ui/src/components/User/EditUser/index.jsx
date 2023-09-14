// Main.js
import React from 'react';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { Card, CardHeader, CardContent, TextField, Button, Grid } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/joy/Typography';
import Box from '@mui/material/Box';
import TagManager from '../../Tag/TagManager';
import * as RestAccess from '../../../utils/RestAccess'
import * as dateTimeHandler from '../../../utils/dateTimeHandler'
import { useRouter } from 'next/router'
import { AuthContext } from '../../../context/Auth/AuthContext';
import CustomSnackbar from '../../SnackBar';
import { useSnackbar } from '../../../context/SnackbarContext';

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
function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
}


export default function EditUser({ open }) {
    const { authUser } = React.useContext(AuthContext);
    const router = useRouter();
    const [ snackbar, setSnackbar ] = React.useState({ open: false, message: '', severity: 'success' });
    const { showSnackbar } = useSnackbar();    
    const [ display, setDisplay ] = React.useState(false);
    const [ formData, setFormData ] = React.useState({
      name : '',
      gender : 0,
      birthday : new Date().toISOString().split('T')[0],
      occupation : 0,
      introduction : '',
      image: null,
      tags: []
    })

    React.useEffect(() => {
      const getUserData = async () => {
          const user = await RestAccess.get('/users/' + authUser.id);
          if(user.status === 200) {
              const userData = user.data;
              const userTags = userData.tags.map((tag) => tag.tag_name);
              setFormData({
                  name : userData.name,
                  gender: userData.gender ? userData.gender : 0,
                  birthday: userData.birthday ? userData.birthday : formData.birthday,
                  occupation: userData.occupation ? userData.occupation : formData.occupation,
                  introduction: userData.introduction ? userData.introduction : '',
                  tags: userTags
              });
              setDisplay(true);
          }
      }
      getUserData();
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault();
    const requestData = {...formData};
    requestData['_method'] = 'PUT';
    const response = await RestAccess.post('/users/' + authUser.id + '/edit',  requestData, {
      headers: {
      'Content-Type': 'multipart/form-data',
    }});
    if(response.status === 200) {
      showSnackbar('ユーザー情報を更新しました', 'success');
      router.push('/users/'+authUser.id);
    } else {
      showSnackbar('ユーザー情報の更新に失敗しました', 'error');
    }

  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  //タグ選択コールバック
  const handleSetTags = (newTags) => {
    setFormData({
      ...formData,
      tags: newTags
    });
};

    

  //生年月日
  const currentDate = new Date().toISOString().split('T')[0];

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
                <CardHeader title="プロフィール編集" />
                <CardContent>
                    <form onSubmit={handleSubmit} >
                        <Box>
                            <Typography>名前</Typography>
                                <TextField
                                    required
                                    variant="outlined"
                                    fullWidth
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    sx={{ mb: 2 }}
                                /> 
                            <Typography>プロフィール画像</Typography>
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
                            <Typography sx={{ mt:2 }}>
                                生年月日
                            </Typography>
                            <TextField
                                sx={{ mb: 2, width: '200px' }}
                                variant="outlined"
                                type="date"
                                id="birthday"
                                name="birthday"
                                value={formData.birthday}
                                onChange={(e) => setFormData({ ...formData, birthday: dateTimeHandler.formatDate(e.target.value, 'YYYY-MM-DD')})}
                                InputLabelProps={{
                                shrink: true,
                                }}
                            />
                            <Typography>
                                職業
                            </Typography>
                            <Select
                                value={formData.occupation}
                                onChange={e => setFormData({...formData, occupation: e.target.value})}
                                sx={{ mb: 2, width: '200px' }}
                            >
                                <MenuItem value={0} sx={{ display: "none"}}></MenuItem>
                                <MenuItem value={1}>社会人</MenuItem>
                                <MenuItem value={2}>学生</MenuItem>
                                <MenuItem value={3}>その他</MenuItem>
                            </Select>
                            <Typography>
                                性別
                            </Typography>
                            <Select
                                value={formData.gender}
                                onChange={e => setFormData({...formData, gender: e.target.value})}
                                sx={{ mb: 2, width: '200px' }}
                            >
                                <MenuItem value={0}sx={{ display: "none"}}></MenuItem>
                                <MenuItem value={1}>男性</MenuItem>
                                <MenuItem value={2}>女性</MenuItem>
                                <MenuItem value={9}>その他</MenuItem>
                            </Select>             
                            <Typography>タグ(複数選択可)</Typography>
                            <TagManager 
                                  callBack={handleSetTags}
                                  tagSet={formData.tags}
                            />
                            <Typography sx={{ mt: 2}}>自己紹介</Typography>
                            <TextField
                                id="introduction"
                                name="introduction"
                                multiline
                                rows={3}
                                variant="outlined"
                                fullWidth
                                value={formData.introduction}
                                onChange={handleChange}
                                sx={{ mb: 2 }}
                            />
                        </Box>
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
                            プロフィールを更新する
                        </Button>
                    </form>
                </CardContent>
            </Card>
          </>
        }
        <CustomSnackbar
          open={snackbar.open}
          handleClose={handleCloseSnackbar}
          severity={snackbar.severity}
          message={snackbar.message}
        />
    </MainContainer>
    )
};