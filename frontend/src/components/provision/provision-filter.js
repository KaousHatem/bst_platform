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




export const ProvisionFilter = ({provisions, setFilteredProvision, ...props}) => {

  const status_text = {
    '-1':"",
    0: "Brouillon",
    1: "Nouveau",
    4: "Annulé",
    9: "Apprové",
    99: "En Livraison",
    999: "Complète"
  }

  const [filterOpen, setFilterOpen] = useState(false)
  const [filterValue, setFilterValue] = useState(null)

  const [valueDelay, setValueDelay] = useState([null, null]);

  const handleChangeFilter = (e) => {
    setFilterValue(e.target.value)
  } 

  const handleFilterOpen = () => {
    setFilterOpen(!filterOpen)
  }

  const handleFilterApply = () => {

    const filterList = provisions.filter((provision) => {
      const filter1 = filterValue === null || provision.status === filterValue
      const filter2 = (valueDelay[0]=== null || new Date(provision.delay) >= new Date(valueDelay[0])) && ( valueDelay[1]=== null || new Date(provision.delay) <= new Date(valueDelay[1]))

      return filter1 && filter2
    })
    setFilteredProvision(filterList)
    setFilterOpen(false)

  }

  const handleFilterReset = () => {
    setFilterValue(null)
    setFilteredProvision(provisions)
    setValueDelay([null, null])
    setFilterOpen(false)
  }

  useEffect(() => {
    console.log(provisions)
  },[provisions])

  return (    
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
                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  variant="standard"
                  label="Status"
                  value={filterValue}
                  onChange={handleChangeFilter}
                >
                { Object.keys(status_text).map((key)=>(
                    key!=='-1' && <MenuItem value={key}>{status_text[key]}</MenuItem>
                  ))
                  
                }
                </Select>
                </FormControl >
                <InputLabel sx={{m:2}} >Delai</InputLabel>
                <DateRangePicker
                  startText="Debut"
                  endText="Fin"
                  value={valueDelay}
                  onChange={(newValue) => {
                    setValueDelay([newValue[0]!==null && format(newValue[0],'yyyy-MM-dd'),newValue[1]!==null && format(newValue[1],'yyyy-MM-dd') || null]);
                  }}
                  renderInput={(startProps, endProps) => (
                    <Fragment>
                      <TextField {...startProps} />
                      <Box sx={{ mx: 2 }}> vers </Box>
                      <TextField {...endProps} />
                    </Fragment>
                  )}
                />
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
  