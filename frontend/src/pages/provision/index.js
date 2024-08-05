import Head from "next/head";
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Pagination,
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { ProvisionListToolbar } from "../../components/provision/provision-list-toolbar";
import { ProvisionListResults } from "../../components/provision/provision-list-results";
import { DashboardLayout } from "../../components/dashboard-layout";

import ProvisionsProvider from "../../services/provision-provider";

import { CONNECTION_ERROR } from "../../utils/constants";

const Provisions = () => {
  const [provisionsResponse, setProvisionsResponse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorSBOpen, setErrorSBOpen] = useState(false);
  const [loadingOpen, setLoadingOpen] = useState(true);
  const [errorSBText, setErrorSBText] = useState("");

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleSBClose = () => {
    setErrorSBOpen(false);
  };

  const handleSBOpen = (text) => {
    setErrorSBOpen(true);
    setErrorSBText(text);
  };

  useEffect(() => {
    const params = "limit=" + limit.toString() + "&" + "offset=" + (page * limit).toString();

    ProvisionsProvider.getProvisions(-1, params).then(
      (response) => {
        setLoadingOpen(false);
        setProvisionsResponse(response.data);
        setLoading(false);
      },
      (error) => {
        setLoadingOpen(false);
        handleSBOpen(CONNECTION_ERROR);
      }
    );
  }, [limit, page]);

  return (
    <>
      {" "}
      {(loading === true && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loadingOpen}
          onClick={() => {
            setLoadingOpen(false);
          }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )) || (
        <>
          <Head>
            <title>Provisions | Material Kit</title>
          </Head>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              py: 8,
            }}
          >
            <Container maxWidth={false}>
              <ProvisionListToolbar />
              <Box sx={{ mt: 3 }}>
                <ProvisionListResults
                  provision_list={provisionsResponse}
                  limit={limit}
                  setLimit={setLimit}
                  page={page}
                  setPage={setPage}
                />
              </Box>
            </Container>
          </Box>
        </>
      )}
      <Snackbar open={errorSBOpen} onClose={() => handleSBClose()}>
        <Alert variant="filled" severity="error">
          {errorSBText}
        </Alert>
      </Snackbar>
    </>
  );
};

Provisions.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Provisions;
