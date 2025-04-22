"use client";

import ErrorBoundary from "../../../components/ErrorBoundary";
import { Container } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export default function DashboardLayout({ children }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ErrorBoundary>
        <Container maxWidth="xl" sx={{ py: 3 }}>
          {children}
        </Container>
      </ErrorBoundary>
    </LocalizationProvider>
  );
}
