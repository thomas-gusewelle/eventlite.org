import React from "react";
import BaseLayout from "./components/BaseLayout";
import Header from "./components/Header";
import Heading from "./components/Heading";
import Text from "./components/Text";
import Button from "./components/Button";
import { MjmlWrapper, MjmlColumn, MjmlSection } from "mjml-react";
import { colors, fontFamily, fontSize, screens } from "./theme";

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

const ConfirmEmail = () => {
  return (
    <BaseLayout style={styles}>
      <Header />
      <MjmlWrapper>
        <MjmlSection cssClass='gutter'>
          <MjmlColumn>
            <Heading cssClass='h1' color={colors.black000}>
              Confirm Your Email Address
            </Heading>
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection cssClass='gutter'>
          <MjmlColumn>
            <Text color={colors.black} paddingTop={24} paddingBottom={24}>
              Confirming your email allows us and your organization to know
              it&apos;s really you. Please use the button below to confirm your
              email.
            </Text>
            <Button>Confirm Email</Button>
          </MjmlColumn>
        </MjmlSection>
      </MjmlWrapper>
    </BaseLayout>
  );
};

ConfirmEmail.subject = "Confirm Your Email";
export default ConfirmEmail;
