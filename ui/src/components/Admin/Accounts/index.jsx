import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import * as RestAccess from '../../../utils/RestAccess';
import { useSnackbar } from '../../../context/SnackbarContext';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function DataTable({ accounts, deleteAccounts }) {
    // const [rows, setRows] = React.useState(accounts);
    const [selectedIds, setSelectedIds] = React.useState([]);
    const { showSnackbar } = useSnackbar();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const columns = [
        { field: 'id', headerName: 'ID', flex: 1 },
        { field: 'name', headerName: 'ユーザー名', flex: 2 },
        { field: 'email', headerName: 'メールアドレス', flex: 3},
        { 
            field: 'is_admin', 
            headerName: '権限', 
            flex: 2 ,
            renderCell: (params) => (params.value ? "管理者" : "一般ユーザー")
        }
    ];


    const handleDeleteAccounts = (e) => {
        e.preventDefault();
        deleteAccounts(selectedIds);
        setSelectedIds([]);
    }

    return (
        <>
            <Button 
                variant="contained"
                color="error" 
                onClick={e => handleDeleteAccounts(e)} 
                style={{ marginBottom: 16 }}
                disabled={selectedIds.length == 0}
            >
                選択したアカウントを削除
            </Button>
            <div style={{ height: 400, flex: '100%', overflowX: 'scroll' }}>
                <DataGrid
                    rows={accounts}
                    columns={columns}
                    pageSize={5}
                    checkboxSelection
                    onRowSelectionModelChange={(newSelection) => {
                        setSelectedIds(newSelection);
                    }}
                    isRowSelectable={(params) => !params.row.is_admin}
                />
            </div>
        </>
    );
}