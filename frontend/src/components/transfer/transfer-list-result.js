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

export const TransferListResults = ({ transferList, ...rest }) => {

    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(0);

    const router = useRouter();

    const [transfers, setTransfers] = useState(transferList)

    const status_text = {
        1: "Nouveau",
        999: "Reçu"
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
            pathname: '/transfer/edit-transfer/',
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
                                    Transfert de
                                </TableCell>
                                <TableCell >
                                    Transfert vers
                                </TableCell>
                                <TableCell>
                                    Cree par
                                </TableCell>
                                <TableCell align="center">
                                    Date
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
                            {transfers.slice(page * limit, page * limit + limit).map((transfer) => (
                                <TableRow
                                    hover
                                    key={transfer.id}
                                >

                                    <TableCell>
                                        {transfer.ref}
                                    </TableCell>
                                    <TableCell>
                                        {transfer.source.name}
                                    </TableCell>
                                    <TableCell>
                                        {transfer.target.name}
                                    </TableCell>
                                    <TableCell>
                                        {transfer.created_by.fullname}
                                    </TableCell >
                                    <TableCell align="center">
                                        {format(new Date(transfer.created_on), 'dd/MM/yyyy')}
                                    </TableCell >
                                    <TableCell align="center">
                                        <Label
                                            variant={status_style[transfer.status][0]}
                                            color={status_style[transfer.status][1]}
                                        >
                                            {status_text[transfer.status]}
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
                                                onClick={(event) => { handleClickEdit(event, transfer.id) }}
                                            />

                                        </Box>

                                    </TableCell>
                                </TableRow>
                            ))}
                            {transfers.length === 0 &&
                                <TableRow>
                                    <TableCell colSpan={7}
                                        align="center" >
                                        Aucun transfert existe
                                    </TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
                </Box>
            </PerfectScrollbar>
            <TablePagination
                component="div"
                count={transfers.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[10, 25, 50]}
            />


        </Box>


    );
};










