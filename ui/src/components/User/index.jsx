// Main.js
import React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/joy/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Link from 'next/link'
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import List from '@mui/joy/List';
import Log from '../Log/Log'
import MyMaterial from '../Material/MyMaterial';
import { Bar } from 'react-chartjs-2';
import * as RestAccess from '../../utils/RestAccess'
import * as dateTimeHandler from '../../utils/dateTimeHandler'
import { useContext } from 'react';
import { AuthContext } from '../../context/Auth/AuthContext';
import { useSnackbar } from '../../context/SnackbarContext';
import CategoryEditDialog from '../Category/CategoryEditDialog'



import { Chart, registerables} from 'chart.js';
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(...registerables, ChartDataLabels);

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

const initialEndDate = new Date();
const initialStartDate = new Date();
initialStartDate.setDate(initialEndDate.getDate() - 6); 

export default function User({ open, userId }) {
    const { showSnackbar } = useSnackbar();
    const { authUser } = useContext(AuthContext);
    const [value, setValue] = React.useState('1');

    const [fontSize, setFontSize] = React.useState(14);

    const [ user, setUser ] = React.useState({});

    const [ studyTime, setStudyTime ] = React.useState({});

    const [ studyLogs, setStudyLogs ] = React.useState([]);

    const [ materials, setMaterials ] = React.useState([]);

    const [ display, setDisplay ] = React.useState(false);

    const [startDate, setStartDate] = React.useState(initialStartDate);
    const [endDate, setEndDate] = React.useState(initialEndDate);

 
    const [data, setData] = React.useState({
        labels:[],
        datasets:[]
    });
 
    //効率悪いと思う
    React.useEffect(() => {
        const getAllData = async () => {
            //ユーザーデータ取得
            const userRes = await RestAccess.get('/users/' + userId);
            const studyTimeRes = await RestAccess.get('/users/' + userId + '/study-hours');
            //勉強時間（グラフ用データ）
            const studyTimeDataSet = await RestAccess.get('/users/' + userId + '/study-hours/daily');
            //勉強ログ
            const logRes = await RestAccess.get('/users/' + userId + '/study-logs');
            //My教材
            const materialsRes = await RestAccess.get('/users/' + userId + '/materials');
            if(userRes.status === 200 && studyTimeRes.status === 200 && studyTimeDataSet.status === 200 && logRes.status === 200 && materialsRes.status === 200) {
                //グラフ用データ作成
                const newData = {};
                const lastWeekDates = getLastWeekDates(endDate);
                newData.datasets = [...studyTimeDataSet.data];
                newData.labels = lastWeekDates;
                setUser((prev) => ({...prev, ...userRes.data}));
                setStudyTime(studyTimeRes.data);
                setData(newData);
                setStudyLogs(logRes.data);
                setMaterials(materialsRes.data);
                if(!display) {
                    setDisplay(true);
                }
            }
        }
        getAllData();
    }, [value, userId])

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

    React.useEffect(() => {
        //グラフ文字サイズ関連
        const updateFontSize = () => {
            const width = window.innerWidth;
            setFontSize(width < 480 ? 8 : 12);
        };
        // 初回レンダリング時にフォントサイズを更新
        updateFontSize();
        // ウィンドウのリサイズ時にフォントサイズを更新
        window.addEventListener('resize', updateFontSize);
        

        // クリーンアップ関数
        return () => {
            window.removeEventListener('resize', updateFontSize);
        };
    }, []);




    
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    //日付のフォーマット
    const formatDate = (date, format = 'YYYYMMDD') => {
        const year = date.getFullYear();
        // getMonth() は 0 から始まるため、1 を加算
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const options = {};
        switch(format) {
            case 'MMDD':
                return `${month}/${day}`;
            case 'YYYYMM':
                return `${year}/${month}`;
            default:
                return `${year}/${month}/${day}`;
        }
    };

    const options = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          x: {
            stacked: true,
            ticks: {
                fontSize: fontSize
            }
          },
          y: {
            beginAtZero: true,
            stacked: true,
            // max: maxYValue + (0.1 * maxYValue),
            ticks: {
              display: false,
            }
            
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: function() {
                return '';
              },
              label: function (context) {
                const label = context.dataset.label;
                if(label === 'Total') {
                    return '';
                }
                const value = context.raw;
                if (value < 60) {
                  return label + ': ' + value + '分';
                } else {
                  const hours = Math.floor(value / 60);
                  const minutes = value % 60;
                  return label + ': ' + hours + '時間' + minutes + '分';
                }
              },
            },
          },
          datalabels: {
            display: function(context) {
                return context.datasetIndex === context.chart.data.datasets.length - 1; // 最後のデータセットのみ表示
            },
            formatter: function(value, context) {
                let total = 0;
                for (let dataset of context.chart.data.datasets) {
                    total += dataset.data[context.dataIndex];
                }
                return total < 60 ? total + 'm' : Math.floor(total / 60) + 'h' + (total % 60) + 'm'; 
            },
            color: '#000',
            align: 'end',
            anchor: 'end',
            offset: -9,
            font: {
                size: fontSize
            }
          },
        },
    }

    

    //一週間分の日付取得
    function getLastWeekDates(date) {
        let dates = [];
        for (let i = 6; i >= 0; i--) {
            let tempDate = new Date(date);
            tempDate.setDate(date.getDate() - i);
            
            // 日付のみを取得するために、時、分、秒、ミリ秒を0にリセット
            tempDate.setHours(0, 0, 0, 0);
            
            dates.push(formatDate(tempDate, 'MMDD'));
        }
        return dates;
    }

    const renderJob = (job) => {
        switch(job) {
            case 0:
                return '';
            case 1:
                return '社会人';
            case 2:
                return '学生';
            case 3:
                return 'その他';
        }
    }

    //My教材から削除コールバック
    const removeMaterial = async (materialId) => {
        const response = await RestAccess.del('/users/' + authUser.id + '/materials/' + materialId + '/remove');
        if(response.status === 200) {
            setMaterials(materials.filter(material => material.material_id != materialId));
            showSnackbar('My教材から削除しました');
        } else {
            showSnackbar('エラーが発生しました', 'error');
        }
    }

    //勉強ログ削除コールバック
    const deleteLog = async (logId) => {
        const response = await RestAccess.del('study-logs/' + logId);
        if(response.status == 200) {
            showSnackbar('削除しました。')
            const newLogs = await RestAccess.get('/users/' + userId + '/study-logs'); 
            setStudyLogs(newLogs.data);
        }  else {
            showSnackbar('削除できませんでした', 'error');
        }
      }

      
    const [ categoryEditDialogFlag, setCategoryEditDialogFlag ] = React.useState(false);

    const addCategory = async (newCategory) => {
        const response = await RestAccess.post('/categories', newCategory, {
            'Content-Type': 'application/json'
        });
        if(response.status == 200) {
            setCategories(prev => [...prev, response.data]);
            showSnackbar('カテゴリを追加しました')
        } else {
            showSnackbar('エラーが発生しました', 'error');
        }
    }

    const editCategory = async (categoryId, updatedCategory) => {
        const response = await RestAccess.put('/categories/' + categoryId + '/edit', updatedCategory, {
            'Content-Type': 'application/json'
        });
        if(response.status == 200) {
            setCategories(categories.map(category => category.id === categoryId ? {...category, ...updatedCategory} : category));
            showSnackbar('更新しました。')
        } else {
            showSnackbar('エラーが発生しました', 'error');
        }
    }

    const deleteCategory = async (categoryId) => {
        const response = await RestAccess.del('/categories/' + categoryId + '/remove');
        if(response.status == 200) {
            setCategories(categories.filter(category => category.id !== categoryId));
            showSnackbar('カテゴリを削除しました')
        } else {
            showSnackbar('エラーが発生しました', 'error');
        }
    }
    

    const categoryDialogClose = () => {
        setCategoryEditDialogFlag(false);
    }
        
    if (!display) {
        return null;
    }
  return  (
    <MainContainer open={open}>
        <DrawerHeader />
        <React.Fragment>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                {user.profileimg != null ?
                    <Avatar
                        alt={user.name.slice(0, 1)}
                        src={process.env.NEXT_PUBLIC_API_ENDPOINT + '/' + user.profileimg}
                        sx={{ width: '120px', height:'120px', fontSize: '3.5rem' }}
                        aria-label="recipe"
                    />
                    :
                    <Avatar sx={{ bgcolor: red[500], width: '120px', height:'120px', fontSize: '3.5rem' }} aria-label="recipe">
                        {user.name.slice(0, 1)}
                    </Avatar>
                }
            </Box>

            <Card>
                <CardContent>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            marginBottom: '10px'
                        }}
                        >
                            {user.name}
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            {user.age != null && user.age + '歳'}
                            {(user.age != null && (user.occupation != null && user.occupation != 0)) && '/'}
                            {user.occupation != null && renderJob(user.occupation)}
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            {user.introduction != null && user.introduction}
                        </div>
                    </div>
                    <div style={{ fontWeight: 'bold', marginTop: '10px' }}>タグ</div>
                    <Box display="flex" flexWrap="wrap" sx={{ pb: 2, gap: '3px' }}>
                        {user.tags.length > 0 && 
                            user.tags.map((value) => (
                                <Chip key={value.id} label={value.tag_name} color="primary" />
                            ))
                        }
                    </Box>
                    {/* 自分の場合 */}
                    {authUser.id == user.id && 
                        <>
                            <Link href={'/users/edit'} >
                                <Button sx={{ fontWeight: 'bold' }}>プロフィール編集</Button>
                            </Link>
                            <Button onClick={() => setCategoryEditDialogFlag(true)} sx={{ fontWeight: 'bold' }}>カテゴリ編集</Button>
                        </>
                    }
                </CardContent>
            </Card>


            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="勉強記録" value='1' />
                        <Tab label="タイムライン" value='2' />
                        <Tab label="My教材" value='3' />
                    </TabList>
                    </Box>

                    
                    {/* 勉強時間 */}
                    <TabPanel value='1' sx={{ p: 0 }}>
                        <Link href={user.id + "/record"}>
                            <Card>
                                <CardContent>
                                    <Grid container sx={{ justifyContent: 'space-around' }}>
                                        <Grid item xs={4} sx={{ textAlign: 'center' }}>
                                            <Box>
                                                <Typography>今日</Typography>
                                                <Typography>{dateTimeHandler.formatTime(studyTime.today_hours)}</Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={4} sx={{ textAlign: 'center' }}>
                                            <Box>
                                                <Typography>今月</Typography>
                                                <Typography>{dateTimeHandler.formatTime(studyTime.month_hours)}</Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={4} sx={{ textAlign: 'center' }}>
                                            <Box>
                                                <Typography>総合</Typography>
                                                <Typography>{dateTimeHandler.formatTime(studyTime.totalHours)}</Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>

                                    <Box sx={{ width: '100%', height: '300px'}}>
                                        <Bar data={data} options={options} />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Link>
                    </TabPanel>

                    {/* 勉強ログ */}
                    <TabPanel value='2' sx={{ p: 2 }}>
                    {studyLogs ? 
                        studyLogs.map((value) => {
                            return <Log key={value.id} logData={value} isLiked={value.is_liked} callback={deleteLog}/>
                        })
                        :
                        <h3>勉強記録が投稿されていません</h3>
                    }
                    </TabPanel>

                    {/* My教材 */}
                    <TabPanel value='3' sx={{ p: 0 }}>
                        <List sx={{ mt: 2, width: '100%', bgcolor: 'background.paper' }}>
                            {materials.length > 0 && 
                                materials.map((value) => {
                                    return (
                                        <MyMaterial removeMaterial={removeMaterial} categories={categories} key={value.id} materialData={value} isLiked={value.is_liked}/>
                                    )
                                })
                            }
                        </List>
                    </TabPanel>
                    
                </TabContext>
            </Box>
        </React.Fragment>
        <CategoryEditDialog open={categoryEditDialogFlag} addCategory={addCategory} editCategory={editCategory} deleteCategory={deleteCategory} categories={categories} categoryDialogClose={categoryDialogClose}/>
    </MainContainer>
    )
};