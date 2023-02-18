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

const ResetPassword = ({ code }: { code: string }) => {
  return (
    <BaseLayout style={styles}>
      <Header />
      <MjmlWrapper cssClass='gutter' paddingBottom={"30px"}>
        <MjmlSection>
          <MjmlColumn>
            <Heading cssClass='h1' color={colors.black000}>
              Reset Your Password
            </Heading>
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection>
          <MjmlColumn>
            <Text color={colors.black} paddingTop={24} paddingBottom={24}>
              Please use the button below to reset your password.
            </Text>
            <Button
              href={`http://eventlite.org/account/reset-password?code=${encodeURIComponent(
                code
              )}`}>
              Reset Password
            </Button>
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection paddingTop={"30px"}>
          <MjmlColumn>
            <Text color={colors.black} fontSize={fontSize.sm}>
              If you did not request this link please reach out to
              support@eventlite.org.
            </Text>
          </MjmlColumn>
        </MjmlSection>
      </MjmlWrapper>
      <Footer />
    </BaseLayout>
  );
};

ResetPassword.subject = "Reset Password";
export default ResetPassword;
