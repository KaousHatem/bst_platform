import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Grid,
  InputLabel,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,

} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import SaveIcon from '@mui/icons-material/Save';

import ProductProvider from '../../services/product-provider'


export const ProductImportDialog = ({open,  handleClickOpen, handleClose}) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [selectedFile, setSelectedFile] = useState();
    const [isSelected, setIsSelected] = useState(false);

    const [loading, setLoading] = useState(false);

    const onChangeHandler = (event) => {
        setSelectedFile(event.target.files[0]);
        setIsSelected(true);
    }

    const handleSubmission = (e) => {
        setLoading(true);
        ProductProvider.addBulkProduct(selectedFile).then(
            (response) => {
              console.log(response.data)
              if(response){
                  handleClose(e)
                  setLoading(false);
                  setIsSelected(false);
                  setSelectedFile(null);
              }
            },
            error => {
              const resMessage =
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString();
                handleClose(e)
              console.log(resMessage)
            }
          )
        
    }

    return(
        <Dialog 
            open={open} 
            onClose={handleClose}
            fullScreen={fullScreen}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle>IMPORTER ARTICLE</DialogTitle>
            <DialogContent>   
                <DialogContentText>
                    
                    {isSelected ? (
                        <Box>
                            <Typography>{selectedFile.name}</Typography>
                        </Box>
                    ) : (
                        <Typography>Selectionner La list des articles</Typography>
                    )}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <InputLabel>
                    <input
                        id="btn-upload"
                        name="btn-upload"
                        style={{ display: 'none' }}
                        type="file"
                        onChange = {onChangeHandler}
                    />
                    <Button
                    component="span" >
                        Choisir le fichier
                    </Button>
                </InputLabel>
                <LoadingButton
                  loading={loading}
                  onClick={handleSubmission}
                  // loadingIndicator="En cour"
                  // loadingPosition="end"
                >
                  Submit
                </LoadingButton>
                
            </DialogActions>
        </Dialog>
    )

}