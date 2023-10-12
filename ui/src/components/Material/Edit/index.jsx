import React from 'react';
import { Card, CardHeader, CardContent, TextField, Button } from '@mui/material';
import Typography from '@mui/joy/Typography';
import Box from '@mui/material/Box';
import TagManager from '../../Tag/TagManager';
import * as RestAccess from '../../../utils/RestAccess';
import { useRouter } from 'next/router'
import { useSnackbar } from '../../../context/SnackbarContext';

export default function EditMaterial({ materialId }) {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();    
    const [ display, setDisplay ] = React.useState(false);
    const [ formData, setFormData ] = React.useState({
        material_name : "",
        description: "",
        author: "",
        publisher: "",
        pages: "",
        url: "",
        image: '',
        tags: []
    })

    React.useEffect(() => {
        const getTagData = async () => {
            const materialReq = await RestAccess.get('/materials/' + materialId);
            if(materialReq.status === 200) {
                const material = materialReq.data;
                const materialTags = material.tags.map((tag) => tag.tag_name);
                setFormData({
                    material_name : material.material_name,
                    description: material.description,
                    author: material.author ? material.author : '',
                    publisher: material.publisher ? material.publisher : '',
                    pages: material.pages ? material.pages : '',
                    url: material.url ? material.url : '',
                    tags: materialTags
                });
                setDisplay(true);
            } else if(materialReq.status === 404) {
              showSnackbar('対象の勉強記録が見つかりません', 'error');
              router.push('/materials');
            }
        }
        getTagData();
    }, [])

    const handleSubmit = async (event) => {
      event.preventDefault();
      const requestData = {...formData};
        requestData['_method'] = 'PUT';
      const response = await RestAccess.post('/materials/' + materialId + '/edit',  requestData, {
        headers: {
          'Content-Type': 'multipart/form-data',
      }})
      if(response.status === 200) {
        showSnackbar('教材情報を更新しました', 'success');
        router.push('/materials');
      } else {
        showSnackbar('教材の更新に失敗しました', 'error');
      }

    }

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value
      });
    };

    //タグ選択コールバック
    const handleSetTags = (newTags) => {
        setFormData({
          ...formData,
          tags: newTags
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
        {display &&
          <>
            <Card>
                <CardHeader title="教材登録" />
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <Box>
                            <Typography>教材名</Typography>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    required
                                    id="material_name"
                                    name="material_name"
                                    value={formData.material_name}
                                    onChange={handleChange}
                                    sx={{ mb: 2 }}
                                />   
                            <Typography>教材画像</Typography>
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
                            <Typography sx={{ mt: 2 }}>タグ(複数選択可)</Typography>
                            <TagManager 
                              callBack={handleSetTags}
                              tagSet={formData.tags}
                            />
                            <Typography sx={{ mt: 2 }}>教材説明</Typography>
                            <TextField
                                multiline
                                rows={3}
                                variant="outlined"
                                fullWidth
                                required
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                sx={{ mb: 2 }}
                            />
                            <Typography>著者名(任意)</Typography>
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="author"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                sx={{ mb: 2 }}
                            />
                            <Typography>ページ数(任意)</Typography>
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="pages"
                                name="pages"
                                value={formData.pages}
                                onChange={handleChange}
                                sx={{ mb: 2 }}
                            />
                            <Typography>出版社(任意)</Typography>
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="publisher"
                                name="publisher"
                                value={formData.publisher}
                                onChange={handleChange}
                                sx={{ mb: 2 }}
                            />
                            <Typography>URL(任意)</Typography>
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="url"
                                name="url"
                                value={formData.url}
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
                            type='submit'
                        >
                            教材情報を更新する
                        </Button>
                    </form>
                </CardContent>
            </Card>
          </>
        }
    </>
    )
};