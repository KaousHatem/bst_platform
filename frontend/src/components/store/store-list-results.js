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



export const StoreListResults = ({ storeList, ...rest}) => {

  const [selectedStoreIds, setSelectedStoreIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const [stores, setStores] = useState(storeList)
  const router = useRouter();

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [storeIdDelete, setStoreIdDelete] = useState(-1)

  const [errorSBOpen, setErrorSBOpen] = useState(false)

  const [loadingOpen, setLoadingOpen] = useState(false)
  const [errorSBText, setErrorSBText] = useState("")

  const CANNOT_DELETE_ERROR = "Ce fournisseur ne peux pas etre supprimé."
  const CONNECTION_ERROR = "Probleme de connexion, Veuillez de ressayer"


  const handleClose = () => {
    setDeleteOpen(false)
  }
  

  

  const handleSelectAll = (event) => {
    let newSelectedStoreIds;

    if (event.target.checked) {
      newSelectedStoreIds = stores.map((store) => store.id);
    } else {
      newSelectedStoreIds = [];
    }

    setSelectedStoreIds(newSelectedStoreIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedStoreIds.indexOf(id);
    let newSelectedStoreIds = [];

    if (selectedIndex === -1) {
      newSelectedStoreIds = newSelectedStoreIds.concat(selectedStoreIds, id);
    } else if (selectedIndex === 0) {
      newSelectedStoreIds = newSelectedStoreIds.concat(selectedStoreIds.slice(1));
    } else if (selectedIndex === selectedStoreIds.length - 1) {
      newSelectedStoreIds = newSelectedStoreIds.concat(selectedStoreIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedStoreIds = newSelectedStoreIds.concat(
        selectedStoreIds.slice(0, selectedIndex),
        selectedStoreIds.slice(selectedIndex + 1)
      );
    }

    setSelectedStoreIds(newSelectedStoreIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleClickEdit = (e,store) => {

    const data = {
     pathname: '/store/edit-store/',
     query:{'id':store.id}
    }
    router.push(data);
  }

  const handleClickStock = (e, store) => {
    const data = {
     pathname: '/stock/',
     query:{'id':store.id}
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
                    checked={selectedStoreIds.length === stores.length}
                    color="primary"
                    indeterminate={
                      selectedStoreIds.length > 0
                      && selectedStoreIds.length < stores.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  Magasin
                </TableCell>
                <TableCell>
                  Site
                </TableCell>
                <TableCell>
                  Responsable
                </TableCell>
                <TableCell>
                  Etat
                </TableCell>
                <TableCell>
                  Nombre Article
                </TableCell>
                <TableCell align="center">
                  <ThreeDotsIcon />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stores.slice(page*limit, page*limit+limit).map((store)=>(
                <TableRow
                  hover
                  key={store.id}
                  selected={selectedStoreIds.indexOf(store.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedStoreIds.indexOf(store.id) !== -1}
                      onChange={(event) => handleSelectOne(event, store.id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    {store.name}
                  </TableCell>
                  <TableCell>
                    {store.location}
                  </TableCell>
                  <TableCell>
                    {store.store_manager.fullname}
                  </TableCell>
                  <TableCell>
                    {store._open ? "ouvert" : "fermé"}
                  </TableCell>
                  <TableCell>
                    {store.products}
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
                        onClick = {(event) => {handleClickEdit(event, store)}}
                       />
                       <ViewIcon 
                        sx={{
                          mx:1,
                          cursor: "pointer"
                        }}
                        onClick = {(event) => {handleClickStock(event, store)}}
                       />
                        
                       
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {stores.length === 0 && 
                <TableRow>
                  <TableCell colSpan={7}
                  align="center" >
                    Aucun magasin existe
                  </TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>  
      <TablePagination
        component="div"
        count={stores.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
      
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













