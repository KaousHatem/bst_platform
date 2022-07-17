import Head from 'next/head';
import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Select, 
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
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  FormControl,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,

} from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {ThreeDots as ThreeDotsIcon} from '../../icons/three-dots'
import {Delete as DeleteIcon} from '../../icons/delete'

import { ProductAddToolbar } from '../../components/product/product-add-toolbar';
import { DashboardLayout } from '../../components/dashboard-layout';
import { UnitAddDialog } from '../../components/product/unit-add-dialog'
import { OUnitAddDialog } from '../../components/product/other-unit-add-dialog'

import CategoryProvider from '../../services/category-provider'
import ProductProvider from '../../services/product-provider'
import UnitProvider from '../../services/unit-provider'
import UnitConversionProvider from '../../services/unit-conversion-provider'


const AddProduct = () => {

  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [units, setUnits] = useState([])
  const [sku, setSku] = useState("")
  const [id, setId] = useState("")
  const router = useRouter();

  const [open, setOpen] = useState(false)
  const [otherUnitsOpen, setOtherUnitsOpen] = useState(false)

  const [currentUnit, setCurrentUnit] = useState()

  const [convertedUnits, setConvertedUnits] = useState([])

  const [nameError,setNameError] = useState(false)
  const [categoryError,setCategoryError] = useState(false)
  const [baseUnitError,setBaseUnitError] = useState(false)

  const [errorSBOpen, setErrorSBOpen] = useState(false)
  const [errorSBText, setErrorSBText] = useState("")

  
  const CONNECTION_ERROR = "Probleme de connexion, Veuillez de ressayer"

  const [loadingOpen, setLoadingOpen] = useState(false)

  useEffect(() => {
    setLoadingOpen(true)
    Promise.all([
      CategoryProvider.getCategories(),
      ProductProvider.getLastProduct(),
      UnitProvider.getUnits(),
      ]).then((responses) => {
        if(responses.length){

          setCategories(responses[0].data)
          setId(("0000000"+(responses[1].data.id+1)).slice(-7))
          setUnits(responses[2].data)
          setLoading(false)
          setLoadingOpen(false)
        }
      },
      (error)=>{
        setLoadingOpen(false)
        handleSBOpen(CONNECTION_ERROR)
      }

      )
  },[])

  const handleCategorySelector = (e) => {
    const category = categories[categories.findIndex(item => item.ref === e.target.value)]
    setSku(category.ref+id)
  }


  const validationForm = (e) => {
    return !(e.target.name.value==="") && !(e.target.category.value==="") && !(e.target.unit.value==="")

  }

  const handleOnSubmit = (e) => {
    e.preventDefault();


    setNameError((prevState) => (e.target.name.value===""))
    setCategoryError((prevState)=>(e.target.category.value===""))
    setBaseUnitError((prevState)=>(e.target.unit.value===""))

    if (validationForm(e)){
      const data = {
        name: e.target.name.value,
        category: e.target.category.value,
        base_unit: e.target.unit.value,
      }

      if(e.target.description.value){
        data.description = e.target.description.value
      }
      setLoadingOpen(true)

      ProductProvider.addProduct(data).then(
        (response) => {
          if (convertedUnits.length!==0){
            const dataList = convertedUnits.map((unit)=>{
              return {
                product: response.data.id,
                base_unit: units.find((unit)=>{return unit.ref===response.data.base_unit}).id ,
                to_unit: unit.unit.id,
                multiplier: unit.facteur
              }
            })
            UnitConversionProvider.addUnitConversion(dataList).then(
              (response)=>{
                setLoadingOpen(false)
                router.push('/products');
              },
              (error)=>{
                setLoadingOpen(false)
                handleSBOpen(CONNECTION_ERROR)
              })
          }else{
            setLoadingOpen(false)
            router.push('/products');
          }
          
            
        },
        error => {
          console.log('error')
          setLoadingOpen(false)
          handleSBOpen(CONNECTION_ERROR)
        }
        )
    }
    
  }
  
  const handleUnitRefresh = () => {
    UnitProvider.getUnits().then(
      (response) => {
        setUnits(response.data)
      })
  }

  const handleSBClose = () => {
    setErrorSBOpen(false)
  }

  const handleSBOpen = (text) => {
    setErrorSBText(text)
    setErrorSBOpen(true)
  }


  return (
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
        EURL BST | AJOUTER ARTICLE
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
        <ProductAddToolbar />
        <Box sx={{ 
          mt: 3 ,
          backgroundColor: "white",
        }}>
          <Card>
            <CardContent>
              <Box sx={{ maxWidth: 500 }}>
                <form id='add-product-form' 
                onSubmit={handleOnSubmit}>
                  
                  <TextField
                    label="Sku"
                    fullWidth
                    margin="dense"
                    name="sku"
                    type="text"
                    variant="outlined"
                    value={sku}
                    disabled
                    sx={{
                          my: 2
                        }} 
                  />
                  <TextField
                    sx={{
                            my: 2
                          }} 
                    fullWidth
                    label="Désignation"
                    margin="dense"
                    name="name"
                    type="text"
                    variant="outlined"
                    required
                    error={nameError}
                  />
                  <FormControl
                    sx={{
                            my: 2
                          }}  
                    fullWidth>
                  <InputLabel id="demo-simple-select-label">Categorie *</InputLabel>
                  <Select
                    fullWidth
                    label="Categorie *"
                    name="category"
                    margin="dense"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    defaultValue={""}
                    onChange={handleCategorySelector}
                    required
                    error={categoryError}
                    
                  >
                    {categories.slice(0,categories.length).map((category) => (
                      <MenuItem 
                      key={category.ref} 
                      value={category.ref}>{category.name}</MenuItem>
                    ))}
                  </Select>
                  </FormControl>
                  <TextField
                    sx={{
                          my: 2
                        }} 
                    label="Description"
                    fullWidth
                    margin="dense"
                    name="description"
                    type="text"
                    variant="outlined"
                  />
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                          my: 2
                        }} 
                    
                  >
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Unité de base *</InputLabel>

                      <Select
                        fullWidth
                        name="unit"
                        margin="normal"
                        defaultValue={""}
                        labelId="demo-simple-select-label"
                        label="Unité de base *"
                        id="demo-simple-select"
                        value={currentUnit}
                        required
                        error={baseUnitError}
                        onChange={(e) =>{setCurrentUnit(e.target.value)}}
                      >
                        {units.slice(0,units.length).map((unit) => (
                          <MenuItem 
                          key={unit.ref} 
                          value={unit.ref}>{unit.name}</MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                    <IconButton aria-label="fingerprint" 
                    color="secondary" 
                    onClick={() => setOpen(true)}
                    >
                      <AddCircleIcon />
                    </IconButton>
                  </Stack>
                  <InputLabel>
                    Autre Unité
                  </InputLabel>
                  <Button
                    color="primary"
                    variant="contained"
                    sx={{ my: 2 }}
                    onClick={()=> setOtherUnitsOpen(true)}
                    disabled={currentUnit===undefined}
                  >
                    Ajouter une Unité
                  </Button>
                  <Table>
                    <TableHead sx={{
                      backgroundColor: '#F4F7FC',
                      textAlign: 'center'
                    }} 
                    >
                      <TableRow>
                        <TableCell>
                          Unité
                        </TableCell>
                        <TableCell>
                          Facteur
                        </TableCell>
                        <TableCell align="center">
                          <ThreeDotsIcon />
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {convertedUnits.map((convertedUnit) => (
                        <TableRow
                          hover
                          key={convertedUnit.id}
                        >
                          
                          <TableCell>
                            {convertedUnit.unit.name}
                          </TableCell>
                          <TableCell>
                            {convertedUnit.facteur}
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
                              
                              <DeleteIcon 
                                sx={{
                                  mx:1
                                }}
                                onClick={(event) => {
                                  setConvertedUnits(convertedUnits.filter((row) => {return row.unit.ref !== convertedUnit.unit.ref}))
                                }}
                              />
                            </Box>
                            
                            
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </form>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>

    <UnitAddDialog open={open} 
      setOpen={setOpen} 
      handleUnitRefresh={handleUnitRefresh}/>
    <OUnitAddDialog units={units} 
      open={otherUnitsOpen} 
      setOpen={setOtherUnitsOpen} 
      baseUnit={currentUnit} 
      convertedUnits={convertedUnits} 
      setConvertedUnits={setConvertedUnits}/>
    
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

AddProduct.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default AddProduct;
