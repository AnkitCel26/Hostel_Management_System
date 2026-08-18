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
  GET_ADMIN_RENT_SUMMARY,
  GET_ALL_RENT_PAYMENTS,
  UPDATE_RENT_PAYMENT,
} from "../../graphql/paymentManagement.api";

import type {
  AdminRentPayment,
  AdminRentSummary,
  PaymentMode,
} from "../../types/PaymentManagement.types";

const PaymentManagement = () => {
  const [month, setMonth] = useState("August");
  const [year, setYear] = useState(2026);

  const [open, setOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] =
    useState<AdminRentPayment | null>(null);

  const [paidAmount, setPaidAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("cash");

  const {
    data: summaryData,
    loading: summaryLoading,
    error: summaryError,
  } = useQuery(GET_ADMIN_RENT_SUMMARY, {
    variables: {
      month,
      year,
    },
  });

  const {
    data: paymentData,
    loading: paymentLoading,
    error: paymentError,
  } = useQuery(GET_ALL_RENT_PAYMENTS);

  const [updateRentPayment, { loading: updating }] =
    useMutation(UPDATE_RENT_PAYMENT);

  const summaries: AdminRentSummary[] = summaryData?.getAdminRentSummary ?? [];

  const payments: AdminRentPayment[] = paymentData?.getAllRentPayments ?? [];

  const totalRooms = summaries.reduce((total, pg) => total + pg.totalRooms, 0);

  const occupiedRooms = summaries.reduce(
    (total, pg) => total + pg.occupiedRooms,
    0,
  );

  const totalRent = summaries.reduce((total, pg) => total + pg.totalRent, 0);

  const paidRent = summaries.reduce((total, pg) => total + pg.paidRent, 0);

  const dueRent = summaries.reduce((total, pg) => total + pg.dueRent, 0);

  const handleEdit = (payment: AdminRentPayment) => {
    setSelectedPayment(payment);

    setPaidAmount("");
    setPaymentDate(
      payment.paymentDate ? payment.paymentDate.substring(0, 10) : "",
    );

    setPaymentMode(payment.paymentMode ?? "cash");

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPayment(null);
    setPaidAmount("");
    setPaymentDate("");
    setPaymentMode("cash");
  };

  const handleUpdate = async () => {
    if (!selectedPayment) {
      return;
    }

    try {
      await updateRentPayment({
        variables: {
          paymentId: selectedPayment.id,
          input: {
            paidAmount: Number(paidAmount),
            paymentDate,
            paymentMode,
          },
        },
        refetchQueries: [
          GET_ALL_RENT_PAYMENTS,
          {
            query: GET_ADMIN_RENT_SUMMARY,
            variables: {
              month,
              year,
            },
          },
        ],
      });

      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  if (summaryLoading || paymentLoading) {
    return <Typography>Loading payment details...</Typography>;
  }

  if (summaryError || paymentError) {
    return (
      <Typography sx={{ color: "#d32f2f" }}>
        Failed to load payment details.
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
          marginBottom: "24px",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              marginBottom: "4px",
            }}
          >
            Rent Management
          </Typography>

          <Typography>Manage rent payments and dues</Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: "16px",
          }}
        >
          <TextField
            select
            size="small"
            label="Month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            {[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            size="small"
            label="Year"
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(5, 1fr)",
          },
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <Card>
          <CardContent>
            <Typography>Total Rooms</Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                marginTop: "8px",
              }}
            >
              {totalRooms}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography>Occupied Rooms</Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                marginTop: "8px",
              }}
            >
              {occupiedRooms}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography>Expected Rent</Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                marginTop: "8px",
              }}
            >
              ₹{totalRent.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography>Collected</Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                marginTop: "8px",
                color: "#2e7d32",
              }}
            >
              ₹{paidRent.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography>Due</Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                marginTop: "8px",
                color: "#d32f2f",
              }}
            >
              ₹{dueRent.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          marginBottom: "16px",
        }}
      >
        PG Rent Summary
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        {summaries.map((pg) => (
          <Card key={pg.pgId}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  marginBottom: "16px",
                }}
              >
                {pg.pgName}
              </Typography>

              <Typography sx={{ marginBottom: "8px" }}>
                Rooms: {pg.totalRooms}
              </Typography>

              <Typography sx={{ marginBottom: "8px" }}>
                Occupied: {pg.occupiedRooms}
              </Typography>

              <Typography sx={{ marginBottom: "8px" }}>
                Expected Rent: ₹{pg.totalRent.toLocaleString()}
              </Typography>

              <Typography
                sx={{
                  marginBottom: "8px",
                  color: "#2e7d32",
                }}
              >
                Collected: ₹{pg.paidRent.toLocaleString()}
              </Typography>

              <Typography
                sx={{
                  color: "#d32f2f",
                }}
              >
                Due: ₹{pg.dueRent.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          marginBottom: "16px",
        }}
      >
        Payment History
      </Typography>

      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tenant</TableCell>
              <TableCell>PG</TableCell>
              <TableCell>Room</TableCell>
              <TableCell>Month</TableCell>
              <TableCell>Rent</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Due</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No payments found
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => {
                const due = Number(payment.amount) - Number(payment.paidAmount);

                return (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.tenant.user.name}</TableCell>

                    <TableCell>{payment.tenant.pg.name}</TableCell>

                    <TableCell>
                      {payment.tenant.room
                        ? `Room ${payment.tenant.room.roomNo}`
                        : "-"}
                    </TableCell>

                    <TableCell>
                      {payment.month} {payment.year}
                    </TableCell>

                    <TableCell>
                      ₹{Number(payment.amount).toLocaleString()}
                    </TableCell>

                    <TableCell>
                      ₹{Number(payment.paidAmount).toLocaleString()}
                    </TableCell>

                    <TableCell>₹{due.toLocaleString()}</TableCell>

                    <TableCell>
                      <Chip
                        label={payment.status}
                        size="small"
                        sx={{
                          color:
                            payment.status === "paid"
                              ? "#2e7d32"
                              : payment.status === "overdue"
                                ? "#d32f2f"
                                : "#ed6c02",
                          backgroundColor:
                            payment.status === "paid"
                              ? "#e8f5e9"
                              : payment.status === "overdue"
                                ? "#ffebee"
                                : "#fff3e0",
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<EditIcon />}
                        sx={{
                          backgroundColor: "#5B21B6",
                          color: "#FFFFFF",
                          textTransform: "none",
                          "&:hover": {
                            backgroundColor: "#4C1D95",
                          },
                        }}
                        onClick={() => handleEdit(payment)}
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Update Rent Payment</DialogTitle>

        <DialogContent>
          {selectedPayment && (
            <Box sx={{ marginTop: "8px" }}>
              <Typography sx={{ marginBottom: "16px" }}>
                Tenant: <strong>{selectedPayment.tenant.user.name}</strong>
              </Typography>

              <Typography sx={{ marginBottom: "16px" }}>
                Rent Amount: ₹{Number(selectedPayment.amount).toLocaleString()}
              </Typography>

              <Typography sx={{ marginBottom: "16px" }}>
                Already Paid: ₹
                {Number(selectedPayment.paidAmount).toLocaleString()}
              </Typography>

              <TextField
                label="Additional Paid Amount"
                type="number"
                fullWidth
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                sx={{ marginBottom: "16px" }}
              />

              <TextField
                label="Payment Date"
                type="date"
                fullWidth
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                sx={{ marginBottom: "16px" }}
              />

              <TextField
                select
                label="Payment Mode"
                fullWidth
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
              >
                <MenuItem value="cash">Cash</MenuItem>

                <MenuItem value="upi">UPI</MenuItem>

                <MenuItem value="card">Card</MenuItem>
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
            disabled={updating || !paidAmount || !paymentDate}
            sx={{ bgcolor: "#5B21B6" }}
          >
            {updating ? "Updating..." : "Update Payment"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentManagement;
