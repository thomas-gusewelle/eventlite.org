import BaseLayout from "../components/BaseLayout";
import Header from "../components/Header";
import Heading from "../components/Heading";
import Text from "../components/Text";
import { MjmlWrapper, MjmlColumn, MjmlSection } from "mjml-react";
import { colors, fontSize, screens } from "../theme";
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

// Takes a list of names for deleted accounts and displays to be emailed to org admins
const AccountDeleteNotification = ({
  names
}: {
  names: string[]
}) => {
  return (
    <BaseLayout style={styles}>
      <Header />
      <MjmlWrapper cssClass='gutter' paddingBottom={"30px"}>
        <MjmlSection>
          <MjmlColumn>
            <Heading cssClass='h1' color={colors.black000}>User Account Deleted</Heading>
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection>
          <MjmlColumn>
            <Text color={colors.black} paddingTop={24} paddingBottom={24}>
              The following user(s) have deleted their accounts. This action is irreversible and deletes all data associated with the account including any scheduled events and avalibility.
            </Text>
            <Text color={colors.black} paddingTop={24} paddingBottom={24}>
              User(s):
              <br />
              {names.map(name => (
                <>
                  <Text>{name}</Text>
                  <br />
                </>
              ))}</Text>
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection paddingTop={"30px"}>
          <MjmlColumn>
            <Text color={colors.black} fontSize={fontSize.sm}>If you believe this account was deleted in error, you can add them back to your team, which will allow them to recreate their account. This however will not reschedule them for any events previously scheduled.</Text>
          </MjmlColumn>
        </MjmlSection>
      </MjmlWrapper>
      <Footer />
    </BaseLayout>
  );
};

AccountDeleteNotification.subject = "User Account Deleted"
export default AccountDeleteNotification;
