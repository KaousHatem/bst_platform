import Head from 'next/head';
import NextLink from 'next/link';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Select,
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
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
  FormControl,

} from '@mui/material';
import { LocalizationProvider, DatePicker, AdapterDateFns } from '@mui/lab'
import InputLabel from '@mui/material/InputLabel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { ProvisionAddToolbar } from '../../components/provision/provision-add-toolbar';
import { DashboardLayout } from '../../components/dashboard-layout';
import frLocale from 'date-fns/locale/fr';
import { ProvisionAddProduct } from '../../components/provision/provision-add-product';
import { customers } from '../../__mocks__/customers';
import { productPrivision as products } from '../../__mocks__/product-privision';

import { format } from 'date-fns'

import LocationProvider from '../../services/location-provider'
import ProvisionProvider from '../../services/provision-provider'
import ProvisionProductProvider from '../../services/provision-product-provider'
import UserProvider from '../../services/user-provider'

import UXAccess from '../../utils/ux-access'

const AddProvision = () => {

  const [loading, setLoading] = useState(true)

  const [value, setValue] = React.useState(new Date());
  const [locationValue, setLocationValue] = React.useState("");
  const [locations, setLocations] = useState([])
  const [userLocation, setUserLocation] = useState(null)

  const [selectedProducts, setSelectedProducts] = useState([])

  const router = useRouter();

  const [errorSBOpen, setErrorSBOpen] = useState(false)

  const [loadingOpen, setLoadingOpen] = useState(false)
  const [errorSBText, setErrorSBText] = useState("")

  const [locationError, setLocationError] = useState(false)

  const [allConfirmed, setAllConfirmed] = useState(false)

  const CONNECTION_ERROR = "Probleme de connexion, Veuillez de ressayer"
  const NO_PRODUCT_ERROR = "Veuillez de selectioner au moin un article"
  const ALL_CONFIRMED_ERROR = "Veuillez de confirmer tous les articles"
  const NO_VALIDATION_ERROR = "Veuillez de remplir les champs obligatoires"


  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const handleLocationChange = (newValue) => {
    setLocationValue(newValue.target.value)
  };

  const validationForm = () => {
    return locationValue !== ""
  }

  const handleOnSubmit = (e, status) => {
    e.preventDefault();
    const delay_date = format(value, 'yyyy-MM-dd')

    setLocationError((prevState) => (locationValue === ""))

    const data = {
      destination: locationValue,
      delay: delay_date,
      status: status,
      ref: null
    }



    if (validationForm()) {
      if (selectedProducts.length) {
        if (allConfirmed) {
          setLoadingOpen(true)
          ProvisionProvider.addProvision(data).then(
            (response) => {
              const provision_product_list = selectedProducts.map(product => {
                return {
                  product: product.data.id,
                  provision: response.data.id,
                  unit: product.unit.ref,
                  quantity: product.quantity
                }
              })
              ProvisionProductProvider.addProvisionProduct(provision_product_list).then(
                (response) => {
                  router.push('/provision');
                  setLoadingOpen(false)
                },
                error => {
                  console.log(error)
                  setLoadingOpen(false)
                  handleSBOpen(CONNECTION_ERROR)
                }
              )
            },
            error => {
              console.log(error)
              setLoadingOpen(false)
              handleSBOpen(CONNECTION_ERROR)
            }
          )
        } else {
          handleSBOpen(ALL_CONFIRMED_ERROR)
        }

      } else {
        handleSBOpen(NO_PRODUCT_ERROR)
      }
    } else {
      handleSBOpen(NO_VALIDATION_ERROR)
    }
  }

  const handleSBClose = () => {
    setErrorSBOpen(false)
  }

  const handleSBOpen = (text) => {
    setErrorSBText(text)
    setErrorSBOpen(true)
  }



  useEffect(() => {
    setLoadingOpen(true)
    Promise.all([
      LocationProvider.getLocations(),
      !UXAccess.hasAllLocationAccess() && UserProvider.getMeUser(),
    ]).then(
      responses => {
        setLocations(responses[0].data)
        if (responses[1]) {
          setLocationValue(responses[1].data.location)
        }
        setLoadingOpen(false)
      },
      errors => {
        console.log(errors)
        setLoadingOpen(true)
        handleSBOpen(CONNECTION_ERROR)
      })
  }, [])

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingOpen}
        onClick={() => { setLoadingOpen(false) }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Head>
        <title>
          EURL BST | AJOUTER DEMANDE APPRO
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
          <ProvisionAddToolbar isAddPage={true}
            handleSaveAsDraft={handleOnSubmit} />
          <Box sx={{
            mt: 3,
            backgroundColor: "white",
          }}>
            <Card>
              <CardContent>
                <Box >
                  <form id="add-provision-form"
                    onSubmit={(event) => handleOnSubmit(event, 1)}>
                    <Grid container
                      spacing={1}
                      columnSpacing={{
                        xs: 1, sm: 2, md: 3
                      }}>
                      <Grid item
                        xs={6}>
                        <TextField
                          fullWidth
                          label="Reference"
                          margin="dense"
                          name="ref"
                          type="text"
                          variant="outlined"
                          disabled
                        />
                      </Grid>
                      <Grid item
                        xs={6}>
                        <FormControl
                          fullWidth
                          sx={{
                            my: 1
                          }}
                        >
                          <InputLabel id="demo-simple-select-label">Destination de livraison *</InputLabel>
                          <Select
                            name="destination"
                            fullWidth
                            margin="dense"
                            label="Destination de livraison"
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={locationValue}
                            // selected={locationValue}
                            onChange={handleLocationChange}
                            disabled={!UXAccess.hasAllLocationAccess()}
                            required
                            error={locationError}
                          >
                            {locations.slice(0, locations.length).map((location) => (
                              <MenuItem key={location.name}
                                value={location.name}>{location.name}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item
                        xs={6}>
                        <DatePicker
                          name="delay"
                          label="Date de livraison *"
                          inputFormat="dd/MM/yyyy"
                          dateFormat="dd/MM/yyyy"
                          value={value}
                          selected={value}
                          onChange={handleChange}
                          renderInput={(params) => <TextField {...params}
                            fullWidth
                            sx={{
                              my: 2
                            }} />}
                          required
                          disablePast
                        />
                      </Grid>
                    </Grid>
                  </form>

                  <ProvisionAddProduct selectedProducts={selectedProducts}
                    setAllConfirmed={setAllConfirmed}
                    setSelectedProducts={setSelectedProducts} />
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>
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

AddProvision.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default AddProvision;
