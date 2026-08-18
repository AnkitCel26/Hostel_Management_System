import { useContext, useEffect, useState } from "react";
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
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import AuthContext from "../../context/AuthContext";

import {
  CREATE_RENT_PAYMENT,
  GET_RENT_PAYMENT_HISTORY,
} from "../../graphql/tenantPayment.api";

import type {
  PaymentMode,
} from "../../types/TenantPayment.types";

const TenantPayment = () => {
  const { user } = useContext(AuthContext)!;

  const [open, setOpen] = useState(false);

  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [amount, setAmount] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("cash");

  const { data, loading, error } = useQuery(GET_RENT_PAYMENT_HISTORY, {
    variables: {
      userId: user?.id ?? "",
    },
    skip: !user?.id,
  });

  const [createRentPayment, { loading: creating, error: createError }] =
    useMutation(CREATE_RENT_PAYMENT);

  const paymentData = data?.getRentPaymentHistory;
  const payments = paymentData?.paymentHistory ?? [];
  const tenantId = data?.getTenantPgRoom?.tenant?.id;


  useEffect(() => {
    if (paymentData) {
      setAmount(String(paymentData.monthlyRent));
    }
  }, [paymentData]);

  const handleOpen = () => {
    setMonth("");
    setYear(new Date().getFullYear());
    setAmount(String(paymentData?.monthlyRent ?? ""));
    setPaidAmount("");
    setDueDate("");
    setPaymentDate("");
    setPaymentMode("cash");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreate = async () => {
    if (!tenantId) {
      return;
    }

    if (
      !month ||
      !year ||
      !amount ||
      !paidAmount ||
      !dueDate ||
      !paymentDate ||
      !paymentMode
    ) {
      return;
    }

    try {
      await createRentPayment({
        variables: {
          input: {
            tenantId,
            month,
            year,
            amount: Number(amount),
            paidAmount: Number(paidAmount),
            dueDate,
            paymentDate,
            paymentMode,
          },
        },
        refetchQueries: [
          {
            query: GET_RENT_PAYMENT_HISTORY,
            variables: {
              userId: user?.id ?? "",
            },
          },
        ],
      });

      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) {
      return "-";
    }

    const value = date.includes("T") ? date.split("T")[0] : date;

    const parts = value.split("-");

    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    return value;
  };
  if (!data) {
    return (
      <Typography >
        No Payment data found...
      </Typography>
    );
  }

  if (loading) {
    return <Typography>Loading payments...</Typography>;
  }

  if (error) {
    return <Typography sx={{color:"#DC2626"}}>Failed to load payments.</Typography>;
  }

  const totalPaid = payments.reduce(
    (total, payment) => total + payment.paidAmount,
    0,
  );

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
            Payments
          </Typography>

          <Typography sx={{ mt: 1 }}>
            View and manage your rent payments
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          disabled={!tenantId}
          sx={{
            backgroundColor: "#5B21B6",
            "&:hover": {
              backgroundColor: "#4C1D95",
            },
          }}
        >
          Create Payment
        </Button>
      </Box>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 3 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography>Monthly Rent</Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mt: 1,
              }}
            >
              ₹{paymentData?.monthlyRent ?? 0}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography>Total Payments</Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mt: 1,
              }}
            >
              {payments.length}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography>Paid Amount</Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mt: 1,
                color: "#16A34A",
              }}
            >
              ₹{totalPaid}
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Month</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Paid Amount</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Payment Date</TableCell>
              <TableCell>Payment Mode</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No payments found
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.month}</TableCell>

                  <TableCell>{payment.year}</TableCell>

                  <TableCell>₹{payment.amount}</TableCell>

                  <TableCell>₹{payment.paidAmount}</TableCell>

                  <TableCell>{formatDate(payment.dueDate)}</TableCell>

                  <TableCell>{formatDate(new Date(Number(payment.paymentDate)).toLocaleDateString())}</TableCell>

                  <TableCell>
                    {payment.paymentMode
                      ? payment.paymentMode.toUpperCase()
                      : "-"}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={payment.status}
                      size="small"
                      sx={{
                        color: "#FFFFFF",
                        backgroundColor:
                          payment.status === "paid" ? "#16A34A" : "#F59E0B",
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Create Rent Payment</DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {createError && (
              <Typography sx={{ color: "#DC2626" }}>
                {createError.message}
              </Typography>
            )}

            <TextField
              select
              label="Month"
              fullWidth
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              <MenuItem value="January">January</MenuItem>
              <MenuItem value="February">February</MenuItem>
              <MenuItem value="March">March</MenuItem>
              <MenuItem value="April">April</MenuItem>
              <MenuItem value="May">May</MenuItem>
              <MenuItem value="June">June</MenuItem>
              <MenuItem value="July">July</MenuItem>
              <MenuItem value="August">August</MenuItem>
              <MenuItem value="September">September</MenuItem>
              <MenuItem value="October">October</MenuItem>
              <MenuItem value="November">November</MenuItem>
              <MenuItem value="December">December</MenuItem>
            </TextField>

            <TextField
              label="Year"
              type="number"
              fullWidth
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            />

            <TextField
              label="Rent Amount"
              type="number"
              fullWidth
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <TextField
              label="Paid Amount"
              type="number"
              fullWidth
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
            />

            <TextField
              label="Due Date"
              type="date"
              fullWidth
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
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
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} sx={{ color: "#5B21B6" }}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={
              creating ||
              !tenantId ||
              !month ||
              !year ||
              !amount ||
              !paidAmount ||
              !dueDate ||
              !paymentDate ||
              !paymentMode
            }
            sx={{
              backgroundColor: "#5B21B6",
              "&:hover": {
                backgroundColor: "#4C1D95",
              },
            }}
          >
            {creating ? "Creating..." : "Create Payment"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TenantPayment;
