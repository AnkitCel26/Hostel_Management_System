import { useContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import {
  Alert,
  Snackbar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

import AuthContext from "../../context/AuthContext";
import { ADMIN_DASHBOARD } from "../../graphql/adminDashboard.api";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext)!;

  const { data, loading, error } = useQuery(ADMIN_DASHBOARD);

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (error) {
      setSnackbarOpen(true);
    }
  }, [error]);

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

  const statsData = data?.getAdminDashboardStats;

  const totalPgs = statsData?.totalPgs ?? 0;
  const activePgs = statsData?.activePgs ?? 0;
  const totalRooms = statsData?.totalRooms ?? 0;
  const totalTenants = statsData?.totalTenants ?? 0;
  const occupiedBeds = statsData?.occupiedBeds ?? 0;
  const availableBeds = statsData?.availableBeds ?? 0;
  const fullRooms = statsData?.fullRooms ?? 0;
  const availableRooms = statsData?.availableRooms ?? 0;

  const totalCapacity = occupiedBeds + availableBeds;

  const occupancy =
    totalCapacity > 0 ? Math.round((occupiedBeds / totalCapacity) * 100) : 0;

  const stats = [
    {
      title: "Total PGs",
      value: totalPgs,
    },
    {
      title: "Total Rooms",
      value: totalRooms,
    },
    {
      title: "Total Tenants",
      value: totalTenants,
    },
    {
      title: "Occupied Beds",
      value: occupiedBeds,
    },
  ];

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 600,
          mb: 1,
        }}
      >
        Admin Dashboard
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          mb: 3,
        }}
      >
        Welcome back, {user?.name}
      </Typography>

      <Grid container spacing={2.5}>
        {stats.map((stat) => (
          <Grid
            key={stat.title}
            size={{
              xs: 12,
              sm: 6,
              md: 3,
            }}
          >
            <Card>
              <CardContent>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1,
                  }}
                >
                  {stat.title}
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  minHeight: 50,
                }}
              >
                Room Occupancy
              </Typography>

              <Stack spacing={1.5}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body2">Occupied</Typography>

                  <Typography variant="body2">
                    {occupiedBeds} / {totalCapacity}
                  </Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={occupancy}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#E9D5FF",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#5B21B6",
                    },
                  }}
                />

                <Typography variant="body2" color="text.secondary">
                  {occupancy}% occupied
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 1,
                  }}
                >
                  <Typography variant="body2" sx={{fontWeight:600,mt:5,fontSize:20}}>Available Beds</Typography>

                  <Typography variant="body2" sx={{fontWeight:600,mt:5,fontSize:20}}>{availableBeds}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                Overview
              </Typography>

              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: [
                      "Active PGs",
                      "Available Rooms",
                      "Full Rooms",
                      "Available Beds",
                    ],
                    colorMap: {
                      type: "ordinal",
                      colors: ["#1976D2", "#2E7D32", "#ED6C02", "#9C27B0"],
                    },
                  },
                ]}
                series={[
                  {
                    data: [activePgs, availableRooms, fullRooms, availableBeds],
                    label: "Count",
                  },
                ]}
                height={300}
                borderRadius={6}
                margin={{
                  top: 20,
                  bottom: 60,
                  left: 50,
                  right: 20,
                }}
                grid={{
                  horizontal: true,
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert severity="error" onClose={() => setSnackbarOpen(false)}>
          {error?.message || "Failed to load dashboard"}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard;
