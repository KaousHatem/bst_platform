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
  Stack,
  Select,
  MenuItem,
  FormControl

} from '@mui/material';
import { getInitials } from '../../utils/get-initials';
import { Positive as PositiveIcon } from '../../icons/positive';


import {ThreeDots as ThreeDotsIcon} from '../../icons/three-dots'
import {Edit as EditIcon} from '../../icons/edit'
import {Delete as DeleteIcon} from '../../icons/delete'
import Label from '../Label';

import ProductProvider from '../../services/product-provider'
import UnitProvider from '../../services/unit-provider'


export const OUnitAddDialog = ({open, units, setOpen, baseUnit, convertedUnits, setConvertedUnits}) => {

  const [factError, setFactError] = useState(false)
  const [unitError, setUnitError] = useState(false)

  // const [units, setUnits] = useState([])

  const [loading, setLoading] = useState(true)


  const handleClose = () => {
    setOpen(false);
  };

  const handleAddUnit = (e) => {
    e.preventDefault();
    setFactError(false)
    setUnitError(false)
    
    if (e.target.unit.value===""){
      setUnitError(prevState => (true))
    }
    if (e.target.fact.value===""){
      setFactError(prevState => (true))
    }


    if (!(e.target.fact.value==="") && !(e.target.unit.value==="")){
      const data = {
        unit: units.find((unit)=>{return unit.ref===e.target.unit.value}),
        facteur: e.target.fact.value

      }

      setConvertedUnits(oldUnits=>[...oldUnits, data])
      setOpen(false)
      
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
        '& > :not(style)': { m: 1, width: '50ch' },
      }}
      noValidate
      autoComplete="off">
        <Stack
          direction="row"
          spacing={2}
          sx={{
              my: 2
            }} 
        >
          <FormControl fullWidth>
            <InputLabel>
              Type d'Unité
            </InputLabel>
            <Select
              fullWidth
              name="unit"
              margin="normal"
              defaultValue={""}
              labelId="demo-simple-select-label"
              label="Type d'Unité"
              id="demo-simple-select"
              required
              error={unitError}
            >
              {units.slice(0,units.length).map((unit) => (
                unit.ref!==baseUnit && !convertedUnits.map((unit)=>{return unit.unit.ref}).includes(unit.ref) &&
                <MenuItem 
                key={unit.ref} 
                value={unit.ref}>{unit.name}</MenuItem>
                ))}
            </Select>
          </FormControl>
          
          <TextField name="fact" 
            id="outlined-basic" 
            label="Facteur" 
            variant="outlined" 
            placeholder="ex: 10" 
            required
            error={factError}/>
        </Stack>
        
      </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Annuler</Button>
        <Button form="add-unit-form" type = "submit">Ajouter</Button>
      </DialogActions>
    </Dialog>
    )

}