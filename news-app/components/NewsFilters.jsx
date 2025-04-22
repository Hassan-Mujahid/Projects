"use client";

import Grid from "@mui/material/Grid2";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { parseISO, format } from "date-fns";

export default function NewsFilters({
  sortBy,
  onSortChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
  disabled = false,
}) {
  const formatDateForAPI = (date) => {
    if (!date) return null;
    try {
      // Create a new date object and set it to local timezone
      const localDate = new Date(date);
      // Use date-fns format to ensure consistent date formatting
      return format(localDate, "yyyy-MM-dd");
    } catch (error) {
      console.error("Date formatting error:", error);
      return null;
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        <Grid xs={12} sm={4}>
          <FormControl fullWidth disabled={disabled}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => onSortChange(e.target.value)}
            >
              <MenuItem value="publishedAt_desc">Latest First</MenuItem>
              <MenuItem value="relevancy">Most Relevant</MenuItem>
              <MenuItem value="popularity">Most Popular</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid xs={12} sm={4}>
          <DatePicker
            label="From Date"
            value={fromDate ? parseISO(fromDate) : null}
            onChange={(newDate) => {
              onFromDateChange(formatDateForAPI(newDate));
            }}
            disabled={disabled}
            slotProps={{
              textField: {
                fullWidth: true,
                error: false,
              },
            }}
            maxDate={toDate ? parseISO(toDate) : undefined}
          />
        </Grid>

        <Grid xs={12} sm={4}>
          <DatePicker
            label="To Date"
            value={toDate ? parseISO(toDate) : null}
            onChange={(newDate) => {
              onToDateChange(formatDateForAPI(newDate));
            }}
            disabled={disabled}
            slotProps={{
              textField: {
                fullWidth: true,
                error: false,
              },
            }}
            minDate={fromDate ? parseISO(fromDate) : undefined}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
