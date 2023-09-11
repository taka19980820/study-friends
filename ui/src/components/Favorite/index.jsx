import React from 'react';
import Typography from '@mui/joy/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/joy/IconButton';
import * as RestAccess from '../../utils/RestAccess';


export default function Favorite(props) {
    const [ favFlag, setFavFlag ] = React.useState(props.isLiked);
    const [ favorites, setFavorites ] = React.useState([...props.favorites]);

    const handleFavorite = async () => {
        //apiと通信していいね追加または、削除。
        if(!favFlag) {
            const response = await RestAccess.post('study-logs/' + props.logId + '/like');
            if(response.status = 200) {
                setFavorites([...favorites, response.data]);
                setFavFlag(!favFlag);
            } else {
                showSnackbar('エラー');
            }
        } else {
            const response = await RestAccess.del('study-logs/' + props.logId + '/unlike');
            if(response.status = 200) {
                setFavorites([...response.data]);
                setFavFlag(!favFlag);
            } else {
                showSnackbar('エラー');
            }
        }
        
    };

  
  return  (
    <>
        <IconButton 
            aria-label="add to favorites" 
            sx={favFlag ? { color: 'red'} : {color: 'text.secondary'}}
            onClick={handleFavorite}
        >
            <FavoriteIcon />
        </IconButton>
        <Typography variant="caption">
            いいね{favorites.length}件
        </Typography>
    </>
    )
};