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

} from '@mui/material';
import { getInitials } from '../../utils/get-initials';
import { Positive as PositiveIcon } from '../../icons/positive';


import { ThreeDots as ThreeDotsIcon } from '../../icons/three-dots'
import { Edit as EditIcon } from '../../icons/edit'
import { Delete as DeleteIcon } from '../../icons/delete'
import { Save as SaveIcon } from '../../icons/save'
import { Done as DoneIcon } from '../../icons/done'
import { Convert as ConvertIcon } from '../../icons/convert'

import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';


import Label from '../Label';

import { PRProductAddDialog } from './pr-product-add-dialog'


export const PRAddProduct = ({ provisionProducts, selecetedProducts, setSelectedProducts, isDraft = true, productInPurchase, doneModeProducts, setDoneModeProducts, ...rest }) => {
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);




  const handleOnConvert = (event, product) => {
    console.log(doneModeProducts)
    if (doneModeProducts.includes(product.productProvision.id)) {
      const newArray = doneModeProducts.filter((item) => item !== product.productProvision.id)
      setDoneModeProducts(newArray)
    }
  }

  const handleOnDone = (event, product) => {

    console.log(doneModeProducts)
    if (!doneModeProducts.includes(product.productProvision.id)) {
      setDoneModeProducts([...doneModeProducts, product.productProvision.id])
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

  const [open, setOpen] = React.useState(false);

  const [quantityOpen, setQuantityOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setQuantityOpen(false)
  }

  const handleUnitChange = (event, product) => {

    if (event.target.value === product.productProvision.product.base_unit) {
      const fact_to_unit = product.productProvision.product.unit_conversions.find((convret_unit) => {
        return convret_unit.to_unit.ref === product.unit
      }).multiplier
      console.log(fact_to_unit)
      const new_quantity = product.quantity * fact_to_unit
      product.quantity = new_quantity
    } else if (product.unit === product.productProvision.product.base_unit) {
      const fact_to_unit = product.productProvision.product.unit_conversions.find((convret_unit) => {
        return convret_unit.to_unit.ref === event.target.value
      }).multiplier
      console.log(fact_to_unit)
      const new_quantity = product.quantity / fact_to_unit
      product.quantity = new_quantity
    } else {
      const fact_to_unit = product.productProvision.product.unit_conversions.find((convret_unit) => {
        return convret_unit.to_unit.ref === event.target.value
      }).multiplier
      const fact_from_unit = product.productProvision.product.unit_conversions.find((convret_unit) => {
        return convret_unit.to_unit.ref === product.unit
      }).multiplier

      const base_quantity = product.quantity * fact_from_unit
      const new_quantity = base_quantity / fact_to_unit
      product.quantity = new_quantity
    }



    product.unit = event.target.value;
    setSelectedProducts([...selecetedProducts]);

    console.log(product)

  }


  const handleQuantityChange = (e, product) => {
    const tmp_selecetedProducts = selecetedProducts
    tmp_selecetedProducts[tmp_selecetedProducts.indexOf(product)].quantity = e.target.value
    setSelectedProducts(tmp_selecetedProducts)
  }

  return (

    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: "100%" }}>
          {isDraft && <Grid item
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
          {selecetedProducts && <PRProductAddDialog open={open}
            handleClickOpen={handleClickOpen}
            allProvisionProducts={provisionProducts}
            setOpen={setOpen}
            selectedProducts={selecetedProducts}
            setSelectedProducts={setSelectedProducts}
            productInPurchase={productInPurchase}
            setDoneModeProducts={setDoneModeProducts} />}
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
                  <ThreeDotsIcon />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selecetedProducts.slice(0, limit).map((product) => (
                <TableRow
                  hover
                  key={product.productProvision.id}

                >
                  <TableCell>
                    {product.productProvision.product.sku}
                  </TableCell>
                  <TableCell>
                    {product.productProvision.product.name}
                  </TableCell>
                  <TableCell
                    align="center"
                  >{
                      doneModeProducts.includes(product.productProvision.id) &&
                      product.unit ||
                      <Select
                        fullWidth
                        name="unit"
                        margin="normal"
                        defaultValue={product.unit}
                        onChange={event => handleUnitChange(event, product)}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                      >
                        <MenuItem
                          key={product.productProvision.product.base_unit}
                          value={product.productProvision.product.base_unit}>{product.productProvision.product.base_unit}</MenuItem>

                        {product.productProvision.product.unit_conversions && product.productProvision.product.unit_conversions.map((unit) => (
                          <MenuItem
                            key={unit.to_unit.ref}
                            value={unit.to_unit.ref} >{unit.to_unit.ref}</MenuItem>))}
                      </Select>
                    }
                  </TableCell>
                  <TableCell align="center">
                    {product.quantity}
                  </TableCell>
                  <TableCell
                  >
                    {isDraft &&
                      <Box
                        align="center"
                        sx={{
                          justifyContent: 'center',
                          display: 'flex'
                        }}
                      >
                        {
                          doneModeProducts.includes(product.productProvision.id) &&
                          <ConvertIcon
                            sx={{
                              mx: 1,
                              cursor: "pointer"
                            }}
                            onClick={(event) => handleOnConvert(event, product)}
                          /> ||
                          <DoneIcon
                            sx={{
                              mx: 1,
                              cursor: "pointer"
                            }}
                            onClick={(event) => handleOnDone(event, product)}
                          />

                        }
                        <DeleteIcon
                          sx={{
                            mx: 1,
                            cursor: "pointer"
                          }}
                          onClick={(event) => {
                            setSelectedProducts(selecetedProducts.filter((row) => { return row.productProvision.id !== product.productProvision.id }))
                          }}
                        />

                      </Box>
                    }

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={selecetedProducts.length}
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


