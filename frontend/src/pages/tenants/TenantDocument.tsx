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

import UploadFileIcon from "@mui/icons-material/UploadFile";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DescriptionIcon from "@mui/icons-material/Description";
import DeleteIcon from "@mui/icons-material/Delete";

import type { Document } from "../../types/TenantDocument.types";
import { uploadDocument } from "../../supabase/uploadDoc";
import {
  DELETE_TENANT_DOCUMENT,
  GET_TENANT_DOCUMENTS,
  UPLOAD_DOCUMENT,
} from "../../graphql/tenantDocument.api";

const TenantDocument = () => {
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [docType, setDocType] = useState<Document>("aadhaar");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);

  const { data, loading, error: queryError } = useQuery(GET_TENANT_DOCUMENTS);

  const [uploadTenantDocs] = useMutation(UPLOAD_DOCUMENT);
  const [deleteTenantDocument, { loading: deleting }] = useMutation(
    DELETE_TENANT_DOCUMENT,
  );

  const documents = data?.getTenantDocuments ?? [];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setFileUpload(file);
    setError(null);
  };

  const handleUploadOpen = () => {
    setFileUpload(null);
    setDocType("aadhaar");
    setError(null);
    setUploadOpen(true);
  };

  const handleUploadClose = () => {
    if (uploading) return;

    setUploadOpen(false);
    setFileUpload(null);
    setDocType("aadhaar");
    setError(null);
  };
  const handleDelete = async (documentId: string) => {
    try {
      await deleteTenantDocument({
        variables: {
          documentId,
        },
        refetchQueries: [GET_TENANT_DOCUMENTS],
      });
    } catch (error) {
      console.error(error);
    }
  };
  const handleUpload = async () => {
    if (!fileUpload) {
      setError("Do select a file");
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const fileUrl = await uploadDocument(fileUpload);

      const { data } = await uploadTenantDocs({
        variables: {
          input: {
            documentType: docType,
            fileUrl,
          },
        },
        refetchQueries: [GET_TENANT_DOCUMENTS],
      });

      if (!data?.uploadTenantDocs?.document) {
        throw new Error("Failed to save document");
      }

      handleUploadClose();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error ? error.message : "Failed to upload document.",
      );
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <Typography>Loading documents...</Typography>;
  }

  if (queryError) {
    return (
      <Typography sx={{ color: "#DC2626" }}>
        Failed to load documents.
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
            Tenant Documents
          </Typography>

          <Typography>Upload and manage your documents</Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<UploadFileIcon />}
          onClick={handleUploadOpen}
          sx={{
            backgroundColor: "#5B21B6",
            "&:hover": {
              backgroundColor: "#4C1D95",
            },
          }}
        >
          Upload Document
        </Button>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
          },
          gap: 2,
          marginBottom: 3,
        }}
      >
        <Card sx={{ height: "100%", width: "50%" }}>
          <CardContent>
            <Typography>Total Documents</Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                marginTop: 1,
              }}
            >
              {documents.length}
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
          mt: 8,
          gap: 6,
        }}
      >
        {documents.length === 0 ? (
          <Card
            sx={{
              gridColumn: "1 / -1",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 5,
              }}
            >
              <DescriptionIcon
                sx={{
                  fontSize: 50,
                  color: "#5B21B6",
                  marginBottom: 2,
                }}
              />

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  marginBottom: 1,
                }}
              >
                No documents found
              </Typography>

              <Typography
                sx={{
                  color: "#6B7280",
                  marginBottom: 3,
                }}
              >
                Upload a tenant document to get started
              </Typography>

              <Button
                variant="contained"
                startIcon={<UploadFileIcon />}
                onClick={handleUploadOpen}
                sx={{
                  backgroundColor: "#5B21B6",
                  "&:hover": {
                    backgroundColor: "#4C1D95",
                  },
                }}
              >
                Upload Document
              </Button>
            </CardContent>
          </Card>
        ) : (
          documents.map((document) => (
            <Card
              key={document.id}
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
                    justifyContent: "space-between",
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
                    {document.documentType === "aadhaar"
                      ? "Aadhaar Document"
                      : "PAN Document"}
                  </Typography>

                  <Chip
                    label={
                      document.documentType === "aadhaar" ? "Aadhaar" : "PAN"
                    }
                    size="small"
                    sx={{
                      color: "#FFFFFF",
                      backgroundColor: "#5B21B6",
                    }}
                  />
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#6B7280",
                    marginBottom: 2,
                    flex: 1,
                  }}
                >
                  Uploaded on{" "}
                  {new Date(document.createdAt).toLocaleDateString()}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Button
                    component="a"
                    href={document.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    startIcon={<VisibilityIcon />}
                    sx={{
                      width: 200,
                      marginTop: 6,
                      borderRadius: 6,
                      color: "#FFFFFF",
                      backgroundColor: "#5B21B6",
                      "&:hover": {
                        backgroundColor: "#4C1D95",
                      },
                    }}
                  >
                    View Document
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleDelete(document.id)}
                    disabled={deleting}
                    startIcon={<DeleteIcon />}
                    sx={{
                      width: 100,
                      marginTop: 6,

                      backgroundColor: "#DC2626",
                      color: "#FFFFFF",
                      borderRadius: 6,
                      "&:hover": {
                        backgroundColor: "#B91C1C",
                      },
                      "&:disabled": {
                        backgroundColor: "#FCA5A5",
                        color: "#FFFFFF",
                      },
                    }}
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>

      <Dialog
        open={uploadOpen}
        onClose={handleUploadClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Upload Tenant Document</DialogTitle>

        <DialogContent>
          <Box sx={{ marginTop: 1 }}>
            <TextField
              select
              label="Document Type"
              fullWidth
              value={docType}
              onChange={(e) => setDocType(e.target.value as Document)}
              disabled={uploading}
              sx={{ marginBottom: 2 }}
            >
              <MenuItem value="aadhaar">Aadhaar</MenuItem>
              <MenuItem value="pan">PAN</MenuItem>
            </TextField>

            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadFileIcon />}
              fullWidth
              disabled={uploading}
              sx={{
                height: 56,
                color: "#5B21B6",
                borderColor: "#5B21B6",
                "&:hover": {
                  borderColor: "#4C1D95",
                  backgroundColor: "#EDE9FE",
                },
              }}
            >
              {fileUpload ? "Change Document" : "Choose Document"}

              <input
                hidden
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
            </Button>

            {fileUpload && (
              <Box
                sx={{
                  marginTop: 2,
                  padding: 2,
                  backgroundColor: "#F9FAFB",
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2">Selected file</Typography>

                <Typography
                  sx={{
                    fontWeight: 500,
                    marginTop: 0.5,
                  }}
                >
                  {fileUpload.name}
                </Typography>
              </Box>
            )}

            {error && (
              <Typography
                sx={{
                  color: "#DC2626",
                  marginTop: 2,
                }}
              >
                {error}
              </Typography>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleUploadClose}
            disabled={uploading}
            sx={{
              color: "#5B21B6",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!fileUpload || uploading}
            startIcon={<UploadFileIcon />}
            sx={{
              backgroundColor: "#5B21B6",
              "&:hover": {
                backgroundColor: "#4C1D95",
              },
            }}
          >
            {uploading ? "Uploading..." : "Upload Document"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TenantDocument;
