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
import { LoadingButton } from '@mui/lab';


export const ProvisionRejectDialog = ({ rejectOpen, handleRejectClose, handleReject }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


    return (
        <Dialog
            open={rejectOpen}
            onClose={handleRejectClose}
            fullScreen={fullScreen}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle>ANNULER LA DEMANDE D&apos;APPRO</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Veuillez confirmer l'annullation de la demande d&apos;appro
                </DialogContentText>
                <form id="reject-provision-form"
                    onSubmit={e => { handleReject(e) }}>
                    <TextField
                        id="outlined-multiline-static"
                        label="Raison d'annullation"
                        name="note"
                        margin="normal"
                        fullWidth
                        multiline
                        rows={2}
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button
                    // onClick={handleReject}
                    form="reject-provision-form"
                    type="submit"
                >
                    Confirmer
                </Button>
            </DialogActions>
        </Dialog>
    )

}