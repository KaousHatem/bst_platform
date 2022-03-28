import Head from 'next/head';
import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Select, MenuItem, Box, Button, Container, Grid, Link, TextField, Typography, Card, CardContent, } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ProductAddToolbar } from '../../components/product/product-add-toolbar';
import { DashboardLayout } from '../../components/dashboard-layout';

import CategoryProvider from '../../services/category-provider'
import ProductProvider from '../../services/product-provider'


const EditProduct = (props) => {

  const [categories, setCategories] = useState([])

  const [sku, setSku] = useState("")
  const [name, setName] = useState("")
  const [category, setCategory] = useState(0)
  const [description, setDescription] = useState("")
  const [unit, setUnit] = useState("")

  const [id, setId] = useState("")
  const router = useRouter();
  const [product, setProduct] = useState({})


  useEffect(() => {
    CategoryProvider.getCategories().then(
        (response) => {
          setCategories(response.data)
        }
      )
    // setProduct(router.query)
    setSku(router.query.sku)
    setName(router.query.name)
    setCategory(router.query.category)
    setDescription(router.query.description)
    setUnit(router.query.unit)
    setId(router.query.id)
  },[])

  const handleCategorySelector = (e) => {
    const category = categories[categories.findIndex(item => item.id === e.target.value)]

  }

  const handleOnSubmit = (e) => {
    e.preventDefault();
    console.log(e.target.category.value)
    const data = {
      sku: sku,
      name: e.target.name.value,
      category: e.target.category.value,
      unit: e.target.unit.value,
    }

    if(e.target.description.value){
      data.description = e.target.description.value
    }


    ProductProvider.editProduct(data,id).then(
      (response) => {
        alert("done")
        router.push('/products/list-product');
      },
      error => {
        alert(error.message)
      }
      )
  }
  
  return (
    <>
    <Head>
      <title>
        EURL BST | EDITER ARTICLE
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
                    margin="normal"
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
                    margin="normal"
                    name="name"
                    type="text"
                    value={name}
                    variant="outlined"
                    onChange={(e) => {
                      setName(e.target.value)}}
                  />
                  <InputLabel>
                    Groupe 
                  </InputLabel>
                  <Select
                    fullWidth
                    name="category"
                    margin="normal"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    // defaultValue={parseInt(product.category)}
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value)}}
                    sx={{
                      my: 2
                    }} 
                    disabled
                  >
                    {categories.slice(0,categories.length).map((category) => (
                      <MenuItem key={category.ref} 
                      value={category.ref}>{category.name}</MenuItem>
                    ))}
                  </Select>
                  <InputLabel>
                    Description 
                  </InputLabel>
                  <TextField
                    fullWidth
                    margin="normal"
                    name="description"
                    type="text"
                    variant="outlined"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value)}}

                  />
                  <InputLabel>
                    Unité 
                  </InputLabel>
                  <Select
                    fullWidth
                    name="unit"
                    margin="normal"
                    // defaultValue={''+product.unit}
                    value={unit}
                    onChange={(e) => {
                      setUnit(e.target.value)}}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    sx={{
                      my: 2
                    }} 
                  >
                    <MenuItem value={"U"}>U</MenuItem>
                    <MenuItem value={"KG"}>KG</MenuItem>
                    <MenuItem value={"M"}>M</MenuItem>
                  </Select>
                </form>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  </>
  );
};

EditProduct.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default EditProduct;
