import { z } from "zod";
import sendMail from "../../emails";
import ReportSubmited from "../../emails/feedback/reportSubmitted";
import { createSupaServerClient } from "../../utils/serverSupaClient";
import { createTRPCRouter, publicProcedure } from "./context";


export const feedbackRouter = createTRPCRouter({
  submitReport: publicProcedure.input(
    z.object({
      type: z.union([
        z.literal("BUG"),
        z.literal("FEEDBACK"),
        z.literal("OTHER"),
      ]),
      text: z.string().min(1),
      route: z.string(),
      picUrl: z.string().nullish(),
    })
  ).mutation(async ({ ctx, input }) => {

    const supabase = createSupaServerClient();
    let picUrl = undefined;
    if (input.picUrl) {
      const pic = supabase.storage.from("feedback").getPublicUrl(input.picUrl);
      picUrl = pic.data.publicUrl;
    }

    const report = await ctx.prisma?.bugFeatureReport.create({
      data: {
        type: input.type,
        text: input.text,
        userId: ctx?.session?.user.id,
        url: input.route,
        picUrl: picUrl,
      },
    });
    const user = await ctx.prisma?.user.findFirst({
      where: {
        id: ctx?.session?.user.id,
      },
    });
    try {
      await sendMail({
        to: "tgusewelle@eventlite.org",
        component: (
          <ReportSubmited
            id={report?.id}
            picUrl={picUrl}
            firstName={user?.firstName}
            lastName={user?.lastName}
            email={user?.email}
            type={input.type}
            url={input.route}
            text={input.text}
          />
        ),
        attachments: picUrl ? [{ filename: report?.id, path: picUrl }] : [],
      });
    } catch (error) { }
  })

})

