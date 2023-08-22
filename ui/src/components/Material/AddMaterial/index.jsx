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

import Autocomplete from '@mui/material/Autocomplete';

import TagManager from '../../Tag/TagManager';


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


export default function AddMaterial({ open }) {
    const {
        control,
        handleSubmit,
      } = useForm();
    
      const onSubmit = (data) => {
        console.log(data);
    };

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
    const tagSet = [
        { tagId: 1, tagName: 'PHP'},
        { tagId: 2, tagName: 'Laravel'},
        { tagId: 3, tagName: 'Java'},
        { tagId: 4, tagName: 'Linux'},
        { tagId: 5, tagName: 'CentOS'},
        { tagId: 6, tagName: 'LPIC'},
        { tagId: 7, tagName: 'CCNA'},
    ]

    React.useEffect(() => {
        setTags([...tagSet])
    }, [])
    

  return  (
    <MainContainer open={open}>
        <DrawerHeader />
        <Card>
            <CardHeader title="教材登録" />
            <CardContent>
                    <Box component="form">
                        <Typography>教材名</Typography>
                            <TextField
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                             />                        
                        <Typography>タグ(複数選択可)</Typography>
                        <TagManager suggestions={['React', 'MUI', 'JavaScript', 'PHP']}/>
                        {/* <Select
                            multiple
                            value={tags}
                            onChange={handleSetTags}
                            MenuProps={MenuProps}
                            fullWidth
                            sx={{ mb: 2 }}
                        >
                            {tags.map((value) => {
                                return (
                                <MenuItem 
                                    key={value.tagId} 
                                    value={value.tagName} 
                                    style={getStyles(value, tags, theme)}
                                >
                                    {value.tagName}
                                </MenuItem>
                            )})} */}
                        {/* </Select> */}
                        <Typography>教材説明</Typography>
                        <TextField
                            multiline
                            rows={3}
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <Typography>著者名(任意)</Typography>
                        <TextField
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <Typography>ページ数(任意)</Typography>
                        <TextField
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <Typography>出版社(任意)</Typography>
                        <TextField
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <Typography>URL(任意)</Typography>
                        <TextField
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                    </Box>
                    <Button sx={{
                            width: '100%',
                            "@media screen and (max-width:600px)": {
                                width: '100%',
                            },
                        }} variant="contained">
                            教材を登録する
                        </Button>
            </CardContent>
        </Card>
    </MainContainer>
    )
};