import { useState } from "react";
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
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

import {
  GET_ALL_PGS_ROOMS,
  CREATE_ROOM,
  UPDATE_ROOM,
} from "../../graphql/RoomManagement.api";

import type {
  Room,
} from "../../types/RoomManagement.types";

interface PgOption {
  id: string;
  name: string;
  rooms: Room[];
}

interface RoomForm {
  pgId: string;
  roomNo: string;
  floor: string;
  capacity: string;
  occupiedNo: string;
  monthlyRent: string;
  status: string;
}

interface RoomWithPgName extends Room {
  pgName: string;
}

const emptyForm: RoomForm = {
  pgId: "",
  roomNo: "",
  floor: "",
  capacity: "",
  occupiedNo: "0",
  monthlyRent: "",
  status: "available",
};

const RoomManagement = () => {
  const [open, setOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [form, setForm] = useState<RoomForm>(emptyForm);

  const { data, loading, error } = useQuery(GET_ALL_PGS_ROOMS);

  const [createRoom, { loading: creating }] = useMutation(CREATE_ROOM);

  const [updateRoom, { loading: updating }] = useMutation(UPDATE_ROOM);

  const pgs: PgOption[] = data?.getAllPgsRooms ?? [];

  const rooms: RoomWithPgName[] = pgs.flatMap((pg) =>
    pg.rooms.map((room) => ({
      ...room,
      pgName: pg.name,
    })),
  );

  const handleCreate = () => {
    setEditingRoom(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);

    setForm({
      pgId: room.pgId,
      roomNo: String(room.roomNo),
      floor: String(room.floor),
      capacity: String(room.capacity),
      occupiedNo: String(room.occupiedNo),
      monthlyRent: String(room.monthlyRent),
      status: room.status,
    });

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingRoom(null);
    setForm(emptyForm);
  };

  const handleChange = (field: keyof RoomForm, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (editingRoom) {
        await updateRoom({
          variables: {
            roomId: editingRoom.id,
            input: {
              occupiedNo: Number(form.occupiedNo),
              monthlyRent: Number(form.monthlyRent),
              status: form.status,
            },
          },
          refetchQueries: [GET_ALL_PGS_ROOMS],
        });
      } else {
        await createRoom({
          variables: {
            input: {
              pgId: form.pgId,
              roomNo: Number(form.roomNo),
              floor: Number(form.floor),
              capacity: Number(form.capacity),
              occupiedNo: Number(form.occupiedNo),
              monthlyRent: Number(form.monthlyRent),
            },
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
    return <CircularProgress/>
  }

  if (error) {
    return <Typography color="error">Failed to load rooms.</Typography>;
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
            Room Management
          </Typography>

          <Typography color="text.secondary">
            Manage rooms in your PGs
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
          sx={{bgcolor:"#5B21B6" }}
        >
          Add Room
        </Button>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
          gap: 2,
        }}
      >
        {rooms.map((room) => (
          <Card key={room.id}>
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
                  Room {room.roomNo}
                </Typography>

                <Chip
                  label={room.status === "full" ? "Full" : "Available"}
                  color={room.status === "full" ? "error" : "success"}
                  size="small"
                />
              </Box>

              <Typography sx={{ mb: 1 }}>PG: {room.pgName}</Typography>

              <Typography sx={{ mb: 1 }}>Floor: {room.floor}</Typography>

              <Typography sx={{ mb: 1 }}>Capacity: {room.capacity}</Typography>

              <Typography sx={{ mb: 1 }}>
                Occupied: {room.occupiedNo}
              </Typography>

              <Typography sx={{ mb: 2 }}>
                Monthly Rent: ₹{room.monthlyRent}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  borderTop: "1px solid #eee",
                  pt: 1,
                }}
              >
                <IconButton size="small" onClick={() => handleEdit(room)}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {rooms.length === 0 && (
        <Box sx={{ textAlign: "center", py: 5 }}>
          <Typography>No rooms found.</Typography>
        </Box>
      )}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editingRoom ? "Edit Room" : "Add New Room"}</DialogTitle>

        <DialogContent>
          <Box
            sx={{
              display: "grid",
              gap: 2,
              mt: 1,
            }}
          >
            <TextField
              select
              label="PG"
              fullWidth
              value={form.pgId}
              disabled={Boolean(editingRoom)}
              onChange={(e) => handleChange("pgId", e.target.value)}
            >
              {pgs.map((pg) => (
                <MenuItem key={pg.id} value={pg.id}>
                  {pg.name}
                </MenuItem>
              ))}
            </TextField>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
              }}
            >
              <TextField
                label="Room Number"
                type="number"
                value={form.roomNo}
                disabled={Boolean(editingRoom)}
                onChange={(e) => handleChange("roomNo", e.target.value)}
              />

              <TextField
                label="Floor"
                type="number"
                value={form.floor}
                disabled={Boolean(editingRoom)}
                onChange={(e) => handleChange("floor", e.target.value)}
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
                label="Capacity"
                type="number"
                value={form.capacity}
                disabled={Boolean(editingRoom)}
                onChange={(e) => handleChange("capacity", e.target.value)}
              />

              <TextField
                label="Occupied"
                type="number"
                value={form.occupiedNo}
                onChange={(e) => handleChange("occupiedNo", e.target.value)}
              />
            </Box>

            <TextField
              label="Monthly Rent"
              type="number"
              value={form.monthlyRent}
              onChange={(e) => handleChange("monthlyRent", e.target.value)}
            />

            {editingRoom && (
              <TextField
                select
                label="Status"
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="full">Full</MenuItem>
              </TextField>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} sx={{color:"#5B21B6" }}>Cancel</Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={creating || updating}
            sx={{bgcolor:"#5B21B6" }}
          >
            {creating || updating
              ? "Saving..."
              : editingRoom
                ? "Update Room"
                : "Create Room"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoomManagement;
