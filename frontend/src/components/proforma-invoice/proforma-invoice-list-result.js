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


export const ProformaInvoiceListResults = ({ proformaInvoiceList, ...rest }) => {





    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(0);

    const [proformaInvoices, setProformaInvoices] = useState(proformaInvoiceList)
    const router = useRouter();



    const handleLimitChange = (event) => {
        setLimit(event.target.value);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleClickEdit = (e, id) => {

        // const data = {
        //     pathname: '/proforma-request/edit-proforma-request/',
        //     query: { 'id': id }
        // }
        // router.push(data);
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
                                    La demande
                                </TableCell>
                                <TableCell align="center">
                                    Fournisseur
                                </TableCell>
                                <TableCell align="center">
                                    Montant
                                </TableCell>
                                <TableCell align="center">
                                    date de creation
                                </TableCell>
                                <TableCell align="center">
                                    <ThreeDotsIcon />
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {proformaInvoices.slice(page * limit, page * limit + limit).map((proformaInvoice) => (
                                <TableRow
                                    hover
                                    key={proformaInvoice.id}
                                >

                                    <TableCell>
                                        {proformaInvoice.ref}
                                    </TableCell>
                                    <TableCell>
                                        {proformaInvoice.proformaRequest.ref}
                                    </TableCell>
                                    <TableCell align="center">
                                        {proformaInvoice.supplier.name}
                                    </TableCell>
                                    <TableCell align="center">
                                        {proformaInvoice.amount}
                                    </TableCell>
                                    <TableCell align="center">
                                        {format(new Date(proformaInvoice.created_on), 'dd/MM/yyyy')}
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
                                                onClick={(event) => { handleClickEdit(event, proformaInvoice.id) }}
                                            />

                                        </Box>

                                    </TableCell>
                                </TableRow>
                            ))}
                            {proformaInvoices.length === 0 &&
                                <TableRow>
                                    <TableCell colSpan={7}
                                        align="center" >
                                        Aucune facture proforma existe
                                    </TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
                </Box>
            </PerfectScrollbar>
            <TablePagination
                component="div"
                count={proformaInvoices.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[10, 25, 50]}
            />


        </Box>


    );
};










