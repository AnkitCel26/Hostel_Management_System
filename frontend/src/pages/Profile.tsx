import { useContext, useEffect, useState } from "react";
import { useMutation } from "@apollo/client/react";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";

import AuthContext from "../context/AuthContext";
import { UPDATE_PROFILE } from "../graphql/Profile.api";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext)!;

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [updateProfile, { loading }] = useMutation(UPDATE_PROFILE);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone);
    }
  }, [user]);

  if (!user) {
    return null;
  }

  const handleEdit = () => {
    setName(user.name);
    setPhone(user.phone);
    setEditing(true);
  };

  const handleCancel = () => {
    setName(user.name);
    setPhone(user.phone);
    setEditing(false);
  };

  const handleSave = async () => {
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName || !/^\d{10}$/.test(trimmedPhone)) {
      return;
    }

    try {
      const { data } = await updateProfile({
        variables: {
          input: {
            name: trimmedName,
            phone: trimmedPhone,
          },
        },
      });

      if (data?.updateProfile?.user) {
        setUser(data.updateProfile.user);
        setEditing(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ maxWidth: 700, margin: "65px auto" }}>
      <Card sx={{boxShadow: "0 6px 18px rgba(0, 0, 0, 0.18)",}}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{
                    width: 70,
                    height: 70,
                    backgroundColor: "#5B21B6",
                    fontSize: 28,
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>

                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {user.name}
                  </Typography>

                  <Typography>{user.role}</Typography>
                </Box>
              </Box>

              {!editing && (
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                  sx={{
                    backgroundColor: "#5B21B6",
                    "&:hover": {
                      backgroundColor: "#4C1D95",
                    },
                  }}
                >
                  Edit
                </Button>
              )}
            </Box>

            <Divider />

            {editing ? (
              <>
                <TextField
                  label="Full Name"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <TextField
                  label="Phone"
                  fullWidth
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    disabled={loading}
                    sx={{color:"#5B21B6",border:"1px solid #5B21B6"}}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={
                      loading ||
                      !name.trim() ||
                      !/^\d{10}$/.test(phone.trim())
                    }
                    sx={{
                      backgroundColor: "#5B21B6",
                      "&:hover": {
                        backgroundColor: "#4C1D95",
                      },
                    }}
                  >
                    {loading ? "Saving..." : "Save"}
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Box>
                  <Typography>Full Name</Typography>
                  <Typography>{user.name}</Typography>
                </Box>

                <Box>
                  <Typography>Email</Typography>
                  <Typography>{user.email}</Typography>
                </Box>

                <Box>
                  <Typography>Phone</Typography>
                  <Typography>{user.phone}</Typography>
                </Box>

                <Box>
                  <Typography>Role</Typography>
                  <Typography sx={{ textTransform: "capitalize" }}>
                    {user.role}
                  </Typography>
                </Box>

                <Box>
                  <Typography>Account Status</Typography>
                  <Typography>
                    {user.isActive ? "Active" : "Inactive"}
                  </Typography>
                </Box>
              </>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;