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



export const ReceiptProductDialog = ({product, products, setProducts, open, setOpen}) => {

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [fullWidth, setFullWidth] = React.useState(true);

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
      note:note,
      conformity:conformity,
      status:'new'

    }
    console.log(newArr)
    setProducts(newArr)

    setNote()
    setConformity()
    setOpen(false);
  }

  const handleConformity = (event, new_conformity) => {
    setConformity(new_conformity);
  };

  useEffect(()=>{
    if(open){
      setNote(product.note)
      setConformity(product.conformity)
    }
  },[open])


  return(
    <Dialog
    // fullScreen={fullScreen}
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
            <InputLabel>
              QUANTITE
            </InputLabel>
            <Typography
            sx={{
                // my: 2
              }} >
              {product.quantityReceipt}
            </Typography>
            <InputLabel>
              QUANTITE
            </InputLabel>
            <Typography
            sx={{
                // my: 2
              }} >
              {product.quantityAccepted}
            </Typography>
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
                <ToggleButton value={true} aria-label="conforme">
                  conforme
                </ToggleButton>
                <ToggleButton value={false} aria-label="non-conforme">
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