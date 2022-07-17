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
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Backdrop,
  Snackbar,
  Alert,
  CircularProgress,
  FormControl,
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


const EditProduct = (props) => {

  const router = useRouter();
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [units, setUnits] = useState([])



  const [id, setId] = useState(router.query.id)
  const [product, setProduct] = useState({})

  const [open, setOpen] = useState(false)
  const [otherUnitsOpen, setOtherUnitsOpen] = useState(false)

  const [currentUnit, setCurrentUnit] = useState()
  const [convertedUnits, setConvertedUnits] = useState([])
  const [oldConvertedUnits, setOldConvertedUnits] = useState([])

  const [nameError,setNameError] = useState(false)
  const [categoryError,setCategoryError] = useState(false)
  const [baseUnitError,setBaseUnitError] = useState(false)

  const [errorSBOpen, setErrorSBOpen] = useState(false)
  const [errorSBText, setErrorSBText] = useState("")

  const CONNECTION_ERROR = "Probleme de connexion, Veuillez de ressayer"

  const [loadingOpen, setLoadingOpen] = useState(false)


  useEffect(() => {
    if(id){
      setLoadingOpen(true)
      Promise.all([
      CategoryProvider.getCategories(),
      ProductProvider.getProducts(id),
      UnitProvider.getUnits(),
      ]).then((responses) => {
        console.log(responses)
        if(responses.length){
          setCategories(responses[0].data)
          setProduct(responses[1].data)
          setUnits(responses[2].data)
          setCurrentUnit(responses[1].data.base_unit)
          setOldConvertedUnits(responses[1].data.unit_conversions.map((convertedUnit)=>{
            return {
              id:convertedUnit.id,
              unit: convertedUnit.to_unit,
              facteur: convertedUnit.multiplier,
            }
          }))
          setConvertedUnits(responses[1].data.unit_conversions.map((convertedUnit)=>{
            return {
              id:convertedUnit.id,
              unit: convertedUnit.to_unit,
              facteur: convertedUnit.multiplier,
            }
          }))
          setLoading(false)
          setLoadingOpen(false)
        }
      },(errors)=>{
        setLoadingOpen(false)
        handleSBOpen(CONNECTION_ERROR)
      })
    }
    

  },[id])

  const handleCategorySelector = (e) => {
    const category = categories[categories.findIndex(item => item.id === e.target.value)]

  }

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const data = {
      name: e.target.name.value,
      category: e.target.category.value,
      base_unit: e.target.unit.value,
    }

    if(e.target.description.value){
      data.description = e.target.description.value
    }

    const updateList = convertedUnits.filter((convertedUnit)=>{
      const unit = oldConvertedUnits.find((unit)=>{
        if(unit.unit.ref === convertedUnit.unit.ref){
          return unit.facteur !== parseInt(convertedUnit.facteur)
        }
      })
      return unit !== undefined
    }).map((convertedUnit)=>{
      const data = {
          id: oldConvertedUnits.find((unit)=>{return unit.unit.ref===convertedUnit.unit.ref}).id,
          product: product.id,
          base_unit: units.find((unit)=>{return unit.ref===e.target.unit.value}).id ,
          to_unit: convertedUnit.unit.id,
          multiplier: convertedUnit.facteur
        }
      return data
    })

    const updateIds = oldConvertedUnits.filter((convertedUnit)=>{
      const unit = convertedUnits.find((unit)=>{
        if(unit.unit.ref === convertedUnit.unit.ref){
          return unit.facteur !== parseInt(convertedUnit.facteur)
        }
      })
      return unit !== undefined
    }).map((convertedUnit)=>{
      
      return convertedUnit.id
    })


    const dataList = convertedUnits.filter((convertedUnit)=>{
      const unit = oldConvertedUnits.find((unit)=>{  
        return unit.unit.ref===convertedUnit.unit.ref
        })
      return unit === undefined
    }).map((convertedUnit)=>{
      const data = {
          product: product.id,
          base_unit: units.find((unit)=>{return unit.ref===e.target.unit.value}).id ,
          to_unit: convertedUnit.unit.id,
          multiplier: convertedUnit.facteur
        }
      return data
    })

    const deleteIds = oldConvertedUnits.filter((convertedUnit)=>{
      return convertedUnits.find((unit)=>{return unit.unit.ref===convertedUnit.unit.ref})===undefined
    }).map((convertedUnit)=>{
      return convertedUnit.id
    })

   
    setLoadingOpen(true)
    Promise.all([
      ProductProvider.editProduct(data,id),
      updateList.length !== 0 && UnitConversionProvider.bulkUpdateUnitConversion(updateIds, updateList),
      dataList.length !== 0 && UnitConversionProvider.addUnitConversion(dataList),
      deleteIds.length !== 0 &&UnitConversionProvider.bulkDeleteUnitConversion(deleteIds),
      ]).then(
      (responses)=>{
        setLoadingOpen(false)
        router.push('/products');
      },
      (errors)=>{
        setLoadingOpen(false)
        handleSBOpen(CONNECTION_ERROR)
      })
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
        EURL BST | EDITER ARTICLE
      </title>
    </Head>
    { !loading && <Box
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
                    fullWidth
                    label="Sku"
                    margin="dense"
                    name="sku"
                    type="text"
                    variant="outlined"
                    value={product.sku}
                    disabled
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
                    defaultValue={product.name}
                    required
                    error={nameError}
                  />
                  <FormControl
                    sx={{
                            my: 2
                          }}  
                    fullWidth>
                    <InputLabel id="demo-simple-select-label">Categorie</InputLabel>
                    <Select
                      fullWidth
                      label="Categorie *"
                      name="category"
                      margin="dense"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      defaultValue={product.category}
                      disabled
                    >
                      {categories.slice(0,categories.length).map((category) => (
                        <MenuItem key={category.ref} 
                        value={category.ref}>{category.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    margin="dense"
                    name="description"
                    sx={{
                          my: 2
                        }} 
                    label="Description"
                    type="text"
                    variant="outlined"
                    defaultValue={product.description}

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
                        defaultValue={product.base_unit}
                        labelId="demo-simple-select-label"
                        label="Unité de base *"
                        id="demo-simple-select"
                        onChange={(e) =>{setCurrentUnit(e.target.value)}}
                        disabled={convertedUnits.length !== 0}
                        required
                        error={baseUnitError}
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
                      {  
                        convertedUnits.map((convertedUnit) => (
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
    </Box>}

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
        Probleme de connexion, Veuillez de ressayer
      </Alert>
    </Snackbar>
  </>
  );
};

EditProduct.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default EditProduct;
