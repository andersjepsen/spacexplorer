import { gql, useQuery } from "@apollo/client";
import { AppBar, Toolbar, styled } from "@mui/material";
import type { NextPage } from "next";
import React from "react";
import { GetCapsulesQuery } from "../api/api";

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

type Props = React.PropsWithChildren<{}>;

export function Layout({ children }: Props) {
  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>SpaceXplorer</Toolbar>
      </AppBar>
      <Offset />

      <main>{children}</main>
    </div>
  );
}
