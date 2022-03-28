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

import {ThreeDots as ThreeDotsIcon} from '../../icons/three-dots'
import {Edit as EditIcon} from '../../icons/edit'
import {Delete as DeleteIcon} from '../../icons/delete'
import Label from '../Label';

import ProductProvider from '../../services/product-provider'
import {ProductDeleteDialog} from './product-delete-dialog'
import {ProductFilter} from './product-filter'



export const ProductListResults = ({ product, categories, ...rest }) => {
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const router = useRouter();

  const [products, setProducts] = useState(product)
  const [filteredProducts, setFilteredProducts] = useState(product)


  const [open, setOpen] = useState(false);
  const [id, setId] = useState(-1)

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const [clickedId, setClickedId] = useState(-1)
  const [clickedStatus, setClickedStatus] = useState(false)

  const handleClickMenu = (event, product) => {
    setClickedId(product.id)
    setClickedStatus(product.status)
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleClickOpen = (e, id) => {
    setOpen(true)
    setId(id)
  }

  const handleClose = () => {
    setOpen(false)
  }

 
  const handleSelectAll = (event) => {
    let newSelectedProductIds;

    if (event.target.checked) {
      newSelectedProductIds = filteredProducts.map((product) => product.id);
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

  const handleClickEdit = (e,product) => {
    router.push({ 
     pathname: '/products/edit-product',
     query: product
    });
  }

  const handleDelete = () => {
    setOpen(false)
    ProductProvider.deleteProduct(id).then(
        (response) => {
          console.log('item: '+id+' is deleted')
          setProducts(filteredProducts.filter(function(product) {
            return product.id !== id
          }))
        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          console.log(resMessage)
        }
      )
  }

  const handleActivate = (e) => {
    const index = filteredProducts.findIndex(item => item.id === clickedId)
    const tmpProduct = filteredProducts[index]
    tmpProduct.status = false
    ProductProvider.editProduct(filteredProducts[index],clickedId).then(
      (response) => {
        filteredProducts[index].status = false
      })
    setAnchorEl(null);
  }

  const handleDeactivate = (e) => {
    const index = filteredProducts.findIndex(item => item.id === clickedId)
    const tmpProduct = filteredProducts[index]
    tmpProduct.status = true
    ProductProvider.editProduct(filteredProducts[index],clickedId).then(
      (response) => {
        filteredProducts[index].status = true
      })
    setAnchorEl(null);
  }

  useEffect(() => {
    console.log(categories)
  })

  

  return (
    <Card {...rest}>
      <ProductFilter products={products} 
      setFilteredProducts={setFilteredProducts} 
      categories={categories} />
      <PerfectScrollbar>
        <Box sx={{ minWidth: "100%" }}>
          <Table>
            <TableHead sx={{
              backgroundColor: '#F4F7FC',
              textAlign: 'center'
            }} 
            >
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedProductIds.length === filteredProducts.length}
                    color="primary"
                    indeterminate={
                      selectedProductIds.length > 0
                      && selectedProductIds.length < filteredProducts.length
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
                <TableCell>
                  Description
                </TableCell>
                <TableCell align="center" >
                  status
                </TableCell>
                <TableCell align="center">
                  <ThreeDotsIcon />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.slice(page*limit, page*limit+limit).map((product) => (
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
                    { product.sku === '' && '-' || product.sku}
                  </TableCell>
                  <TableCell>
                    {product.name}
                  </TableCell>
                  <TableCell
                    align="center"
                  >
                    {product.unit === '' && '-' || product.unit}
                  </TableCell>
                  <TableCell>
                    {product.description === null && '-' || product.description}
                  </TableCell>
                  <TableCell align="center">
                    <Label
                      variant={(product.status === false && 'outlined') || 'filled'}
                      color={(product.status === false && 'text') || 'primary'}
                    >
                      {product.status && 'active' || 'inactive'}
                    </Label>
                  </TableCell>
                  <TableCell
                    >
                    <Box
                      align="center"
                      sx={{
                          justifyContent: 'center',
                          display: 'flex'
                      }}
                    >
                      <EditIcon 
                        sx={{
                          mx:1
                        }}
                        onClick = {(event) => {handleClickEdit(event, product)}}
                       />
                      <DeleteIcon 
                        sx={{
                          mx:1
                        }}
                        onClick = {(event) => {handleClickOpen(event, product.id)}}
                      />
                      
                      <ThreeDotsIcon 
                        sx={{
                          mx:1
                        }}
                        id="edit-btn"
                        aria-haspopup="true"
                        aria-controls={menuOpen ? 'edit-menu' : undefined}
                        aria-expanded={menuOpen ? 'true' : undefined}
                        onClick={(event) => handleClickMenu(event, product)}
                      />
                      <Menu
                        id="edit-menu"
                        anchorEl={anchorEl}
                        open={menuOpen}
                        onClose={handleCloseMenu}
                        MenuListProps={{
                          'aria-labelledby': 'edit-btn',
                        }}
                      >
                        { clickedStatus && <MenuItem onClick={(event) => handleActivate(event)}>Deactiver</MenuItem>
                        || <MenuItem onClick={(event) => handleDeactivate(event)}>Activer</MenuItem>}
                        
                      </Menu>
                    </Box>
                    
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={filteredProducts.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
      <ProductDeleteDialog open={open} 
      handleClickOpen={handleClickOpen} 
      handleClose={handleClose} 
      handleDelete={handleDelete} />
    </Card>

  );
};

ProductListResults.propTypes = {
  products: PropTypes.array.isRequired
};
