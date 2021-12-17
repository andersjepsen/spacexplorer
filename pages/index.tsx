import { gql, useQuery } from "@apollo/client";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Alert,
  Box,
  Grid,
  LinearProgress,
  Link as MuiLink,
  Typography,
} from "@mui/material";
import type { NextPage } from "next";
import Link from "next/link";
import { GetLaunchesQuery, GetLaunchesQueryVariables } from "../api/api";
import { LaunchCard } from "../components/LaunchCard";
import { useList } from "../hooks/useList";
import { Container } from "../ui";

const GET_LAUNCHES = gql`
  query GetLaunches($limit: Int, $offset: Int) {
    launches(limit: $limit, offset: $offset) {
      id
      ...LaunchCard
    }
  }
  ${LaunchCard.fragments.launch}
`;

const Home: NextPage = () => {
  const { data, error, loading, fetchMore } = useQuery<
    GetLaunchesQuery,
    GetLaunchesQueryVariables
  >(GET_LAUNCHES, {
    variables: { limit: 12, offset: 0 },
    notifyOnNetworkStatusChange: true,
  });

  const launches = useList(data?.launches);

  if (error) {
    return <Alert severity="error">Something went wrong!</Alert>;
  }

  return (
    <>
      {loading && <LinearProgress />}
      {data && (
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4">Launches</Typography>
            </Grid>
            {launches.map((launch) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={launch.id}>
                <Link href={`/launches/${launch.id}`} passHref>
                  <MuiLink variant="inherit" underline="none">
                    <LaunchCard launch={launch} />
                  </MuiLink>
                </Link>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" alignItems="center">
                <LoadingButton
                  color="primary"
                  variant="contained"
                  loading={loading}
                  onClick={() =>
                    fetchMore({ variables: { offset: launches.length } })
                  }
                >
                  Load more
                </LoadingButton>
              </Box>
            </Grid>
          </Grid>
        </Container>
      )}
    </>
  );
};

export default Home;
