import { useQuery } from "@apollo/client";
import { UserContext } from "@context/eden";
import { FIND_PROJECT } from "@graphql/eden";
import { useRouter } from "next/router";
import { useContext } from "react";
import { AppUserMenuLayout, MyProjectContainer } from "ui";

import type { NextPageWithLayout } from "../../_app";

const MyProjectsViewPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { _id } = router.query;
  const { currentUser } = useContext(UserContext);

  console.log("currentUser", currentUser);

  const { data: dataProject } = useQuery(FIND_PROJECT, {
    variables: {
      fields: {
        _id,
      },
    },
    context: { serviceName: "soilservice" },
  });

  // project data with shortlist
  if (dataProject) console.log("dataProject", dataProject.findProject);

  return <MyProjectContainer />;
};

MyProjectsViewPage.getLayout = (page) => (
  <AppUserMenuLayout recommnededSidebar={false}>{page}</AppUserMenuLayout>
);

export default MyProjectsViewPage;

import { IncomingMessage, ServerResponse } from "http";
import { getSession } from "next-auth/react";

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse;
}) {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: `/login`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}