import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import { axiosClient } from "../hooks/axiosClient";
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import EditLocationIcon from '@mui/icons-material/EditLocation';

const List = () => {

  const [spots, setSpots] = useState([]);
  
  const navigate = useNavigate();

  const { accessToken } = useAuth();
  axiosClient.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
      return config
    }
  })

  useEffect(() => {
    axiosClient.get("/view")
    .then(res => {
      setSpots(res.data);
    })
    .catch(e => {
      alert("データの取得に失敗しました");
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
    { field: 'store', headerName: '店舗名', width: 300 },
    { field: 'category', headerName: 'カテゴリ', width: 150 },
    { field: 'user', headerName: '登録者', width: 150 },
    { field: 'comment', headerName: 'コメント', width: 500 },
  ]

  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        rows={spots}
        columns={columns}
        density='compact'
        autoHeight
        // onSelectionModelChange={(rowId) => {
        //   console.log(rowId);
        // }}
      />
    </div>
  )
}

export default List;