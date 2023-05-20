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


export const TransferUploadDialog = ({ uploadOpen, handleUploadOpen, handleUploadClose, handleSelectFile, handleOnSubmit, loading, isSelected }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


    return (
        <Dialog
            open={uploadOpen}
            onClose={handleUploadClose}
            fullScreen={fullScreen}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle>AJOUTER LE DOCUMENT BON DE TRANSFERT</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Veuillez ajouter le bon de transfert reçu
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <InputLabel>
                    <input
                        id="btn-upload"
                        name="btn-upload"
                        style={{ display: 'none' }}
                        type="file"
                        accept=".jpg,.png,application/pdf"
                        onChange={(e) => { handleSelectFile(e) }}
                    />
                    <Button
                        component="span" >
                        Choisir le fichier
                    </Button>
                </InputLabel>
                <LoadingButton
                    loading={loading}
                    // onClick={handleOnSubmit}
                    disabled={isSelected ? false : true}
                    form="edit-transfer-form"
                    type="submit"
                // loadingIndicator="En cour"
                // loadingPosition="end"
                >
                    Confirmer la reception
                </LoadingButton>
            </DialogActions>
        </Dialog>
    )

}