import BaseLayout from "../components/BaseLayout";
import Header from "../components/Header";
import Heading from "../components/Heading";
import Text from "../components/Text";
import Button from "../components/Button";
import { MjmlWrapper, MjmlColumn, MjmlSection, MjmlGroup, MjmlRaw, MjmlBody, MjmlDivider } from "mjml-react";
import { colors, fontFamily, fontSize, fontWeight, screens } from "../theme";
import Footer from "../components/Footer";
import { EventPositions, User, Event, Locations, Role } from "@prisma/client";
import { shortDate } from "../../components/dateTime/dates";
import { shortTime } from "../../components/dateTime/times";
import { PicNameRowSmall } from "../../components/profile/PicNameRow";
import { fullName } from "../../utils/fullName";


type EventsWithPositions = (Event & {
  Locations: Locations | null;
  positions: (EventPositions & {
    Role: Role | null
    User: User | null
  })[];
})[] | undefined

const styles = `
  .h1 > * {
    font-size: 48px !important;
  }
  .h2 > * {
    font-size: ${fontSize.lg}px !important;
  }
  .p > * {
    font-size: ${fontSize.base}px !important;
  }
  .mt-6 > * {
    padding-top: 12px !important;
  }
  .marginTop {
  margin-top: 18px !important
}

  @media (min-width:${screens.xs}) {
    .h1 > * {
      font-size: 36px !important;
    }
    .h2 > * {
      font-size: ${fontSize.xxl}px !important;
    }
    .p > * {
      font-size: ${fontSize.md}px !important;
    }
  }
`;

const DayBeforeEmail = ({ events, user }: { events: EventsWithPositions, user: User }) => {

  return (
    <BaseLayout style={styles}>
      <Header />
      <MjmlWrapper cssClass='gutter' paddingBottom={"30px"}>
        <MjmlSection>
          <MjmlColumn>
            <Heading cssClass='h1' color={colors.black000}>
              Your Upcoming Events
            </Heading>
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection>
          <MjmlColumn>
            <Text color={colors.black} paddingTop={24} paddingBottom={24}>
              Hi {user.firstName}, here is a reminder of your upcoming events!            </Text>
          </MjmlColumn>
        </MjmlSection>

        {events?.map((event, index) => (
          <>
            <MjmlSection cssClass={index > 0 ? "marginTop" : ""} key={event.id} paddingLeft={10} paddingTop={5} paddingBottom={5} border={"1px solid rgb(209 213 219)"} borderRadius={"2rem"}>
              <MjmlColumn>
                <Text color={colors.black} fontSize={fontSize.lg} fontWeight={fontWeight.bold}>{event?.name}</Text>
                <Text color={colors.black} fontSize={fontSize.md}>{event?.Locations?.name}</Text>
                <Text color={colors.black}>{shortDate(event.datetime)}</Text>
                <Text color={colors.black}>{shortTime(event.datetime)}</Text>
              </MjmlColumn>
            </MjmlSection>
            <MjmlSection border={"1px solid rgb(209 213 219)"} borderTop={"none"} borderRadius={"2rem"}>
              <MjmlGroup>
                <MjmlColumn borderRight={"1px solid rgb(209 213 219)"}>
                  {event.positions.map((pos, index) => (
                    <>
                      <Text padding={"10px 10px"} color={colors.black} fontWeight={fontWeight.bold}>{pos.Role?.name}</Text>
                      {index != event.positions.length - 1 && <MjmlDivider borderColor={colors.gray300} borderWidth={1} />}
                    </>
                  ))}
                </MjmlColumn>
                <MjmlColumn>
                  {event.positions.map((pos, index) => (
                    <>
                      <Text padding={"10px 10px"} color={colors.black}>{fullName(pos.User?.firstName, pos.User?.lastName)}</Text>
                      {index != event.positions.length - 1 && <MjmlDivider borderColor={colors.gray300} borderWidth={1} />}
                    </>
                  ))}
                </MjmlColumn>
              </MjmlGroup>
            </MjmlSection>
          </>
        ))}
      </MjmlWrapper>
      <Footer />
    </BaseLayout>
  );
};

DayBeforeEmail.subject = "Schedule Reminder";
export default DayBeforeEmail;
