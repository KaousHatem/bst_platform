import { useState, useEffect } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { useRouter } from "next/router";
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
  Menu,
  MenuItem,
  Backdrop,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { getInitials } from "../../utils/get-initials";

import { ThreeDots as ThreeDotsIcon } from "../../icons/three-dots";
import { Edit as EditIcon } from "../../icons/edit";
import { Delete as DeleteIcon } from "../../icons/delete";
import { View as ViewIcon } from "../../icons/view";
import Label from "../Label";

import ProvisionsProvider from "../../services/provision-provider";
import { ProvisionDeleteDialog } from "./provision-delete-dialog";
import { ProvisionFilter } from "./provision-filter";

export const ProvisionListResults = ({
  provision_list,
  limit,
  setLimit,
  page,
  setPage,
  ...rest
}) => {
  const [selectedProvisionIds, setSelectedProvisionIds] = useState([]);

  const [provisions, setProvisions] = useState(provision_list.results);
  const [filteredProvision, setFilteredProvision] = useState(provision_list.results);
  const router = useRouter();

  const status_text = {
    0: "Brouillon",
    1: "Nouveau",
    4: "Annulé",
    9: "Approuvé",
    99: "En Livraison",
    999: "Complète",
  };

  const status_style = {
    0: ["outlined", "text"],
    1: ["filled", "primary"],
    4: ["filled", "error"],
    9: ["filled", "secondary"],
    99: ["filled", "info"],
    999: ["filled", "warning"],
  };

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [provisionIdDelete, setProvisionIdDelete] = useState(-1);

  const [errorSBOpen, setErrorSBOpen] = useState(false);
  const [errorSBText, setErrorSBText] = useState("");

  const CONNECTION_ERROR = "Probleme de connexion, Veuillez de ressayer";

  const [loadingOpen, setLoadingOpen] = useState(false);

  const handleClose = () => {
    setDeleteOpen(false);
  };
  const handleDeleteOpen = (event, provision_id) => {
    setProvisionIdDelete(provision_id);
    setDeleteOpen(true);
  };

  const handleDeleteProvision = () => {
    setDeleteOpen(false);
    setLoadingOpen(true);
    ProvisionsProvider.deleteProvision(provisionIdDelete).then(
      (response) => {
        setFilteredProvision(
          filteredProvision.filter(function (provision) {
            return provision.id !== provisionIdDelete;
          })
        );
        setLoadingOpen(false);
      },
      (error) => {
        setLoadingOpen(false);
        handleSBOpen(CONNECTION_ERROR);
      }
    );
  };

  const handleSelectAll = (event) => {
    let newSelectedProvisionIds;

    if (event.target.checked) {
      newSelectedProvisionIds = provisions.map((provision) => provision.id);
    } else {
      newSelectedProvisionIds = [];
    }

    setSelectedProvisionIds(newSelectedProvisionIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedProvisionIds.indexOf(id);
    let newSelectedProvisionIds = [];

    if (selectedIndex === -1) {
      newSelectedProvisionIds = newSelectedProvisionIds.concat(selectedProvisionIds, id);
    } else if (selectedIndex === 0) {
      newSelectedProvisionIds = newSelectedProvisionIds.concat(selectedProvisionIds.slice(1));
    } else if (selectedIndex === selectedProvisionIds.length - 1) {
      newSelectedProvisionIds = newSelectedProvisionIds.concat(selectedProvisionIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedProvisionIds = newSelectedProvisionIds.concat(
        selectedProvisionIds.slice(0, selectedIndex),
        selectedProvisionIds.slice(selectedIndex + 1)
      );
    }

    setSelectedProvisionIds(newSelectedProvisionIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleClickEdit = (e, provision) => {
    const data = {
      pathname: "/provision/edit-provision",
      query: { provisionId: provision.id },
    };
    router.push(data);
  };

  const handleSBClose = () => {
    setErrorSBOpen(false);
  };

  const handleSBOpen = (text) => {
    setErrorSBText(text);
    setErrorSBOpen(true);
  };

  useEffect(() => {
    setProvisions(provision_list.results);
    setFilteredProvision(provision_list.results);
  }, [provision_list]);

  return (
    <Box {...rest}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingOpen}
        onClick={() => {
          setLoadingOpen(false);
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {provisions.length !== 0 && (
        <ProvisionFilter
          provisions={provisions}
          setFilteredProvision={setFilteredProvision}
          setPage={setPage}
          setLimit={setLimit}
        />
      )}
      <PerfectScrollbar>
        <Box sx={{ minWidth: "100%" }}>
          <Table>
            <TableHead
              sx={{
                backgroundColor: "#F4F7FC",
                textAlign: "center",
              }}
            >
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedProvisionIds.length === provisions.length}
                    color="primary"
                    indeterminate={
                      selectedProvisionIds.length > 0 &&
                      selectedProvisionIds.length < provisions.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Reference</TableCell>
                <TableCell>Destination</TableCell>
                <TableCell>Créée Par</TableCell>
                <TableCell>Créée le</TableCell>
                <TableCell align="center">statut</TableCell>
                <TableCell align="center">
                  <ThreeDotsIcon />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProvision.map((provision) => (
                <TableRow
                  hover
                  key={provision.id}
                  selected={selectedProvisionIds.indexOf(provision.id) !== -1}
                >
                  {console.log(provision.created_on)}
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedProvisionIds.indexOf(provision.id) !== -1}
                      onChange={(event) => handleSelectOne(event, provision.id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>{(provision.ref == null && "_") || provision.ref}</TableCell>
                  <TableCell
                    sx={{
                      width: "40%",
                    }}
                  >
                    {provision.destination}
                  </TableCell>
                  <TableCell>{provision.created_by.fullname}</TableCell>
                  <TableCell>{format(new Date(provision.created_on), "dd/MM/yyyy")}</TableCell>
                  <TableCell align="center">
                    <Label
                      variant={status_style[provision.status][0]}
                      color={status_style[provision.status][1]}
                    >
                      {status_text[provision.status]}
                    </Label>
                  </TableCell>
                  <TableCell>
                    <Box
                      align="center"
                      sx={{
                        justifyContent: "center",
                        display: "flex",
                      }}
                    >
                      {(provision.status !== "0" && (
                        <ViewIcon
                          sx={{
                            mx: 1,
                            cursor: "pointer",
                          }}
                          onClick={(event) => {
                            handleClickEdit(event, provision);
                          }}
                        />
                      )) || (
                        <>
                          <EditIcon
                            sx={{
                              mx: 1,
                              cursor: "pointer",
                            }}
                            onClick={(event) => {
                              handleClickEdit(event, provision);
                            }}
                          />

                          <DeleteIcon
                            sx={{
                              mx: 1,
                              cursor: "pointer",
                            }}
                            onClick={(event) => {
                              handleDeleteOpen(event, provision.id);
                            }}
                          />
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {filteredProvision.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Aucune demande d&apos;appro existe
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={provision_list.count}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[10, 25, 50]}
      />
      <ProvisionDeleteDialog
        open={deleteOpen}
        handleDeleteOpen={handleDeleteOpen}
        handleClose={handleClose}
        handleDeleteProvision={handleDeleteProvision}
      />
      <Snackbar open={errorSBOpen} onClose={handleSBClose}>
        <Alert variant="filled" severity="error">
          Probleme de connexion, Veuillez de ressayer
        </Alert>
      </Snackbar>
    </Box>
  );
};
