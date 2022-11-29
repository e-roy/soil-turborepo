// import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
// import { FIND_MEMBER } from "@eden/package-graphql";
import {
  AppUserSubmenuLayout,
  Card,
  GridItemEight,
  GridItemTwo,
  GridLayout,
  // Loading,
  // NewProfileContainer,
  // SEOProfile,
} from "@eden/package-ui";
import * as React from "react";

const GrantsIdPage = ({ grant }: { grant: string }) => {
  return (
    <>
      {/* <SEOProfile
        handle={member?.discordName || ""}
        image={member?.discordAvatar || ""}
        role={member?.memberRole?.title || ""}
      /> */}
      <AppUserSubmenuLayout showSubmenu={false}>
        <GridLayout className={`bg-background h-screen`}>
          <GridItemTwo> </GridItemTwo>
          <GridItemEight>
            <Card
              shadow
              className={`h-85 scrollbar-hide overflow-y-scroll bg-white`}
            >
              {" "}
              grant {grant}
              {/* {member ? (
                <NewProfileContainer user={member} />
              ) : (
                <Loading title={`Searching...`} />
              )} */}
            </Card>
          </GridItemEight>
          <GridItemTwo> </GridItemTwo>
        </GridLayout>
      </AppUserSubmenuLayout>
    </>
  );
};

export default GrantsIdPage;

// import { Members } from "@eden/package-graphql/generated";
import type { GetServerSideProps } from "next";

// const client = new ApolloClient({
//   ssrMode: typeof window === "undefined",
//   link: new HttpLink({
//     uri: process.env.NEXT_PUBLIC_GRAPHQL_URL as string,
//     credentials: "same-origin",
//   }),
//   cache: new InMemoryCache(),
// });

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  console.log("id", id);

  // const { data } = await client.query({
  //   query: FIND_MEMBER,
  //   variables: {
  //     fields: {
  //       discordName: handle,
  //     },
  //     ssr: true,
  //   },
  // });

  return {
    props: {
      grant: id,
      // member: data.findMember,
    },
  };
};
