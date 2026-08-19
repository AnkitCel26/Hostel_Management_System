import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import {
  GET_ALL_PGS_ROOMS,
  CREATE_PG,
  UPDATE_PG,
} from "../../graphql/pgManagement.api";

import type { AllPgs } from "../../types/PgManagement.types";

interface PgForm {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contactNo: string;
  description: string;
  isActive: boolean;
}

const emptyForm: PgForm = {
  name: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  contactNo: "",
  description: "",
  isActive: true,
};

const PgManagement = () => {
  const [open, setOpen] = useState(false);
  const [editingPg, setEditingPg] = useState<AllPgs | null>(null);
  const [form, setForm] = useState<PgForm>(emptyForm);
  const [formError, setFormError] = useState("");

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(9);

  const { data, loading, error } = useQuery(GET_ALL_PGS_ROOMS, {
    variables: {
      input: {
        page,
        limit,
      },
    },
  });

  const [createPg, { loading: creating }] = useMutation(CREATE_PG);

  const [updatePg, { loading: updating }] = useMutation(UPDATE_PG);

  const pgs = data?.getAllPgsRooms.items ?? [];
  const totalPages = data?.getAllPgsRooms.totalPages ?? 0;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  const handleCreate = () => {
    setFormError("");
    setEditingPg(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const handleEdit = (pg: AllPgs) => {
    setFormError("");
    setEditingPg(pg);

    setForm({
      name: pg.name,
      address: pg.address,
      city: pg.city,
      state: pg.state,
      pincode: pg.pincode,
      contactNo: pg.contactNo,
      description: pg.description ?? "",
      isActive: pg.isActive,
    });

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingPg(null);
    setForm(emptyForm);
    setFormError("");
  };

  const handleChange = (field: keyof PgForm, value: string | boolean) => {
    setFormError("");
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const isFormValid = () => {
    if (editingPg) {
      return (
        form.address.trim() !== "" &&
        form.city.trim() !== "" &&
        form.state.trim() !== "" &&
        form.pincode.trim() !== "" &&
        form.contactNo.trim() !== "" &&
        form.description.trim() !== ""
      );
    }

    return (
      form.name.trim() !== "" &&
      form.address.trim() !== "" &&
      form.city.trim() !== "" &&
      form.state.trim() !== "" &&
      form.pincode.trim() !== "" &&
      form.contactNo.trim() !== "" &&
      form.description.trim() !== ""
    );
  };

  const isFormChanged = () => {
    if (!editingPg) return true;

    return (
      form.address !== editingPg.address ||
      form.city !== editingPg.city ||
      form.state !== editingPg.state ||
      form.pincode !== editingPg.pincode ||
      form.contactNo !== editingPg.contactNo ||
      form.description !== (editingPg.description ?? "") ||
      form.isActive !== editingPg.isActive
    );
  };
  const handleSubmit = async () => {
    try {
      if (editingPg) {
        await updatePg({
          variables: {
            pgId: editingPg.id,
            input: {
              address: form.address,
              city: form.city,
              state: form.state,
              pincode: form.pincode,
              contactNo: form.contactNo,
              description: form.description,
              isActive: form.isActive,
            },
          },
          refetchQueries: [
            {
              query: GET_ALL_PGS_ROOMS,
              variables: {
                input: {
                  page,
                  limit,
                },
              },
            },
          ],
        });
      } else {
        await createPg({
          variables: {
            input: {
              name: form.name,
              address: form.address,
              city: form.city,
              state: form.state,
              pincode: form.pincode,
              contactNo: form.contactNo,
              description: form.description,
            },
          },
          refetchQueries: [
            {
              query: GET_ALL_PGS_ROOMS,
              variables: {
                input: {
                  page,
                  limit,
                },
              },
            },
          ],
        });
      }

      handleClose();
    } catch (error) {
      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError("Failed to save room");
      }
    }
  };

  if (loading) {
    return <Typography>Loading PGs...</Typography>;
  }

  if (error) {
    return <Typography color="error">Failed to load PGs.</Typography>;
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            PG Management
          </Typography>

          <Typography color="text.secondary">
            Manage your PG properties
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
          sx={{ bgcolor: "#5B21B6" }}
        >
          Add PG
        </Button>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
          gap: 2,
        }}
      >
        {pgs.map((pg) => (
          <Card
            key={pg.id}
            sx={{
              borderRadius: 2,
              boxShadow: 1,
              height: "100%",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">{pg.name}</Typography>

                <Chip
                  label={pg.isActive ? "Active" : "Inactive"}
                  color={pg.isActive ? "success" : "default"}
                  size="small"
                />
              </Box>

              <Typography sx={{ mb: 1 }}>
                Description: {pg.description || "No Description"}
              </Typography>

              <Typography sx={{ mb: 1 }}>Address: {pg.address}</Typography>

              <Typography sx={{ mb: 1 }}>
                {pg.city}, {pg.state} - {pg.pincode}
              </Typography>

              <Typography sx={{ mb: 2 }}>Contact: {pg.contactNo}</Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "1px solid #eee",
                  pt: 1.5,
                }}
              >
                <Typography>Rooms: {pg.rooms.length}</Typography>

                <IconButton size="small" onClick={() => handleEdit(pg)}>
                  <EditIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 8,
        }}
      >
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          size="large"
          sx={{
            "& .MuiPaginationItem-root": {
              color: "#5B21B6",
            },
            "& .MuiPaginationItem-root.Mui-selected": {
              backgroundColor: "#5B21B6",
              color: "#FFFFFF",
            },
            "& .MuiPaginationItem-root.Mui-selected:hover": {
              backgroundColor: "#4C1D95",
            },
          }}
        />
      </Box>

      {pgs.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 5,
          }}
        >
          <Typography color="text.secondary">No PGs found.</Typography>
        </Box>
      )}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography>{editingPg ? "Edit PG" : "Add New PG"}</Typography>

          {editingPg && (
            <IconButton onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
          )}
        </DialogTitle>

        <DialogContent>
          {formError && (
            <Typography
              color="error"
              sx={{
                mb: 2,
                p: 1.5,
                backgroundColor: "#FEE2E2",
                borderRadius: 1,
              }}
            >
              {formError}
            </Typography>
          )}
          <Box
            sx={{
              display: "grid",
              gap: 2,
              mt: 1,
            }}
          >
            <TextField
              label="PG Name"
              fullWidth
              value={form.name}
              disabled={Boolean(editingPg)}
              onChange={(e) => handleChange("name", e.target.value)}
            />

            <TextField
              label="Address"
              fullWidth
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
              }}
            >
              <TextField
                label="City"
                fullWidth
                value={form.city}
                onChange={(e) => handleChange("city", e.target.value)}
              />

              <TextField
                label="State"
                fullWidth
                value={form.state}
                onChange={(e) => handleChange("state", e.target.value)}
              />
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
              }}
            >
              <TextField
                label="Pincode"
                fullWidth
                value={form.pincode}
                onChange={(e) => handleChange("pincode", e.target.value)}
              />

              <TextField
                label="Contact Number"
                fullWidth
                value={form.contactNo}
                onChange={(e) => handleChange("contactNo", e.target.value)}
              />
            </Box>

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </Box>
        </DialogContent>
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem
            sx={{ color: "#e10707" }}
            onClick={() => {
              handleMenuClose();
              handleChange("isActive", false);
            }}
          >
            Inactive
          </MenuItem>
        </Menu>

        <DialogActions>
          <Button onClick={handleClose} sx={{ color: "#5B21B6" }}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={
              creating ||
              updating ||
              !isFormValid() ||
              (!!editingPg && !isFormChanged())
            }
            sx={{ bgcolor: "#5B21B6" }}
          >
            {creating || updating
              ? "Saving..."
              : editingPg
                ? "Update PG"
                : "Create PG"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PgManagement;
