import React from "react";
import { Typography, Fab } from "@mui/material";
import { Home } from "@mui/icons-material";

export default function NotFound() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Typography variant="h3">404</Typography>
        <div>⠀⠀</div>
        <Typography variant="h5">Šī lappuse neeksistē.</Typography>
      </div>
      <br></br>
      <div>
        <Fab variant="extended" href="/">
          <Home sx={{ mr: 1 }} />
          Atgriezties sākumā
        </Fab>
      </div>
    </main>
  );
}
