import { useState, useEffect } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
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
    Menu,
    MenuItem
} from '@mui/material';
import { getInitials } from '../../utils/get-initials';

import { ThreeDots as ThreeDotsIcon } from '../../icons/three-dots'
import { Edit as EditIcon } from '../../icons/edit'
import { Delete as DeleteIcon } from '../../icons/delete'
import { View as ViewIcon } from '../../icons/view'


import UXAccess from '../../utils/ux-access'

import Label from '../Label';

export const StockInListResults = ({ stockInList, ...rest }) => {

    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(0);

    const router = useRouter();

    let [stockInDocuments, setStockInDocuments] = useState(stockInList)
    const source_text = {
        1: "Achat sans dossier",
        3: "Autre"
    }
    const status_text = {
        1: "Nouveau",
        999: "Complété"
    }

    const status_style = {
        // 0: ['outlined', 'text'],
        1: ['filled', 'primary'],
        // 4: ['filled', 'error'],:
        999: ['filled', 'secondary'],
        // 99: ['filled', 'info'],
        // 999: ['filled', 'warning']
    }


    const handleLimitChange = (event) => {
        setLimit(event.target.value);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleClickEdit = (e, id) => {

        const data = {
            pathname: '/stock-in/edit-stock-in-document/',
            query: { 'id': id }
        }
        router.push(data);
    }


    return (
        <Box {...rest}>
            <PerfectScrollbar>
                <Box sx={{ minWidth: "100%" }} >
                    <Table>
                        <TableHead sx={{
                            backgroundColor: '#F4F7FC',
                            textAlign: 'center'
                        }} >
                            <TableRow>
                                <TableCell>
                                    Reference
                                </TableCell>
                                <TableCell>
                                    Date d&apos;entré
                                </TableCell>
                                <TableCell >
                                    Crée par
                                </TableCell>
                                <TableCell>
                                    Source d&apos;entré
                                </TableCell>
                                <TableCell align="center">
                                    Status
                                </TableCell>
                                <TableCell align="center">
                                    <ThreeDotsIcon />
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stockInDocuments.slice(page * limit, page * limit + limit).map((stockInDocument) => (
                                <TableRow
                                    hover
                                    key={stockInDocument.id}
                                >

                                    <TableCell>
                                        {stockInDocument.ref}
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(stockInDocument.created_on), 'dd/MM/yyyy')}
                                    </TableCell>
                                    <TableCell>
                                        {stockInDocument.created_by.fullname}
                                    </TableCell>
                                    <TableCell>
                                        {source_text[stockInDocument.source]}
                                    </TableCell >

                                    <TableCell align="center">
                                        <Label
                                            variant={status_style[stockInDocument.status][0]}
                                            color={status_style[stockInDocument.status][1]}
                                        >
                                            {status_text[stockInDocument.status]}
                                        </Label>
                                    </TableCell >
                                    <TableCell
                                    >
                                        <Box
                                            align="center"
                                            sx={{
                                                justifyContent: 'center',
                                                display: 'flex'
                                            }}
                                        >
                                            <ViewIcon
                                                sx={{
                                                    mx: 1,
                                                    cursor: "pointer"
                                                }}
                                                onClick={(event) => { handleClickEdit(event, stockInDocument.id) }}
                                            />

                                        </Box>

                                    </TableCell>
                                </TableRow>
                            ))}
                            {stockInDocuments.length === 0 &&
                                <TableRow>
                                    <TableCell colSpan={7}
                                        align="center" >
                                        Aucun Bon d&apos;entré existe
                                    </TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
                </Box>
            </PerfectScrollbar>
            <TablePagination
                component="div"
                count={stockInDocuments.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[10, 25, 50]}
            />


        </Box>


    );
};










