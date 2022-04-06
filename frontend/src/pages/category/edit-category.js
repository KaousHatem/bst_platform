import Head from 'next/head';
import NextLink from 'next/link';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {  Select, MenuItem, Box, Button, Container, Grid, Link, TextField, Typography, Card, CardContent, } from '@mui/material';
import {LocalizationProvider, DatePicker, AdapterDateFns} from '@mui/lab'
import InputLabel from '@mui/material/InputLabel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import {CategoryAddToolbar} from '../../components/category/category-add-toolbar'
import { DashboardLayout } from '../../components/dashboard-layout';
import frLocale from 'date-fns/locale/fr';

import { format } from 'date-fns'

import CategoryProvider from '../../services/category-provider'



const EditCategory = () => {




  const router = useRouter();
  const [categoryId, setCategoryId] = useState(router.query.id);
  const [category, setCategory] = useState({})
  const [loading, SetLoading] = useState(true)


  const handleOnSubmit = (e) => {
    e.preventDefault();
    const data = {
      'ref':e.target.ref.value,
      'name':e.target.name.value,
      
    }
    console.log(data)
    CategoryProvider.updateCategory(data,categoryId).then(
      (response) => {
        alert("done")
        console.log(response.data)
        router.push('/project/location/');
      },
      error => {
        alert(error.message)
      }
      )
  }


  useEffect(() => {

    if(categoryId && JSON.stringify(category) === "{}"){
      CategoryProvider.getCategories(categoryId).then(
        (response) => {
          console.log(response.data)
          setCategory(response.data)
          SetLoading(false)        
        },
        (error) => {
          alert(error.message)
        }
        )
    }
  },[])

  
  return (
    loading === false && 
    <>
    <Head>
      <title>
        EURL BST | MODIFIER UNE CATEGORIE
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
        <CategoryAddToolbar/>
        <Box sx={{ 
          mt: 3 ,
          backgroundColor: "white",
        }}>
          <Card>
            <CardContent>
              <Box >
                <form id="add-category-form" 
                onSubmit={(event) => handleOnSubmit(event)}>
                  <Grid container 
                  spacing={1} 
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item 
                    xs={6}>
                      <InputLabel>
                        Reference
                      </InputLabel>
                      <TextField
                        fullWidth
                        margin="normal"
                        name="ref"
                        type="text"
                        variant="outlined"
                        defaultValue={category.ref}
                      />
                    </Grid>
                    <Grid item 
                    xs={6}>
                      <InputLabel>
                        Nom du Category
                      </InputLabel>
                      <TextField
                        fullWidth
                        margin="normal"
                        name="name"
                        type="text"
                        variant="outlined"
                        defaultValue={category.name}
                      />
                    </Grid>
                    
                    
                  </Grid>
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

EditCategory.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default EditCategory;
