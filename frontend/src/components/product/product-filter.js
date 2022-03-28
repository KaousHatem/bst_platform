import { useState, useEffect,Fragment } from 'react';
import { format } from 'date-fns'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardAction,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
  Collapse,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  FormControl,

} from '@mui/material';
import DateRangePicker from '@mui/lab/DateRangePicker';
import { Download as DownloadIcon } from '../../icons/download';
import { Search as SearchIcon } from '../../icons/search';
import { Upload as UploadIcon } from '../../icons/upload';
import { Positive as PositiveIcon } from '../../icons/positive';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

export const ProductFilter = ({products, setFilteredProducts, categories, ...props}) => {

  const unit_text = ['-1','U','M','KG']

  const [filterOpen, setFilterOpen] = useState(false)
  const [categoryFilterValue, setCategoryFilterValue] = useState(null)
  const [UnitFilterValue, setUnitFilterValue] = useState(null)

  const handleChangeCategoryFilter = (e) => {
    setCategoryFilterValue(e.target.value)
  } 

  const handleChangeUnitFilter = (e) => {
    setUnitFilterValue(e.target.value)
  } 

  const handleFilterOpen = () => {
    setFilterOpen(!filterOpen)
  }

  const handleFilterApply = () => {

    const filterList = products.filter((product) => {
      const filter1 = categoryFilterValue === null || product.category === categoryFilterValue
      const filter2 = UnitFilterValue === null || product.unit === UnitFilterValue


      return filter1 && filter2
    })
    setFilteredProducts(filterList)
    setFilterOpen(false)

  }

  const handleFilterReset = () => {
    setCategoryFilterValue(null)
    setUnitFilterValue(null)
    setFilteredProducts(products)
    setFilterOpen(false)
  }



  return(
    <Box {...props}>
      <Box sx={{ mb: 3 }}>
        <Card >
          <CardContent>
            <Box sx={{
              display:'flex',
              flexDirection:'row',
               }}>
              <TextField
                sx={{
                  maxWidth: 400
                }}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon
                        color="action"
                        fontSize="small"
                      >
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  )
                }}
                placeholder="Rechercher"
                variant="outlined"
              />
              <Button   startIcon={<FilterAltIcon />} 
                sx={{
                  ml: 'auto',
                  "&.MuiButtonBase-root:hover": {
                    bgcolor: "transparent"
                  }
                }}
                onClick = {handleFilterOpen}
              >
                Filtrer
              </Button>
            </Box>
          </CardContent>
          <Collapse in={filterOpen} 
          timeout="auto" 
          unmountOnExit>
            <CardContent>
              <Box sx={{
                display:'flex',
                flexDirection:'column',
              }} >
                <FormControl 
                sx={{ 
                  m: 1,
                  width: '30%' ,

                }}>
                <InputLabel id="demo-simple-select-label">Groupe</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  variant="standard"
                  label="Status"
                  value={categoryFilterValue}
                  onChange={handleChangeCategoryFilter}
                >
                { categories.map((category)=>(
                    <MenuItem key={category.ref} 
                    value={category.ref}>{category.name}</MenuItem>
                  ))
                  
                }
                </Select>
                </FormControl >
                <FormControl 
                sx={{ 
                  m: 1,
                  width: '30%' ,

                }}>
                <InputLabel id="demo-simple-select-label">Unité</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  variant="standard"
                  label="Status"
                  value={UnitFilterValue}
                  onChange={handleChangeUnitFilter}
                >
                { unit_text.map((unit)=>(
                    unit!=='-1' && <MenuItem value={unit}>{unit}</MenuItem>
                  ))
                  
                }
                </Select>
                </FormControl >
                
                <Box
                  sx={{
                      display:'flex',
                      flexDirection:'row',
                      alignSelf:'flex-end',
                    }}
                >
                  <Button
                    sx={{
                      mr:2,
                    }}
                    variant="contained"
                    onClick={handleFilterApply}
                  >
                    Appliquer
                  </Button>
                  <Button
                    sx={{
                      alignSelf:'flex-end'
                    }}
                    variant="outlined"
                    onClick={handleFilterReset}
                  >
                    reset
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Collapse>
        </Card>
      </Box>
    </Box>
    )
}