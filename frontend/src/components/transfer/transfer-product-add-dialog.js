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

} from '@mui/material';
import { getInitials } from '../../utils/get-initials';
import { Positive as PositiveIcon } from '../../icons/positive';


import { ThreeDots as ThreeDotsIcon } from '../../icons/three-dots'
import { Edit as EditIcon } from '../../icons/edit'
import { Delete as DeleteIcon } from '../../icons/delete'
import Label from '../Label';



export const TransferProductAddDialog = ({ open, handleClickOpen, setOpen, allProducts, selectedProducts, setSelectedProducts, setDoneModeProducts }) => {

    const [products, setProducts] = useState(allProducts)
    // const [searched, setSearched] = useState('')
    // const [allProducts, setAllProducts] = useState([])

    const [selectedProductIds, setSelectedProductIds] = useState(selectedProducts.map((row => { return (row.id) })));

    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(0);

    // const [notFound, setNotFound] = useState(false);

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleClose = () => {
        setLimit(10)
        setPage(0)
        setProducts(allProducts)
        // setSelectedProductIds(selectedProducts.map((row => {return(row.data.id)})))
        setOpen(false);
    };

    const handleAddProductToProvision = () => {
        const newSelectedProduct = selectedProductIds.filter((i) => {
            return !selectedProducts.map((product) => {
                return product.id
            })
                .includes(i)
        })
            .map((i) => {
                let product = allProducts.find((row) => { return row.id === i })
                return { ...product, staticQuantity: product.quantity }

            })

        console.log(newSelectedProduct)
        setSelectedProducts((oldSelectedProducts) => { return [...oldSelectedProducts, ...newSelectedProduct] })

        // setSelectedProducts([...selectedProducts,...selectedProductIds.filter((i) => {return !selectedProducts.map((product)=>{
        //   return product.id
        // }).includes(i)}).map(i => {
        //     const product_i = allProvisionProducts.filter((row) => {
        //       return(row.id === i)
        //     })[0]
        //     return product_i
        //   } 
        // )])

        setLimit(10)
        setPage(0)
        setOpen(false);
    }

    const handleSelectAll = (event) => {
        let newSelectedProductIds;

        if (event.target.checked) {
            newSelectedProductIds = products.map((product) => product.id);
        } else {
            newSelectedProductIds = [];
        }

        setSelectedProductIds(newSelectedProductIds);
    };

    const handleSelectOne = (event, id) => {
        const selectedIndex = selectedProductIds.indexOf(id);
        let newSelectedProductIds = [];

        if (selectedIndex === -1) {
            newSelectedProductIds = newSelectedProductIds.concat(selectedProductIds, id);
        } else if (selectedIndex === 0) {
            newSelectedProductIds = newSelectedProductIds.concat(selectedProductIds.slice(1));
        } else if (selectedIndex === selectedProductIds.length - 1) {
            newSelectedProductIds = newSelectedProductIds.concat(selectedProductIds.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelectedProductIds = newSelectedProductIds.concat(
                selectedProductIds.slice(0, selectedIndex),
                selectedProductIds.slice(selectedIndex + 1)
            );
        }
        setSelectedProductIds(newSelectedProductIds);
    };

    useEffect(() => {
        setProducts(allProducts)
    }, [allProducts])

    useEffect(() => {
        setSelectedProductIds(selectedProducts.map((row => { return (row.id) })))

    }, [selectedProducts])

    return (
        <Dialog open={open}
            onClose={handleClose}>
            <DialogTitle>AJOUTER ARTICLE</DialogTitle>
            <DialogContent>

                <Table
                    sx={{
                        my: 3
                    }}
                >
                    <TableHead
                        sx={{
                            backgroundColor: "#F4F7FC",
                            textAlign: 'center'
                        }}
                    >
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={selectedProductIds.length === products.length}
                                    color="primary"
                                    indeterminate={
                                        selectedProductIds.length > 0
                                        && selectedProductIds.length < products.length
                                    }
                                    onChange={handleSelectAll}
                                />
                            </TableCell>
                            <TableCell>
                                Sku
                            </TableCell>
                            <TableCell>
                                Designation
                            </TableCell>
                            <TableCell>
                                Quantité
                            </TableCell>
                            <TableCell>
                                Prix Unitaire
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.slice(page * limit, page * limit + limit).map((product) => (
                            <TableRow
                                hover
                                key={product.id}
                                selected={selectedProductIds.indexOf(product.id) !== -1}

                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedProductIds.indexOf(product.id) !== -1}
                                        onChange={(event) => handleSelectOne(event, product.id)}
                                        value="true"
                                    />

                                </TableCell>
                                <TableCell>
                                    {product.product.sku}
                                </TableCell>
                                <TableCell>
                                    {product.product.name}
                                </TableCell>
                                <TableCell>
                                    {product.quantity}
                                </TableCell>
                                <TableCell>
                                    {product.price}
                                </TableCell>
                            </TableRow>
                        ))}
                        {products.length === 0 &&
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    align="center">
                                    L&apos;article n&apos;existe pas
                                </TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={products.length}
                    onPageChange={handlePageChange}
                    page={page}
                    rowsPerPage={limit}
                    rowsPerPageOptions={-1}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Annuler</Button>
                {<Button onClick={handleAddProductToProvision}>Ajouter</Button>}
            </DialogActions>
        </Dialog>
    )

}