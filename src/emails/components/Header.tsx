/* eslint-disable @next/next/no-img-element */
import React from "react";
import { MjmlColumn, MjmlGroup, MjmlSection, MjmlWrapper } from "mjml-react";
import Text from "./Text";
import Link from "./Link";
import { colors, fontSize, lineHeight, fontWeight } from "../theme";

export default function Header() {
  return (
    <MjmlWrapper paddingTop='40px' paddingBottom='30px' cssClass='gutter'>
      <MjmlSection>
        <MjmlGroup>
          <MjmlColumn width='100%'>
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
          </MjmlColumn>
        </MjmlGroup>
      </MjmlSection>
    </MjmlWrapper>
  );
}
