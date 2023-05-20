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



export const StockInAddProduct = ({ selectedProducts, setSelectedProducts, setAllConfirmed, isAdd = true, ...rest }) => {


  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);


  let [savedModeProducts, setSavedModeProducts] = useState(selectedProducts.map((product) => { return (selectedProducts.indexOf(product)) }))



  const [open, setOpen] = React.useState(false);

  const [quantityOpen, setQuantityOpen] = useState(false)

  const [unitOpen, setUnitOpen] = useState(false)





  const handleOnEdit = (event, product) => {
    console.log(savedModeProducts)
    if (savedModeProducts.includes(selectedProducts.indexOf(product))) {
      const newArray = savedModeProducts.filter((item) => item !== selectedProducts.indexOf(product))
      setSavedModeProducts(newArray)
    }
  }

  const handleOnSave = (event, product) => {
    if (!savedModeProducts.includes(selectedProducts.indexOf(product))) {
      if (product.quantity && product.quantity > 0) {
        setSavedModeProducts([...savedModeProducts, selectedProducts.indexOf(product)])
      } else {
        setQuantityOpen(true)
        // alert("Veuillez saisir la quantité de l'article")
      }

    }

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

  const handlePriceChange = (e, product) => {
    product.price = e.target.value;
    setSelectedProducts([...selectedProducts]);
  }

  const handleQuantityChange = (e, product) => {
    product.quantity = e.target.value;
    setSelectedProducts([...selectedProducts]);
  }

  const handleUnitChange = (event, product) => {

    product.unit = event.target.value;
    setSelectedProducts([...selectedProducts]);
  }

  useEffect(() => {
    if (selectedProducts.length) {
      setAllConfirmed(savedModeProducts.length === selectedProducts.length)
    }

  }, [savedModeProducts])



  return (

    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: "100%" }}>
          {isAdd && <Grid item
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
              Ajouter un Article
            </Button>
          </Grid>}
          {selectedProducts && <ProductAddDialog open={open}
            handleClickOpen={handleClickOpen}
            setOpen={setOpen}
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts} />}
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
                  Prix U
                </TableCell>
                {isAdd && <TableCell align="center">
                  <ThreeDotsIcon />
                </TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedProducts.slice(page * limit, page * limit + limit).map((product) => (
                <TableRow
                  hover
                  key={product.data.id}
                  selected={selectedProductIds.indexOf(product.data.id) !== -1}

                >

                  <TableCell>
                    {product.data.sku}
                  </TableCell>
                  <TableCell>
                    {product.data.name}
                  </TableCell>

                  <TableCell
                    align="center"
                  >
                    {isAdd && !savedModeProducts.includes(selectedProducts.indexOf(product)) &&
                      <Select
                        fullWidth
                        name="unit"
                        margin="normal"
                        defaultValue={product.unit.ref}
                        onChange={event => handleUnitChange(event, product)}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                      >
                        <MenuItem
                          key={product.data.base_unit.ref}
                          value={product.data.base_unit.ref}>{product.data.base_unit.ref}</MenuItem>

                        {product.data.unit_conversions && product.data.unit_conversions.map((unit) => (
                          <MenuItem
                            key={unit.to_unit.ref}
                            value={unit.to_unit.ref} >{unit.to_unit.ref}</MenuItem>))}
                      </Select> ||
                      product.unit.ref
                    }


                  </TableCell>


                  <TableCell align="center">
                    {isAdd && !savedModeProducts.includes(selectedProducts.indexOf(product)) &&
                      <TextField
                        inputStyle={{ textAlign: 'center' }}
                        sx={{
                          width: '10ch'
                        }}
                        defaultValue={product.quantity}
                        onChange={event => handleQuantityChange(event, product)}
                      /> ||
                      product.quantity
                    }
                  </TableCell>
                  <TableCell align="center">
                    {isAdd && !savedModeProducts.includes(selectedProducts.indexOf(product)) &&
                      <TextField
                        inputStyle={{ textAlign: 'center' }}
                        sx={{
                          width: '10ch'
                        }}
                        defaultValue={product.price}
                        onChange={event => handlePriceChange(event, product)}
                      /> ||
                      product.price
                    }
                  </TableCell>
                  {isAdd && <TableCell
                  >

                    <Box
                      align="center"
                      sx={{
                        justifyContent: 'center',
                        display: 'flex'
                      }}
                    >
                      {
                        !savedModeProducts.includes(selectedProducts.indexOf(product)) &&
                        <SaveIcon
                          onClick={(event) => handleOnSave(event, product)}
                          sx={{
                            mx: 1,
                            cursor: "pointer"
                          }}
                        /> ||
                        <EditIcon
                          onClick={(event) => handleOnEdit(event, product)}
                          sx={{
                            mx: 1,
                            cursor: "pointer"
                          }}
                        />
                      }

                      <DeleteIcon
                        sx={{
                          mx: 1,
                          cursor: "pointer"
                        }}
                        onClick={(event) => {
                          setSelectedProducts(selectedProducts.filter((row) => { return row.data.id !== product.data.id }))
                        }}
                      />

                    </Box>


                  </TableCell>
                  }
                </TableRow>
              ))}
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
      <Snackbar open={quantityOpen}
        onClose={handleClose}>
        <Alert variant="filled"
          severity="error">
          Veuillez saisir la quantité de l&apos;article
        </Alert>
      </Snackbar>


    </Card>
  );
};


