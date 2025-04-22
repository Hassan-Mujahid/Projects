"use client";

import { AppBar, Toolbar, Box, Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import handleSignOut from "../utils/signOut";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          bgcolor: "#37b24d",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Link
              href="/"
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <Box
                component="span"
                sx={{
                  fontWeight: 700,
                  fontSize: "1.5rem",
                  lineHeight: "2rem",
                  color: "white",
                  "&:hover": {
                    opacity: 0.9,
                  },
                }}
              >
                News
              </Box>
            </Link>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {!session ? (
              <Link
                href="/sign-in"
                style={{
                  textDecoration: "none",
                }}
              >
                <Button
                  color="inherit"
                  sx={{
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  Sign In
                </Button>
              </Link>
            ) : (
              <Link
                href="/"
                style={{
                  textDecoration: "none",
                }}
              >
                <Button
                  color="inherit"
                  onClick={handleSignOut}
                  sx={{
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  Sign Out
                </Button>
              </Link>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
