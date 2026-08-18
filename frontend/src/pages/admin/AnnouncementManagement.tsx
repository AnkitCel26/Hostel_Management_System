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
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

import {
  GET_ALL_ANNOUNCEMENTS,
  GET_ALL_PGS,
  CREATE_ANNOUNCEMENT,
  UPDATE_ANNOUNCEMENT,
} from "../../graphql/announcementManagement.api";

import type {
  Announcement,
  CreateAnnouncementMutation,
  CreateAnnouncementMutationVariables,
  GetAllAnnouncementsQuery,
  GetAllPgsRoomsQuery,
  UpdateAnnouncementMutation,
  UpdateAnnouncementMutationVariables,
} from "../../types/AnnouncementManagement.types";

const AnnouncementManagement = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);

  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);

  const [pgId, setPgId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isActive, setIsActive] = useState(true);

  const {
    data,
    loading,
    error,
  } = useQuery<GetAllAnnouncementsQuery>(
    GET_ALL_ANNOUNCEMENTS,
  );

  const {
    data: pgData,
    loading: pgLoading,
  } = useQuery<GetAllPgsRoomsQuery>(
    GET_ALL_PGS,
  );

  const [
    createAnnouncement,
    { loading: creating },
  ] = useMutation<
    CreateAnnouncementMutation,
    CreateAnnouncementMutationVariables
  >(CREATE_ANNOUNCEMENT);

  const [
    updateAnnouncement,
    { loading: updating },
  ] = useMutation<
    UpdateAnnouncementMutation,
    UpdateAnnouncementMutationVariables
  >(UPDATE_ANNOUNCEMENT);

  const announcements: Announcement[] =
    data?.getAllAnnouncements ?? [];

  const pgs = pgData?.getAllPgsRooms ?? [];

  const handleCreateOpen = () => {
    setPgId("");
    setTitle("");
    setContent("");
    setCreateOpen(true);
  };

  const handleCreateClose = () => {
    setCreateOpen(false);
    setPgId("");
    setTitle("");
    setContent("");
  };

  const handleCreate = async () => {
    if (!pgId || !title || !content) {
      return;
    }

    try {
      await createAnnouncement({
        variables: {
          input: {
            pgId,
            title,
            content,
          },
        },
        refetchQueries: [
          GET_ALL_ANNOUNCEMENTS,
        ],
      });

      handleCreateClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateOpen = (
    announcement: Announcement,
  ) => {
    setSelectedAnnouncement(announcement);
    setIsActive(announcement.isActive);
    setUpdateOpen(true);
  };

  const handleUpdateClose = () => {
    setUpdateOpen(false);
    setSelectedAnnouncement(null);
    setIsActive(true);
  };

  const handleUpdate = async () => {
    if (!selectedAnnouncement) {
      return;
    }

    try {
      await updateAnnouncement({
        variables: {
          announcementId:
            selectedAnnouncement.id,
          input: {
            isActive,
          },
        },
        refetchQueries: [
          GET_ALL_ANNOUNCEMENTS,
        ],
      });

      handleUpdateClose();
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (date: string) => {
    const timestamp = Number(date);

    if (!Number.isNaN(timestamp)) {
      return new Date(timestamp).toLocaleDateString();
    }

    const parsedDate = new Date(date);

    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate.toLocaleDateString();
    }

    return "-";
  };

  if (loading) {
    return (
      <Typography>
        Loading announcements...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography sx={{ color: "#DC2626" }}>
        Failed to load announcements.
      </Typography>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              marginBottom: 1,
            }}
          >
            Announcements
          </Typography>

          <Typography>
            Create and manage PG announcements
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateOpen}
          sx={{
            backgroundColor: "#5B21B6",
            "&:hover": {
              backgroundColor: "#4C1D95",
            },
          }}
        >
          Create Announcement
        </Button>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(3, 1fr)",
          },
          gap: 2,
          marginBottom: 3,
        }}
      >
        <Card sx={{ height: "100%" }}>
          <CardContent>
            <Typography>
              Total Announcements
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                marginTop: 1,
              }}
            >
              {announcements.length}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ height: "100%" }}>
          <CardContent>
            <Typography>
              Active
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: "#16A34A",
                marginTop: 1,
              }}
            >
              {
                announcements.filter(
                  (announcement) =>
                    announcement.isActive,
                ).length
              }
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ height: "100%" }}>
          <CardContent>
            <Typography>
              Inactive
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: "#6B7280",
                marginTop: 1,
              }}
            >
              {
                announcements.filter(
                  (announcement) =>
                    !announcement.isActive,
                ).length
              }
            </Typography>
          </CardContent>
        </Card>
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
        {announcements.length === 0 ? (
          <Card
            sx={{
              gridColumn: "1 / -1",
            }}
          >
            <CardContent>
              <Typography align="center">
                No announcements found
              </Typography>
            </CardContent>
          </Card>
        ) : (
          announcements.map((announcement) => (
            <Card
              key={announcement.id}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "flex-start",
                    gap: 1,
                    marginBottom: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {announcement.title}
                  </Typography>

                  <Chip
                    label={
                      announcement.isActive
                        ? "Active"
                        : "Inactive"
                    }
                    size="small"
                    sx={{
                      color: "#FFFFFF",
                      backgroundColor:
                        announcement.isActive
                          ? "#16A34A"
                          : "#6B7280",
                    }}
                  />
                </Box>

                <Typography
                  sx={{
                    marginBottom: 2,
                    flex: 1,
                  }}
                >
                  {announcement.content}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#6B7280",
                    marginBottom: 2,
                  }}
                >
                  PG: {announcement.pg.name}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#6B7280",
                    marginBottom: 2,
                  }}
                >
                  Created:{" "}
                  {formatDate(
                    announcement.createdAt,
                  )}
                </Typography>

                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() =>
                    handleUpdateOpen(
                      announcement,
                    )
                  }
                  sx={{
                    color: "#FFFFFF",
                    backgroundColor: "#5B21B6",
                    "&:hover": {
                      backgroundColor: "#4C1D95",
                    },
                  }}
                >
                  Update Status
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </Box>

      <Dialog
        open={createOpen}
        onClose={handleCreateClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Create Announcement
        </DialogTitle>

        <DialogContent>
          <Box sx={{ marginTop: 1 }}>
            <TextField
              select
              label="PG"
              fullWidth
              value={pgId}
              onChange={(e) =>
                setPgId(e.target.value)
              }
              disabled={pgLoading}
              sx={{ marginBottom: 2 }}
            >
              <MenuItem value="" disabled>
                {pgLoading
                  ? "Loading PGs..."
                  : "Select PG"}
              </MenuItem>

              {pgs.map((pg) => (
                <MenuItem
                  key={pg.id}
                  value={pg.id}
                >
                  {pg.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Title"
              fullWidth
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              sx={{ marginBottom: 2 }}
            />

            <TextField
              label="Content"
              fullWidth
              multiline
              minRows={4}
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCreateClose} sx={{color:"#5B21B6"}}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={
              creating ||
              !pgId ||
              !title ||
              !content
            }
            sx={{
              backgroundColor: "#5B21B6",
              "&:hover": {
                backgroundColor: "#4C1D95",
              },
            }}
          >
            {creating
              ? "Creating..."
              : "Create Announcement"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={updateOpen}
        onClose={handleUpdateClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Update Announcement
        </DialogTitle>

        <DialogContent>
          {selectedAnnouncement && (
            <Box sx={{ marginTop: 1 }}>
              <Typography
                sx={{ marginBottom: 2 }}
              >
                Title:{" "}
                <strong>
                  {selectedAnnouncement.title}
                </strong>
              </Typography>

              <Typography
                sx={{ marginBottom: 2 }}
              >
                Content:{" "}
                {selectedAnnouncement.content}
              </Typography>

              <Typography
                sx={{ marginBottom: 2 }}
              >
                PG:{" "}
                <strong>
                  {selectedAnnouncement.pg.name}
                </strong>
              </Typography>

              <TextField
                select
                label="Status"
                fullWidth
                value={
                  isActive
                    ? "active"
                    : "inactive"
                }
                onChange={(e) =>
                  setIsActive(
                    e.target.value ===
                      "active",
                  )
                }
              >
                <MenuItem value="active">
                  Active
                </MenuItem>

                <MenuItem value="inactive">
                  Inactive
                </MenuItem>
              </TextField>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleUpdateClose} sx={{color:"#5B21B6"}}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleUpdate}
            disabled={updating}
            sx={{
              backgroundColor: "#5B21B6",
              "&:hover": {
                backgroundColor: "#4C1D95",
              },
            }}
          >
            {updating
              ? "Updating..."
              : "Update Status"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AnnouncementManagement;