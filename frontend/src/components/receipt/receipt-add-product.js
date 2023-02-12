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


import {ThreeDots as ThreeDotsIcon} from '../../icons/three-dots'
import {Edit as EditIcon} from '../../icons/edit'
import {Delete as DeleteIcon} from '../../icons/delete'
import {Save as SaveIcon} from '../../icons/save'


import AddCircleIcon from '@mui/icons-material/AddCircle';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';


import Label from '../Label';

import {ReceiptConfirmDialog} from './receipt-confirm-dialog'


export const ReceiptAddProduct = ({selectedProducts,setSelectedProducts, setAllConfirmed, isDraft=true,...rest}) => {
  

  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  
  let [savedModeProducts, setSavedModeProducts] = useState(selectedProducts.map((product)=>{return(selectedProducts.indexOf(product))}))



  const [open, setOpen] = React.useState(false);

  const [quantityOpen, setQuantityOpen] = useState(false)

  const [unitOpen, setUnitOpen] = useState(false)


  const [selectedProduct, setSelectedProduct] = useState()


  const handleOnEdit = (event, product) => {
    console.log(savedModeProducts)
    if( savedModeProducts.includes(selectedProducts.indexOf(product)) ){
      const newArray = savedModeProducts.filter((item) => item !== selectedProducts.indexOf(product))
      setSavedModeProducts(newArray)
    }
  }

  const handleOnSave = (event, product) => {
    if( !savedModeProducts.includes(selectedProducts.indexOf(product)) ){
      if (product.quantity && product.quantity > 0){
        setSavedModeProducts([ ...savedModeProducts , selectedProducts.indexOf(product)])
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


  const handleClickOpen = (product) => {
    setSelectedProduct(product)
    setOpen(true);
  };

  const handleClose = () => {
    setQuantityOpen(false)
  }


  const handleQuantityChange = (e, product) => {
    product.quantity = e.target.value;
    setSelectedProducts([...selectedProducts]);
  }

  const handleUnitChange = (event,product) => {

    product.unit = event.target.value;
    setSelectedProducts([...selectedProducts]);
  }

  

 

  return (

    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: "100%" }}>
          {selectedProduct && 
            <ReceiptConfirmDialog 
              products={selectedProducts} 
              setProducts={setSelectedProducts} 
              product={selectedProduct} 
              open={open} 
              setOpen={setOpen} 
            />}
          
          <Table>
            <TableHead sx={{
              backgroundColor: '#F4F7FC',
              textAlign: 'center'
            }} 
            >
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedProductIds.length === selectedProducts.length}
                    color="primary"
                    indeterminate={
                      selectedProductIds.length > 0
                      && selectedProductIds.length < selectedProducts.length
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
                <TableCell align="center" >
                  Unité
                </TableCell>
                <TableCell align="center">
                  Quantité
                </TableCell>
                <TableCell align="center">
                  Quantité Reçu
                </TableCell>
                <TableCell align="center">
                  Quantité Accepté
                </TableCell>
                <TableCell align="center">
                  Conforme
                </TableCell>
                <TableCell align="center">
                  <ThreeDotsIcon />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedProducts.slice(page * limit, page * limit + limit).map((product) => { return (
                product.quantityLeft > 0 &&
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
                    {product.sku}
                  </TableCell>
                  <TableCell>
                    {product.name}
                  </TableCell>
                  <TableCell>
                    {product.unit}
                  </TableCell>
                  <TableCell>
                    {product.quantity}
                  </TableCell>
                  <TableCell>
                    {product.receivedQuantity && product.receivedQuantity || "-" }
                  </TableCell>
                  <TableCell>
                    {product.acceptedQuantity && product.acceptedQuantity || "-" }
                  </TableCell>
                  <TableCell>
                    {product.conformity && product.conformity || "-" }
                  </TableCell>

                  <TableCell
                    >
                    <DoneOutlineIcon 
                          onClick={()=>{handleClickOpen(product)}}
                          sx={{
                            mx:1,
                            cursor: "pointer",
                            
                          }}
                         />
                    
                  </TableCell>
                </TableRow>
              )})}
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
        rowsPerPageOptions={[5, 10, 25, 50]}
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


