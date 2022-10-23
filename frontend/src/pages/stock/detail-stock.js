import Head from 'next/head';
import NextLink from 'next/link';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import {  Select, 
  MenuItem, 
  Box, 
  Button, 
  Container, 
  Grid, 
  Link, 
  TextField, 
  Typography, 
  Card, 
  CardContent,
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import {LocalizationProvider, DatePicker, AdapterDateFns} from '@mui/lab'
import InputLabel from '@mui/material/InputLabel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {ThreeDots as ThreeDotsIcon} from '../../icons/three-dots'

import { StockDetailToolbar } from '../../components/stock/stock-detail-toolbar';

import { DashboardLayout } from '../../components/dashboard-layout';

import { ReceiptProduct } from '../../components/receipt/receipt-product'

import { format } from 'date-fns'

import StockProvider from '../../services/stock-provider'


import UXAccess from '../../utils/ux-access'


const StyledTableHead = styled(TableHead)(({ theme }) => ({
  '& .MuiTableCell-root': {
            fontSize: '10px',
          },
  
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '& .MuiTableCell-root': {
            fontSize: '0.7rem',
          },
  
}));

const DetailStock = () => {


  const router = useRouter();

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const [loading, setLoading] = useState(true)

  const [stockId, setStockId] = useState(router.query.stockId && parseInt(router.query.stockId) || undefined)
  
  const [stock, setStock] = useState()

  const [stockMovements, setStockMovements] = useState([])
 
  
  const [errorSBOpen, setErrorSBOpen] = useState(false)

  const [loadingOpen, setLoadingOpen] = useState(false)
  const [errorSBText, setErrorSBText] = useState("")

  
  const CONNECTION_ERROR = "Probleme de connexion, Veuillez de ressayer"


  

  const handleSBClose = () => {
    setErrorSBOpen(false)
  }

  const handleSBOpen = (text) => {
    setErrorSBText(text)
    setErrorSBOpen(true)
  }



  useEffect( () => {

    setLoadingOpen(true)
    Promise.all([
      StockProvider.getStocks(stockId)
      ]).then(
        responses => {
          console.log(responses)
          setStock(responses[0].data)
          setStockMovements(responses[0].data.stock_movement)
          setLoadingOpen(false)
          setLoading(false)
         

        }
        ,errors => {
          setLoadingOpen(false)
          handleSBOpen(CONNECTION_ERROR)
          setLoading(false)
        }
      )    
    
  },[stockId])


  
  return ( !loading &&
    <>
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loadingOpen}
      onClick={()=>{setLoadingOpen(false)}}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
    <Head>
      <title>
        EURL BST | STOCK
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth={false}>
        <StockDetailToolbar stockId={stock.id} />
        <Box sx={{ 
          mt: 3 ,
          backgroundColor: "white",
        }}>
          <Card>
            <CardContent>
              <Box >
                <Grid container 
                spacing={1} 
                columnSpacing={{ 
                  xs: 1, sm: 2, md: 3 }}>
                  <Grid item
                  xs={2}>
                    <InputLabel>
                      Sku
                    </InputLabel>
                    <Typography
                    sx={{
                        my: 2
                      }} >
                      {stock.product.sku}
                    </Typography>
                  </Grid>
                  <Grid item
                  xs={2}>
                    <InputLabel>
                      Designation
                    </InputLabel>
                    <Typography
                    sx={{
                        my: 2
                      }} >
                      {stock.product.name}
                    </Typography>
                  </Grid>
                  <Grid item
                  xs={2}>
                    <InputLabel>
                      quantité
                    </InputLabel>
                    <Typography
                    sx={{
                        my: 2
                      }} >
                      {stock.quantity}
                    </Typography>
                  </Grid>
                  <Grid item
                  xs={2}>
                    <InputLabel>
                      Unité
                    </InputLabel>
                    <Typography
                    sx={{
                        my: 2
                      }} >
                      {stock.product.base_unit.ref}
                    </Typography>
                  </Grid>
                  <Grid item
                  xs={2}>
                    <InputLabel>
                      Prix unitaire
                    </InputLabel>
                    <Typography
                    sx={{
                        my: 2
                      }} >
                      {stock.price}
                    </Typography>
                  </Grid>
                  <Grid item
                  xs={2}>
                    <InputLabel>
                      Prix Total
                    </InputLabel>
                    <Typography
                    sx={{
                        my: 2
                      }} >
                      -
                    </Typography>
                  </Grid>
                  
                </Grid>
                
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ 
          mt: 3 ,
          backgroundColor: "white",
        }}>
          <Card>
            <CardContent>
              <Box >
                <Table
                >
                  <StyledTableHead sx={{
                    backgroundColor: '#F4F7FC',
                    textAlign: 'center',
                    
                  }} >
                    <TableRow>
                      <TableCell>
                        Date
                      </TableCell>
                      <TableCell>
                        Type de movement
                      </TableCell>
                      <TableCell>
                        Justification
                      </TableCell>
                      <TableCell>
                        Reference
                      </TableCell>
                      <TableCell>
                        Quantité
                      </TableCell>
                      <TableCell>
                        Unité
                      </TableCell>
                      <TableCell>
                        Prix unitaire
                      </TableCell>
                      <TableCell>
                        Prix Total
                      </TableCell>
                      <TableCell align="center">
                        <ThreeDotsIcon />
                      </TableCell>
                    </TableRow>
                  </StyledTableHead>
                  <TableBody>
                   {stockMovements.slice(page*limit, page*limit+limit).map((stockMovement)=>(
                      <StyledTableRow
                        hover
                        key={0}
                        
                      >
                        <TableCell>
                          {format(new Date(stockMovement.created_on),"dd/MM/yyyy hh:mm")}
                        </TableCell>
                        <TableCell align="center">
                          {stockMovement.movement_type === "0" ? "Entrée" : stockMovement.movement_type === "1" ? "Sortie" : "Initialisation"}
                        </TableCell>
                        <TableCell align="center">
                          {stockMovement.movement_detail.justification === "0" ? "Achat" : stockMovement.movement_detail.justification === "1" ? "Achat sans dossier" : stockMovement.movement_detail.justification === "2" ? "Tansfert" : stockMovement.movement_detail.justification === "3" ? "Vers Chantier" : "-"}
                        </TableCell>
                        <TableCell align="center">
                          {stockMovement.movement_detail.reference === "" ? "-" : stockMovement.movement_detail.reference}
                        </TableCell>
                        <TableCell align="center">
                          {stockMovement.movement_detail.quantity}
                        </TableCell>
                        <TableCell align="center">
                          {stockMovement.movement_detail.unit}
                        </TableCell>
                        <TableCell align="center">
                          {stockMovement.movement_detail.price}
                        </TableCell>
                        <TableCell align="center">
                          {stockMovement.movement_detail.total_price}
                        </TableCell>
                        <TableCell align="center"
                          >
                          <ThreeDotsIcon />
                        </TableCell>
                      </StyledTableRow>
                    ))}
                    
                    {stockMovements.length === 0 && 
                      <TableRow>
                        <TableCell colSpan={9}
                        align="center" >
                          Aucun Movemens existe
                        </TableCell>
                      </TableRow>
                    }
                  </TableBody>
                </Table>      
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
    <Snackbar open={errorSBOpen} 
    onClose={handleSBClose}>
      <Alert variant="filled" 
      severity="error">
        {errorSBText}
      </Alert>
    </Snackbar>
  </>
  );
};

DetailStock.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default DetailStock;
