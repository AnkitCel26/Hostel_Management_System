import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  Alert,
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
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import {
  CREATE_COMPLAINT,
  GET_TENANT_COMPLAINTS,
} from "../../graphql/tenantComplaint.api";

const TenantComplaint = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");
  const [formError, setFormError] = useState("");

  const { data, loading, error } = useQuery(GET_TENANT_COMPLAINTS);

  const [createComplaint, { loading: creating }] = useMutation(
    CREATE_COMPLAINT,
    {
      refetchQueries: [GET_TENANT_COMPLAINTS],
    },
  );

  const complaints = data?.getTenantComplaints ?? [];

  const handleClose = () => {
    if (creating) return;

    setDialogOpen(false);
    setTitle("");
    setDescription("");
    setDocumentUrl("");
    setFormError("");
  };

  const handleSubmit = async () => {
    setFormError("");

    if (!title.trim() || !description.trim()) {
      setFormError("Title and description are required.");
      return;
    }

    try {
      await createComplaint({
        variables: {
          input: {
            title: title.trim(),
            description: description.trim(),
            documentUrl: documentUrl.trim() || null!,
          },
        },
      });

      handleClose();
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Failed to submit complaint.",
      );
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
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
            Complaints
          </Typography>

          <Typography sx={{ color: "#6B7280", mt: 0.5 }}>
            Submit and track your complaints
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setFormError("");
            setDialogOpen(true);
          }}
          sx={{
            backgroundColor: "#5B21B6",
            "&:hover": {
              backgroundColor: "#4C1D95",
            },
          }}
        >
          Create Complaint
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message}
        </Alert>
      )}

      {!error && complaints.length === 0 && (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              No complaints yet
            </Typography>

            <Typography sx={{ color: "#6B7280", mb: 2 }}>
              You have not submitted any complaints.
            </Typography>

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
              sx={{
                textTransform: "none",
                color: "#5B21B6",
                borderColor: "#5B21B6",
              }}
            >
              Submit Complaint
            </Button>
          </CardContent>
        </Card>
      )}

      {complaints.length > 0 && (
        <Stack spacing={2}>
          {complaints.map((complaint) => (
            <Card key={complaint.id}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {complaint.title}
                    </Typography>

                    <Typography
                      sx={{
                        color: "#6B7280",
                        fontSize: 14,
                        mt: 0.5,
                      }}
                    >
                      Created on{" "}
                      {new Date(
                        Number(complaint.createdAt),
                      ).toLocaleDateString("en-IN")}
                    </Typography>
                  </Box>

                  <Chip
                    label={complaint.status.replace("_", " ")}
                    size="small"
                    color={
                      {
                        open: "warning",
                        in_progress: "info",
                        resolved: "success",
                        closed: "default",
                      }[complaint.status] as
                        | "default"
                        | "info"
                        | "success"
                        | "warning"
                    }
                  />
                </Box>

                <Typography sx={{ mb: 2 }}>
                  {complaint.description}
                </Typography>

                {complaint.documentUrl && (
                  <Button
                    variant="outlined"
                    size="small"
                    href={complaint.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      textTransform: "none",
                      color: "#5B21B6",
                      borderColor: "#5B21B6",
                    }}
                  >
                    View Document
                  </Button>
                )}

                {complaint.resolvedAt && (
                  <Typography
                    sx={{
                      mt: 2,
                      color: "#16A34A",
                      fontSize: 14,
                    }}
                  >
                    Resolved on{" "}
                    {new Date(
                      Number(complaint.resolvedAt),
                    ).toLocaleDateString()}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <Dialog open={dialogOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Submit Complaint</DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {formError && <Alert severity="error">{formError}</Alert>}

            <TextField
              label="Title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              fullWidth
              required
            />

            <TextField
              label="Description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              fullWidth
              required
              multiline
              rows={4}
            />

            <TextField
              label="Document URL"
              value={documentUrl}
              onChange={(event) => setDocumentUrl(event.target.value)}
              fullWidth
              placeholder="Optional"
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleClose}
            disabled={creating}
            sx={{ color: "#5B21B6" }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={creating || !title.trim() || !description.trim()}
            sx={{
              backgroundColor: "#5B21B6",
              "&:hover": {
                backgroundColor: "#4C1D95",
              },
            }}
          >
            {creating ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Submit"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TenantComplaint;