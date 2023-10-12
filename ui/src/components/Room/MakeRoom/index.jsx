import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Card, CardHeader, CardContent, TextField, Button } from '@mui/material';
import Typography from '@mui/joy/Typography';
import Box from '@mui/material/Box';
import { useContext } from 'react';
import { AuthContext } from '../../../context/Auth/AuthContext';
import { useSnackbar } from '../../../context/SnackbarContext';
import TagManager from '../../Tag/TagManager';
import * as RestAccess from '../../../utils/RestAccess';
import { useRouter } from 'next/router'

export default function MakeRoom() {
    const { showSnackbar } = useSnackbar();    
    const [ formData, setFormData ] = React.useState({
        room_name: '',
        description: '',
        image: null,
        tags: []
    })
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await RestAccess.post('/rooms', formData, {
          headers: {
          'Content-Type': 'multipart/form-data'
        }})
        if(response.status === 200) {
          showSnackbar('ルームを作成しました', 'success');
          router.push('/rooms');
        } else {
          showSnackbar(response.status.message, 'error');
        }
  
    }

  //タグ選択コールバック
  const handleSetTags = (newTags) => {
      setFormData({
        ...formData,
        tags: newTags
      });
  };

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
    <>
        <Card>
            <CardHeader title="勉強ルーム作成" />
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
                        <Typography sx={{ mt: 2 }}>タグ選択(複数選択可)</Typography>
                        <TagManager 
                            callBack={handleSetTags}
                            tags={formData.tags}
                        />
                        <Typography>ルーム説明</Typography>
                        <TextField
                            required
                            multiline
                            rows={3}
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            variant="outlined"
                            fullWidth
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
                            作成する
                    </Button>
                </form>
            </CardContent>
        </Card>
    </>
    )
};