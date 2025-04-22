"use client";

import { Box, Tabs, Tab, Paper } from "@mui/material";

const categories = [
  { value: "all", label: "All" },
  { value: "business", label: "Business" },
  { value: "technology", label: "Technology" },
  { value: "entertainment", label: "Entertainment" },
  { value: "health", label: "Health" },
  { value: "science", label: "Science" },
  { value: "sports", label: "Sports" },
];

export default function CategoryFilter({ value, onChange }) {
  return (
    <Paper elevation={0} sx={{ mb: 3, bgcolor: "background.default" }}>
      <Tabs
        value={value}
        onChange={(e, newValue) => onChange(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          "& .MuiTab-root": {
            minWidth: "auto",
            px: 3,
            py: 1,
          },
          // Hide scroll buttons when they're disabled
          "& .MuiTabs-scrollButtons.Mui-disabled": {
            display: "none",
          },
          // Ensure proper spacing when buttons are visible
          "& .MuiTabs-scrollButtons": {
            width: "auto",
            flexShrink: 0,
          },
        }}
      >
        {categories.map((category) => (
          <Tab
            key={category.value}
            label={category.label}
            value={category.value}
          />
        ))}
      </Tabs>
    </Paper>
  );
}
