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
import { useRouter, useSearchParams } from "next/navigation";
import GoogleIcon from "@mui/icons-material/Google";

export default function SignIn() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      });

      console.log("result", result);

      if (result?.error) {
        if (result.error.includes("Database connection")) {
          setError("Unable to connect to the server. Please try again later.");
        } else if (result.error) {
          setError("Invalid email or password");
        } else {
          setError("An error occurred during sign in");
        }
      } else {
        // Successful login
        router.push("/"); // or wherever you want to redirect
        window.location.href = "/";
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
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
            Sign In
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Regular Sign In Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              name="email"
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
              name="password"
              margin="normal"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              disabled={isLoading || isGoogleLoading}
              error={!!error}
            />
            <Link href="/forgot-password">
              <span className="text-sm text-gray-500 flex justify-end">
                Forgot Password?
              </span>
            </Link>

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
                "Sign In"
              )}
            </Button>
          </Box>

          {/* <Divider sx={{ my: 2 }}>OR</Divider> 

          {/* Google Sign In */}
          {/*  <Box sx={{ textAlign: "center" }}>
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
              Sign in with Google
            </Button>
          </Box> */}

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{" "}
              <Link
                href="/sign-up"
                style={{
                  color: "inherit",
                  textDecoration: "underline",
                }}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}

/////////////////////////////////////

// "use client";

// import {
//   TextField,
//   Button,
//   Card,
//   CardContent,
//   IconButton,
// } from "@mui/material";
// import GoogleIcon from "@mui/icons-material/Google";
// import Link from "next/link";
// // import { signIn } from "../../../auth";
// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import Alert from "@mui/material/Alert";
// import CircularProgress from "@mui/material/CircularProgress";

// const SignIn = () => {
//   const router = useRouter();
// const [error, setError] = useState("");
// const [loading, setLoading] = useState(false);

// const handleGoogleSignIn = async () => {
//   try {
//     setLoading(true);
//     await signIn("google", {
//       callbackUrl: "/",
//     });
//   } catch (error) {
//     console.error("Google sign in error:", error);
//   } finally {
//     setLoading(false);
//   }
// };

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setError("");
//   setLoading(true);

//   const formData = new FormData(e.currentTarget);

//   try {
//     const result = await signIn("credentials", {
//       email: formData.get("email"),
//       password: formData.get("password"),
//       redirect: false,
//     });

//     console.log("result", result);

//     if (result?.error) {
//       if (result.error.includes("Database connection")) {
//         setError("Unable to connect to the server. Please try again later.");
//       } else if (result.error) {
//         setError("Invalid email or password");
//       } else {
//         setError("An error occurred during sign in");
//       }
//     } else {
//       // Successful login
//       router.push("/"); // or wherever you want to redirect
//     }
//   } catch (error) {
//     setError("An unexpected error occurred");
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <div className="min-h-screen min-w-screen flex flex-col lg:flex-row gap-4 lg:gap-10 justify-start lg:items-center lg:justify-center mt-6">
//       <div>
//         <div className="text-3xl lg:text-6xl font-bold text-center ">News</div>
//         <div className="text-sm font-semibold text-center mt-2">
//           Sign In with Email or google to see exciting News!
//         </div>
//       </div>
//       <div className="flex justify-center items-center">
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
//                 id="email"
//                 required
//                 name="email"
//                 type="email"
//                 label="Email"
//                 variant="filled"
//                 margin="normal"
//               />
//               <TextField
//                 fullWidth
//                 id="password"
//                 required
//                 type="password"
//                 name="password"
//                 label="Password"
//                 variant="filled"
//                 margin="normal"
//               />
//               <Link href="/forgot-password">
//                 <button className="w-full flex justify-end text-sm">
//                   Forgot password?
//                 </button>
//               </Link>
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
//                 Sign In
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
//                 <span className="items-end">Sign In with Google</span>
//               </Button>
//             </form>
//             <div className="mt-4 display">
//               Don't Have an Account?
//               <Link href="/sign-up" className="text-blue-500">
//                 Sign Up
//               </Link>
//             </div>
//             {error && (
//               <Alert severity="error" sx={{ mt: "16px" }}>
//                 {error}
//               </Alert>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default SignIn;
