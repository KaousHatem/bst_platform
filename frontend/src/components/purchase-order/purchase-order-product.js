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

import UXAccess from '../../utils/ux-access'


import Label from '../Label';



export const PurchaseOrderProduct = ({ setPurchaseProducts, purchaseProducts = [], ...rest }) => {

  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [changed, setChanged] = useState(false)




  const moneyFormat = (value) =>
    new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'DZD'
    }).format(value);



  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };


  const updatePrice = (event, product) => {
    setChanged(true)
    const data_index = purchaseProducts.indexOf(product)
    purchaseProducts[data_index].unitPrice = event.target.value
    setPurchaseProducts([...purchaseProducts])
  }


  return (

    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: "100%" }}>
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
                {UXAccess.hasAccessToPrice() && <TableCell align="center">
                  Prix Unitaire
                </TableCell>}
                <TableCell align="center">
                  Prix Totale
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchaseProducts.map((product) => (
                <TableRow
                  hover
                  key={product.id}

                >
                  <TableCell>
                    {product.sku}
                  </TableCell>
                  <TableCell>
                    {product.name}
                  </TableCell>
                  <TableCell align="center">
                    {product.unit}
                  </TableCell>
                  <TableCell align="center">
                    {product.quantity}
                  </TableCell>
                  {UXAccess.hasAccessToPrice() && <TableCell align="center">
                    {(product.unitPrice && !changed) &&
                      moneyFormat(product.unitPrice) ||
                      <TextField
                        inputStyle={{ textAlign: 'center' }}
                        sx={{
                          width: '10ch'
                        }}

                        value={product.unitPrice}
                        onChange={e => { updatePrice(e, product) }}
                      />
                    }

                  </TableCell>}
                  <TableCell align="center">
                    {moneyFormat(product.quantity * product.unitPrice)}
                  </TableCell>

                </TableRow>
              ))}
              {purchaseProducts.length === 0 &&
                <TableRow>
                  <TableCell colSpan={7}
                    align="center" >
                    Aucun Article existe
                  </TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      {/* <TablePagination
        component="div"
        count={purchaseProducts.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[10, 25, 50]}
      /> */}


    </Card>
  );
};


