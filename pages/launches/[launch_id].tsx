import { gql, useQuery } from "@apollo/client";
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  ImageList,
  ImageListItem,
  CardHeader,
  Avatar,
  LinearProgress,
  Typography,
} from "@mui/material";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { GetLaunchQuery, GetLaunchQueryVariables } from "../../api/api";
import { useList } from "../../hooks";
import { useQueryParam } from "../../hooks/useQueryParam";
import { Container } from "../../ui";

const GET_LAUNCH = gql`
  query GetLaunch($id: ID!) {
    launch(id: $id) {
      id
      details
      mission_name
      launch_date_utc
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

        <Grid item xs>
          <Card>
            <CardHeader title="Details" />
            <CardContent>
              <Typography>{data?.launch?.details}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs>
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
