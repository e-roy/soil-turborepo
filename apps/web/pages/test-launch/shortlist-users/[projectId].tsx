import { LaunchProvider } from "@context/eden";
import {
  AppUserLayout,
  Button,
  Card,
  GridItemNine,
  GridItemSix,
  GridItemThree,
  GridLayout,
  Loading,
  MemberMatchCard,
  MemberProfileCard,
  ProjectLayoutCard,
  RoleModal,
  TextHeading3,
} from "ui";

import type { NextPageWithLayout } from "../../_app";

const LaunchPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { projectId, roleId, memberId } = router.query;
  const [members, setMembers] = useState<Members[]>([]);
  const [member, setMember] = useState<Members | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [roleModalOpen, setRoleModalOpen] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);

  const { data: roleData } = useQuery(FIND_ROLE_TEMPLATE, {
    variables: {
      fields: {
        _id: roleId,
      },
    },
    // skip: !_id,
    context: { serviceName: "soilservice" },
  });

  const { data: roles } = useQuery(FIND_ROLE_TEMPLATES, {
    variables: {
      fields: {},
    },
    context: { serviceName: "soilservice" },
  });

  useQuery(FIND_MEMBERS, {
    variables: {
      fields: {},
    },
    // skip: !_id,
    context: { serviceName: "soilservice" },
    onCompleted(data) {
      // @TODO missing the role filter, it should come from the backend
      setMembers(data.findMembers);
    },
  });

  useQuery(FIND_MEMBER, {
    variables: {
      fields: {
        _id: memberId,
      },
    },
    skip: !memberId,
    context: { serviceName: "soilservice" },
    onCompleted(data) {
      if (!data.findMember) return;

      setMember(data.findMember);
    },
  });

  useQuery(FIND_PROJECT, {
    variables: {
      fields: {
        _id: projectId,
      },
    },
    skip: !projectId,
    context: { serviceName: "soilservice" },
    onCompleted(data) {
      if (!data.findProject) return;
      setProject(data.findProject);
      setRoleModalOpen(data.findProject?.role?.length === 0);
    },
  });

  const [updateProject, {}] = useMutation(UPDATE_PROJECT, {
    onCompleted({ updateProject }: Mutation) {
      if (!updateProject) console.log("updateProject is null");
      console.log(updateProject);
    },
  });

  const handleShortlistMember = () => {
    if (project?.team) {
      const mappedTeam: TeamType[] = project.team.map(
        (member: Maybe<TeamType>) => {
          return {
            memberID: member?.memberInfo?._id,
            roleId: member?.roleID,
            phase: member?.phase,
          };
        }
      );

      updateProject({
        variables: {
          fields: {
            _id: projectId,
            team: [
              ...mappedTeam,
              { memberID: memberId, roleID: roleId, phase: "shortlisted" },
            ],
          },
        },
        context: { serviceName: "soilservice" },
        onCompleted: () => {
          setMember(null);
          router.push(
            `/test-launch/shortlist-users/${projectId}?roleId=${roleId}`
          );
        },
      });
    }
  };

  const shortlistedMembers = project?.team?.filter(
    (member) => member?.phase === "shortlisted"
  );

  const filteredMembers = members?.filter(
    (member: Members) =>
      !project?.team?.some(
        (teamMember) => teamMember?.memberInfo?._id === member?._id
      )
  );

  const handleSaveRole = (role: Maybe<RoleTemplate>) => {
    const mappedRoles: RoleInput[] | undefined = project?.role?.map(
      (_role: Maybe<RoleType>) => {
        return {
          _id: _role?._id,
          // skills: _role?.skills,
          title: _role?.title,
        };
      }
    );

    const mappedRole: RoleInput = {
      _id: role?._id,
      // skills: role?.skills,
      title: role?.title,
    };

    updateProject({
      variables: {
        fields: {
          _id: projectId,
          role: mappedRoles ? [...mappedRoles, mappedRole] : [mappedRole],
        },
      },
      context: { serviceName: "soilservice" },
      onCompleted: () => {
        // setMember(null);
        router.push(
          `/test-launch/shortlist-users/${projectId}${
            roleId ? "" : `?roleId=${role?._id}`
          }`
        );
      },
    });
  };

  const handleAddRole = () => {
    setRoleModalOpen(true);
  };

  const handleSelectRole = (role: Maybe<RoleType>) => {
    if (role) {
      setSelectedRole(role);
      router.push(
        `/test-launch/shortlist-users/${projectId}?roleId=${role._id}`
      );
    }
  };

  return (
    <LaunchProvider>
      {roleModalOpen && (
        <RoleModal
          onSubmit={handleSaveRole}
          openModal={roleModalOpen}
          roles={roles?.findRoleTemplates}
        />
      )}
      <GridLayout>
        <GridItemThree>
          {project && (
            <ProjectLayoutCard
              project={project}
              handleAddRole={handleAddRole}
              handleSelectRole={handleSelectRole}
              selectedRole={selectedRole}
              showRoles
            />
          )}
          {member &&
            filteredMembers.map((_member: Members, index) => (
              <p
                key={index}
                onClick={() =>
                  router.push(
                    `/test-launch/shortlist-users/${projectId}?roleId=${roleId}&memberId=${_member._id}`
                  )
                }
                className="cursor-pointer"
              >
                {_member.discordName}
              </p>
            ))}
        </GridItemThree>
        {!member && (
          <GridItemNine className="hide-scrollbar h-8/10 overflow-scroll">
            {roleId && (
              <>
                <Card className="mb-8 flex items-center bg-white p-6">
                  {!!filteredMembers.length && roleData ? (
                    <>
                      <div className="w-3/4">
                        <TextHeading3>
                          {`You’re looking at all ${filteredMembers.length} ${
                            roleData.findRole
                              ? roleData.findRole + "s"
                              : "members"
                          } in
                    Developer DAO. Please add desired skills to get the best
                    results.`}
                        </TextHeading3>
                        <p className="text-soilGray text-sm">
                          Choose just one role for now, you’ll be able to add
                          more later.
                        </p>
                      </div>
                      <Button className="ml-auto" variant="primary">
                        Add skills
                      </Button>
                    </>
                  ) : (
                    <Loading />
                  )}
                </Card>
                <div className="grid grid-cols-3 gap-x-10 gap-y-10">
                  {filteredMembers?.map((_member: Members, index) => (
                    <MemberMatchCard
                      key={index}
                      onClick={() =>
                        router.push(
                          `/test-launch/shortlist-users/${projectId}?roleId=${roleId}&memberId=${_member._id}`
                        )
                      }
                      member={_member}
                    />
                  ))}
                </div>
              </>
            )}
          </GridItemNine>
        )}
        {!!member && (
          <GridItemSix>
            <MemberProfileCard
              member={member}
              onClickNotNow={() => {
                setMember(null);
                router.push(
                  `/test-launch/shortlist-users/${projectId}?roleId=${roleId}`
                );
              }}
              onClickAddToList={() => {
                handleShortlistMember();
              }}
            />
          </GridItemSix>
        )}
        <GridItemThree>
          {shortlistedMembers?.map((member: any, index) => (
            <p key={index}>{member.memberInfo.discordName}</p>
          ))}
        </GridItemThree>
      </GridLayout>
    </LaunchProvider>
  );
};

LaunchPage.getLayout = (page) => <AppUserLayout>{page}</AppUserLayout>;

export default LaunchPage;

import { useMutation, useQuery } from "@apollo/client";
import {
  FIND_MEMBER,
  FIND_MEMBERS,
  FIND_PROJECT,
  FIND_ROLE_TEMPLATE,
  FIND_ROLE_TEMPLATES,
  UPDATE_PROJECT,
} from "@graphql/eden";
import {
  Maybe,
  Members,
  Mutation,
  Project,
  RoleInput,
  RoleTemplate,
  RoleType,
  TeamType,
} from "@graphql/eden/generated";
import { IncomingMessage, ServerResponse } from "http";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useState } from "react";

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