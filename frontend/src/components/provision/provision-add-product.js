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

} from '@mui/material';
import { getInitials } from '../../utils/get-initials';
import { Positive as PositiveIcon } from '../../icons/positive';


import {ThreeDots as ThreeDotsIcon} from '../../icons/three-dots'
import {Edit as EditIcon} from '../../icons/edit'
import {Delete as DeleteIcon} from '../../icons/delete'
import {Save as SaveIcon} from '../../icons/save'


import Label from '../Label';

import {ProductAddDialog} from './product-add-dialog'


export const ProvisionAddProduct = ({selecetedProducts,setSelectedProducts, isDraft=true,...rest}) => {
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  
  let [savedModeProducts, setSavedModeProducts] = useState(selecetedProducts.map((product)=>{return(selecetedProducts.indexOf(product))}))

  const handleOnEdit = (event, product) => {
    console.log(selecetedProducts)
    if( savedModeProducts.includes(selecetedProducts.indexOf(product)) ){
      const newArray = savedModeProducts.filter((item) => item !== selecetedProducts.indexOf(product))
      setSavedModeProducts(newArray)
    }
  }

  const handleOnSave = (event, product) => {
    if( !savedModeProducts.includes(selecetedProducts.indexOf(product)) ){
      if (product.quantity && product.quantity > 0){
        setSavedModeProducts([ ...savedModeProducts , selecetedProducts.indexOf(product)])
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

  const [open, setOpen] = React.useState(false);

  const [quantityOpen, setQuantityOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setQuantityOpen(false)
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
                my:3
              }}
              color="primary"
              variant="contained"
              onClick={handleClickOpen}
              startIcon={(<PositiveIcon />)}
            >
              Ajouter un Article
            </Button>
          </Grid>}
          {selecetedProducts && <ProductAddDialog open={open} 
          handleClickOpen={handleClickOpen} 
          setOpen={setOpen} 
          selectedProducts={selecetedProducts} 
          setSelectedProducts={setSelectedProducts}/>}
          <Table>
            <TableHead sx={{
              backgroundColor: '#F4F7FC',
              textAlign: 'center'
            }} 
            >
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedProductIds.length === selecetedProducts.length}
                    color="primary"
                    indeterminate={
                      selectedProductIds.length > 0
                      && selectedProductIds.length < selecetedProducts.length
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
                  <ThreeDotsIcon />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selecetedProducts.slice(0, limit).map((product) => (
                <TableRow
                  hover
                  key={product.data.id}
                  selected={selectedProductIds.indexOf(product.data.id) !== -1}
                  
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedProductIds.indexOf(product.data.id) !== -1}
                      onChange={(event) => handleSelectOne(event, product.data.id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    {product.data.sku}
                  </TableCell>
                  <TableCell>
                    {product.data.name}
                  </TableCell>
                  <TableCell
                    align="center"
                  >
                    {product.data.unit}
                  </TableCell>
                  <TableCell align="center">
                  {isDraft && !savedModeProducts.includes(selecetedProducts.indexOf(product)) &&
                    <TextField
                    inputStyle={{ textAlign: 'center' }}
                      sx={{
                        width: '10ch'
                      }}
                      defaultValue={product.quantity}
                      onChange={event => handleQuantityChange(event,product)}
                    /> ||
                    product.quantity
                  }
                  </TableCell>
                  <TableCell
                    >
                    { isDraft &&
                    <Box
                      align="center"
                      sx={{
                          justifyContent: 'center',
                          display: 'flex'
                      }}
                    >
                      {
                        !savedModeProducts.includes(selecetedProducts.indexOf(product)) &&
                        <SaveIcon
                          onClick={(event) => handleOnSave(event, product)}
                          sx={{
                            mx:1
                          }}
                        /> ||
                        <EditIcon 
                          onClick={(event) => handleOnEdit(event, product)}
                          sx={{
                            mx:1
                          }}
                         />
                      }
                      
                      <DeleteIcon 
                        sx={{
                          mx:1
                        }}
                        onClick={(event) => {
                          setSelectedProducts(selecetedProducts.filter((row) => {return row.data.id !== product.data.id}))
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
        rowsPerPageOptions={[5, 10, 25]}
      />
      <Snackbar open={quantityOpen} 
      onClose={handleClose}>
        <Alert variant="filled" 
        severity="error">
          Veuillez saisir la quantité de l`&apos;`article
        </Alert>
      </Snackbar>
      
    </Card>
  );
};


