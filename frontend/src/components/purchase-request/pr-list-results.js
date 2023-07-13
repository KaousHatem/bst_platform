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

import PurchaseRequestProvider from '../../services/purchase-request-provider'
import PRProductProvider from '../../services/pr-product-provider'

import { PRDeleteDialog } from './pr-delete-dialog'
import { PRApproveDialog } from './pr-approve-dialog'

import { PurchaseRequestFilter } from './pr-filter'

import Label from '../Label';

export const PRListResults = ({ purchaseReqList, ...rest }) => {

  const status_text = {
    0: "Brouillon",
    1: "Nouveau",
    4: "Annulé",
    9: "Approuvé",
  }

  const status_style = {
    0: ['outlined', 'text'],
    1: ['filled', 'primary'],
    4: ['filled', 'error'],
    9: ['filled', 'secondary'],

  }

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const [clickedId, setClickedId] = useState(-1)

  const [approveOpen, setApproveOpen] = useState(false)
  const [purchaseRequestIdApprove, setPurchaseRequestIdApprove] = useState()

  const [selectedPRIds, setSelectedPRIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const [purchaseRequests, setPurchaseRequests] = useState(purchaseReqList)
  const [filteredPurchaseRequest, setFilteredPurchaseRequest] = useState(purchaseReqList)

  const router = useRouter();

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [purchaseRequestIdDelete, setPurchaseRequestIdDelete] = useState(-1)


  const handleApproveClose = () => {
    setApproveOpen(false)
  }
  const handleApproveOpen = (event) => {
    setApproveOpen(true)
  }

  const handleApprovePurchaseRequest = () => {
    setApproveOpen(false)
    const data = {
      status: status,
    }
    if (clickedId) {
      PurchaseRequestProvider.approvePurchaseRequest(clickedId).then(
        (response) => {
          alert("done")
          router.push('/purchase-request');
        },
        (error) => {
          alert("error")
        })
    }
  }

  const handleClose = () => {
    setDeleteOpen(false)
  }
  const handleDeleteOpen = (event, pr_id) => {
    setPurchaseRequestIdDelete(pr_id)
    setDeleteOpen(true)
  }

  const handleDeletePurchaseRequest = () => {
    setDeleteOpen(false)
    PurchaseRequestProvider.deletePurchaseRequest(purchaseRequestIdDelete).then(
      (response) => {
        console.log('PurchaseRequest: ' + purchaseRequestIdDelete + ' is deleted')
        setPurchaseRequests(purchaseRequests.filter(function (purchaseRequest) {
          return purchaseRequest.id !== purchaseRequestIdDelete
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

  const handleSelectAll = (event) => {
    let newSelectedPurchaseReqIds;

    if (event.target.checked) {
      newSelectedPurchaseReqIds = purchaseRequests.map((purchaseRequest) => purchaseRequest.id);
    } else {
      newSelectedPurchaseReqIds = [];
    }

    setSelectedPRIds(newSelectedPurchaseReqIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedPRIds.indexOf(id);
    let newSelectedPRIds = [];

    if (selectedIndex === -1) {
      newSelectedPRIds = newSelectedPRIds.concat(selectedPRIds, id);
    } else if (selectedIndex === 0) {
      newSelectedPRIds = newSelectedPRIds.concat(selectedPRIds.slice(1));
    } else if (selectedIndex === selectedPRIds.length - 1) {
      newSelectedPRIds = newSelectedPRIds.concat(selectedPRIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedPRIds = newSelectedPRIds.concat(
        selectedPRIds.slice(0, selectedIndex),
        selectedPRIds.slice(selectedIndex + 1)
      );
    }

    setSelectedPRIds(newSelectedPRIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleClickEdit = (e, purchaseRequest) => {

    const data = {
      pathname: '/purchase-request/edit-purchase-request/',
      query: { 'id': purchaseRequest.id }
    }
    router.push(data);
  }

  const handleClickMenu = (event, id) => {
    setClickedId(id)
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setClickedId(undefined);
    setAnchorEl(null);
  };




  return (
    <Box {...rest}>
      {purchaseRequests.length !== 0 && <PurchaseRequestFilter purchaseRequests={purchaseRequests}
        setFilteredPurchaseRequest={setFilteredPurchaseRequest}
        setPage={setPage}
        setLimit={setLimit} />}
      <PerfectScrollbar>
        <Box sx={{ minWidth: "100%" }} >
          <Table>
            <TableHead sx={{
              backgroundColor: '#F4F7FC',
              textAlign: 'center'
            }} >
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedPRIds.length === purchaseRequests.length}
                    color="primary"
                    indeterminate={
                      selectedPRIds.length > 0
                      && selectedPRIds.length < purchaseRequests.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  Reference
                </TableCell>
                <TableCell>
                  demande d&apos;appro
                </TableCell>
                <TableCell>
                  Destination
                </TableCell>
                <TableCell>
                  Créée le
                </TableCell>
                <TableCell>
                  Statut
                </TableCell>
                <TableCell align="center">
                  <ThreeDotsIcon />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPurchaseRequest.slice(page * limit, page * limit + limit).map((purchaseRequest) => (
                <TableRow
                  hover
                  key={purchaseRequest.id}
                  selected={selectedPRIds.indexOf(purchaseRequest.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedPRIds.indexOf(purchaseRequest.id) !== -1}
                      onChange={(event) => handleSelectOne(event, purchaseRequest.id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    {purchaseRequest.ref}
                  </TableCell>
                  <TableCell>
                    {purchaseRequest.provision.ref}
                  </TableCell>
                  <TableCell sx={{
                    width: '40%'
                  }}>
                    {purchaseRequest.provision.destination.name}
                  </TableCell>
                  <TableCell>
                    {purchaseRequest.created_by.fullname}
                  </TableCell>
                  <TableCell align="center">
                    <Label
                      variant={status_style[purchaseRequest.status][0]}
                      color={status_style[purchaseRequest.status][1]}
                    >
                      {status_text[purchaseRequest.status]}
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
                      {purchaseRequest.status !== '0' &&
                        <ViewIcon
                          sx={{
                            mx: 1,
                            cursor: "pointer"
                          }}
                          onClick={(event) => { handleClickEdit(event, purchaseRequest) }}
                        />
                        || <>
                          <EditIcon
                            sx={{
                              mx: 1,
                              cursor: "pointer"
                            }}
                            onClick={(event) => { handleClickEdit(event, purchaseRequest) }}
                          />
                          <DeleteIcon
                            sx={{
                              mx: 1,
                              cursor: "pointer"
                            }}
                            onClick={(event) => { handleDeleteOpen(event, purchaseRequest.id) }}
                          />
                        </>
                      }
                    </Box>

                  </TableCell>
                </TableRow>
              ))}
              {filteredPurchaseRequest.length === 0 &&
                <TableRow>
                  <TableCell colSpan={7}
                    align="center" >
                    Aucune demande d&apos;achat existe
                  </TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={filteredPurchaseRequest.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[10, 25, 50]}
      />
      <PRDeleteDialog open={deleteOpen}
        handleDeleteOpen={handleDeleteOpen}
        handleClose={handleClose}
        handleDeletePurchaseRequest={handleDeletePurchaseRequest} />
      <PRApproveDialog approveOpen={approveOpen}
        handleApproveOpen={handleApproveOpen}
        handleApproveClose={handleApproveClose}
        handleApprovePurchaseRequest={handleApprovePurchaseRequest} />
    </Box>


  );
};

PRListResults.propTypes = {
  purchaseReqList: PropTypes.array.isRequired
};












