import {
  MatchMembersToSkillOutput,
  Maybe,
} from "@eden/package-graphql/generated";
import {
  Avatar,
  Card,
  SocialMediaComp,
  TextHeading2,
  TextHeading3,
} from "@eden/package-ui";
import { GrExpand } from "react-icons/gr";

export interface UserMiniCardProps {
  matchMember?: Maybe<MatchMembersToSkillOutput>;
  item?: any;
  resultCardFlag?: any;
  resultPopUpFlag?: any;
  onExpand?: () => void;
}

export const UserMiniCard = ({ matchMember, onExpand }: UserMiniCardProps) => {
  const member = matchMember?.member;

  if (!matchMember) {
    return null;
  }
  return (
    <div>
      <Card border shadow>
        <div className={`flex flex-row justify-between justify-items-stretch`}>
          <div></div>
          <div>
            <div className={`relative flex flex-col items-center`}>
              <div className="relative">
                <Avatar src={member?.discordAvatar as string} />
              </div>
              <div className="flex justify-center">
                <TextHeading2>@{member?.discordName}</TextHeading2>
              </div>
              <div className="flex justify-center">
                <TextHeading3 className="text-sm text-gray-600">
                  {member?.memberRole?.title}
                </TextHeading3>
              </div>
              <div className="flex justify-center">
                <SocialMediaComp size="1.2rem" title="" links={member?.links} />
              </div>
            </div>
          </div>
          <div>
            <button
              className={`basis-1/8 w-full text-zinc-400`}
              onClick={onExpand}
            >
              <GrExpand size="15px" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
