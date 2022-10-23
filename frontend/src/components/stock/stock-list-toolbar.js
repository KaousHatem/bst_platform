import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardAction,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
  Collapse,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  FormControl
} from '@mui/material';
import { Download as DownloadIcon } from '../../icons/download';
import { Search as SearchIcon } from '../../icons/search';
import { Upload as UploadIcon } from '../../icons/upload';
import { Positive as PositiveIcon } from '../../icons/positive';


export const StockListToolbar = (props,) => {
  const router  = useRouter()


  const handleClickAdd = (e) => {

    const data = {
     pathname: '/stock-init/add-stock-init',
     query:{'storeId':props.store.id}
    }
    router.push(data);
  }

  return (    
    <Box {...props}>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          m: -1,
          mb:2
        }}
      >
        <Typography
          sx={{ m: 1 }}
          variant="h4"
        >
          BST MAGASIN {props.store.name}
        </Typography>
        <Box sx={{ m: 1 }}>
          
          <Button
            color="primary"
            variant="contained"
            onClick = {(event) => {handleClickAdd(event)}}
            startIcon={(<PositiveIcon />)}
          >
            Ajouter stock article
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
