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



export const StockListResults = ({ stockList, ...rest}) => {

  const [selectedStockIds, setSelectedStockIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const [stocks, setStocks] = useState(stockList)
  const router = useRouter();

  const [deleteOpen, setDeleteOpen] = useState(false)
  // const [storeIdDelete, setStoreIdDelete] = useState(-1)

  const [errorSBOpen, setErrorSBOpen] = useState(false)

  const [loadingOpen, setLoadingOpen] = useState(false)
  const [errorSBText, setErrorSBText] = useState("")

  const CANNOT_DELETE_ERROR = "Ce fournisseur ne peux pas etre supprimé."
  const CONNECTION_ERROR = "Probleme de connexion, Veuillez de ressayer"


  const handleClose = () => {
    setDeleteOpen(false)
  }
  

  

  const handleSelectAll = (event) => {
    let newSelectedStockIds;

    if (event.target.checked) {
      newSelectedStockIds = stocks.map((stock) => stock.id);
    } else {
      newSelectedStockIds = [];
    }

    setSelectedStockIds(newSelectedStockIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedStockIds.indexOf(id);
    let newSelectedStockIds = [];

    if (selectedIndex === -1) {
      newSelectedStockIds = newSelectedStockIds.concat(selectedStockIds, id);
    } else if (selectedIndex === 0) {
      newSelectedStockIds = newSelectedStockIds.concat(selectedStockIds.slice(1));
    } else if (selectedIndex === selectedStockIds.length - 1) {
      newSelectedStockIds = newSelectedStockIds.concat(selectedStockIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedStockIds = newSelectedStockIds.concat(
        selectedStockIds.slice(0, selectedIndex),
        selectedStockIds.slice(selectedIndex + 1)
      );
    }

    setSelectedStockIds(newSelectedStockIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  

  const handleClickStock = (e,stock) => {
    const data = {
     pathname: '/stock/detail-stock',
     query:{'stockId':stock.id}
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
                    checked={selectedStockIds.length === stocks.length}
                    color="primary"
                    indeterminate={
                      selectedStockIds.length > 0
                      && selectedStockIds.length < stocks.length
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
                <TableCell>
                  Unité
                </TableCell>
                <TableCell>
                  Quantité
                </TableCell>
                <TableCell>
                  Prix Unitaire
                </TableCell>
                <TableCell>
                  Derniere mise à jour
                </TableCell>
                <TableCell align="center">
                  <ThreeDotsIcon />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stocks.slice(page*limit, page*limit+limit).map((stock)=>(
                <TableRow
                  hover
                  key={stock.id}
                  selected={selectedStockIds.indexOf(stock.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedStockIds.indexOf(stock.id) !== -1}
                      onChange={(event) => handleSelectOne(event, stock.id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    {stock.product.sku}
                  </TableCell>
                  <TableCell>
                    {stock.product.name}
                  </TableCell>
                  <TableCell>
                    {stock.product.base_unit.ref}
                  </TableCell>
                  <TableCell>
                    {stock.quantity}
                  </TableCell>
                  <TableCell>
                    {stock.price}
                  </TableCell>
                  <TableCell>
                    {format(new Date(stock.updated_on),"dd/MM/yyyy hh:mm")}
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
                          mx:1,
                          cursor: "pointer"
                        }}
                        onClick = {(event) => {handleClickStock(event,stock)}}
                       />
                        
                       
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {stocks.length === 0 && 
                <TableRow>
                  <TableCell colSpan={7}
                  align="center" >
                    Aucun article existe
                  </TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>  
      <TablePagination
        component="div"
        count={stocks.length}
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













