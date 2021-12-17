import { gql, useQuery } from "@apollo/client";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  ImageList,
  ImageListItem,
  LinearProgress,
  Typography,
} from "@mui/material";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { GetLaunchQuery, GetLaunchQueryVariables } from "../../api/api";
import { useList } from "../../hooks";
import { useQueryParam } from "../../hooks/useQueryParam";
import { Container } from "../../ui";
import { useMemo } from "react";
import Link from "next/link";

const GET_LAUNCH = gql`
  query GetLaunch($id: ID!) {
    launch(id: $id) {
      id
      details
      mission_id
      mission_name
      launch_date_utc
      rocket {
        rocket_name
      }
      launch_site {
        site_name
      }
      launch_success
      links {
        mission_patch_small
        flickr_images
      }
    }
  }
`;

const MissionPage: NextPage = () => {
  const router = useRouter();

  const id = useQueryParam(router.query.launch_id);
  const { data, loading, error } = useQuery<
    GetLaunchQuery,
    GetLaunchQueryVariables
  >(GET_LAUNCH, {
    variables: { id },
  });

  const flickrImages = useList(data?.launch?.links?.flickr_images);

  const missionNames = useMemo(() => {
    return (
      data?.launch?.mission_name?.split("/").map((name) => name.trim()) ?? []
    );
  }, [data]);

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item>
              <Avatar
                aria-label={`${data?.launch?.mission_name} mission patch}`}
                src={data?.launch?.links?.mission_patch_small ?? undefined}
              />
            </Grid>
            <Grid item xs>
              <Typography variant="h4">{data?.launch?.mission_name}</Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={23}>
              <Card>
                <CardHeader title="Details" />
                <CardContent>
                  <Typography>
                    {data?.launch?.details ?? `No details available`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  {data?.launch?.launch_date_utc && (
                    <Typography>
                      Launch date:{" "}
                      {new Date(data.launch.launch_date_utc).toLocaleString()}
                    </Typography>
                  )}
                  <Typography>
                    Rocket: {data?.launch?.rocket?.rocket_name}
                  </Typography>
                  <Typography>
                    Launch site: {data?.launch?.launch_site?.site_name}
                  </Typography>

                  <Typography>
                    Mission(s):{" "}
                    {missionNames.map((missionName, i) => {
                      const missionId = data?.launch?.mission_id?.[i];
                      return (
                        <>
                          {missionId ? (
                            <Link
                              key={missionName}
                              href={`/missions/${missionId}`}
                            >
                              {missionName}
                            </Link>
                          ) : (
                            missionName
                          )}{" "}
                        </>
                      );
                    })}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card>
            <CardHeader title="Photos" />
            <CardMedia>
              <ImageList>
                {flickrImages.map((flickrUrl) => (
                  <ImageListItem key={flickrUrl}>
                    <img src={flickrUrl} alt="" />
                  </ImageListItem>
                ))}
              </ImageList>
            </CardMedia>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MissionPage;
