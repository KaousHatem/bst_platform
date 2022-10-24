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
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { getInitials } from '../../utils/get-initials';

import {ThreeDots as ThreeDotsIcon} from '../../icons/three-dots'
import {Edit as EditIcon} from '../../icons/edit'
import {Delete as DeleteIcon} from '../../icons/delete'
import {View as ViewIcon} from '../../icons/view'

import SupplierProvider from '../../services/supplier-provider'

import {SupplierDeleteDialog} from './supplier-delete-dialog'

export const SupplierListResults = ({ supplierList, ...rest}) => {
  const [selectedSupplierIds, setSelectedSupplierIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const [suppliers, setSuppliers] = useState(supplierList)
  const router = useRouter();

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [supplierIdDelete, setSupplierIdDelete] = useState(-1)

  const [errorSBOpen, setErrorSBOpen] = useState(false)

  const [loadingOpen, setLoadingOpen] = useState(false)
  const [errorSBText, setErrorSBText] = useState("")

  const CANNOT_DELETE_ERROR = "Ce fournisseur ne peux pas etre supprimé."
  const CONNECTION_ERROR = "Probleme de connexion, Veuillez de ressayer"


  const handleClose = () => {
    setDeleteOpen(false)
  }
  const handleDeleteOpen = (event, supplier_id) => {
    setSupplierIdDelete(supplier_id)
    setDeleteOpen(true)
  }

  const handleDeleteSupplier = () => {
    setDeleteOpen(false)
    setLoadingOpen(true)
    SupplierProvider.deleteSupplier(supplierIdDelete).then(
      (response) => {
        setSuppliers(suppliers.filter(function(supplier) {
          return supplier.id !== supplierIdDelete
        }))
        setLoadingOpen(false)
      },
      error => {
        setLoadingOpen(false)
        handleSBOpen(CANNOT_DELETE_ERROR)
      }
    )
  }

  const handleSelectAll = (event) => {
    let newSelectedSupplierIds;

    if (event.target.checked) {
      newSelectedSupplierIds = suppliers.map((supplier) => supplier.id);
    } else {
      newSelectedSupplierIds = [];
    }

    setSelectedSupplierIds(newSelectedSupplierIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedSupplierIds.indexOf(id);
    let newSelectedSupplierIds = [];

    if (selectedIndex === -1) {
      newSelectedSupplierIds = newSelectedSupplierIds.concat(selectedSupplierIds, id);
    } else if (selectedIndex === 0) {
      newSelectedSupplierIds = newSelectedSupplierIds.concat(selectedSupplierIds.slice(1));
    } else if (selectedIndex === selectedSupplierIds.length - 1) {
      newSelectedSupplierIds = newSelectedSupplierIds.concat(selectedSupplierIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedSupplierIds = newSelectedSupplierIds.concat(
        selectedSupplierIds.slice(0, selectedIndex),
        selectedSupplierIds.slice(selectedIndex + 1)
      );
    }

    setSelectedSupplierIds(newSelectedSupplierIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleClickEdit = (e,supplier) => {

    const data = {
     pathname: '/supplier/edit-supplier/',
     query:{'id':supplier.id}
    }
    router.push(data);
  }

  const handleSBClose = () => {
    setErrorSBOpen(false)
  }

  const handleSBOpen = (text) => {
    setErrorSBText(text)
    setErrorSBOpen(true)
  }


  return(
    <Box {...rest}>
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loadingOpen}
      onClick={()=>{setLoadingOpen(false)}}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
      <PerfectScrollbar>
        <Box sx={{minWidth: "100%"}} >
          <Table>
            <TableHead sx={{
              backgroundColor: '#F4F7FC',
              textAlign: 'center'
            }} >
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedSupplierIds.length === suppliers.length}
                    color="primary"
                    indeterminate={
                      selectedSupplierIds.length > 0
                      && selectedSupplierIds.length < suppliers.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  Id
                </TableCell>
                <TableCell>
                  Nom du fournisseur
                </TableCell>
                <TableCell>
                  Registre du commerce
                </TableCell>
                <TableCell>
                  Wilaya
                </TableCell>
                <TableCell align="center">
                  <ThreeDotsIcon />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {suppliers.slice(page*limit, page*limit+limit).map((supplier)=>(
                <TableRow
                  hover
                  key={supplier.id}
                  selected={selectedSupplierIds.indexOf(supplier.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedSupplierIds.indexOf(supplier.id) !== -1}
                      onChange={(event) => handleSelectOne(event, supplier.id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    {supplier.id}
                  </TableCell>
                  <TableCell>
                    {supplier.name}
                  </TableCell>
                  <TableCell>
                    {supplier.register_number}
                  </TableCell>
                  <TableCell>
                    {supplier.state}
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
                          mx:1,
                          cursor: "pointer"
                        }}
                        onClick = {(event) => {handleClickEdit(event, supplier)}}
                       />
                        
                       <DeleteIcon 
                        sx={{
                          mx:1,
                          cursor: "pointer"
                        }}
                        onClick = {(event) => {handleDeleteOpen(event, supplier.id)}}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {suppliers.length === 0 && 
                <TableRow>
                  <TableCell colSpan={7}
                  align="center" >
                    Aucun fournisseur existe
                  </TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>  
      <TablePagination
        component="div"
        count={suppliers.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
      <SupplierDeleteDialog open={deleteOpen} 
      handleDeleteOpen={handleDeleteOpen} 
      handleClose={handleClose}
      handleDeleteSupplier={handleDeleteSupplier} />
      <Snackbar open={errorSBOpen} 
      onClose={handleSBClose}>
        <Alert variant="filled" 
        severity="error">
          {errorSBText}
        </Alert>
      </Snackbar>
    </Box>


  );
};













