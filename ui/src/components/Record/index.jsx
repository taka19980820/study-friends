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

import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import Logs from '../Log'

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { Bar } from 'react-chartjs-2';
import { Chart, registerables} from 'chart.js';
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(...registerables, ChartDataLabels);

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

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
        // maxWidth: '100%', // Ensure the content doesn't exceed screen width
        // margin: '0 auto', // Center content horizontally
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

export default function Record({ open }) {
    const [data, setData] = React.useState({
        labels: [],
        datasets: [
            {
              label: 'PHP',
              data: [260, 50, 30, 75, 120, 90, 150], // それぞれの日付に対応する時間データ
              // backgroundColor: 'rgba(75, 192, 192, 0.6)',
              // borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: '#888',
              borderColor: '#888',
              borderWidth: 1,
            },
            {
              label: 'LPIC',
              data: [260, 50, 30, 75, 120, 90, 150], // それぞれの日付に対応する時間データ
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
      
              borderWidth: 1,
            },
            {
              label: 'CCNA',
              data: [260, 50, 30, 75, 120, 90, 150], // それぞれの日付に対応する時間データ
              backgroundColor: 'rgba(75, 12, 192, 0.6)',
              borderColor: 'rgba(75, 12, 192, 1)',
      
              borderWidth: 1,
            },
            {
              label: 'Laravel',
              data: [260, 50, 30, 75, 120, 90, 150], // それぞれの日付に対応する時間データ
              backgroundColor: 'rgba(7, 192, 192, 0.6)',
              borderColor: 'rgba(7, 192, 192, 1)',
      
              borderWidth: 1,
            },
            {
              label: 'Python',
              data: [1260, 1350, 630, 575, 1120, 1190, 1150], // それぞれの日付に対応する時間データ
              backgroundColor: 'rgba(75, 192, 19, 0.6)',
              borderColor: 'rgba(75, 192, 19, 1)',
      
              borderWidth: 1,
            },
          ],
    });
    React.useEffect(() => {
        const lastWeekDates = getLastWeekDates(endDate);
        const newData = {...data};
        newData.labels = lastWeekDates;
        setData(newData);
    }, []);

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

    //過去7週を取得
    const getLastSevenWeekDates = (date) => {
        let dates = [];
        for(let i = 0; i < 7; i++) {
            let addDate = 7 * i;
            let tempDate = new Date(date);
            tempDate.setDate(date.getDate() + addDate);
            // 日付のみを取得するために、時、分、秒、ミリ秒を0にリセット
            tempDate.setHours(0, 0, 0, 0);
            dates.push(formatDate(tempDate, 'MMDD'));
        }
        console.log(dates)
        return dates;
    }

    //過去半年の年月を取得
    const getLastHaflYearMonth = (date) => {
        console.log(date)
        let yearMonths = [];
        for(let i = 0; i < 7; i++) {
            let tempDate = new Date(date);
            tempDate.setMonth(tempDate.getMonth() + i)
            yearMonths.push(formatDate(tempDate, 'YYYYMM'));
        }
        return yearMonths;
    }

    const [value, setValue] = React.useState('1');
    const handleChange = (event, newValue) => {
        const newStartDate = new Date();
        const newEndDate = new Date();
        const newData = {...data};
        switch(newValue) {
            case '1':
                //日別表示
                newStartDate.setDate(newEndDate.getDate() - 6)
                newData.labels = getLastWeekDates(newEndDate);

                setData(newData);
                setStartDate(newStartDate)
                setEndDate(newEndDate)
                break;
                
                break;
            case '2':
                //週別表示
                const startOfWeek = getStartOfWeek(new Date());
                const endOfWeek = getEndOfWeek(new Date());
                newStartDate.setDate(startOfWeek.getDate() - 42);

                newData.labels = getLastSevenWeekDates(newStartDate);

                setData(newData);
                setStartDate(newStartDate);
                setEndDate(endOfWeek);
                break;
            case '3':
                //月別表示
                
                const startOfMonth = getStartOfMonth(newEndDate);
                const sixMonthAgo = new Date(startOfMonth);
                sixMonthAgo.setMonth(startOfMonth.getMonth() - 6);
                

                newData.labels = getLastHaflYearMonth(sixMonthAgo);

                setData(newData);
                setStartDate(sixMonthAgo);
                setEndDate(startOfMonth);
                break;
        }
        setValue(newValue);
    };

    //日付選択
    const [startDate, setStartDate] = React.useState(initialStartDate);
    const [endDate, setEndDate] = React.useState(initialEndDate);

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

    //現在の日付から週の初めを取得する
    function getStartOfWeek(date) {
        let dayOfWeek = date.getDay(); // 0 (Sunday) - 6 (Saturday)
        let offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 日曜日の場合は6, それ以外はdayOfWeek - 1
        let startDate = new Date(date);
        startDate.setDate(date.getDate() - offset);
        startDate.setHours(0, 0, 0, 0); // ゼロ時間に設定する
        return startDate;
    }

    function getEndOfWeek(date) {
        let dayOfWeek = date.getDay(); // 0 (Sunday) - 6 (Saturday)
        let offset = dayOfWeek === 0 ? 0 : 7 - dayOfWeek; // 日曜日の場合は0, それ以外は7 - dayOfWeek
        let endDate = new Date(date);
        endDate.setDate(date.getDate() + offset);
        endDate.setHours(23, 59, 59, 999); // 23時59分59秒999ミリ秒に設定する
        return endDate;
    }

    //現在の日付から 月初めを取得する
    function getStartOfMonth(date) {
        let newDate = new Date(date);
        newDate.setDate(1);
        return newDate;
    }

    const handlePrevMonth = () => {
        const newStartDate = new Date(startDate);
        const newEndDate = new Date(endDate);
        newStartDate.setMonth(startDate.getMonth() - 1);
        newEndDate.setMonth(endDate.getMonth() - 1);

        const newData = {...data};
        newData.labels = getLastHaflYearMonth(newStartDate);

        setData(newData);
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    }

    const handleNextMonth = () => {
        const newStartDate = new Date(startDate);
        const newEndDate = new Date(endDate);
        newStartDate.setMonth(startDate.getMonth() + 1);
        newEndDate.setMonth(endDate.getMonth() + 1);

        const newData = {...data};
        newData.labels = getLastHaflYearMonth(newStartDate);

        setData(newData);
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    }
    
    
    const handlePrevWeek = () => {
        const newEndDate = new Date(endDate);
        newEndDate.setDate(endDate.getDate() - 7);
        const startOfWeek = getStartOfWeek(newEndDate);
        const newStartDate = new Date(startOfWeek);
        newStartDate.setDate(startOfWeek.getDate() - 7 * 6);

        const newData = {...data};
        newData.labels = getLastSevenWeekDates(newStartDate);

        setData(newData);
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    }

    const handleNextWeek = () => {
        const newEndDate = new Date(endDate);
        newEndDate.setDate(endDate.getDate() + 7);
        const startOfWeek = getStartOfWeek(newEndDate);
        const newStartDate = new Date(startOfWeek);
        newStartDate.setDate(startOfWeek.getDate() - 7 * 6);

        const newData = {...data};
        newData.labels = getLastSevenWeekDates(newStartDate);

        setData(newData);
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    }

    const handlePrevDate = () => {
        const newStartDate = new Date();
        const newEndDate = new Date();
        newStartDate.setDate(startDate.getDate() - 1);
        newEndDate.setDate(endDate.getDate() - 1)

        const newData = {...data};
        newData.labels = getLastWeekDates(newEndDate);

        setData(newData);
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    }

    const handleNextDate = () => {
        const newStartDate = new Date();
        const newEndDate = new Date();
        newStartDate.setDate(startDate.getDate() + 1);
        newEndDate.setDate(endDate.getDate() + 1)

        const newData = {...data};
        newData.labels = getLastWeekDates(newEndDate);

        setData(newData);
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    }

    //グラフ部分（日別）
    const [fontSize, setFontSize] = React.useState(14);

    React.useEffect(() => {
    //   const windowWidth = window.innerWidth;
    //   setFontSize(windowWidth < 480 ? 8 : 12);
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
            ticks: {
              display: false,
            }
            // max: maxYValue + (0.1 * maxYValue)
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
            offset: -4,
            font: {
                size: fontSize
            }
          },
        },
    }

  return  (
    <MainContainer open={open}>
        <DrawerHeader />
        <Card>
            <CardContent>
                <Grid container sx={{ justifyContent: 'space-around' }}>
                    <Grid item xs={4} sx={{ textAlign: 'center' }}>
                        <Box>
                            <Typography>今日</Typography>
                            <Typography>0時間</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'center' }}>
                        <Box>
                            <Typography>今月</Typography>
                            <Typography>0時間</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'center' }}>
                        <Box>
                            <Typography>総合</Typography>
                            <Typography>0時間</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>

        
        <Box sx={{ width: '100%', typography: 'body1', mt: 2 }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                    <Tab label="日" value="1" />
                    <Tab label="週" value="2" />
                    <Tab label="月" value="3" />
                </TabList>
                </Box>

                
                {/* 勉強時間 */}
                <TabPanel value="1" sx={{ p: 0 }}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" sx={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Button onClick={handlePrevDate}>
                                    <ChevronLeftIcon />
                                </Button>
                               <Typography>{formatDate(startDate) + ' 〜 ' + formatDate(endDate)}</Typography>
                               <Button onClick={handleNextDate}>
                                    <ChevronRightIcon />
                               </Button>
                            </Stack>
                                <Box sx={{ width: '100%', height: '300px'}}>
                                    <Bar data={data} options={options} />
                                </Box>
                            
                            {/* <Bar data={data} options={options} /> */}
                        </CardContent>
                    </Card>                       
                </TabPanel>

                <TabPanel value="2" sx={{ p: 2 }}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" sx={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Button onClick={handlePrevWeek}>
                                    <ChevronLeftIcon />
                                </Button>
                               <Typography>{formatDate(startDate) + ' 〜 ' + formatDate(endDate)}</Typography>
                               <Button onClick={handleNextWeek}>
                                    <ChevronRightIcon />
                               </Button>
                            </Stack>
                                <Box sx={{ width: '100%', height: '300px'}}>
                                    <Bar data={data} options={options} />
                                </Box>
                            {/* <Bar data={data} options={options} /> */}
                        </CardContent>
                    </Card>
                </TabPanel>

                <TabPanel value="3" sx={{ p: 0 }}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" sx={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Button onClick={handlePrevMonth}>
                                    <ChevronLeftIcon />
                                </Button>
                               <Typography>{formatDate(startDate, 'YYYYMM') + ' 〜 ' + formatDate(endDate, 'YYYYMM')}</Typography>
                               <Button onClick={handleNextMonth}>
                                    <ChevronRightIcon />
                               </Button>
                            </Stack>
                                <Box sx={{ width: '100%', height: '300px'}}>
                                    <Bar data={data} options={options} />
                                </Box>
                            {/* <Bar data={data} options={options} /> */}
                        </CardContent>
                    </Card>             
                </TabPanel>
                
            </TabContext>
        </Box>

    </MainContainer>
    )
};