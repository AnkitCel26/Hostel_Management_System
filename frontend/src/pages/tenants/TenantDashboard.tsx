import { useContext } from "react";
import { useQuery } from "@apollo/client/react";

import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";

import AuthContext from "../../context/AuthContext";

import { GET_TENANT_DASHBOARD } from "../../graphql/TenantDashboard.api";

import type { Complaint } from "../../types/TenantDashboard.types";

const TenantDashboard = () => {
  const { user } = useContext(AuthContext)!;

  const { data, loading, error } = useQuery(GET_TENANT_DASHBOARD, {
    variables: {
      userId: user?.id ?? "",
    },
    skip: !user?.id,
  });

  if (loading) {
    return <Typography>Loading dashboard...</Typography>;
  }

  if (!data) {
    return (
      <Typography >
        No data found...
      </Typography>
    );
  }
  if (error) {
    return (
      <Typography sx={{ color: "#DC2626" }}>
        Failed to load dashboard.
      </Typography>
    );
  }

  if (!data) {
    return null;
  }

  const tenantPgRoom = data.getTenantPgRoom;
  const rentData = data.getRentPaymentHistory;
  const complaints = data.getTenantComplaints;
  const announcements = data.getTenantPgAnnouncements;

  const openComplaints = complaints.filter(
    (complaint: Complaint) => complaint.status === "open",
  ).length;

  const inProgressComplaints = complaints.filter(
    (complaint: Complaint) => complaint.status === "in_progress",
  ).length;

  const resolvedComplaints = complaints.filter(
    (complaint: Complaint) => complaint.status === "resolved",
  ).length;

  const recentPayments = rentData.paymentHistory.slice(0, 5);

  const recentAnnouncements = announcements
    .filter((announcement) => announcement.isActive)
    .slice(0, 3);

  return (
    <Box>
      <Box sx={{ marginBottom: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            marginBottom: 1,
          }}
        >
          Welcome, {user?.name}
        </Typography>

        <Typography>Here's your hostel overview</Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
          },
          gap: 2,
          marginBottom: 3,
        }}
      >
        <Card>
          <CardContent>
            <Typography>My Room</Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                marginTop: 1,
                color: "#5B21B6",
              }}
            >
              Room {tenantPgRoom.room.roomNo}
            </Typography>

            <Typography sx={{ marginTop: 1 }}>
              {tenantPgRoom.pg.name}
            </Typography>

            <Typography>Floor {tenantPgRoom.room.floor}</Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography>Monthly Rent</Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                marginTop: 1,
                color: "#5B21B6",
              }}
            >
              ₹{rentData.monthlyRent}
            </Typography>

            <Typography sx={{ marginTop: 1 }}>
              Room capacity: {tenantPgRoom.room.capacity}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography>Complaints</Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                marginTop: 1,
              }}
            >
              {complaints.length}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ marginTop: 1 }}>
              <Chip
                label={`Open ${openComplaints}`}
                size="small"
                sx={{
                  color: "#FFFFFF",
                  backgroundColor: "#F59E0B",
                }}
              />

              <Chip
                label={`Progress ${inProgressComplaints}`}
                size="small"
                sx={{
                  color: "#FFFFFF",
                  backgroundColor: "#2563EB",
                }}
              />

              <Chip
                label={`Resolved ${resolvedComplaints}`}
                size="small"
                sx={{
                  color: "#FFFFFF",
                  backgroundColor: "#16A34A",
                }}
              />
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Card sx={{ marginBottom: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              marginBottom: 2,
            }}
          >
            Recent Payments
          </Typography>

          {recentPayments.length === 0 ? (
            <Typography>No payment history found.</Typography>
          ) : (
            <Stack spacing={2}>
              {recentPayments.map((payment) => (
                <Box
                  key={payment.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #E5E7EB",
                    paddingBottom: 1.5,
                  }}
                >
                  <Box>
                    <Typography>
                      {payment.month} {payment.year}
                    </Typography>

                    <Typography>
                      Paid ₹{payment.paidAmount} / ₹{payment.amount}
                    </Typography>
                  </Box>

                  <Chip
                    label={payment.status}
                    size="small"
                    sx={{
                      color: "#FFFFFF",
                      backgroundColor:
                        payment.status === "paid" ? "#16A34A" : "#F59E0B",
                    }}
                  />
                </Box>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              marginBottom: 2,
            }}
          >
            Announcements
          </Typography>

          {recentAnnouncements.length === 0 ? (
            <Typography>No announcements available.</Typography>
          ) : (
            <Stack spacing={2}>
              {recentAnnouncements.map((announcement) => (
                <Box
                  key={announcement.id}
                  sx={{
                    borderBottom: "1px solid #E5E7EB",
                    paddingBottom: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "#5B21B6",
                    }}
                  >
                    {announcement.title}
                  </Typography>

                  <Typography sx={{ marginTop: 1 }}>
                    {announcement.content}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default TenantDashboard;
