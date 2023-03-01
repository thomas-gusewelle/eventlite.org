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

const SendBetaInvite = ({ link, name }: { link: string; name: string }) => {
  return (
    <BaseLayout style={styles}>
      <Header />
      <MjmlWrapper cssClass='gutter' paddingBottom={"30px"}>
        <MjmlSection>
          <MjmlColumn>
            <Heading cssClass='h1' color={colors.black000}>
              Welcome to the Beta!
            </Heading>
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection>
          <MjmlColumn>
            <Text color={colors.black} paddingTop={24} paddingBottom={24}>
              <p>Hi {name},</p>
              <p>
                Thank you so much for your interest in EventLite.org. We are
                excited to welcome you to the beta and look forward to gaining
                invaluable insights and feedback from you and your team. To get
                started, click the button below to set up your organization.
              </p>
              <p>Welcome to EventLite!</p>
              <p>
                Thomas Gusewelle <br />
                Founder
              </p>
            </Text>
            <Button href={link}>Get Started</Button>
          </MjmlColumn>
        </MjmlSection>
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

SendBetaInvite.subject = "Welcome to the Beta";
export default SendBetaInvite;
