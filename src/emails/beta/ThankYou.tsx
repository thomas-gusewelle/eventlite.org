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

const ThankYouEmail = ({ firstName }: { firstName: string }) => {
  return (
    <BaseLayout style={styles}>
      <Header />
      <MjmlWrapper cssClass='gutter' paddingBottom={"30px"}>
        <MjmlSection>
          <MjmlColumn>
            <Heading cssClass='h1' color={colors.black000}>
              Thank you for registering your interest!
            </Heading>
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection>
          <MjmlColumn>
            <Text color={colors.black} paddingTop={24} paddingBottom={24}>
              <p>{firstName},</p>
              <p>
                Thank you for your interest and for registering to be part of
                our beta program.
              </p>
              <p>
                We are working hard to create a platform that will make
                volunteer scheduling and management a breeze for organizers like
                you. Your decision to join our beta program shows us that
                we&apos;re headed in the right direction. Your feedback and
                insights will be invaluable in helping us refine EventLite and
                make it even better.
              </p>
              <p>
                We are truly grateful for your support and enthusiasm for
                EventLite.org. It means a lot to us to have you be a part of our
                journey. We can&apos;t wait to hear your thoughts and
                suggestions, and to work together to make EventLite everything
                you need it to be.
              </p>
              <p>
                Be on the lookout for an invitation email soon to get started managing your team with EventLite.
              </p>
              <p>
                Thanks again for your interest, and please don&apos;t hesitate
                to reach out if you have any questions or feedback.
              </p>
              <p>Warm regards,</p>
              Thomas Gusewelle
              <br />
              Founder EventLite.org
            </Text>
          </MjmlColumn>
        </MjmlSection>
      </MjmlWrapper>
      <Footer />
    </BaseLayout>
  );
};

ThankYouEmail.subject = "Thank You";
export default ThankYouEmail;
