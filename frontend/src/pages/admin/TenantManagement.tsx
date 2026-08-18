import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

import {
  GET_ALL_TENANTS,
  GET_ALL_USERS,
  GET_ALL_PGS_ROOMS,
  CREATE_TENANT,
  UPDATE_TENANT,
} from "../../graphql/tenantManagement.api";

import type {
  AllTenant,
  CreateTenantVariables,
  UpdateTenantVariables,
} from "../../types/TenantManagement.types";

interface TenantForm {
  userId: string;
  pgId: string;
  roomId: string;
  joiningDate: string;
  status: string;
}

const emptyForm: TenantForm = {
  userId: "",
  pgId: "",
  roomId: "",
  joiningDate: "",
  status: "active",
};

const TenantManagement = () => {
  const [open, setOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<AllTenant | null>(null);
  const [form, setForm] = useState<TenantForm>(emptyForm);

  const {
    data: tenantData,
    loading: tenantLoading,
    error: tenantError,
  } = useQuery(GET_ALL_TENANTS);

  const { data: userData, loading: userLoading } = useQuery(GET_ALL_USERS);

  const { data: pgData, loading: pgLoading } = useQuery(GET_ALL_PGS_ROOMS);

  const [createTenant, { loading: creating }] = useMutation(CREATE_TENANT);

  const [updateTenant, { loading: updating }] = useMutation(UPDATE_TENANT);

  const tenants = tenantData?.getAllTenants ?? [];
  const users = userData?.allUsers ?? [];
  const pgs = pgData?.getAllPgsRooms ?? [];

  const selectedPg = pgs.find((pg) => pg.id === form.pgId);

  const availableRooms = selectedPg
    ? selectedPg.rooms.filter(
        (room) => room.status !== "full" && room.occupiedNo < room.capacity,
      )
    : [];

  const tenantUserIds = tenants.map((tenant) => tenant.userId);

  useEffect(() => {
    if (
      form.roomId &&
      !availableRooms.some((room) => room.id === form.roomId)
    ) {
      setForm((prev) => ({
        ...prev,
        roomId: "",
      }));
    }
  }, [form.roomId, form.pgId]);

  const handleOpenCreate = () => {
    setEditingTenant(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const handleOpenEdit = (tenant: AllTenant) => {
    setEditingTenant(tenant);

    setForm({
      userId: tenant.userId,
      pgId: tenant.pgId,
      roomId: tenant.roomId ?? "",
      joiningDate: tenant.joiningDate,
      status: tenant.status,
    });

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTenant(null);
    setForm(emptyForm);
  };

  const handleChange = (field: keyof TenantForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePgChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      pgId: value,
      roomId: "",
    }));
  };

  const handleSubmit = async () => {
    try {
      if (editingTenant) {
        const variables: UpdateTenantVariables = {
          input: {
            tenantId: editingTenant.id,
            joiningDate: form.joiningDate,
            status: form.status,
            roomId: form.roomId || null,
          },
        };

        await updateTenant({
          variables,
          refetchQueries: [
            { query: GET_ALL_TENANTS },
            { query: GET_ALL_PGS_ROOMS },
          ],
        });
      } else {
        const variables: CreateTenantVariables = {
          input: {
            userId: form.userId,
            pgId: form.pgId,
            roomId: form.roomId || null,
            joiningDate: form.joiningDate,
          },
        };

        await createTenant({
          variables,
          refetchQueries: [
            { query: GET_ALL_TENANTS },
            { query: GET_ALL_PGS_ROOMS },
          ],
        });
      }

      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  if (tenantLoading || userLoading || pgLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (tenantError) {
    return <Typography color="error">Failed to load tenants.</Typography>;
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
            Tenant Management
          </Typography>

          <Typography>Manage your PG tenants</Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{ bgcolor: "#5B21B6" }}
        >
          Add Tenant
        </Button>
      </Box>

      {tenants.length === 0 ? (
        <Card>
          <CardContent>
            <Typography align="center">No tenants found</Typography>
          </CardContent>
        </Card>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
              lg: "1fr 1fr 1fr",
            },
            gap: 2,
          }}
        >
          {tenants.map((tenant) => (
            <Card key={tenant.id}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {tenant.user.name}
                  </Typography>

                  <Chip
                    label={tenant.status}
                    color={tenant.status === "active" ? "success" : "default"}
                    size="small"
                  />
                </Box>

                <Typography sx={{ mb: 1 }}>
                  Email: {tenant.user.email}
                </Typography>

                <Typography sx={{ mb: 1 }}>
                  Phone: {tenant.user.phone}
                </Typography>

                <Typography sx={{ fontWeight: 600 }}>PG</Typography>

                <Typography sx={{ mb: 1 }}>
                  {tenant.pg.name} — {tenant.pg.city}, {tenant.pg.state}
                </Typography>

                <Typography sx={{ fontWeight: 600 }}>Room</Typography>

                <Typography sx={{ mb: 1 }}>
                  {tenant.room
                    ? `Room ${tenant.room.roomNo} - Floor ${tenant.room.floor}`
                    : "Not assigned"}
                </Typography>

                <Typography sx={{ mb: 2 }}>
                  Joining Date:{" "}
                  {new Date(tenant.joiningDate).toLocaleDateString()}
                </Typography>

                <Box sx={{ textAlign: "right" }}>
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenEdit(tenant)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingTenant ? "Edit Tenant" : "Add New Tenant"}
        </DialogTitle>

        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              select
              label="Tenant"
              fullWidth
              sx={{ mb: 2 }}
              value={form.userId}
              disabled={Boolean(editingTenant)}
              onChange={(e) => handleChange("userId", e.target.value)}
            >
              {users
                .filter(
                  (user) =>
                    user.isActive &&
                    user.role !== "admin" &&
                    (!tenantUserIds.includes(user.id) ||
                      user.id === editingTenant?.userId),
                )
                .map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name} - {user.email}
                  </MenuItem>
                ))}
            </TextField>

            <TextField
              select
              label="PG"
              fullWidth
              sx={{ mb: 2 }}
              value={form.pgId}
              disabled={Boolean(editingTenant)}
              onChange={(e) => handlePgChange(e.target.value)}
            >
              {pgs
                .filter((pg) => pg.isActive)
                .map((pg) => (
                  <MenuItem key={pg.id} value={pg.id}>
                    {pg.name} - {pg.city}
                  </MenuItem>
                ))}
            </TextField>

            <TextField
              select
              label="Room"
              fullWidth
              sx={{ mb: 2 }}
              value={form.roomId}
              disabled={!form.pgId}
              onChange={(e) => handleChange("roomId", e.target.value)}
            >
              <MenuItem value="">No Room</MenuItem>

              {availableRooms.map((room) => (
                <MenuItem key={room.id} value={room.id}>
                  Room {room.roomNo} - Floor {room.floor} - {room.occupiedNo}/
                  {room.capacity}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Joining Date"
              type="date"
              fullWidth
              sx={{ mb: 2 }}
              value={form.joiningDate}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              onChange={(e) => handleChange("joiningDate", e.target.value)}
            />

            {editingTenant && (
              <TextField
                select
                label="Status"
                fullWidth
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <MenuItem value="active">Active</MenuItem>

                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
            )}
          </Box>
        </DialogContent>

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
              !form.userId ||
              !form.pgId ||
              !form.joiningDate
            }
            sx={{ bgcolor: "#5B21B6" }}
          >
            {creating || updating
              ? "Saving..."
              : editingTenant
                ? "Update Tenant"
                : "Create Tenant"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TenantManagement;
