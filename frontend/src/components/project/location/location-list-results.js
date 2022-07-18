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
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { getInitials } from '../../../utils/get-initials';

import {ThreeDots as ThreeDotsIcon} from '../../../icons/three-dots'
import {Edit as EditIcon} from '../../../icons/edit'
import {Delete as DeleteIcon} from '../../../icons/delete'
import {View as ViewIcon} from '../../../icons/view'

import LocationProvider from '../../../services/location-provider'

import {LocationDeleteDialog} from './location-delete-dialog'

export const LocationListResults = ({ location_list, ...rest}) => {
  const [selectedLocationIds, setSelectedLocationIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const [locations, setLocations] = useState(location_list)
  const router = useRouter();

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [locationIdDelete, setLocationIdDelete] = useState(-1)

  const [errorSBOpen, setErrorSBOpen] = useState(false)

  const [loadingOpen, setLoadingOpen] = useState(false)
  const [errorSBText, setErrorSBText] = useState("")

  const CANNOT_DELETE_ERROR = "Ce site ne peux pas etre supprimer."
  const CONNECTION_ERROR = "Probleme de connexion, Veuillez de ressayer"


  const handleClose = () => {
    setDeleteOpen(false)
  }
  const handleDeleteOpen = (event, location_id) => {
    setLocationIdDelete(location_id)
    setDeleteOpen(true)
  }

  const handleDeleteLocation = () => {
    setDeleteOpen(false)
    setLoadingOpen(true)
    LocationProvider.deleteLocation(locationIdDelete).then(
      (response) => {
        console.log('location: '+locationIdDelete+' is deleted')
        setLocations(locations.filter(function(location) {
          return location.id !== locationIdDelete
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
    let newSelectedLocationIds;

    if (event.target.checked) {
      newSelectedLocationIds = locations.map((location) => location.id);
    } else {
      newSelectedLocationIds = [];
    }

    setSelectedLocationIds(newSelectedLocationIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedLocationIds.indexOf(id);
    let newSelectedLocationIds = [];

    if (selectedIndex === -1) {
      newSelectedLocationIds = newSelectedLocationIds.concat(selectedLocationIds, id);
    } else if (selectedIndex === 0) {
      newSelectedLocationIds = newSelectedLocationIds.concat(selectedLocationIds.slice(1));
    } else if (selectedIndex === selectedLocationIds.length - 1) {
      newSelectedLocationIds = newSelectedLocationIds.concat(selectedLocationIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedLocationIds = newSelectedLocationIds.concat(
        selectedLocationIds.slice(0, selectedIndex),
        selectedLocationIds.slice(selectedIndex + 1)
      );
    }

    setSelectedLocationIds(newSelectedLocationIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleClickEdit = (e,location) => {

    const data = {
     pathname: '/project/location/edit-location/',
     query:{'id':location.id}
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
                    checked={selectedLocationIds.length === locations.length}
                    color="primary"
                    indeterminate={
                      selectedLocationIds.length > 0
                      && selectedLocationIds.length < locations.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  Id
                </TableCell>
                <TableCell>
                  Nom du site
                </TableCell>
                <TableCell>
                  Ville
                </TableCell>
                <TableCell>
                  Wilaya
                </TableCell>
                <TableCell align="center">
                  Code Postale
                </TableCell>
                <TableCell align="center">
                  <ThreeDotsIcon />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {locations.slice(page*limit, page*limit+limit).map((location)=>(
                <TableRow
                  hover
                  key={location.id}
                  selected={selectedLocationIds.indexOf(location.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedLocationIds.indexOf(location.id) !== -1}
                      onChange={(event) => handleSelectOne(event, location.id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    {location.id}
                  </TableCell>
                  <TableCell>
                    {location.name}
                  </TableCell>
                  <TableCell>
                    {location.city}
                  </TableCell>
                  <TableCell>
                    {location.state}
                  </TableCell>
                  <TableCell align="center">
                    {location.codePostal}
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
                        onClick = {(event) => {handleClickEdit(event, location)}}
                       />
                        
                       <DeleteIcon 
                        sx={{
                          mx:1
                        }}
                        onClick = {(event) => {handleDeleteOpen(event, location.id)}}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {locations.length === 0 && 
                <TableRow>
                  <TableCell colSpan={7}
                  align="center" >
                    Aucun site existe
                  </TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>  
      <TablePagination
        component="div"
        count={locations.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
      <LocationDeleteDialog open={deleteOpen} 
      handleDeleteOpen={handleDeleteOpen} 
      handleClose={handleClose}
      handleDeleteLocation={handleDeleteLocation} />

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

LocationListResults.propTypes = {
  location_list: PropTypes.array.isRequired
};












