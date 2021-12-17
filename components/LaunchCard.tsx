import { gql } from "@apollo/client";
import { Avatar, Card, CardHeader, CardMedia } from "@mui/material";
import React from "react";
import { LaunchCardFragment } from "../api/api";
type Props = {
  launch: LaunchCardFragment;
};

export function LaunchCard({ launch }: Props) {
  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar
            aria-label={`${launch.mission_name} mission patch}`}
            src={launch.links?.mission_patch_small ?? undefined}
          />
        }
        title={launch.mission_name}
        subheader={
          launch.launch_date_utc &&
          new Date(launch.launch_date_utc).toLocaleString()
        }
      />
      <CardMedia
        component="img"
        height="194"
        image={launch.links?.flickr_images?.[0] ?? undefined}
        alt={`Photo of ${launch.mission_name} launch`}
      />
    </Card>
  );
}

LaunchCard.fragments = {
  launch: gql`
    fragment LaunchCard on Launch {
      id
      mission_name
      launch_date_utc
      links {
        mission_patch_small
        flickr_images
      }
    }
  `,
};
