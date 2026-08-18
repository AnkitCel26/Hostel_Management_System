import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
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

import { LOGIN_USER } from "../../graphql/auth.api";
import AuthContext from "../../context/AuthContext";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const [loginUser, { loading, error: loginError }] = useMutation(LOGIN_USER);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { setUser } = authContext!;

  const onSubmit = async (formData: LoginFormData) => {
    try {
      const { data } = await loginUser({
        variables: {
          input: formData,
        },
      });

      if (!data) return;

      const user = data.loginUser.user;

      setUser(user);
      reset();

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/tenant/dashboard");
      }
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
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 420,
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
              Welcome Back
            </Typography>

            <Typography>
              Login to your Hostel Management account
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

            {loginError && (
              <Alert severity="error">{loginError.message}</Alert>
            )}

            <Typography sx={{ textAlign: "center" }}>
              Don't have an account?{" "}
              <MuiLink
                component={Link}
                to="/register"
                underline="hover"
                sx={{
                  color: "#5B21B6",
                  fontWeight: 600,
                }}
              >
                Register
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
                "Login"
              )}
            </Button>
          </Box>
        </Stack>
      </Card>
    </Box>
  );
};

export default Login;