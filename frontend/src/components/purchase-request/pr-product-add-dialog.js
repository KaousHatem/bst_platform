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


import {ThreeDots as ThreeDotsIcon} from '../../icons/three-dots'
import {Edit as EditIcon} from '../../icons/edit'
import {Delete as DeleteIcon} from '../../icons/delete'
import Label from '../Label';

import ProductProvider from '../../services/product-provider'


export const PRProductAddDialog = ({open,  handleClickOpen, setOpen, allProvisionProducts, selectedProducts, setSelectedProducts, productInPurchase}) => {

  const [products, setProducts] = useState(allProvisionProducts)
  // const [searched, setSearched] = useState('')
  // const [allProducts, setAllProducts] = useState([])

  const [selectedProductIds, setSelectedProductIds] = useState(selectedProducts.map((row => {return(row.id)})));

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  // const [notFound, setNotFound] = useState(false);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleClose = () => {
    setLimit(10)
    setPage(0)
    setProducts(allProvisionProducts)
    // setSelectedProductIds(selectedProducts.map((row => {return(row.data.id)})))
    setOpen(false);
  };

  const handleAddProductToProvision = () => {
    

    setSelectedProducts([...selectedProducts,...selectedProductIds.filter((i) => {return !selectedProducts.map((product)=>{
      return product.id
    }).includes(i)}).map(i => {
        const product_i = allProvisionProducts.filter((row) => {
          return(row.id === i)
        })[0]
        return product_i
      } 
    )])

    setLimit(10)
    setPage(0)
    setOpen(false);
  }

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

  // const handleChange = (e) => {
  //   setSearched(e.target.value)
  //   const searchedProducts = allProducts.filter((row) => {
  //     return(row.name.toLowerCase().includes(e.target.value.toLowerCase()) || row.sku.toLowerCase().includes(e.target.value.toLowerCase())) 
  //   })
  //     setProducts(searchedProducts)
  //   if (searchedProducts.length == 0){
  //     setNotFound(true)
  //   }
  //   console.log(notFound)
    
  // }

  const handleCheckInPurchase = (event, product) => {
    const ifin = productInPurchase.includes(product)
    console.log(ifin)
    return ifin
  }

  useEffect(() => {
    setProducts(allProvisionProducts)
  },[allProvisionProducts])

  useEffect(()=>{
    setSelectedProductIds(selectedProducts.map((row => {return(row.id)})))

  }, [selectedProducts])

  return(
    <Dialog open={open} 
    onClose={handleClose}>
      <DialogTitle>AJOUTER ARTICLE</DialogTitle>
      <DialogContent>   
        
        <Table
          sx={{
            my:3
          }}
        >
          <TableHead
            sx={{
              backgroundColor: "#F4F7FC",
              textAlign: 'center'
            }}
          >
            <TableRow>
              <TableCell align="center">
                -
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
            </TableRow>
          </TableHead>
          <TableBody>
            {products.slice(page*limit, page*limit+limit).map((product) => (
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
                    disabled = {productInPurchase.includes(product.id)}
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
              </TableRow>
            ))}
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