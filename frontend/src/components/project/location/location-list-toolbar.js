import { useState, useEffect } from 'react';
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
import { Download as DownloadIcon } from '../../../icons/download';
import { Search as SearchIcon } from '../../../icons/search';
import { Upload as UploadIcon } from '../../../icons/upload';
import { Positive as PositiveIcon } from '../../../icons/positive';


export const LocationListToolbar = (props,) => {


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
          BST SITE
        </Typography>
        <Box sx={{ m: 1 }}>
          
          <Button
            color="primary"
            variant="contained"
            href = '/project/location/add-location'
            startIcon={(<PositiveIcon />)}
          >
            Ajouter un site
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
