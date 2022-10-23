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
  Radio

} from '@mui/material';
import { getInitials } from '../../utils/get-initials';
import { Positive as PositiveIcon } from '../../icons/positive';


import {ThreeDots as ThreeDotsIcon} from '../../icons/three-dots'
import {Edit as EditIcon} from '../../icons/edit'
import {Delete as DeleteIcon} from '../../icons/delete'
import Label from '../Label';

import ProductProvider from '../../services/product-provider'


export const ProductSelectDialog = ({open,  handleClickOpen, setOpen, selectedProduct, setSelectedProduct}) => {

  const [products, setProducts] = useState([])
  const [searched, setSearched] = useState('')
  const [allProducts, setAllProducts] = useState([])

  const [selectedProductId, setSelectedProductId] = useState();

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const [notFound, setNotFound] = useState(false);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleClose = () => {
    setLimit(10)
    setPage(0)
    setSearched("")
    setSelectedProductId(selectedProduct ? selectedProduct.id : undefined)
    setProducts(allProducts)
    // setSelectedProductIds(selectedProducts.map((row => {return(row.data.id)})))
    setOpen(false);
  };

  const handleSelectProduct = () => {
    

    // setSelectedProducts([...selectedProducts,...selectedProductIds.filter((i) => {return !selectedProducts.map((product)=>{
    //   return product.data.id
    // }).includes(i)}).map(i => {
      
    //     const product_i = allProducts.filter((row) => {
    //       return(row.id === i)
    //     })[0]
    //     const product_data = {
    //       data: product_i,
    //       quantity: 10,
    //       unit: product_i.base_unit
    //     }
    //     return product_data
    //   } 
    // )])

    setSelectedProduct(allProducts.find((product)=> {return product.id === selectedProductId}))
    setLimit(10)
    setPage(0)
    setOpen(false);
  }

  const handleSelectOne = (event, id) => {
    
    setSelectedProductId(id)
    
  };

  const handleChange = (e) => {
    setSearched(e.target.value)
    const searchedProducts = allProducts.filter((row) => {
      return(row.name.toLowerCase().includes(e.target.value.toLowerCase()) || row.sku.toLowerCase().includes(e.target.value.toLowerCase())) 
    })
      setProducts(searchedProducts)
    if (searchedProducts.length == 0){
      setNotFound(true)
    }
    console.log(notFound)
    
  }

  useEffect(() => {
    if (allProducts.length === 0 && products.length === 0){
      ProductProvider.getProducts().then(
        (response) => {
          setAllProducts(response.data)
          setProducts(response.data)
        }
      )
     }
  })

  // useEffect(()=>{
  //   setSelectedProductIds(selectedProducts.map((row => {return(row.data.id)})))
  // }, [selectedProduct])

  return(
    <Dialog open={open} 
    onClose={handleClose}>
      <DialogTitle>AJOUTER ARTICLE</DialogTitle>
      <DialogContent>   
        <TextField
          autoFocus
          margin="dense"
          id="search"
          label="Recherche"
          type="text"
          fullWidth
          variant="standard"
          value={searched}
          onChange={handleChange}
        />
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
            </TableRow>
          </TableHead>
          <TableBody>
            {products.slice(page*limit, page*limit+limit).map((product) => (
              <TableRow
                hover
                key={product.id}
                // selected={selectedProductIds.indexOf(product.id) !== -1}
                
              >
                <TableCell padding="checkbox">
                  <Radio
                    name="radio-buttons"
                    checked={selectedProductId === product.id}
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
              </TableRow>
            ))}
             {notFound && 
                <TableRow>
                  <TableCell 
                  colSpan={3} 
                  align="center">
                    L`&apos;`article n`&apos;`existe pas
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
        <Button onClick={handleSelectProduct}>Ajouter</Button>
      </DialogActions>
    </Dialog>
    )

}