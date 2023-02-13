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

import { ThreeDots as ThreeDotsIcon } from '../../icons/three-dots'
import { Edit as EditIcon } from '../../icons/edit'
import { Delete as DeleteIcon } from '../../icons/delete'
import { View as ViewIcon } from '../../icons/view'


import UXAccess from '../../utils/ux-access'

import Label from '../Label';




export const ReceiptListResults = ({ receiptList, ...rest }) => {



  const [selectedReceiptIds, setSelectedReceiptIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const [receipts, SetReceipts] = useState(receiptList)
  const router = useRouter();

  const handleSelectAll = (event) => {
    let newSelectedReceiptIds;

    if (event.target.checked) {
      newSelectedReceiptIds = receipts.map((receipt) => receipt.id);
    } else {
      newSelectedReceiptIds = [];
    }

    setSelectedReceiptIds(newSelectedReceiptIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedReceiptIds.indexOf(id);
    let newSelectedReceiptIds = [];

    if (selectedIndex === -1) {
      newSelectedReceiptIds = newSelectedReceiptIds.concat(selectedReceiptIds, id);
    } else if (selectedIndex === 0) {
      newSelectedReceiptIds = newSelectedReceiptIds.concat(selectedReceiptIds.slice(1));
    } else if (selectedIndex === selectedReceiptIds.length - 1) {
      newSelectedReceiptIds = newSelectedReceiptIds.concat(selectedReceiptIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedReceiptIds = newSelectedReceiptIds.concat(
        selectedReceiptIds.slice(0, selectedIndex),
        selectedReceiptIds.slice(selectedIndex + 1)
      );
    }

    setSelectedReceiptIds(newSelectedReceiptIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleClickEdit = (e, receipt) => {

    const data = {
      pathname: '/receipt/edit-receipt/',
      query: { 'id': receipt.id }
    }
    router.push(data);
  }


  return (
    <Box {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: "100%" }} >
          <Table>
            <TableHead sx={{
              backgroundColor: '#F4F7FC',
              textAlign: 'center'
            }} >
              <TableRow>
                <TableCell>
                  Reference
                </TableCell>
                <TableCell align="center">
                  Date de reception
                </TableCell>
                <TableCell align="center">
                  N° bon de commande
                </TableCell>
                <TableCell>
                  Date de commande
                </TableCell>
                <TableCell>
                  Recu par
                </TableCell>
                <TableCell>
                  Magasin
                </TableCell>
                <TableCell align="center">
                  <ThreeDotsIcon />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {receipts.slice(page * limit, page * limit + limit).map((receipt) => (
                <TableRow
                  hover
                  key={receipt.id}
                  selected={selectedReceiptIds.indexOf(receipt.id) !== -1}
                >
                  <TableCell sx={{
                    width: '9%',
                  }}>
                    {receipt.ref}
                  </TableCell>
                  <TableCell align="center"
                    sx={{
                      width: '10%',
                    }}>
                    {format(new Date(receipt.created_on), 'dd-MM-yyyy')}
                  </TableCell>
                  <TableCell align="center"
                    sx={{
                      width: '9%',
                    }}>
                    {receipt.purchaseOrder.ref}
                  </TableCell>
                  <TableCell
                    sx={{
                      width: '10%',
                    }}>
                    {format(new Date(receipt.purchaseOrder.created_on), 'dd-MM-yyyy')}
                  </TableCell>
                  <TableCell>
                    {receipt.created_by.fullname}
                  </TableCell>
                  <TableCell sx={{
                    width: '40%'
                  }}>
                    {receipt.purchaseOrder.purchaseRequest.provision.destination.name}
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
                          mx: 1,
                          cursor: "pointer"
                        }}
                        onClick={(event) => { handleClickEdit(event, receipt) }}
                      />

                    </Box>

                  </TableCell>
                </TableRow>
              ))}
              {receipts.length === 0 &&
                <TableRow>
                  <TableCell colSpan={7}
                    align="center" >
                    Aucun Bon de reception existe
                  </TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={receipts.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[10, 25, 50]}
      />


    </Box>


  );
};










