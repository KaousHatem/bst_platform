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
import { Download as DownloadIcon } from '../../icons/download';
import { Search as SearchIcon } from '../../icons/search';
import { Upload as UploadIcon } from '../../icons/upload';
import { Positive as PositiveIcon } from '../../icons/positive';
import FilterAltIcon from '@mui/icons-material/FilterAlt';


export const ProvisionListToolbar = (props,) => {

 


  return (    
    <Box {...props}>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          m: -1
        }}
      >
        <Typography
          sx={{ m: 1 }}
          variant="h4"
        >
          DEMANDE D`&apos;`APPRO
        </Typography>
        <Box sx={{ m: 1 }}>
          <Button
            startIcon={(<UploadIcon fontSize="small" />)}
            sx={{ mr: 1 }}
          >
            Importer
          </Button>
          <Button
            startIcon={(<DownloadIcon fontSize="small" />)}
            sx={{ mr: 1 }}
          >
            Exporter
          </Button>
          <Button
            color="primary"
            variant="contained"
            href = '/provision/add-provision'
            startIcon={(<PositiveIcon />)}
          >
            Ajouter demande d`&apos;`appro
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
  