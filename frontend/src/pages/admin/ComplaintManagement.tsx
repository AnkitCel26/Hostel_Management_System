import { useEffect, useState } from "react";
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
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";

import {
  GET_ALL_COMPLAINTS,
  UPDATE_COMPLAINT,
} from "../../graphql/complaintManagement.api";

import type {
  AdminComplaint,
  ComplaintStatus,
} from "../../types/ComplaintManagement.types";

const ComplaintManagement = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] =
    useState<AdminComplaint | null>(null);

  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | "">("");

  const [status, setStatus] = useState<ComplaintStatus>("open");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const { data, loading, error } = useQuery(GET_ALL_COMPLAINTS, {
    variables: {
      page,
      limit,
      search: debouncedSearch,
      status: statusFilter || undefined,
    },
  });

  const [updateComplaint, { loading: updating }] =
    useMutation(UPDATE_COMPLAINT);

  const complaints: AdminComplaint[] = data?.getAllComplaints.items ?? [];

  const totalPages = data?.getAllComplaints.totalPages ?? 0;

  const totalComplaints = data?.getAllComplaints.total ?? 0;

  const handleEdit = (complaint: AdminComplaint) => {
    setSelectedComplaint(complaint);
    setStatus(complaint.status);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedComplaint(null);
    setStatus("open");
  };

  const handleUpdate = async () => {
    if (!selectedComplaint) {
      return;
    }

    try {
      await updateComplaint({
        variables: {
          complaintId: selectedComplaint.id,
          input: {
            status,
          },
        },
        refetchQueries: [
          {
            query: GET_ALL_COMPLAINTS,
            variables: {
              page,
              limit,
              search: debouncedSearch,
              status: statusFilter || undefined,
            },
          },
        ],
      });

      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusColor = (complaintStatus: ComplaintStatus) => {
    if (complaintStatus === "resolved") {
      return "#16A34A";
    }

    if (complaintStatus === "closed") {
      return "#6B7280";
    }

    if (complaintStatus === "in_progress") {
      return "#2563EB";
    }

    return "#F59E0B";
  };

  if (loading) {
    return <Typography>Loading complaints...</Typography>;
  }

  if (error) {
    return (
      <Typography sx={{ color: "#DC2626" }}>
        Failed to load complaints.
      </Typography>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          marginBottom: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
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
            Complaints
          </Typography>

          <Typography>View and manage tenant complaints</Typography>
        </Box>

        
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          marginBottom: 3,
          flexWrap: "wrap",
        }}
      >
        <Card sx={{ width: 180, minHeight: 110 }}>
          <CardContent>
            <Typography>Total Complaints</Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                marginTop: 1,
              }}
            >
              {totalComplaints}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ width: 180, minHeight: 110 }}>
          <CardContent>
            <Typography>Open</Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: "#F59E0B",
                marginTop: 1,
              }}
            >
              {
                complaints.filter((complaint) => complaint.status === "open")
                  .length
              }
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ width: 180, minHeight: 110 }}>
          <CardContent>
            <Typography>In Progress</Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: "#2563EB",
                marginTop: 1,
              }}
            >
              {
                complaints.filter(
                  (complaint) => complaint.status === "in_progress",
                ).length
              }
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ width: 180, minHeight: 110 }}>
          <CardContent>
            <Typography>Resolved</Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: "#16A34A",
                marginTop: 1,
              }}
            >
              {
                complaints.filter(
                  (complaint) => complaint.status === "resolved",
                ).length
              }
            </Typography>
          </CardContent>
        </Card>

      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 ,mb:2}}>
          <TextField
            select
            size="small"
            label="Status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as ComplaintStatus | "");
              setPage(1);
            }}
            sx={{
              width: "180px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                backgroundColor: "#fff",
              },
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="open">Open</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="resolved">Resolved</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
          </TextField>

          <TextField
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tenant, PG, room or complaint"
            sx={{
              width: "320px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                backgroundColor: "#fff",
              },
            }}
          />
        </Box>
      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tenant</TableCell>
              <TableCell>PG</TableCell>
              <TableCell>Room</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Document</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {complaints.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No complaints found
                </TableCell>
              </TableRow>
            ) : (
              complaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell>{complaint.tenant.user.name}</TableCell>

                  <TableCell>{complaint.tenant.pg.name}</TableCell>

                  <TableCell>
                    {complaint.tenant.room
                      ? `Room ${complaint.tenant.room.roomNo}`
                      : "-"}
                  </TableCell>

                  <TableCell>{complaint.title}</TableCell>

                  <TableCell>{complaint.description}</TableCell>

                  <TableCell>
                    <Chip
                      label={complaint.status}
                      size="small"
                      sx={{
                        color: "#FFFFFF",
                        backgroundColor: getStatusColor(complaint.status),
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    {new Date(Number(complaint.createdAt)).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                    {complaint.documentUrl ? (
                      <Button
                        size="small"
                        href={complaint.documentUrl}
                        target="_blank"
                      >
                        View
                      </Button>
                    ) : (
                      "-"
                    )}
                  </TableCell>

                  <TableCell>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      sx={{
                        color: "#FFFFFF",
                        backgroundColor: "#5B21B6",
                        "&:hover": {
                          backgroundColor: "#4C1D95",
                        },
                      }}
                      onClick={() => handleEdit(complaint)}
                    >
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

          {totalPages >= 1 && (
            <TableBody>
              <TableRow>
                <TableCell colSpan={9}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      py: 1,
                    }}
                  >
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={(_, value) => setPage(value)}
                      color="primary"
                      sx={{
                        "& .MuiPaginationItem-root": {
                          color: "#5B21B6",
                        },
                        "& .MuiPaginationItem-root.Mui-selected": {
                          backgroundColor: "#5B21B6",
                          color: "#fff",
                        },
                        "& .MuiPaginationItem-root.Mui-selected:hover": {
                          backgroundColor: "#4C1D95",
                        },
                      }}
                    />
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Update Complaint</DialogTitle>

        <DialogContent>
          {selectedComplaint && (
            <Box sx={{ marginTop: 1 }}>
              <Typography sx={{ marginBottom: 2 }}>
                Tenant: <strong>{selectedComplaint.tenant.user.name}</strong>
              </Typography>

              <Typography sx={{ marginBottom: 2 }}>
                PG: <strong>{selectedComplaint.tenant.pg.name}</strong>
              </Typography>

              <Typography sx={{ marginBottom: 2 }}>
                Room:{" "}
                <strong>
                  {selectedComplaint.tenant.room
                    ? `Room ${selectedComplaint.tenant.room.roomNo}`
                    : "-"}
                </strong>
              </Typography>

              <Typography sx={{ marginBottom: 2 }}>
                Title: <strong>{selectedComplaint.title}</strong>
              </Typography>

              <Typography sx={{ marginBottom: 2 }}>
                Description: {selectedComplaint.description}
              </Typography>

              <TextField
                select
                label="Status"
                fullWidth
                value={status}
                onChange={(e) => setStatus(e.target.value as ComplaintStatus)}
              >
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </TextField>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} sx={{ color: "#5B21B6" }}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleUpdate}
            disabled={updating|| status === selectedComplaint?.status}
            sx={{
              backgroundColor: "#5B21B6",
              "&:hover": {
                backgroundColor: "#4C1D95",
              },
            }}
          >
            {updating ? "Updating..." : "Update Status"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ComplaintManagement;
