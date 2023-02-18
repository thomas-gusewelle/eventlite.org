import BaseLayout from "../components/BaseLayout";
import Header from "../components/Header";
import Heading from "../components/Heading";
import Text from "../components/Text";
import Button from "../components/Button";
import { MjmlWrapper, MjmlColumn, MjmlSection } from "mjml-react";
import { colors, fontFamily, fontSize, screens } from "../theme";
import Footer from "../components/Footer";

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

const InviteCode = ({
  orgName,
  invideCode,
  email,
}: {
  orgName: string | undefined;
  invideCode: string;
  email: string;
}) => {
  return (
    <BaseLayout style={styles}>
      <Header />
      <MjmlWrapper cssClass='gutter' paddingBottom={"30px"}>
        <MjmlSection>
          <MjmlColumn>
            <Heading cssClass='h1' color={colors.black000}>
              Join {orgName}&apos;s Team
            </Heading>
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection>
          <MjmlColumn>
            <Text color={colors.black} paddingTop={24} paddingBottom={24}>
              You have ben invited to join {orgName}&apos;s team. Click the
              button below to create your account.
            </Text>
            <Button
              href={`https://eventlite.org/account/invite?code=${encodeURIComponent(
                invideCode
              )}&email=${email}&orgName=${orgName}`}>
              Join Now
            </Button>
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection paddingTop={"30px"}>
          <MjmlColumn>
            <Text color={colors.black} fontSize={fontSize.sm}>
              If you think this email was sent in error, there&apos;s nothing to
              worry about - you can safely ignore it.
            </Text>
          </MjmlColumn>
        </MjmlSection>
      </MjmlWrapper>
      <Footer />
    </BaseLayout>
  );
};

InviteCode.subject = ({ orgName }: { orgName: string }) =>
  `Join ${orgName}'s Team`;
export default InviteCode;
