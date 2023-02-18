/* eslint-disable @next/next/no-img-element */
import React from "react";
import {
  MjmlSection,
  MjmlWrapper,
  MjmlColumn,
  MjmlText,
  MjmlImage,
  MjmlGroup,
  MjmlSpacer,
  MjmlRaw,
} from "mjml-react";
import Link from "./Link";
import Text from "./Text";
import { colors, fontSize, fontWeight } from "../theme";
import { EMAIL_PREFERENCES_URL } from "mailing-core";

type FooterProps = {
  includeUnsubscribe?: boolean;
};

export default function Footer({ includeUnsubscribe = false }: FooterProps) {
  return (
    <>
      <MjmlWrapper cssClass='gutter'>
        <MjmlSection>
          <MjmlColumn>
            <MjmlRaw>
              <tr>
                <td>
                  <table
                    border={0}
                    cellPadding={0}
                    cellSpacing={0}
                    role='presentation'
                    width='100%'>
                    <tr>
                      <td>
                        <a href='https://eventlite.org'>
                          <img
                            src={
                              "https://kisagiikxconhevqlkke.supabase.co/storage/v1/object/public/email-images/EventLiteLogo.png"
                            }
                            alt='EventLite Logo'
                            height={48}
                            style={{
                              border: 0,
                              display: "block",
                              outline: "none",
                              textDecoration: "none",
                              fontSize: 16,
                              height: 48,
                            }}
                          />
                        </a>
                      </td>
                      <td width='31px' align='left'>
                        <a href='https://www.facebook.com/profile.php?id=100090004564248'>
                          <img
                            src={
                              "https://kisagiikxconhevqlkke.supabase.co/storage/v1/object/public/email-images/icons8-facebook-48.png"
                            }
                            alt='Facebook'
                            style={{
                              border: 0,
                              display: "block",
                              outline: "none",
                              textDecoration: "none",
                              fontSize: 16,
                              height: 48,
                              width: 48,
                            }}
                          />
                        </a>
                      </td>
                      <td width='31px' align='right'>
                        <a href='https://twitter.com/EventLiteOrg'>
                          <img
                            src={
                              "https://kisagiikxconhevqlkke.supabase.co/storage/v1/object/public/email-images/icons8-twitter-48.png"
                            }
                            alt='Twitter'
                            style={{
                              border: 0,
                              display: "block",
                              outline: "none",
                              textDecoration: "none",
                              fontSize: 16,
                              height: 48,
                              width: 48,
                            }}
                          />
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </MjmlRaw>
          </MjmlColumn>
          {/* <MjmlColumn>
            <Text align='left'>
              <Link
                color={colors.white}
                fontSize={fontSize.xl}
                fontWeight={fontWeight.bold}
                href='https://eventlite.org'
                textDecoration='none'>
                <img
                  width={200}
                  src={
                    "https://kisagiikxconhevqlkke.supabase.co/storage/v1/object/public/email-images/eventLiteEmailCover.jpg"
                  }
                  alt=''
                  style={{
                    verticalAlign: "text-bottom",
                    paddingRight: 10,
                  }}
                />
              </Link>
            </Text>
          </MjmlColumn> */}
        </MjmlSection>
      </MjmlWrapper>

      <MjmlWrapper cssClass='gutter' paddingTop={"10px"} paddingBottom='40px'>
        <MjmlSection>
          <MjmlColumn>
            <Text color={colors.gray500}>
              &copy; 2023 EventLite.org
              <br />
              All right reserved
            </Text>
          </MjmlColumn>
        </MjmlSection>
      </MjmlWrapper>
    </>
  );
}
