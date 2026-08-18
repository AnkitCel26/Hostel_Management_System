import { useQuery } from "@apollo/client/react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

import { GET_TENANT_ANNOUNCEMENTS } from "../../graphql/tenantAnnouncement.api";

const TenantAnnouncement = () => {
  const { data, loading, error } = useQuery(
    GET_TENANT_ANNOUNCEMENTS,
  );

  const announcements = data?.getTenantPgAnnouncements ?? [];

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 6,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Announcements
        </Typography>

        <Typography
          sx={{
            color: "#6B7280",
            mt: 0.5,
          }}
        >
          Latest announcements from your PG
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message}
        </Alert>
      )}

      {!error && announcements.length === 0 && (
        <Card>
          <CardContent
            sx={{
              textAlign: "center",
              py: 6,
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              No announcements
            </Typography>

            <Typography sx={{ color: "#6B7280" }}>
              There are no announcements available at the moment.
            </Typography>
          </CardContent>
        </Card>
      )}

      {!error && announcements.length > 0 && (
        <Stack spacing={2}>
          {announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 2,
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#5B21B6",
                    }}
                  >
                    {announcement.title}
                  </Typography>

                  <Chip
                    label={announcement.isActive ? "Active" : "Inactive"}
                    size="small"
                    color={
                      announcement.isActive ? "success" : "default"
                    }
                  />
                </Box>

                <Typography sx={{ mb: 2 }}>
                  {announcement.content}
                </Typography>

                <Typography
                  sx={{
                    color: "#6B7280",
                    fontSize: 14,
                  }}
                >
                  {new Date(
                    Number(announcement.createdAt),
                  ).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default TenantAnnouncement;