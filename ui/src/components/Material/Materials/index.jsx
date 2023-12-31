import React from 'react';
import Typography from '@mui/joy/Typography';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import List from '@mui/joy/List';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link'
import TagManager from '../../Tag/TagManager';
import Material from '../Material';
import * as RestAccess from '../../../utils/RestAccess';
import { AuthContext } from '../../../context/Auth/AuthContext';
import { useSnackbar } from '../../../context/SnackbarContext';


export default function Materials() {
    const { authUser } = React.useContext(AuthContext);
    const { showSnackbar } = useSnackbar();
    //検索欄開閉
    const [searchContainerExpanded, setSearchContainerExpanded] = React.useState(false);
    const handleSearchContainer = () => {
        setSearchContainerExpanded(!searchContainerExpanded);
    };
    const [ materials, setMaterials ] = React.useState([]);
    const [ display, setDisplay ] = React.useState(false);

    React.useEffect(() => {
      const getAllData = async () => {
          //教材取得
          const materials = await RestAccess.get('/materials');

          if(materials.status == 200) {
              setMaterials(materials.data);
              setDisplay(true);
          } else {
              showSnackbar('エラーが発生しました', 'error');
          }
      }
      getAllData();
    }, []);


    //カテゴリー取得
    const [ categories, setCategories ] = React.useState([]);
    const getCategories = async () => {
        const response = await RestAccess.get('/users/' + authUser.id + '/categories');
        if(response.status === 200) {
            setCategories(prev => [...prev, ...response.data]);
        } else {
            showSnackbar('エラーが発生しました', 'error');
        }
    }
    React.useEffect(() => {
        getCategories();
    }, [])

    const searchMaterials = async (tags) => {
        let response = null;
        if(tags.length > 0) {
            response = await RestAccess.get('/materials', {
                params: {
                    tags: tags.join(",")
                }
            })
        } else {
            response = await RestAccess.get('/materials')
        }
        
        if(response.status == 200) {
            setMaterials(response.data);
        } else {
            showSnackbar('教材の取得に失敗しました', 'error')
        }
    }



  return  (
    <>
        <h2>教材一覧</h2>
        { display && 
        <>
          <Button onClick={handleSearchContainer} variant="text" sx={{ fontSize: '1.2rem' }}>教材検索</Button>
          <Collapse in={searchContainerExpanded} timeout="auto" unmountOnExit>
              <Box>
                  <TagManager callBack={searchMaterials}/>
              </Box>
          </Collapse>

          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {materials.length > 0 ? 
                  materials.map((value) => {
                      return (
                          <Material key={value.id} categories={categories} materialData={value} isLiked={value.is_liked} isRegisterd={value.is_registerd}/>
                      )
                  })
                  :
                  <Typography>教材が見つかりませんでした</Typography>
              }
          </List>

          <Link href="/materials/register">
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
        </>      
        }
    </>
    )
};