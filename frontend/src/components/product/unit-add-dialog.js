import * as React from 'react';
import { useState, useEffect } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
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

} from '@mui/material';
import { getInitials } from '../../utils/get-initials';
import { Positive as PositiveIcon } from '../../icons/positive';


import {ThreeDots as ThreeDotsIcon} from '../../icons/three-dots'
import {Edit as EditIcon} from '../../icons/edit'
import {Delete as DeleteIcon} from '../../icons/delete'
import Label from '../Label';

import ProductProvider from '../../services/product-provider'
import UnitProvider from '../../services/unit-provider'


export const UnitAddDialog = ({open, setOpen, handleUnitRefresh}) => {

  const [refError, setRefError] = useState(false)
  const [unitError, setUnitError] = useState(false)


  const handleClose = () => {
    setOpen(false);
  };

  const handleAddUnit = (e) => {
    e.preventDefault();
    setRefError(false)
    setUnitError(false)

    if (e.target.ref.value===" "){
      setRefError(prevState => (true))
    }
    if (e.target.unit.value===" "){
      setUnitError(prevState => (true))
    }


    if (!(e.target.ref.value===" ") && !(e.target.unit.value===" ")){
      const data = {
        ref: e.target.ref.value,
        name: e.target.unit.value
      }

      UnitProvider.addUnit(data).then(
        (response) => {
          handleUnitRefresh()
          setOpen(false)

        })
    }
    
  }



  return(
    <Dialog open={open} 
    onClose={handleClose}>
      <DialogTitle>AJOUTER UNITE</DialogTitle>
      <DialogContent
      >   
      <Box
      component="form"
      id='add-unit-form' 
      onSubmit={handleAddUnit}
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off">
        <TextField name="unit" 
          id="outlined-basic" 
          label="Unité" 
          variant="outlined" 
          placeholder="ex: Mètre liniaire" 
          required
          error={unitError}/>
        <TextField name="ref" 
          id="outlined-basic" 
          label="Reference" 
          variant="outlined" 
          placeholder="ex: M" 
          required
          error={refError}/>
      </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Annuler</Button>
        <Button form="add-unit-form" type = "submit">Ajouter</Button>
      </DialogActions>
    </Dialog>
    )

}