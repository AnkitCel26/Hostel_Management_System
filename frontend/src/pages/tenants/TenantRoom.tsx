import { useContext } from "react";
import { useQuery } from "@apollo/client/react";

import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";

import AuthContext from "../../context/AuthContext";

import { GET_TENANT_ROOM } from "../../graphql/tenantRoom.api";

const TenantRoom = () => {
  const { user } = useContext(AuthContext)!;

  const { data, loading, error } = useQuery(GET_TENANT_ROOM, {
    variables: {
      userId: user?.id ?? "",
    },
    skip: !user?.id,
  });

  if (loading) {
    return <Typography>Loading room...</Typography>;
  }

  if (!data) {
    return (
      <Typography >
        No Room data found...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography sx={{ color: "#DC2626" }}>
        Failed to load room details.
      </Typography>
    );
  }

  

  const { tenant, pg, room } = data.getTenantPgRoom;


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
          My Room
        </Typography>

        <Typography>View your PG and room details</Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: "#5B21B6",
              marginBottom: 2,
            }}
          >
            {pg.name}
          </Typography>

          <Typography sx={{ marginBottom: 1 }}>
            {pg.address}, {pg.city}, {pg.state} - {pg.pincode}
          </Typography>

          <Typography sx={{ marginBottom: 2 }}>
            Contact: {pg.contactNo}
          </Typography>

          <Divider sx={{ marginBottom: 2 }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 3,
            }}
          >
            <Box>
              <Typography>Room Number</Typography>
              <Typography sx={{ fontWeight: 600 }}>
                Room {room.roomNo}
              </Typography>
            </Box>

            <Box>
              <Typography>Floor</Typography>
              <Typography sx={{ fontWeight: 600 }}>
                {room.floor}
              </Typography>
            </Box>

            <Box>
              <Typography>Capacity</Typography>
              <Typography sx={{ fontWeight: 600 }}>
                {room.capacity}
              </Typography>
            </Box>

            <Box>
              <Typography>Occupied</Typography>
              <Typography sx={{ fontWeight: 600 }}>
                {room.occupiedNo}
              </Typography>
            </Box>

            <Box>
              <Typography>Monthly Rent</Typography>
              <Typography sx={{ fontWeight: 600 }}>
                ₹{room.monthlyRent}
              </Typography>
            </Box>

            <Box>
              <Typography>Room Status</Typography>
              <Typography
                sx={{
                  fontWeight: 600,
                  color:
                    room.status === "available"
                      ? "#16A34A"
                      : "#5B21B6",
                }}
              >
                {room.status}
              </Typography>
            </Box>

            <Box>
              <Typography>Joining Date</Typography>
              <Typography sx={{ fontWeight: 600 }}>
                {new Date((tenant.joiningDate)).toLocaleDateString()}
              </Typography>
            </Box>

            <Box>
              <Typography>Tenant Status</Typography>
              <Typography sx={{ fontWeight: 600 }}>
                {tenant.status}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TenantRoom;