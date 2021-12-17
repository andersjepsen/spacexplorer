import { gql, useQuery } from "@apollo/client";
import { Public } from "@mui/icons-material";
import {
  Alert,
  Card,
  CardContent,
  Grid,
  IconButton,
  LinearProgress,
  CardHeader,
  Typography,
} from "@mui/material";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { GetMissionQuery, GetMissionQueryVariables } from "../../api/api";
import { useQueryParam } from "../../hooks";
import { useList } from "../../hooks/useList";
import { Container } from "../../ui";

const GET_MISSION = gql`
  query GetMission($id: ID!) {
    mission(id: $id) {
      id
      name
      description
      manufacturers
      website
      payloads {
        id
        manufacturer
        payload_type
        payload_mass_kg
        payload_mass_lbs
        nationality
        customers
      }
    }
  }
`;

const MissionPage: NextPage = () => {
  const router = useRouter();

  const id = useQueryParam(router.query.mission_id);
  const { data, loading, error } = useQuery<
    GetMissionQuery,
    GetMissionQueryVariables
  >(GET_MISSION, {
    variables: { id },
  });

  const payloads = useList(data?.mission?.payloads);

  return (
    <>
      {loading && <LinearProgress />}
      {error && <Alert severity="error">An error occured</Alert>}
      <Container>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Typography variant="h4">{data?.mission?.name}</Typography>
          </Grid>
          <Grid item>
            <Link href={data?.mission?.website ?? ""} passHref>
              <a target="_blank">
                <IconButton color="primary">
                  <Public />
                </IconButton>
              </a>
            </Link>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Description" />
              <CardContent>
                <Typography>{data?.mission?.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h5">Payloads</Typography>
              </Grid>
              {payloads.map((payload) => (
                <Grid key={payload.id} item xs={12} sm={6} md={4}>
                  <Card>
                    <CardHeader
                      title={payload.id}
                      subheader={payload.payload_type}
                    />
                    <CardContent>
                      <Typography>
                        <strong>Manufacturer:</strong> {payload.manufacturer}
                      </Typography>
                      <Typography>
                        <strong>Customers:</strong>{" "}
                        {payload.customers?.join(", ")}
                      </Typography>
                      <Typography>
                        <strong>Nationality:</strong> {payload.nationality}
                      </Typography>
                      <Typography>
                        <strong>Mass:</strong> {payload.payload_mass_kg} kg (
                        {payload.payload_mass_lbs} lbs)
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default MissionPage;
