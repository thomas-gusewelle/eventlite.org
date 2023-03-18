import BaseLayout from "../components/BaseLayout";
import Header from "../components/Header";
import Heading from "../components/Heading";
import Text from "../components/Text";
import Button from "../components/Button";
import { MjmlWrapper, MjmlColumn, MjmlSection } from "mjml-react";
import { colors, fontFamily, fontSize, screens } from "../theme";
import Footer from "../components/Footer";
import { EventPositions, User, Event, Locations } from "@prisma/client";


type EventsWithPositions = (Event & {
  locations: Locations | null;
  positions: (EventPositions & {
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
              Hi {user.firstName}, below is your upcoming events you are scheduled for.
            </Text>
          </MjmlColumn>
        </MjmlSection>

        {events?.map(event => (

          <MjmlSection key={event.id}>
            <MjmlColumn>
              <Text color={colors.black}>{event?.name}</Text>
              <Text color={colors.black}>{event?. }</Text>
            </MjmlColumn>
          </MjmlSection>
        ))}
        <MjmlSection paddingTop={"30px"}>
          <MjmlColumn>
            <Text color={colors.black} fontSize={fontSize.sm}>
              If you didn&apos;t request this email, there&apos;s nothing to
              worry about - you can safely ignore it.
            </Text>
          </MjmlColumn>
        </MjmlSection>
      </MjmlWrapper>
      <Footer />
    </BaseLayout>
  );
};

DayBeforeEmail.subject = "Schedule Reminder";
export default DayBeforeEmail;
