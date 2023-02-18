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

const ConfirmEmail = ({ link }: { link: string }) => {
  return (
    <BaseLayout style={styles}>
      <Header />
      <MjmlWrapper cssClass='gutter' paddingBottom={"30px"}>
        <MjmlSection>
          <MjmlColumn>
            <Heading cssClass='h1' color={colors.black000}>
              Confirm Your Email Address
            </Heading>
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection>
          <MjmlColumn>
            <Text color={colors.black} paddingTop={24} paddingBottom={24}>
              Confirming your email allows us and your organization to know
              it&apos;s really you. Use the button below to confirm your email.
            </Text>
            <Button href={link}>Confirm Email</Button>
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

ConfirmEmail.subject = "Confirm Your Email";
export default ConfirmEmail;
