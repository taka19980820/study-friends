// Main.js
import React from 'react';
import { styled } from '@mui/material/styles';
// import Typography from '@mui/material/Typography';
import Typography from '@mui/joy/Typography';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
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
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import DeleteIcon from '@mui/icons-material/Delete';
import Delete from '@mui/icons-material/Delete';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import IconButton from '@mui/joy/IconButton';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


import { Person, Circle } from '@mui/icons-material';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import PersonIcon from '@mui/icons-material/Person';
import ListItemButton from '@mui/material/ListItemButton';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

import Link from 'next/link'
import MuiLink from '@mui/material/Link';

import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import SearchBar from '../../Search/KeyWordSearch';
import TagManager from '../../Tag/TagManager';

import Material from '../Material';


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


export default function Materials({ open }) {
    //検索欄開閉
    const [searchContainerExpanded, setSearchContainerExpanded] = React.useState(false);
    const handleSearchContainer = () => {
        setSearchContainerExpanded(!searchContainerExpanded);
    };

    //検索欄のタブ切り替え
    const [value, setValue] = React.useState('1');
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    const searchData = ['Apple', 'Banana', 'Cherry', 'Date', 'Fig', 'Grape', 'Honeydew', 'PHP', 'Laravel', 'Python', 'PHPの教科書'];

  return  (
    <MainContainer open={open}>
        <DrawerHeader />
        <h2>教材一覧</h2>
        <Button onClick={handleSearchContainer} variant="text" sx={{ fontSize: '1.2rem' }}>教材検索</Button>
        <Collapse in={searchContainerExpanded} timeout="auto" unmountOnExit>
            {/* <CardContent>                 */}
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                    <Tab label="キーワード検索" value="1" />
                    <Tab label="タグ検索" value="2" />
                </TabList>
                </Box>

                <TabPanel value="1" sx={{ p: 0 }}>
                    <SearchBar data={searchData} />
                </TabPanel>

                <TabPanel value="2" sx={{ p: 2 }}>
                    <TagManager suggestions={searchData} />
                </TabPanel>
                
            </TabContext>
            {/* </CardContent> */}
        </Collapse>

        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <Material />
            <Material />
            <Material />
        </List>

        <Link href="/addmaterial">
            <Fab 
                sx={{ 
                    position: 'fixed',
                    bottom: '16px',
                    right: '16px',
                    p: 3,
                }}
                variant="extended" 
                size="small" 
                color="primary"
            >
                <AddIcon sx={{ mr: 1 }} />
                教材登録
            </Fab>       
        </Link>        

    </MainContainer>
    )
};