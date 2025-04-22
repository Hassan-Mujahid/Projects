"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import GoogleIcon from "@mui/icons-material/Google";
import { validatePassword } from "../../../utils/validation";

export default function SignUp() {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [validationErrors, setValidationErrors] = useState([]);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setValidationErrors([]);

      const { isValid, errors } = validatePassword(formData.password);
      if (!isValid) {
        setValidationErrors(errors);
        setIsLoading(false);
        return;
      }

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);

      if (data.success === true) {
        setIsLoading(false);
        setError(null);
        setSuccessMessage(data.message);
        return router.push("/sign-in");
      } else if (data.success === false) {
        // Handle error
        setIsLoading(false);
        setError(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      await signIn("google", {
        callbackUrl: "/",
      });
    } catch (error) {
      console.error("Google sign in error:", error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-4">
      <Card elevation={10} sx={{ width: "100%", maxWidth: "325px", p: 2 }}>
        <CardContent>
          <Typography
            variant="h5"
            component="h1"
            gutterBottom
            textAlign="center"
          >
            Sign Up
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Regular Sign Up Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Username"
              margin="normal"
              required
              value={formData.username}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, username: e.target.value }))
              }
              disabled={isLoading || isGoogleLoading}
              error={!!error}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              disabled={isLoading || isGoogleLoading}
              error={!!error}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              disabled={isLoading || isGoogleLoading}
              error={!!error}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              disabled={isLoading || isGoogleLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign Up"
              )}
            </Button>
          </Box>

          {/* <Divider sx={{ my: 2 }}>OR</Divider>

          {/* Google Sign In */}
          {/* <Box sx={{ textAlign: "center" }}>
            <Button
              variant="outlined"
              onClick={handleGoogleSignIn}
              startIcon={
                isGoogleLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  <GoogleIcon />
                )
              }
              fullWidth
              disabled={isLoading || isGoogleLoading}
            >
              Sign up with Google
            </Button>
          </Box> */}

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                style={{
                  color: "inherit",
                  textDecoration: "underline",
                }}
              >
                Sign In
              </Link>
            </Typography>
          </Box>
          {successMessage && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {successMessage}
            </Alert>
          )}
          {validationErrors.length > 0 && (
            <Alert severity="warning">
              <ul className="list-disc pl-4">
                {validationErrors.map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

////////////////////////////////////////////////////////

// "use client";

// import {
//   TextField,
//   Button,
//   Card,
//   CardContent,
//   IconButton,
//   Alert,
// } from "@mui/material";
// import GoogleIcon from "@mui/icons-material/Google";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { signIn } from "next-auth/react";

// const SignIn = () => {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);
//   const router = useRouter();
//   console.log("errorMessage:", errorMessage);

//   const handleGoogleSignIn = async () => {
//     try {
//       setLoading(true);
//       await signIn("google", {
//         callbackUrl: "/",
//       });
//     } catch (error) {
//       console.error("Google sign in error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       const res = await fetch("/api/auth/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, email, password }),
//       });

//       const data = await res.json();
//       console.log(data);

//       if (data.success === true) {
//         setLoading(false);
//         setErrorMessage(null);
//         setSuccessMessage(data.message);
//         router.push("/sign-in");
//       } else if (data.success === false) {
//         // Handle error
//         setLoading(false);
//         setSuccessMessage(null);
//         setErrorMessage(data.message);
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <div className="min-h-screen min-w-screen flex flex-col lg:flex-row gap-4 lg:gap-10 justify-start lg:items-center lg:justify-center mt-6 lg:mx-auto">
//       <div>
//         <div className="text-3xl lg:text-6xl font-bold text-center ">News</div>
//         <div className="text-sm font-semibold text-center mt-2">
//           Sign Up with Email or google to see exciting News!
//         </div>
//       </div>

//       <div className="max-lg:justify-center max-lg:flex">
//         <Card
//           elevation={10}
//           sx={{
//             width: "325px",
//             mt: "1rem",
//             borderRadius: "8px",
//           }}
//         >
//           <CardContent>
//             <form onSubmit={handleSubmit}>
//               <TextField
//                 fullWidth
//                 id="username"
//                 type="text"
//                 label="Username"
//                 variant="filled"
//                 margin="normal"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//               />
//               <TextField
//                 fullWidth
//                 id="email"
//                 type="email"
//                 label="Email"
//                 variant="filled"
//                 margin="normal"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//               <TextField
//                 fullWidth
//                 id="password"
//                 type="password"
//                 label="Password"
//                 variant="filled"
//                 margin="normal"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />

//               <Button
//                 disabled={loading}
//                 type="submit"
//                 variant="contained"
//                 fullWidth
//                 sx={{
//                   bgcolor: "primary.main",
//                   mt: "1rem",
//                 }}
//               >
//                 Sign Up
//               </Button>
//               <Button
//                 disabled={loading}
//                 onClick={handleGoogleSignIn}
//                 variant="contained"
//                 fullWidth
//                 sx={{
//                   bgcolor: "primary.main",
//                   mt: "1rem",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyItems: "center",
//                   gap: "0.5rem",
//                 }}
//               >
//                 <IconButton
//                   size="small"
//                   edge="start"
//                   color="inherit"
//                   aria-label="Google icon"
//                   sx={{
//                     padding: "0px",
//                   }}
//                 >
//                   <GoogleIcon fontSize="inherit" />
//                 </IconButton>
//                 <span className="items-end">Sign Up with Google</span>
//               </Button>
//             </form>
//             {errorMessage && (
//               <Alert
//                 severity="error"
//                 sx={{
//                   mt: "16px",
//                 }}
//               >
//                 {errorMessage}
//               </Alert>
//             )}
//             {successMessage && (
//               <Alert sx={{ mt: "16px" }} severity="success">
//                 {successMessage}
//               </Alert>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default SignIn;
