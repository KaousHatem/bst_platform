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
import Label from '../Label';

import ProvisionsProvider from '../../services/provision-provider'
import {ProvisionDeleteDialog} from './provision-delete-dialog'
import {ProvisionFilter} from './provision-filter'



export const ProvisionListResults = ({ provision_list, ...rest }) => {


  const [selectedProvisionIds, setSelectedProvisionIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const [provisions, setProvisions] = useState(provision_list)
  const [filteredProvision, setFilteredProvision] = useState(provision_list)
  const router = useRouter();

  const status_text = {
    0: "Brouillon",
    1: "Nouveau",
    4: "Annulé",
    9: "Apprové",
    99: "En Livraison",
    999: "Complète"
  }

  const status_style = {
    0: ['outlined','text'],
    1: ['filled','primary'],
    4: ['filled','error'],
    9: ['filled','secondary'],
    99: ['filled','info'],
    999: ['filled','warning']
  }

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [provisionIdDelete, setProvisionIdDelete] = useState(-1)

 
  
  const handleClose = () => {
    setDeleteOpen(false)
  }
  const handleDeleteOpen = (event, provision_id) => {
    setProvisionIdDelete(provision_id)
    setDeleteOpen(true)
  }

  const handleDeleteProvision = () => {
    setDeleteOpen(false)
    ProvisionsProvider.deleteProvision(provisionIdDelete).then(
      (response) => {
        console.log('provision: '+provisionIdDelete+' is deleted')
        setFilteredProvision(filteredProvision.filter(function(provision) {
          return provision.id !== provisionIdDelete
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
    let newSelectedProvisionIds;

    if (event.target.checked) {
      newSelectedProvisionIds = provisions.map((provision) => provision.id);
    } else {
      newSelectedProvisionIds = [];
    }

    setSelectedProvisionIds(newSelectedProvisionIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedProvisionIds.indexOf(id);
    let newSelectedProvisionIds = [];

    if (selectedIndex === -1) {
      newSelectedProvisionIds = newSelectedProvisionIds.concat(selectedProvisionIds, id);
    } else if (selectedIndex === 0) {
      newSelectedProvisionIds = newSelectedProvisionIds.concat(selectedProvisionIds.slice(1));
    } else if (selectedIndex === selectedProvisionIds.length - 1) {
      newSelectedProvisionIds = newSelectedProvisionIds.concat(selectedProvisionIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedProvisionIds = newSelectedProvisionIds.concat(
        selectedProvisionIds.slice(0, selectedIndex),
        selectedProvisionIds.slice(selectedIndex + 1)
      );
    }

    setSelectedProvisionIds(newSelectedProvisionIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleClickEdit = (e,provision) => {

    const data = {
     pathname: '/provision/edit-provision',
     query:{'provisionId':provision.id}
    }
    router.push(data);
  }

  

 

  

  return (
    <Box {...rest}>
      {provisions.length!==0 &&<ProvisionFilter provisions={provisions} 
      setFilteredProvision={setFilteredProvision} />}
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
                    checked={selectedProvisionIds.length === provisions.length}
                    color="primary"
                    indeterminate={
                      selectedProvisionIds.length > 0
                      && selectedProvisionIds.length < provisions.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  Reference
                </TableCell>
                <TableCell>
                  Destination
                </TableCell>
                <TableCell>
                  Cree Par
                </TableCell>
                <TableCell>
                  Delai
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
              {filteredProvision.slice(page*limit, page*limit+limit).map((provision) => (

                <TableRow
                  hover
                  key={provision.id}
                  selected={selectedProvisionIds.indexOf(provision.id) !== -1}
                  
                >
                {console.log(provision.created_on)}
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedProvisionIds.indexOf(provision.id) !== -1}
                      onChange={(event) => handleSelectOne(event, provision.id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    {provision.ref == null && '_' || provision.ref}
                  </TableCell>
                  <TableCell>
                    {provision.destination}
                  </TableCell>
                  <TableCell>
                    {provision.created_by.username}
                  </TableCell>
                  <TableCell>
                    {provision.delay}
                  </TableCell>
                  <TableCell align="center">
                    <Label
                      variant={status_style[provision.status][0]}
                      color={status_style[provision.status][1]}
                    >
                      {status_text[provision.status]}
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
                    {provision.status !== '0' &&
                      <ViewIcon 
                        sx={{
                          mx:1
                        }}
                        onClick = {(event) => {handleClickEdit(event, provision)}}
                       />
                      || <><EditIcon 
                        sx={{
                          mx:1
                        }}
                        onClick = {(event) => {handleClickEdit(event, provision)}}
                       />
                        
                       <DeleteIcon 
                        sx={{
                          mx:1
                        }}
                        onClick = {(event) => {handleDeleteOpen(event, provision.id)}}
                      /></>
                     }
                      

                    </Box>
                    
                  </TableCell>
                </TableRow>
              ))}
              {filteredProvision.length === 0 && 
                <TableRow>
                  <TableCell colSpan={7}
                  align="center" >
                    Aucune demande d`&apos;`appro existe
                  </TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={filteredProvision.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
      <ProvisionDeleteDialog open={deleteOpen} 
      handleDeleteOpen={handleDeleteOpen} 
      handleClose={handleClose} 
      handleDeleteProvision={handleDeleteProvision} />
    </Box>
  );
};


