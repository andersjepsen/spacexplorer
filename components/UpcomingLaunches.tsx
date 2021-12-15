import { Paper, Toolbar, Table, TableCell, TableRow } from "@mui/material";
import React from "react";
import { gql } from "@apollo/client";
import { UpcomingLaunchesFragment } from "../api/api";
import { useList } from "../hooks/useList";

type Props = {
  query: UpcomingLaunchesFragment;
};

export function UpcomingLaunches({ query }: Props) {
  const upcomingLaunches = useList(query.launchesUpcoming);
  return (
    <Paper>
      <Toolbar
        variant="dense"
        sx={{
          bgcolor: (theme) => theme.palette.primary.main,
        }}
      >
        Upcoming launches
      </Toolbar>
      <Table size="small">
        {upcomingLaunches.map((launch) => (
          <TableRow key={launch.id}>
            <TableCell>{launch?.launch_date_utc}</TableCell>
          </TableRow>
        ))}
      </Table>
    </Paper>
  );
}

UpcomingLaunches.fragments = {
  query: gql`
    fragment UpcomingLaunches on Query {
      launchesUpcoming {
        id
        launch_date_utc
      }
    }
  `,
};
