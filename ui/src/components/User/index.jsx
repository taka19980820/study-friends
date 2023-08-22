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
import Logs from '../Log'
import Material from '../Material/Material';
import { Bar } from 'react-chartjs-2';
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

export default function User({ open }) {
    const [value, setValue] = React.useState('1');
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    const [startDate, setStartDate] = React.useState(initialStartDate);
    const [endDate, setEndDate] = React.useState(initialEndDate);

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
        console.log(newData)
        setData(newData);
    }, []);

    //グラフ文字サイズ関連
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

  return  (
    <MainContainer open={open}>
        <DrawerHeader />
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: red[500], width: '120px', height:'120px', fontSize: '3.5rem' }} aria-label="recipe">
                堀
            </Avatar>
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
                        堀越貴也
                    </div>
                    <div style={{ marginBottom: '10px' }}>24歳/社会人</div>
                    <div style={{ textAlign: 'left' }}>堀越と申します。都内の自社開発企業でWEB開発をしています。あと副業でAV男優やってます。
                        よろしくお願いします。
                    </div>
                </div>
                <div style={{ fontWeight: 'bold', marginTop: '10px' }}>タグ</div>
                <Box display="flex" flexWrap="wrap" sx={{ pb: 2, gap: '3px' }}>
                    {/* {roomDetailValues.tags.map((value) => (
                        <Chip key={value.tagId} label={value.tagName} color="primary" />
                    ))} */}
                    <Chip label="PHP" color="primary" />
                    <Chip label="Laravel" color="primary" />
                    <Chip label="Linux" color="primary" />
                    <Chip label="CentOS" color="primary" />
                </Box>
                {/* 自分の場合 */}
                <Link href="/edituser">
                    <Button sx={{ fontWeight: 'bold' }}>プロフィール編集</Button>
                </Link>
            </CardContent>
        </Card>


        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                    <Tab label="勉強記録" value="1" />
                    <Tab label="タイムライン" value="2" />
                    <Tab label="My教材" value="3" />
                </TabList>
                </Box>

                
                {/* 勉強時間 */}
                <TabPanel value="1" sx={{ p: 0 }}>
                    <Link href="record">
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
                                {/* <div style={{ overflowX: 'scroll', width: '100%' }}>
                                    <div style={{ minWidth: '800px' }}>
                                        <Bar data={data} options={options} />
                                    </div>
                                </div> */}
                                <Box sx={{ width: '100%', height: '300px'}}>
                                    <Bar data={data} options={options} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Link>
                </TabPanel>

                <TabPanel value="2" sx={{ p: 2 }}>
                    <Logs />
                </TabPanel>

                <TabPanel value="3" sx={{ p: 0 }}>
                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        <Material />
                        <Material />
                        <Material />
                    </List>
                </TabPanel>
                
            </TabContext>
        </Box>

    </MainContainer>
    )
};