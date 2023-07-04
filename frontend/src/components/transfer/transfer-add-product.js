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
import { TransferProductAddDialog } from './transfer-product-add-dialog';

// import { ProductAddDialog } from './product-add-dialog'
import { parseMoney } from 'src/utils/parsers'


export const TransferAddProduct = ({ setError, storeProducts, selectedProducts, setSelectedProducts, isAddPage = false, ...rest }) => {


    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(0);

    const [errorsQuantity, setErrorsQuantity] = useState([])


    const [open, setOpen] = React.useState(false);


    const handleLimitChange = (event) => {
        setLimit(event.target.value);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setQuantityOpen(false)
    }


    const handleQuantityChange = (e, product) => {
        if (e.target.value > product.staticQuantity) {
            if (!errorsQuantity.includes(product.id)) {
                setErrorsQuantity(oldValue => { return [...oldValue, product.id] })
                product.quantity = product.staticQuantity;
                setSelectedProducts([...selectedProducts]);
            }

        } else {
            if (errorsQuantity.includes(product.id)) {
                setErrorsQuantity(oldValue => {
                    return oldValue.filter(productId => {
                        return productId !== product.id
                    })
                })
            }
            product.quantity = e.target.value;
            setSelectedProducts([...selectedProducts]);
        }



    }

    useEffect(() => {
        if (errorsQuantity.length === 0) {
            setError(false)
        } else {
            setError(true)
        }
    }, [errorsQuantity])



    return (

        <Card {...rest}>
            <PerfectScrollbar>
                <Box sx={{ minWidth: "100%" }}>
                    {isAddPage && <Grid item
                        xs={5}>
                        <Button
                            sx={{
                                my: 3
                            }}
                            color="primary"
                            variant="contained"
                            onClick={handleClickOpen}
                            startIcon={(<PositiveIcon />)}
                        >
                            Selectionner un Article
                        </Button>
                    </Grid>}
                    <TransferProductAddDialog open={open}
                        handleClickOpen={handleClickOpen}
                        setOpen={setOpen}
                        allProducts={storeProducts}
                        selectedProducts={selectedProducts}
                        setSelectedProducts={setSelectedProducts} />
                    <Table>
                        <TableHead sx={{
                            backgroundColor: '#F4F7FC',
                            textAlign: 'center'
                        }}
                        >
                            <TableRow>
                                <TableCell>
                                    Sku
                                </TableCell>
                                <TableCell>
                                    Designation
                                </TableCell>
                                <TableCell align="center" >
                                    Unité
                                </TableCell>
                                <TableCell align="center">
                                    Quantité
                                </TableCell>
                                <TableCell align="center">
                                    Prix
                                </TableCell>
                                <TableCell align="center">
                                    <ThreeDotsIcon />
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {selectedProducts.slice(page * limit, page * limit + limit).map((product) => (
                                <TableRow
                                    hover
                                    key={product.id}
                                >
                                    <TableCell>
                                        {product.product.sku}
                                    </TableCell>
                                    <TableCell>
                                        {product.product.name}
                                    </TableCell>

                                    <TableCell align="center">
                                        {product.product.base_unit.ref}
                                    </TableCell>

                                    <TableCell align="center">
                                        {isAddPage ? <TextField
                                            inputStyle={{ textAlign: 'center' }}
                                            sx={{
                                                width: '10ch'
                                            }}
                                            type="number"
                                            min={0}
                                            max={product.quantity}
                                            error={errorsQuantity.includes(product.id)}
                                            defaultValue={product.quantity}
                                            onChange={event => handleQuantityChange(event, product)}
                                        /> :
                                            product.quantity}
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                    >
                                        {parseMoney(product.price)}
                                    </TableCell>
                                    <TableCell
                                    >
                                        {isAddPage && <DeleteIcon
                                            sx={{
                                                mx: 1,
                                                cursor: "pointer"
                                            }}
                                            onClick={(event) => {
                                                setSelectedProducts(selectedProducts.filter((row) => { return row.id !== product.id }))
                                            }}
                                        />}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {selectedProducts.length === 0 &&
                                <TableRow>
                                    <TableCell colSpan={7}
                                        align="center" >
                                        Aucun Article est selectionné
                                    </TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
                </Box>
            </PerfectScrollbar>
            <TablePagination
                component="div"
                count={selectedProducts.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[10, 25, 50]}
            />


        </Card>
    );
};


