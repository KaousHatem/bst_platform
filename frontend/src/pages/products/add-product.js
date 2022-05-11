import Head from 'next/head';
import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Select, MenuItem, Box, Button, Container, Grid, Link, TextField, Typography, Card, CardContent, IconButton,Stack} from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import { ProductAddToolbar } from '../../components/product/product-add-toolbar';
import { DashboardLayout } from '../../components/dashboard-layout';
import { UnitAddDialog } from '../../components/product/unit-add-dialog'

import CategoryProvider from '../../services/category-provider'
import ProductProvider from '../../services/product-provider'
import UnitProvider from '../../services/unit-provider'


const AddProduct = () => {

  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [units, setUnits] = useState([])
  const [sku, setSku] = useState("")
  const [id, setId] = useState("")
  const router = useRouter();

  const [open, setOpen] = useState(false)

  useEffect(() => {
    Promise.all([
      CategoryProvider.getCategories(),
      ProductProvider.getLastProduct(),
      UnitProvider.getUnits(),
      ]).then((responses) => {
        console.log(responses)
        if(responses.length){
          setLoading(false)
          setCategories(responses[0].data)
          setId(("0000000"+(responses[1].data.id+1)).slice(-7))
          setUnits(responses[2].data)
        }
      })
  },[])

  const handleCategorySelector = (e) => {
    const category = categories[categories.findIndex(item => item.ref === e.target.value)]
    setSku(category.ref+id)
  }



  const handleOnSubmit = (e) => {
    e.preventDefault();
    console.log(e.target.category.value)
    const data = {
      name: e.target.name.value,
      category: e.target.category.value,
      base_unit: e.target.unit.value,
    }

    if(e.target.description.value){
      data.description = e.target.description.value
    }
    console.log(data)

    ProductProvider.addProduct(data).then(
      (response) => {
        alert("done")
        router.push('/products/list-product');
      },
      error => {
        alert(error.message)
      }
      )
  }
  
  const handleUnitRefresh = () => {
    UnitProvider.getUnits().then(
      (response) => {
        setUnits(response.data)
      })
  }


  return ( !loading && 
    <>
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
                  <InputLabel>
                    Sku 
                  </InputLabel>
                  <TextField
                    fullWidth
                    margin="dense"
                    name="sku"
                    type="text"
                    variant="outlined"
                    value={sku}
                    disabled
                  />
                  <InputLabel>
                    Designation 
                  </InputLabel>
                  <TextField
                    fullWidth
                    margin="dense"
                    name="name"
                    type="text"
                    variant="outlined"
                  />
                  <InputLabel>
                    Groupe 
                  </InputLabel>
                  <Select
                    fullWidth
                    name="category"
                    margin="dense"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    defaultValue={""}
                    onChange={handleCategorySelector}
                    sx={{
                      my: 2
                    }} 
                  >
                    {categories.slice(0,categories.length).map((category) => (
                      <MenuItem 
                      key={category.ref} 
                      value={category.ref}>{category.name}</MenuItem>
                    ))}
                  </Select>
                  <InputLabel>
                    Description 
                  </InputLabel>
                  <TextField
                    fullWidth
                    margin="dense"
                    name="description"
                    type="text"
                    variant="outlined"
                  />
                  <InputLabel>
                    Unité 
                  </InputLabel>
                  
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                        my: 2
                      }} 
                  >
                    <Select
                      fullWidth
                      name="unit"
                      margin="normal"
                      defaultValue={""}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                    >
                      {units.slice(0,units.length).map((unit) => (
                        <MenuItem 
                        key={unit.ref} 
                        value={unit.ref}>{unit.name}</MenuItem>
                        ))}
                    </Select>
                    <IconButton aria-label="fingerprint" 
                    color="secondary" 
                    onClick={() => setOpen(true)}
                    >
                      <AddCircleIcon />
                    </IconButton>
                  </Stack>
                </form>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
    <UnitAddDialog open={open} setOpen={setOpen} handleUnitRefresh={handleUnitRefresh}/>
  </>
  );
};

AddProduct.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default AddProduct;
