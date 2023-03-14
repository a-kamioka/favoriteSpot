import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import { axiosClient } from "../hooks/axiosClient";
import { Box, Backdrop, CircularProgress } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import EditLocationIcon from '@mui/icons-material/EditLocation';

const List = () => {

  const [spots, setSpots] = useState([]);
  const [isLoading, setIsLoading] = useState([]);
  
  const navigate = useNavigate();

  const { accessToken } = useAuth();
  axiosClient.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
      return config
    }
  })

  useEffect(() => {
    setIsLoading(true);
    axiosClient.get("/view")
    .then(res => {
      setSpots(res.data);
    })
    .catch(e => {
      alert("データの取得に失敗しました");
    })
    .finally(()  => {
      setIsLoading(false)
    })
  }, []);

  const goToSpot = ((id) => {
    let targetSpot = spots.filter((spot) => {
      return spot.id === id;
    });
    navigate('/view', { state: { position: targetSpot[0]['location'] } });
  });

  const columns = [
    {
      field: 'actions',
      type: 'actions',
      width: 30,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditLocationIcon />}
          label="goSpot"
          onClick={() => goToSpot(params.id)}
        />
      ]
    },
    // { field: 'id', headerName: 'ID', width: 50, columnVisibility: false },
    { field: 'store', headerName: '店舗名', width: 200 },
    { field: 'category', headerName: 'カテゴリ', width: 150 },
    { field: 'user', headerName: '登録者', width: 150 },
    { field: 'comment', headerName: 'コメント', width: 500 },
  ]

  return (
    <Box sx={{ width: '100%', minHeight: '100%' }}>
      <DataGrid
        rows={spots}
        columns={columns}
        density='compact'
        autoHeight
        // onSelectionModelChange={(rowId) => {
        //   console.log(rowId);
        // }}
      />
      <Backdrop
        sx={{ color: '#fff', zIndex: 10 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  )
}

export default List;