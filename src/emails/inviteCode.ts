export function inviteCodeEmailString(
  orgName: string | undefined,
  invideCode: string
): string {
  return `<body
  style="
    background-image: linear-gradient(#6366f1, #312e81);
    height: 100vh;
    font-family: sans-serif;
    padding-top: 2rem;
  "
  >
  <table style="margin: 2rem auto">
    <tr>
      <td>
        <div>
          <a style="text-decoration: none" href="https://themelios.com">
            <div style="color: white; text-align: center">
              <img
                style="margin: 0 auto"
                width="60px"
                src="https://kisagiikxconhevqlkke.supabase.co/storage/v1/object/public/email-images/ThemLogo.png"
              />
  
              <h1
                style="
                  text-align: center;
                  font-size: xx-large;
                  letter-spacing: 0.05rem;
                  margin: 0;
                "
              >
                EventLite.org
              </h1>
            </div>
          </a>
  
          <div
            style="
              background-color: white;
              border: 1px rgb(119, 119, 119) solid;
              border-radius: 0.25rem;
              padding: 2.5rem;
              margin-top: 2rem;
              max-width: 22.5rem;
            "
          >
            <h1 style="text-align: center; margin: 0">
            Join ${orgName}'s Team
            </h1>
            <p style="text-align: center">
              You have ben invited to join Preston Hollow Presbyterian
              Church's team. Click the button below to create your account.
            </p>
            <a style="text-decoration: none; color: white; cursor: pointer;" href="https://themelios-schedule.vercel.app/account/invite?code=${encodeURIComponent(
              invideCode
            )}"><button
              style="
                width: 100%;
                
                padding: 0.5rem 1rem;
                border: none;
                background-color: #4F46E5;
                color: white;
                border-radius: 0.25rem;
                cursor: pointer;
                font-size: 1.25rem;
              "
            >
             Join Now
            </button></a>
          </div>
        </div>
      </td>
    </tr>
  </table>
  </body>`;
}
