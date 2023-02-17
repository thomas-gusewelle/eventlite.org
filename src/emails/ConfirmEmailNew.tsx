import React from "react";
import BaseLayout from "./components/BaseLayout";
import Header from "./components/Header";
import Heading from "./components/Heading";
import Text from "./components/Text";
import Button from "./components/Button";
import { MjmlWrapper, MjmlColumn, MjmlSection } from "mjml-react";
import { colors, fontFamily } from "./theme";

const ConfirmEmail = () => {
  return (
    <BaseLayout>
      <Header />
      <MjmlWrapper>
        <MjmlSection>
          <MjmlColumn>
            <Heading maxWidth={420} color={colors.black000}>
              Please Confirm Your Email
            </Heading>
            <Text color={colors.black}>
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
