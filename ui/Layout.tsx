import {
  AppBar,
  styled,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  Box,
  ListItemText,
} from "@mui/material";
import Link from "next/link";
import React from "react";

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

type Props = React.PropsWithChildren<{}>;

export function Layout({ children }: Props) {
  return (
    <Box>
      <AppBar position="fixed">
        <Toolbar>
          <Link href="/" passHref>
            <Typography>SpaceXplorer</Typography>
          </Link>
        </Toolbar>
      </AppBar>

      <Offset />

      <main>{children}</main>
    </Box>
  );
}
