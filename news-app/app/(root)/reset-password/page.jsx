"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
} from "@mui/material";
import { validatePassword } from "../../../utils/validation";

// Separate the content component that uses useSearchParams
function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setValidationErrors([]);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password strength
    const { isValid, errors } = validatePassword(password);
    if (!isValid) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/sign-in");
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card sx={{ maxWidth: 400, width: "100%" }}>
        <CardContent>
          <h1 className="text-2xl font-bold mb-4 text-center">
            Reset Password
          </h1>

          {success ? (
            <Alert severity="success">
              Password successfully reset. Redirecting to login...
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <TextField
                fullWidth
                type="password"
                label="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />

              <TextField
                fullWidth
                type="password"
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />

              {validationErrors.length > 0 && (
                <Alert severity="warning">
                  <ul className="list-disc pl-4">
                    {validationErrors.map((err, index) => (
                      <li key={index}>{err}</li>
                    ))}
                  </ul>
                </Alert>
              )}

              {error && <Alert severity="error">{error}</Alert>}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Main component wrapped with Suspense
export default function ResetPassword() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <CircularProgress />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}

//////////////////////////////////////////////////////////////////

// "use client";

// import { useState, Suspense } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { TextField, Button, Card, CardContent, Alert } from "@mui/material";
// import { validatePassword } from "../../../utils/validation";

// export default function ResetPassword() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const token = searchParams.get("token");

//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);

//   const [validationErrors, setValidationErrors] = useState([]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setValidationErrors([]);

//     // Validate passwords match
//     if (password !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     // Validate password strength
//     const { isValid, errors } = validatePassword(password);
//     if (!isValid) {
//       setValidationErrors(errors);
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await fetch("/api/auth/reset-password", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ token, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || "Something went wrong");
//       }

//       setSuccess(true);
//       setTimeout(() => {
//         router.push("/sign-in");
//       }, 3000);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4">
//       <Card sx={{ maxWidth: 400, width: "100%" }}>
//         <CardContent>
//           <h1 className="text-2xl font-bold mb-4 text-center">
//             Reset Password
//           </h1>

//           {success ? (
//             <Alert severity="success">
//               Password successfully reset. Redirecting to login...
//             </Alert>
//           ) : (
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <TextField
//                 fullWidth
//                 type="password"
//                 label="New Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 disabled={loading}
//               />

//               <TextField
//                 fullWidth
//                 type="password"
//                 label="Confirm Password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 required
//                 disabled={loading}
//               />

//               {validationErrors.length > 0 && (
//                 <Alert severity="warning">
//                   <ul className="list-disc pl-4">
//                     {validationErrors.map((err, index) => (
//                       <li key={index}>{err}</li>
//                     ))}
//                   </ul>
//                 </Alert>
//               )}

//               {error && <Alert severity="error">{error}</Alert>}

//               <Button
//                 type="submit"
//                 variant="contained"
//                 fullWidth
//                 disabled={loading}
//               >
//                 {loading ? "Resetting..." : "Reset Password"}
//               </Button>
//             </form>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
