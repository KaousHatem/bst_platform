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


export const ProvisionDeleteDialog = ({open, handleDeleteOpen, handleClose, handleDeleteProvision}) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


    return(
        <Dialog 
            open={open} 
            onClose={handleClose}
            fullScreen={fullScreen}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle>SUPPRESSION D&apos;APPRO</DialogTitle>
            <DialogContent>   
                <DialogContentText>
                    Voulez vous supprimer cette demande d&apos;appro?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Annuler</Button>
                <Button onClick={handleDeleteProvision}>Supprimer</Button>
            </DialogActions>
        </Dialog>
    )

}