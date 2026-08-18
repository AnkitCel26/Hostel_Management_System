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
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

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
}

const emptyForm: PgForm = {
  name: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  contactNo: "",
  description: "",
};

const PgManagement = () => {
  const [open, setOpen] = useState(false);
  const [editingPg, setEditingPg] = useState<AllPgs | null>(null);
  const [form, setForm] = useState<PgForm>(emptyForm);

  const { data, loading, error } = useQuery(GET_ALL_PGS_ROOMS);

  const [createPg, { loading: creating }] = useMutation(CREATE_PG);

  const [updatePg, { loading: updating }] = useMutation(UPDATE_PG);

  const pgs = data?.getAllPgsRooms ?? [];

  const handleCreate = () => {
    setEditingPg(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const handleEdit = (pg: AllPgs) => {
    setEditingPg(pg);

    setForm({
      name: pg.name,
      address: pg.address,
      city: pg.city,
      state: pg.state,
      pincode: pg.pincode,
      contactNo: pg.contactNo,
      description: pg.description ?? "",
    });

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingPg(null);
    setForm(emptyForm);
  };

  const handleChange = (field: keyof PgForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
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
            },
          },
          refetchQueries: [GET_ALL_PGS_ROOMS],
        });
      } else {
        await createPg({
          variables: {
            input: form,
          },
          refetchQueries: [GET_ALL_PGS_ROOMS],
        });
      }

      handleClose();
    } catch (error) {
      console.error(error);
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
        <DialogTitle>{editingPg ? "Edit PG" : "Add New PG"}</DialogTitle>

        <DialogContent>
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

        <DialogActions>
          <Button onClick={handleClose} sx={{ color: "#5B21B6" }}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={creating || updating}
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
