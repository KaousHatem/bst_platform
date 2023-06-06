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


export const ReceiptAttachDialog = ({ attachOpen, handleAttachOpen, handleAttachClose, handleSelectFile, handleUploadAttachement, loading, isSelected, selectedFile }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


    return (
        <Dialog
            open={attachOpen}
            onClose={handleAttachClose}
            fullScreen={fullScreen}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle>Attacher LE DOCUMENT BON DE RECEPTION</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Veuillez ajouter le bon de reception signé
                </DialogContentText>
                <DialogContentText>
                    {selectedFile ? "Fichier: " + selectedFile.name : ""}
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
                    onClick={handleUploadAttachement}
                    disabled={isSelected ? false : true}
                // form="edit-transfer-form"
                // type="submit"
                >
                    Confirmer
                </LoadingButton>
            </DialogActions>
        </Dialog>
    )

}