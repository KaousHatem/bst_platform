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
import {View as ViewIcon} from '../../icons/view'

// import PurchaseRequestProvider from '../../services/purchase-request-provider'
// import PRProductProvider from '../../services/pr-product-provider'

// import {PRDeleteDialog} from './pr-delete-dialog'
// import {PRApproveDialog} from './pr-approve-dialog'
import UXAccess from '../../utils/ux-access'
 
import Label from '../Label';

export const POListResults = ({ purchaseOrderList, ...rest}) => {


 

  
  const [selectedPOIds, setSelectedPOIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const [purchaseOrders, setPurchaseOrders] = useState(purchaseOrderList)
  const router = useRouter();

  // const [deleteOpen, setDeleteOpen] = useState(false)
  // const [purchaseRequestIdDelete, setPurchaseRequestIdDelete] = useState(-1)


  

  const handleClose = () => {
    // setDeleteOpen(false)
  }
  const handleDeleteOpen = (event, pr_id) => {
    // setPurchaseRequestIdDelete(pr_id)
    // setDeleteOpen(true)
  }

  const handleDeletePurchaseRequest = () => {
    // setDeleteOpen(false)
    // PurchaseRequestProvider.deletePurchaseRequest(purchaseRequestIdDelete).then(
    //   (response) => {
    //     console.log('PurchaseRequest: '+purchaseRequestIdDelete+' is deleted')
    //     setPurchaseRequests(purchaseRequests.filter(function(purchaseRequest) {
    //       return purchaseRequest.id !== purchaseRequestIdDelete
    //     }))
    //   },
    //   error => {
    //     const resMessage =
    //       (error.response &&
    //         error.response.data &&
    //         error.response.data.message) ||
    //       error.message ||
    //       error.toString();
    //     console.log(resMessage)
    //   }
    // )
  }

  const handleSelectAll = (event) => {
    let newSelectedPurchaseOrderIds;

    if (event.target.checked) {
      newSelectedPurchaseOrderIds = purchaseOrders.map((purchaseOrder) => purchaseOrder.id);
    } else {
      newSelectedPurchaseOrderIds = [];
    }

    setSelectedPOIds(newSelectedPurchaseOrderIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedPOIds.indexOf(id);
    let newSelectedPOIds = [];

    if (selectedIndex === -1) {
      newSelectedPOIds = newSelectedPOIds.concat(selectedPOIds, id);
    } else if (selectedIndex === 0) {
      newSelectedPOIds = newSelectedPOIds.concat(selectedPOIds.slice(1));
    } else if (selectedIndex === selectedPOIds.length - 1) {
      newSelectedPOIds = newSelectedPOIds.concat(selectedPOIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedPOIds = newSelectedPOIds.concat(
        selectedPOIds.slice(0, selectedIndex),
        selectedPOIds.slice(selectedIndex + 1)
      );
    }

    setSelectedPOIds(newSelectedPOIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleClickEdit = (e,purchaseOrder) => {

    const data = {
     pathname: '/purchase-order/edit-purchase-order/',
     query:{'id':purchaseOrder.id}
    }
    router.push(data);
  }


  useEffect(() => {
    console.log(purchaseOrders)
  },[])


  return(
    <Box {...rest}>
      <PerfectScrollbar>
        <Box sx={{minWidth: "100%"}} >
          <Table>
            <TableHead sx={{
              backgroundColor: '#F4F7FC',
              textAlign: 'center'
            }} >
              <TableRow>
                <TableCell>
                  Reference
                </TableCell>
                {UXAccess.hasRefPRinPO() && <TableCell align="center">
                  demande d'appro
                </TableCell>}
                <TableCell align="center">
                  demande d'achat
                </TableCell>
                <TableCell>
                  Destination
                </TableCell>
                <TableCell>
                  Fournisseur
                </TableCell>
                <TableCell>
                  Cree par
                </TableCell>
                <TableCell align="center">
                  <ThreeDotsIcon />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchaseOrders.slice(page*limit, page*limit+limit).map((purchaseOrder)=>(
                <TableRow
                  hover
                  key={purchaseOrder.id}
                  selected={selectedPOIds.indexOf(purchaseOrder.id) !== -1}
                >
                  
                  <TableCell>
                    {purchaseOrder.ref}
                  </TableCell>
                  {UXAccess.hasRefPRinPO() && <TableCell align="center"> 
                    {purchaseOrder.purchaseRequest.provision.ref}
                  </TableCell>}
                  <TableCell align="center">
                    {purchaseOrder.purchaseRequest.ref}
                  </TableCell>
                  <TableCell>
                    {purchaseOrder.purchaseRequest.provision.destination}
                  </TableCell>
                  <TableCell>
                    {purchaseOrder.supplier.name}
                  </TableCell>
                  <TableCell>
                    {purchaseOrder.created_by.username}
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
                      <ViewIcon 
                        sx={{
                          mx:1
                        }}
                        onClick = {(event) => {handleClickEdit(event, purchaseOrder)}}
                       />
                    </Box>
                    
                  </TableCell>
                </TableRow>
              ))}
              {purchaseOrders.length === 0 && 
                <TableRow>
                  <TableCell colSpan={7}
                  align="center" >
                    Aucun Bon de commande existe
                  </TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>  
      <TablePagination
        component="div"
        count={purchaseOrders.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
      {/*<PRDeleteDialog open={deleteOpen} 
      handleDeleteOpen={handleDeleteOpen} 
      handleClose={handleClose}
      handleDeletePurchaseRequest={handleDeletePurchaseRequest} />*/}
      
    </Box>


  );
};










