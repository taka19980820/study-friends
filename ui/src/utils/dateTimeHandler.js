

//時間表示
export const formatTime = (time) => {
    return time < 60 ? time + '分' : Math.floor(time / 60) + '時間' + (time % 60) + '分'; 
}

//日付フォーマット
export const formatDate = (date, format = 'YYYY年MM月DD日') => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    var hour = d.getHours();
    var min = d.getMinutes();
    var sec = d.getSeconds();
    switch(format) {
        case 'YYYY-MM-DD':
            return `${year}-${month}-${day}`;
        case 'YYYY年MM月DD日':
            return `${year}年${month}月${day}日`;
        case 'YYYY年MM月DD日 HH時MM分SS秒':
            return `${year}年${month}月${day}日 ${hour}時${min}分${sec}秒`;
        case 'YYYY-MM':
            return `${year}-${month}`;
    }
}