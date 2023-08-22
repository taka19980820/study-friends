// Main.js
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, CardHeader, CardContent, TextField, Button, Grid } from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Divider from '@mui/material/Divider';


// import Typography from '@mui/material/Typography';
import Typography from '@mui/joy/Typography';

import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
// import IconButton from '@mui/material/IconButton';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import CommentIcon from '@mui/icons-material/Comment';

// import List from '@mui/material/List';
import List from '@mui/joy/List';
// import ListItem from '@mui/material/ListItem';
import ListItem from '@mui/joy/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import DeleteIcon from '@mui/icons-material/Delete';
import Delete from '@mui/icons-material/Delete';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import IconButton from '@mui/joy/IconButton';


import Menu from '@mui/material/Menu';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


import {FormContainer,  TextFieldElement, DateTimePickerElement} from 'react-hook-form-mui'

import Stack from '@mui/material/Stack';


// import MainContent from './MainContent'; // Create a separate component for Main content

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

//   const ExpandMore = styled((props) => {
//     const { expand, ...other } = props;
//     return <IconButton {...other} />;
//   })(({ theme, expand }) => ({
//     transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
//     marginLeft: 'auto',
//     transition: theme.transitions.create('transform', {
//       duration: theme.transitions.duration.shortest,
//     }),
//   }));

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


export default function ManageRoom({ open }) {
    const {
        control,
        handleSubmit,
      } = useForm();
    
      const onSubmit = (data) => {
        console.log(data);
    };
    //勉強日時
    const [studyDateTime, setStudyDateTime] = React.useState(null);
    //カテゴリ選択
    const [category, setCategory] = React.useState('プログラミング');
    const handleSetCategory = (event) => {
        setCategory(event.target.value);
    };
    const categories = [
        // { categoryId: 1, categoryName: '教材なし' },
        { categoryId: 2, categoryName: 'プログラミング' },
        { categoryId: 3, categoryName: 'インフラ' },
        { categoryId: 4, categoryName: '資格取得' },
    ]
    //タグ選択
    const theme = useTheme();
    const [tags, setTags] = React.useState([]);
  
    const handleSetTags = (event) => {
      const {
        target: { value },
      } = event;
      setTags(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
      );
    };
    const tag = {
        // '教材なし': [],
        'プログラミング': [
            { tagId: 1, tagName: 'PHP'},
            { tagId: 2, tagName: 'Laravel'},
            { tagId: 3, tagName: 'Java'},
        ],
        'インフラ': [
            { tagId: 4, tagName: 'Linux'},
            { tagId: 5, tagName: 'CentOS'},

        ],
        '資格取得': [
            { tagId: 6, tagName: 'LPIC'},
            { tagId: 7, tagName: 'CCNA'},
        ],
    }
    //年齢制限設定
    const [ageStart, setAgeStart] = React.useState('noLimit');
    const [ageEnd, setAgeEnd] = React.useState('noLimit');
    const handleSetAgeStart = (event) => {
        setAgeStart(event.target.value)
    }
    const handleSetAgeEnd = (event) => {
        setAgeEnd(event.target.value)
    }
    const ageLimitSetttingStart = [
        {   
            id: 1,
            age: 'noLimit',
            display: '制限なし',
        },
        {
            id: 2,
            age: '10s',
            display: '10代',
        },
        {
            id: 3,
            age: '20s',
            display: '20代',
        }
    ]
    const ageLimitSetttingEnd = [
        {   
            id: 1,
            age: 'noLimit',
            display: '制限なし',
        },
        {
            id: 2,
            age: '20s',
            display: '20代',
        },
        {
            id: 3,
            age: '30s',
            display: '30代',
        },
        {
            id: 4,
            age: '40s',
            display: '40代',
        },
        {
            id: 5,
            age: '50s',
            display: '50代',
        },
        {
            id: 6,
            age: '60s',
            display: '60代',
        },
    ]
    const [numLimitOfMember, setNumLimitOfMember] = React.useState(51);
    const handleNumLimitOfMember = (event) => {
        setNumLimitOfMember(event.target.value)
    }
  return  (
    <MainContainer open={open}>
        <DrawerHeader />
        <Card>
            <CardHeader title="ルーム管理" />
            <CardContent>
                    <Box component="form">
                        <Typography>ルーム名</Typography>
                            <TextField
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                             />
                        <Typography>参加者 100人</Typography>
                        <Box display="flex" flexWrap="wrap" sx={{ pb: 2, gap: '3px' }}>
                            {/* {roomDetailValues.member.map((value) => (
                                <ListItemAvatar key={value.userId}>
                                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                        {value.userName.slice(0, 1)}
                                    </Avatar>
                                </ListItemAvatar>
                            ))} */}
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                    堀
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                    松
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                    分
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                    足
                                </Avatar>
                            </ListItemAvatar>
                        </Box>
                        <Typography>カテゴリ</Typography>
                        <Select
                            value={category}
                            onChange={handleSetCategory}
                            fullWidth
                            sx={{ mb: 2 }}
                        >
                            {categories.map((value) => (
                                <MenuItem key={value.categoryId} value={value.categoryName}>{value.categoryName}</MenuItem>
                            ))}
                        </Select>
                        <Typography>タグ選択</Typography>
                        <Select
                            multiple
                            value={tags}
                            onChange={handleSetTags}
                            MenuProps={MenuProps}
                            fullWidth
                            sx={{ mb: 2 }}
                        >
                            {tag[category].map((value) => {
                                return (
                                <MenuItem 
                                    key={value.tagId} 
                                    value={value.tagName} 
                                    style={getStyles(value, tags, theme)}
                                >
                                    {value.tagName}
                                </MenuItem>
                            )})}
                        </Select>
                        <Typography>ルーム説明</Typography>
                        <TextField
                            multiline
                            rows={3}
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <Typography>年齢制限</Typography>
                        <Stack direction="row" sx={{ mb: 2 }}>
                            <Select
                                value={ageStart}
                                onChange={handleSetAgeStart}
                            >
                                {ageLimitSetttingStart.map((value) => {
                                    return(
                                    <MenuItem 
                                        key={value.id} 
                                        value={value.age}
                                    >
                                        {value.display}
                                    </MenuItem>
                                )})}
                            </Select>
                            <Typography> 〜 </Typography>
                            <Select
                                value={ageEnd}
                                onChange={handleSetAgeEnd}
                            >
                                {ageLimitSetttingEnd.map((value) => (
                                    <MenuItem 
                                        key={value.id} 
                                        value={value.age}
                                    >
                                        {value.display}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Stack>
                        <Typography>人数制限</Typography>
                        <Select
                            value={numLimitOfMember}
                            onChange={handleNumLimitOfMember}
                            sx={{ mb: 2 }}
                        >
                            {[...Array(50)].map((_, i) => (
                                <MenuItem 
                                    key={i+2} 
                                    value={i+2} 
                                >
                                    {i+2 === 51 ? '制限なし' : i+2}
                                </MenuItem> 
                            ))}
                        </Select>
                        
                    </Box>
                    <Stack direction="row" spacing={2}>
                        <Button sx={{
                                width: '100%',
                                "@media screen and (max-width:600px)": {
                                    width: '100%',
                                },
                            }} 
                            variant="contained"
                            color="error"
                        >
                                ルーム削除
                        </Button>
                        <Button sx={{
                                width: '100%',
                                "@media screen and (max-width:600px)": {
                                    width: '100%',
                                },
                            }} variant="contained">
                                更新する
                        </Button>                      
                    </Stack>
                   
            </CardContent>
        </Card>
    </MainContainer>
    )
};