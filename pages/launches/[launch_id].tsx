import { gql } from "@apollo/client";
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
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useMemo } from "react";
import { GetLaunchQuery, GetLaunchQueryVariables } from "../../api/api";
import { initializeApollo } from "../../apollo.client";
import { useList } from "../../hooks";
import { Container } from "../../ui";

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

export const getStaticProps: GetStaticProps<{
  launch: GetLaunchQuery["launch"];
}> = async (context) => {
  const client = initializeApollo();

  const id =
    typeof context.params?.launch_id === "string"
      ? context.params.launch_id
      : "";

  const { data } = await client.query<GetLaunchQuery, GetLaunchQueryVariables>({
    query: GET_LAUNCH,
    variables: {
      id,
    },
  });

  if (!data.launch) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      launch: data.launch,
    },
    revalidate: 43200, // 12 hours (60*60*12)
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: true };
};

const LaunchPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  launch,
}) => {
  const router = useRouter();

  const flickrImages = useList(launch?.links?.flickr_images);

  const missionNames = useMemo(() => {
    return launch?.mission_name?.split("/").map((name) => name.trim()) ?? [];
  }, [launch]);

  if (router.isFallback) {
    return <LinearProgress />;
  }

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item>
              <Avatar
                aria-label={`${launch?.mission_name} mission patch}`}
                src={launch?.links?.mission_patch_small ?? undefined}
              />
            </Grid>
            <Grid item xs>
              <Typography variant="h4">{launch?.mission_name}</Typography>
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
                    {launch?.details ?? `No details available`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  {launch?.launch_date_utc && (
                    <Typography>
                      Launch date:{" "}
                      {new Date(launch.launch_date_utc).toLocaleString()}
                    </Typography>
                  )}
                  <Typography>Rocket: {launch?.rocket?.rocket_name}</Typography>
                  <Typography>
                    Launch site: {launch?.launch_site?.site_name}
                  </Typography>

                  <Typography>
                    Mission(s):{" "}
                    {missionNames.map((missionName, i) => {
                      const missionId = launch?.mission_id?.[i];
                      return (
                        <Fragment key={missionName}>
                          {missionId ? (
                            <Link href={`/missions/${missionId}`}>
                              {missionName}
                            </Link>
                          ) : (
                            missionName
                          )}{" "}
                        </Fragment>
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

export default LaunchPage;
