import { useMutation } from "@apollo/client/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import background from '../../assets/background.jpg'

import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Stack,
  Link as MuiLink,
  TextField,
  Typography,
} from "@mui/material";

import { REGISTER_USER } from "../../graphql/auth.api";
import { Link, useNavigate } from "react-router-dom";

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email"),

  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();

  const [registerUser, { loading, error: registerError }] =
    useMutation(REGISTER_USER);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (formData: RegisterFormData) => {
    try {
      const { data } = await registerUser({
        variables: {
          input: {
            ...formData,
            role: "tenant",
          },
        },
      });

      if (!data) return;

      reset();
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F5F3FF",
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100vw',
        height: '100vh',
        px: 2,
        py: 4,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 500,
          p: 4,
          borderRadius: 3,
          boxShadow: 4,
          backgroundColor: "rgba(255, 255, 255, 0.55)",
          backdropFilter: "blur(3px)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
        }}
      >
        <Stack spacing={3}>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h4"
              sx={{
                color: "#5B21B6",
                fontWeight: 700,
                marginBottom: 1,
              }}
            >
              Create Account
            </Typography>

            <Typography>
              Register for your Hostel Management account
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
            }}
          >
            <TextField
              label="Full Name"
              fullWidth
              {...register("name")}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(255,255,255,0.6)",
                },
              }}
            />

            <TextField
              label="Email"
              type="email"
              fullWidth
              {...register("email")}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(255,255,255,0.6)",
                },
              }}
            />

            <TextField
              label="Phone Number"
              type="tel"
              fullWidth
              {...register("phone")}
              error={Boolean(errors.phone)}
              helperText={errors.phone?.message}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(255,255,255,0.6)",
                },
              }}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              {...register("password")}
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(255,255,255,0.6)",
                },
              }}
            />

            {registerError && (
              <Alert severity="error">{registerError.message}</Alert>
            )}

            <Typography sx={{ textAlign: "center" }}>
              Already have an account?{" "}
              <MuiLink
                component={Link}
                to="/login"
                underline="hover"
                sx={{
                  color: "#5B21B6",
                  fontWeight: 600,
                }}
              >
                Login
              </MuiLink>
            </Typography>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                backgroundColor: "#5B21B6",
                paddingY: 1.4,
                borderRadius: 2,
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#4C1D95",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Create Account"
              )}
            </Button>
          </Box>
        </Stack>
      </Card>
    </Box>
  );
};

export default Register;