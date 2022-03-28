import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon, Typography
} from '@mui/material';
import { Search as SearchIcon } from '../../icons/search';
import { Upload as UploadIcon } from '../../icons/upload';
import { Download as DownloadIcon } from '../../icons/download';
import { Positive as PositiveIcon } from '../../icons/positive';

import {ProductImportDialog} from './product-import-dialog'

export const CustomerListToolbar = (props) => {

  const [open, setOpen] = useState(false);

   const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return(
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
        Articles
      </Typography>
      <Box sx={{ m: 1 }}>
        <Button
          startIcon={(<UploadIcon fontSize="small" />)}
          sx={{ mr: 1 }}
          onClick = {() => {handleClickOpen()}}
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
          href = '/products/add-product'
          startIcon={(<PositiveIcon />)}
        >
          Ajouter Article
        </Button>
      </Box>
    </Box>
    {/*<Box sx={{ mt: 3 }}>
      <Card>
        <CardContent>
          <Box sx={{ maxWidth: 500 }}>
            <TextField
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SvgIcon
                      color="action"
                      fontSize="small"
                    >
                      <SearchIcon />
                    </SvgIcon>
                  </InputAdornment>
                )
              }}
              placeholder="Rechercher"
              variant="outlined"
            />
          </Box>
        </CardContent>
      </Card>
    </Box>*/}
    <ProductImportDialog open={open} 
    handleClickOpen={handleClickOpen} 
    handleClose={handleClose}/>
  </Box>

    )
}
  
