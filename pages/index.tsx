import { gql, useQuery } from "@apollo/client";
import { styled } from "@mui/material";
import type { NextPage } from "next";
import { GetCapsulesQuery } from "../api/api";
import { Layout } from "../ui/Layout";
import { UpcomingLaunches } from "../components/UpcomingLaunches";

const GET_CAPSULES = gql`
  query GetCapsules {
    capsules(limit: 10) {
      id
      type
    }
    ...UpcomingLaunches
  }
  ${UpcomingLaunches.fragments.query}
`;

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

const Home: NextPage = () => {
  const { data } = useQuery<GetCapsulesQuery>(GET_CAPSULES);
  return (
    <Layout>
      {data && <UpcomingLaunches query={data} />}
      {data?.capsules?.map((capsule) => (
        <p key={capsule?.id ?? ""}>
          {capsule?.id} {capsule?.type}
        </p>
      ))}
    </Layout>
  );
};

export default Home;
