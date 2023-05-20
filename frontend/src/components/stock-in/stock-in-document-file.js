import * as React from 'react';
import { useState, useEffect } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
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
    Alert,
    Collapse,
    Snackbar,
    Select,
    MenuItem,
    Stack,
    IconButton,

} from '@mui/material';
import { getInitials } from '../../utils/get-initials';
import { Positive as PositiveIcon } from '../../icons/positive';


import { ThreeDots as ThreeDotsIcon } from '../../icons/three-dots'
import { Edit as EditIcon } from '../../icons/edit'
import { Delete as DeleteIcon } from '../../icons/delete'
import { Save as SaveIcon } from '../../icons/save'

import AddCircleIcon from '@mui/icons-material/AddCircle';


import Label from '../Label';

import { ProductAddDialog } from './product-add-dialog'



export const StockInDocumentFile = ({ files, ...rest }) => {

    const handleDownload = (e, file) => {
        const url = file.file
        window.open(url, "_blank")
    }


    return (

        <Card {...rest}>
            <PerfectScrollbar>
                <Box sx={{ minWidth: "50%" }}>

                    <Table>
                        <TableHead sx={{
                            backgroundColor: '#F4F7FC',
                            textAlign: 'center'
                        }}
                        >
                            <TableRow>

                                <TableCell>
                                    Le nom du fichier
                                </TableCell>
                                <TableCell align="center">
                                    <ThreeDotsIcon />
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {files.map((file) => (
                                <TableRow
                                    hover
                                    key={file.id}
                                >

                                    <TableCell>
                                        {file.name}
                                    </TableCell>
                                    <TableCell sx={{
                                        width: '10%'
                                    }}
                                    align="center">
                                        <Button
                                            onClick={e => handleDownload(e, file)}>Imprimer</Button>
                                    </TableCell>


                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </PerfectScrollbar>



        </Card>
    );
};


