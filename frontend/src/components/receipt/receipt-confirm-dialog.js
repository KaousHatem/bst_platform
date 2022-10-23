import * as React from 'react';
import { useState, useEffect } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { useTheme } from '@mui/material/styles';
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
  useMediaQuery,
  ToggleButtonGroup,
  ToggleButton

} from '@mui/material';

import { getInitials } from '../../utils/get-initials';
import { Positive as PositiveIcon } from '../../icons/positive';


import {ThreeDots as ThreeDotsIcon} from '../../icons/three-dots'
import {Edit as EditIcon} from '../../icons/edit'
import {Delete as DeleteIcon} from '../../icons/delete'
import Label from '../Label';



export const ReceiptConfirmDialog = ({product, products, setProducts, open, setOpen}) => {

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [fullWidth, setFullWidth] = React.useState(true);

  const [receivedQuantity, setReceivedQuantity] = useState(product.quantity)
  const [acceptedQuantity, setAcceptedQuantity] = useState(product.quantity)
  const [note, setNote] = useState(product.note)
  const [conformity, setConformity] = useState(product.conformity)


  const handleClose = () => {
    
    setOpen(false);
  };

  const handleConfirm = (e) => {
    
    let newArr = [...products]
    const index = newArr.map((p)=>{return p.id}).indexOf(product.id)
    newArr[index] = {
      ...product,
      receivedQuantity:receivedQuantity,
      acceptedQuantity:acceptedQuantity,
      note:note,
      conformity:conformity,
      received : (receivedQuantity && acceptedQuantity) ? true : false

    }
    setProducts(newArr)

    setNote()
    setConformity()
    setOpen(false);
  }

  const handleConformity = (event, new_conformity) => {
    setConformity(new_conformity);
  };

  const receiptProductUpdate = (productInput) => {
    setReceivedQuantity(productInput.receivedQuantity ? productInput.receivedQuantity : productInput.quantity)
    setAcceptedQuantity(productInput.acceptedQuantity ? productInput.acceptedQuantity : productInput.quantity)
    setNote(productInput.note)
    setConformity(productInput.conformity)
  }

  useEffect(()=>{
    if(open){
      receiptProductUpdate(product)

    }
  },[open])


  return(
    <Dialog
    fullWidth={true}
    maxWidth='sm'
    
    scroll="body"

    open={open} 
    onClose={handleClose}>
      <DialogTitle>CONFIRMER ARTICLE</DialogTitle>
      <DialogContent
      sx={{
        m:'15px'
      }} 
      >   
        
          <Grid 

          container 
          spacing={2} 
          >

            <Grid item
              xs={6}>
              <InputLabel>
                SKU
              </InputLabel>
              <Typography
              sx={{
                  // my: 2
                }} >
                {product.sku}
              </Typography>
            </Grid>
            <Grid item
              xs={6}>
              <InputLabel>
                DESIGNATION
              </InputLabel>
              <Typography
              sx={{
                  // my: 2
                }} >
                {product.name}
              </Typography>
            </Grid>
            <Grid item
              xs={4}>
              <InputLabel>
                QUANTITE
              </InputLabel>
              <Typography
              sx={{
                  // my: 2
                }} >
                {product.quantity}
              </Typography>
            </Grid>
            
          </Grid>

          <Box
            sx={{
              display:'flex',
              flexDirection:'column'
            }}
          >
            <TextField
              label="Quantité reçu"
              // fullWidth
              margin="normal"
              name="receivedQuantity"
              type="text"
              variant="outlined"
              value={receivedQuantity}
              required
              onChange={(e)=>{setReceivedQuantity(e.target.value)}}
            />
            <TextField
              label="Quantité accepté"
              // fullWidth
              margin="normal"
              name="acceptedQuantity"
              type="text"
              variant="outlined"
              value={acceptedQuantity}
              required
              onChange={(e)=>{setAcceptedQuantity(e.target.value)}}

            />
            <TextField
              id="outlined-multiline-static"
              label="Observation"
              name="note"
              margin="normal"
              // fullWidth
              multiline
              rows={4}
              value={note}
              onChange={(e)=>{setNote(e.target.value)}}
            />
            
            <ToggleButtonGroup
                sx={{
                  mt:'10px'
                }}
                value={conformity}
                exclusive
                onChange={handleConformity}
                aria-label="conformity"
              >
                <ToggleButton value="oui" 
                  aria-label="conforme">
                  conforme
                </ToggleButton>
                <ToggleButton value="non" 
                  aria-label="non-conforme">
                  non conforme
                </ToggleButton>
              </ToggleButtonGroup>
          </Box>


      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} >Annuler</Button>
        <Button onClick={handleConfirm }>Confirmer</Button>
      </DialogActions>
    </Dialog>
    )

}