import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Card, CardHeader, CardContent, TextField, Button, Select, MenuItem } from '@mui/material';
import Typography from '@mui/joy/Typography';
import Box from '@mui/material/Box';
import TagManager from '../../Tag/TagManager';
import * as RestAccess from '../../../utils/RestAccess';
import { useContext } from 'react';
import { useRouter } from 'next/router'
import { AuthContext } from '../../../context/Auth/AuthContext';
import CustomSnackbar from '../../SnackBar';
import { useSnackbar } from '../../../context/SnackbarContext';

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


export default function AddMaterial() {
    const router = useRouter();
    const { authUser } = useContext(AuthContext);
    const { showSnackbar } = useSnackbar();    
    const [ tagSuggestions, setTagSuggestions ] = React.useState([]);
    const [ categories, setCategories ] = React.useState([]);
    const [ category, setCategory ] = React.useState('');
    const [ display, setDisplay ] = React.useState(false);

    const [ formData, setFormData ] = React.useState({
        material_name : "",
        description: "",
        author: "",
        publisher: "",
        pages: "",
        url: "",
        category_id: 1,
        image: null,
        tags: []
    })

    const [ snackbar, setSnackbar ] = React.useState({ open: false, message: '', severity: 'success' });

    const theme = useTheme();
  
    const handleSetCategories = (event) => {
      setCategory(event.target.value);
      setFormData((prev) => ({ ...prev, category_id: event.target.value}));
    };

    const handleCloseSnackbar = () => {
      setSnackbar({ ...snackbar, open: false });
    };

    React.useEffect(() => {
        const getTagData = async () => {
            const tags = await RestAccess.get('/tags');
            const categories = await RestAccess.get('/users/' + authUser.id + '/categories');
            if(tags.status === 200 && categories.status === 200) {
                const tagSets = tags.data;
                const tagSuggestions = tagSets.map((tag) => tag.tag_name);
                // setTags(tagSets);
                setCategories(categories.data);
                setCategory(categories)
                setTagSuggestions(tagSuggestions);
                setDisplay(true);
            }
        }
        getTagData();
    }, [])

    const handleSubmit = async (event) => {
      event.preventDefault();
      // console.log(formData);
      // return ;
      const response = await RestAccess.post('/materials', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
      }})
      if(response.status === 200) {
        showSnackbar('教材を登録しました', 'success');
        router.push('/materials');
      } else {
        showSnackbar('教材を登録できませんでした', 'error');
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
                            <Typography sx={{ mt: 2 }}>カテゴリ選択</Typography>
                            <Select
                                value={formData.category_id}
                                onChange={handleSetCategories}
                                MenuProps={MenuProps}
                                fullWidth
                            >
                                {categories.map((value) => {
                                    return (
                                    <MenuItem 
                                        key={value.id} 
                                        value={value.id}
                                        style={getStyles(value, categories, theme)}
                                    >
                                        {value.category_name}
                                    </MenuItem>
                                )})}
                            </Select>
                            <Typography sx={{ mt: 2 }}>タグ(複数選択可)</Typography>
                            <TagManager 
                              callBack={handleSetTags}
                              tags={formData.tags}
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
                            教材を登録する
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
    </>
    )
};