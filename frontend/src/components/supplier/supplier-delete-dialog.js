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
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';


export const SupplierDeleteDialog = ({open, handleDeleteOpen, handleClose, handleDeleteSupplier}) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


    return(
        <Dialog 
            open={open} 
            onClose={handleClose}
            fullScreen={fullScreen}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle>SUPPRESSION DU FOURNISSEUR</DialogTitle>
            <DialogContent>   
                <DialogContentText>
                    Voulez vous supprimer ce fournisseur?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Annuler</Button>
                <Button onClick={handleDeleteSupplier}>Supprimer</Button>
            </DialogActions>
        </Dialog>
    )

}