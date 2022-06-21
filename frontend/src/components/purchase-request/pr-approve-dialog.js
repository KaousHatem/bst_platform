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


export const PRApproveDialog = ({approveOpen, handleApproveOpen, handleApproveClose, handleApprovePurchaseRequest}) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


    return(
        <Dialog 
            open={approveOpen} 
            onClose={handleApproveClose}
            fullScreen={fullScreen}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle>APPROVER L`&apos;`ACHAT</DialogTitle>
            <DialogContent>   
                <DialogContentText>
                    Voulez vous approver cette demande d`&apos;`achat?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleApproveClose}>Annuler</Button>
                <Button onClick={handleApprovePurchaseRequest}>Approver</Button>
            </DialogActions>
        </Dialog>
    )

}