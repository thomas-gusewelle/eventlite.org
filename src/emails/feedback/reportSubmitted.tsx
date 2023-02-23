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

const ReportSubmited = ({
  id,
  picUrl,
  firstName,
  lastName,
  email,
  type,
  text,
  url,
}: {
  id?: string;
  picUrl: string | undefined | null;
  firstName?: string;
  lastName?: string;
  email?: string;
  type: "FEEDBACK" | "BUG" | "OTHER";
  text: string;
  url: string;
}) => {
  return (
    <BaseLayout style={styles}>
      <Header />
      <MjmlWrapper cssClass='gutter' paddingBottom={"30px"}>
        <MjmlSection>
          <MjmlColumn>
            <Heading cssClass='h1' color={colors.black000}>
              {type} Report
            </Heading>
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection>
          <MjmlColumn>
            <Text color={colors.black} paddingTop={24} paddingBottom={24}>
              <p>ID: {id}</p>
              <p>URL: {url}</p>
              {picUrl && <p>picUrl: {picUrl}</p>}
              <p>First name: {firstName}</p>
              <p>Last name: {lastName}</p>
              <p>Email: {email}</p>
              <p>{text}</p>
            </Text>
          </MjmlColumn>
        </MjmlSection>
      </MjmlWrapper>
      <Footer />
    </BaseLayout>
  );
};

ReportSubmited.subject = "Report Submitted";
export default ReportSubmited;
