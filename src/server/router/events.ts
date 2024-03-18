import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { replaceTime, roundHourDown } from "../utils/dateTimeModifers";
import { createTRPCRouter, loggedInProcedure, adminProcedure } from "./context";
import { v4 as uuidv4 } from "uuid";

export const eventsRouter = createTRPCRouter({
  getUpcomingEventsByOrganization: loggedInProcedure.query(async ({ ctx }) => {
    const org = await ctx.prisma?.user.findFirst({
      where: { id: ctx.session.user.id },
      select: { organizationId: true },
    });
    return await ctx.prisma?.event.findMany({
      where: {
        organizationId: org?.organizationId,
        datetime: {
          gte: roundHourDown(),
        },
      },
      include: {
        Locations: true,
        positions: {
          include: {
            Role: true,
            User: true,
          },
        },
      },
      orderBy: {
        datetime: "asc",
      },
    });
  }),

  getPastEventsByOrganization: loggedInProcedure.query(async ({ ctx }) => {
    const org = await ctx.prisma?.user.findFirst({
      where: { id: ctx.session.user.id },
      select: { organizationId: true },
    });
    return await ctx.prisma?.event.findMany({
      where: {
        organizationId: org?.organizationId,
        datetime: {
          lt: roundHourDown(),
        },
      },
      include: {
        Locations: true,
        positions: {
          include: {
            Role: true,
            User: true,
          },
        },
      },
      orderBy: {
        datetime: "desc",
      },
    });
  }),

  //Gets the upcoming events and the events that need approval
  getUpcomingEventsByUser: loggedInProcedure.query(async ({ ctx }) => {
    // Finds the positions that have already been aggreed to
    const upcomingPositions = await ctx.prisma?.eventPositions.findMany({
      where: {
        User: {
          id: ctx.session.user.id,
        },
        OR: [
          {
            userResponse: true,
          },
          { userResponse: false },
        ],
      },
    });

    // const limit: number = input.limit ?? 3;
    const upcoming = await ctx.prisma?.event.findMany({
      where: {
        id: {
          in: upcomingPositions?.map((item) => item.eventId ?? ""),
        },
        datetime: {
          gte: roundHourDown(),
        },
      },

      include: {
        Locations: true,
        positions: {
          include: {
            Role: true,
            User: true,
          },
        },
      },
      orderBy: {
        datetime: "asc",
      },
    });

    // Finds the positions that have still need to be approved
    const approvalPositions = await ctx.prisma?.eventPositions.findMany({
      where: {
        User: {
          id: ctx.session.user.id,
        },
        userResponse: null,
      },
    });

    // const limit: number = input.limit ?? 3;
    const needApproval = await ctx.prisma?.event.findMany({
      where: {
        id: {
          in: approvalPositions?.map((item) => item.eventId ?? ""),
        },
        datetime: {
          gte: roundHourDown(),
        },
      },

      include: {
        Locations: true,
        positions: {
          include: {
            Role: true,
            User: true,
          },
        },
      },
      orderBy: {
        datetime: "asc",
      },
    });

    return { upcoming: upcoming, needApproval: needApproval };
  }),

  updateUserResponse: loggedInProcedure
    .input(
      z.object({
        response: z.union([
          z.literal("APPROVE"),
          z.literal("DENY"),
          z.literal("NULL"),
        ]),
        positionId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if position ID exists and throw if it does not
      if (input.positionId == undefined) {
        throw new TRPCError({
          message: "Position ID is undefined",
          code: "BAD_REQUEST",
        });
      }
      if (input.response == "APPROVE") {
        return await ctx.prisma?.eventPositions.update({
          where: {
            id: input.positionId,
          },
          data: {
            userResponse: true,
          },
        });
      } else if (input.response == "DENY") {
        return await ctx.prisma?.eventPositions.update({
          where: {
            id: input.positionId,
          },
          data: {
            userResponse: false,
          },
        });
      } else if (input.response == "NULL") {
        return await ctx.prisma?.eventPositions.update({
          where: {
            id: input.positionId,
          },
          data: {
            userResponse: null,
          },
        });
      }
    }),

  getEditEvent: adminProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      if (ctx.req?.headers.referer == undefined) return;
      const queries: string | null = new URL(
        ctx.req?.headers.referer
      ).searchParams.get("rec");

      if (queries == "true") {
        const idEvent = await ctx.prisma?.event.findFirst({
          where: {
            id: input,
          },
          select: {
            recurringId: true,
          },
        });
        if (idEvent?.recurringId == undefined) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        const event =  await ctx.prisma?.event.findFirst({
          where: {
            recurringId: idEvent.recurringId,
          },
          include: {
            Locations: true,
            positions: {
              include: { Role: true },
            },
          },
          orderBy: {
            datetime: "asc",
          },
        });
      const recurranceData = await ctx.prisma.eventReccurance.findUnique({where: {recurringId: event?.recurringId ?? undefined}});
      return {event: event, recurranceData: recurranceData};
      }



      if (queries == "false" || queries == null) {
        const event =  await ctx.prisma?.event.findFirst({
          where: { id: input },
          include: {
            Locations: true,
            positions: {
              include: { Role: true },
            },
          },
        });
      return {event: event, recurranceData: null}
      }
    }),

  getEventRecurranceData: adminProcedure
    .input(z.string().optional())
    .query(async ({ input, ctx }) => {
      if (!input) {
        return null;
      }

      return await ctx.prisma?.eventReccurance.findUnique({
        where: {
          recurringId: input,
        },
      });
    }),

  createEvent: adminProcedure
    .input(
      z.object({
        name: z.string(),
        eventDate: z.date(),
        eventTime: z.date(),
        eventTimeZone: z.string(),
        recurringId: z.string().optional(),
        eventLocation: z.object({
          id: z.string(),
          name: z.string(),
          organizationId: z.string(),
        }),
        positions: z
          .object({
            position: z.object({
              id: z.string(),
              name: z.string(),
              organizationId: z.string().optional(),
            }),
          })
          .array(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const org = await ctx.prisma?.user.findFirst({
        where: { id: ctx.session.user.id },
        select: { organizationId: true },
      });

      return await ctx.prisma?.event.create({
        data: {
          name: input.name,
          recurringId: input?.recurringId,
          datetime: replaceTime(input.eventDate, input.eventTime),
          timezone: input.eventTimeZone,
          organizationId: org?.organizationId,
          locationsId: input.eventLocation.id,
          positions: {
            create: input.positions.map((item) => ({
              roleId: item.position.id,
            })),
          },
        },
      });
    }),

  createEventReccurance: adminProcedure
    .input(
      z.object({
        recurringId: z.string(),
        repeatFrequency: z.object({
          id: z.union([
            z.literal("D"),
            z.literal("W"),
            z.literal("WC"),
            z.literal("M"),
          ]),
          name: z.string(),
        }),

        DEndSelect: z
          .object({
            id: z.union([z.literal("Num"), z.literal("Date")]).nullable(),
            name: z.string(),
          })
          .optional(),

        DNum: z.number().optional(),
        DDate: z.date().optional(),
        WEndSelect: z
          .object({
            id: z.union([z.literal("Num"), z.literal("Date")]).nullable(),
            name: z.string(),
          })
          .optional(),

        WNum: z.number().optional(),
        WDate: z.date().optional(),
        WCEndSelect: z
          .object({
            id: z.union([z.literal("Num"), z.literal("Date")]).nullable(),
            name: z.string(),
          })
          .optional(),

        WCNum: z.number().optional(),
        WCDate: z.date().optional(),
        WCSun: z.boolean().optional(),
        WCMon: z.boolean().optional(),
        WCTues: z.boolean().optional(),
        WCWed: z.boolean().optional(),
        WCThurs: z.boolean().optional(),
        WCFri: z.boolean().optional(),
        WCSat: z.boolean().optional(),
        MEndSelect: z
          .object({
            id: z.union([z.literal("Num"), z.literal("Date")]).nullable(),
            name: z.string(),
          })
          .optional(),
        MNum: z.number().optional(),
        MDate: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma?.eventReccurance.create({
        data: {
          recurringId: input.recurringId,
          repeatFrequecyId: input.repeatFrequency.id,
          repeatFrequencyName: input.repeatFrequency.name,
          DEndSelectId: input.DEndSelect?.id,
          DEndSelectName: input.DEndSelect?.name,
          DNum: input.DNum,
          DDate: input.DDate,
          WEndSelectId: input.WEndSelect?.id,
          WEndSelectName: input.WEndSelect?.name,
          WNum: input.WNum,
          WDate: input.WDate,
          WCEndSelectId: input.WCEndSelect?.id,
          WCEndSelectName: input.WCEndSelect?.name,
          WCNum: input.WCNum,
          WCDate: input.WCDate,
          WCSun: input.WCSun,
          WCMon: input.WCMon,
          WCTues: input.WCTues,
          WCWed: input.WCWed,
          WCFri: input.WCFri,
          WCThurs: input.WCThurs,
          WCSat: input.WCSat,
          MEndSelectId: input.MEndSelect?.id,
          MEndSelectName: input.MEndSelect?.name,
          MNum: input.MNum,
          MDate: input.MDate,
        },
      });
    }),

  EditEventReccuranceData: adminProcedure
    .input(
      z.object({
        recurringId: z.string(),
        repeatFrequency: z.object({
          id: z.union([
            z.literal("D"),
            z.literal("W"),
            z.literal("WC"),
            z.literal("M"),
          ]),
          name: z.string(),
        }),

        DEndSelect: z
          .object({
            id: z.union([z.literal("Num"), z.literal("Date")]).nullable(),
            name: z.string(),
          })
          .optional(),

        DNum: z.number().optional(),
        DDate: z.date().optional(),
        WEndSelect: z
          .object({
            id: z.union([z.literal("Num"), z.literal("Date")]).nullable(),
            name: z.string(),
          })
          .optional(),

        WNum: z.number().optional(),
        WDate: z.date().optional(),
        WCEndSelect: z
          .object({
            id: z.union([z.literal("Num"), z.literal("Date")]).nullable(),
            name: z.string(),
          })
          .optional(),

        WCNum: z.number().optional(),
        WCDate: z.date().optional(),
        WCSun: z.boolean().optional(),
        WCMon: z.boolean().optional(),
        WCTues: z.boolean().optional(),
        WCWed: z.boolean().optional(),
        WCThurs: z.boolean().optional(),
        WCFri: z.boolean().optional(),
        WCSat: z.boolean().optional(),
        MEndSelect: z
          .object({
            id: z.union([z.literal("Num"), z.literal("Date")]).nullable(),
            name: z.string(),
          })
          .optional(),
        MNum: z.number().optional(),
        MDate: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma?.eventReccurance.update({
        where: {
          recurringId: input.recurringId,
        },
        data: {
          recurringId: input.recurringId,
          repeatFrequecyId: input.repeatFrequency.id,
          repeatFrequencyName: input.repeatFrequency.name,
          DEndSelectId: input.DEndSelect?.id,
          DEndSelectName: input.DEndSelect?.name,
          DNum: input.DNum,
          DDate: input.DDate,
          WEndSelectId: input.WEndSelect?.id,
          WEndSelectName: input.WEndSelect?.name,
          WNum: input.WNum,
          WDate: input.WDate,
          WCEndSelectId: input.WCEndSelect?.id,
          WCEndSelectName: input.WCEndSelect?.name,
          WCNum: input.WCNum,
          WCDate: input.WCDate,
          WCSun: input.WCSun,
          WCMon: input.WCMon,
          WCTues: input.WCTues,
          WCWed: input.WCWed,
          WCFri: input.WCFri,
          WCThurs: input.WCThurs,
          WCSat: input.WCSat,
          MEndSelectId: input.MEndSelect?.id,
          MEndSelectName: input.MEndSelect?.name,
          MNum: input.MNum,
          MDate: input.MDate,
        },
      });
    }),

  editEvent: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        eventDate: z.date(),
        eventTime: z.date(),
        eventTimeZone: z.string(),
        organization: z.string(),
        recurringId: z.string().optional(),
        eventLocation: z.object({
          id: z.string(),
          name: z.string(),
          organizationId: z.string(),
        }),
        newPositions: z
          .object({
            position: z.object({
              roleId: z.string(),
              roleName: z.string(),
              organizationId: z.string().optional(),
            }),
          })
          .array(),
        updatePositions: z
          .object({
            eventPositionId: z.string(),
            position: z.object({
              roleId: z.string(),
              roleName: z.string(),
              organizationId: z.string().optional(),
            }),
          })
          .array(),
        deletePositions: z.string().array(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      //deletes all connected positions that are not in the posiitons list
      await ctx.prisma?.eventPositions.deleteMany({
        where: {
          id: {
            in: input.deletePositions,
          },
        },
      });
      await Promise.all(
        input.updatePositions.map(async (item) => {
          await ctx.prisma?.eventPositions.update({
            where: {
              id: item.eventPositionId,
            },
            data: {
              Role: {
                connect: {
                  id: item.position.roleId,
                },
              },
            },
          });
        })
      );

      const events = await ctx.prisma?.event.update({
        data: {
          name: input.name,
          recurringId: input?.recurringId,
          datetime: replaceTime(input.eventDate, input.eventTime),
          timezone: input.eventTimeZone,
          organizationId: input.organization,
          locationsId: input.eventLocation.id,
          positions: {
            create: input.newPositions.map((item) => ({
              roleId: item.position.roleId,
            })),
          },
        },
        where: {
          id: input.id,
        },
      });
      return events;
    }),

  editRecurringEvent: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        eventTime: z.date(),
        eventTimeZone: z.string(),
        organization: z.string(),
        recurringId: z.string().optional(),
        eventLocation: z.object({
          id: z.string(),
          name: z.string(),
          organizationId: z.string(),
        }),
        positions: z
          .object({
            eventPositionId: z.string().nullable().optional(),
            position: z.object({
              roleId: z.string(),
              roleName: z.string(),
              organizationId: z.string().optional(),
            }),
          })
          .array(),
        newDates: z.date().array(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // for events that were not previously reccuring
      if (input.recurringId == undefined) {
        //find original event
        const originalEvent = await ctx.prisma?.event.findFirst({
          where: {
            id: input.id,
          },
          include: {
            positions: true,
          },
        });
        if (originalEvent == undefined) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Event does not exist",
          });
        }
        const recurringId = uuidv4();
        const differentPositionIds = originalEvent.positions.filter(
          (item) =>
            !input.positions.map((pos) => pos.eventPositionId).includes(item.id)
        );
        if (differentPositionIds.length == 0) {
          const newPositions = input.positions.filter(
            (item) => item.eventPositionId == null
          );

          const startDate = input.newDates[0];
          if (startDate == undefined) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Start date not found",
            });
          }
          //updates original events
          const update = await ctx.prisma?.event.update({
            where: {
              id: originalEvent.id,
            },
            data: {
              name: input.name,
              recurringId: recurringId,
              datetime: replaceTime(startDate, input.eventTime),
              timezone: input.eventTimeZone,
              organizationId: input.organization,
              locationsId: input.eventLocation.id,
              positions: {
                create: newPositions.map((position) => ({
                  roleId: position.position.roleId,
                })),
              },
            },
          });

          const newdates = input.newDates.slice(1);
          const newEvents = await Promise.all(
            newdates.map(async (date, index) => {
              await ctx.prisma?.event.create({
                data: {
                  name: input.name,
                  recurringId: recurringId,
                  datetime: replaceTime(date, input.eventTime),
                  timezone: input.eventTimeZone,
                  organizationId: input.organization,
                  locationsId: input.eventLocation.id,
                  positions: {
                    create: input.positions.map((item) => ({
                      roleId: item.position.roleId,
                    })),
                  },
                },
              });
            })
          );
          return [update, ...newEvents];
        }
        if (differentPositionIds.length > 0) {
          await ctx.prisma?.eventPositions.deleteMany({
            where: {
              id: {
                in: differentPositionIds.map((item) => item.id),
              },
            },
          });
          const newPositions = input.positions.filter(
            (item) => item.eventPositionId == null
          );

          const startDate = input.newDates[0];
          if (startDate == undefined) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Start date not found",
            });
          }
          //updates original events
          const update = await ctx.prisma?.event.update({
            where: {
              id: originalEvent.id,
            },
            data: {
              name: input.name,
              recurringId: recurringId,
              datetime: replaceTime(startDate, input.eventTime),
              timezone: input.eventTimeZone,
              organizationId: input.organization,
              locationsId: input.eventLocation.id,
              positions: {
                create: newPositions.map((position) => ({
                  roleId: position.position.roleId,
                })),
              },
            },
          });

          const newdates = input.newDates.slice(1);
          const newEvents = await Promise.all(
            newdates.map(async (date, index) => {
              await ctx.prisma?.event.create({
                data: {
                  name: input.name,
                  recurringId: recurringId,
                  datetime: replaceTime(date, input.eventTime),
                  timezone: input.eventTimeZone,
                  organizationId: input.organization,
                  locationsId: input.eventLocation.id,
                  positions: {
                    create: input.positions.map((item) => ({
                      roleId: item.position.roleId,
                    })),
                  },
                },
              });
            })
          );
          return [update, ...newEvents];
        }
      }

      // for events that were previously recuring
      const exisitingEvents = await ctx.prisma?.event.findMany({
        where: {
          recurringId: input.recurringId,
        },
        include: {
          positions: {
            include: { Role: true, User: true },
          },
        },
        orderBy: { datetime: "asc" },
      });
      // finding if there are same, more, or less new dates than current events
      if (exisitingEvents == undefined) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "There are no existing events that match this one",
        });
      }

      // They are the same
      if (exisitingEvents.length == input.newDates.length) {
        if (exisitingEvents[0] == undefined) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "The first existing event does not exist.",
          });
        }

        const differentPositionsId = exisitingEvents[0].positions.filter(
          (item) =>
            !input.positions.map((inp) => inp.eventPositionId).includes(item.id)
        );

        const _promises = await Promise.all(
          exisitingEvents.map(async (oldEvent, index) => {
            let date = input.newDates[index];
            if (date == undefined) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Date does not exist.",
              });
            }

            if (differentPositionsId.length == 0) {
              const newPositions = input.positions.filter(
                (item) => item.eventPositionId == null
              );

              const event = await ctx.prisma?.event.update({
                data: {
                  name: input.name,
                  recurringId: input?.recurringId,
                  datetime: replaceTime(date, input.eventTime),
                  timezone: input.eventTimeZone,
                  organizationId: input.organization,
                  locationsId: input.eventLocation.id,
                  positions: {
                    create: newPositions.map((position) => ({
                      roleId: position.position.roleId,
                    })),
                  },
                },
                where: {
                  id: oldEvent.id,
                },
              });
            }

            if (differentPositionsId.length > 0) {
              await ctx.prisma?.eventPositions.deleteMany({
                where: {
                  eventId: oldEvent.id,
                  roleId: {
                    in: differentPositionsId.map((item) => item.roleId),
                  },
                },
              });

              let newPositions = input.positions.filter(
                (item) => item.eventPositionId == null
              );

              const event = await ctx.prisma?.event.update({
                data: {
                  name: input.name,
                  recurringId: input?.recurringId,
                  datetime: replaceTime(date, input.eventTime),
                  timezone: input.eventTimeZone,
                  organizationId: input.organization,
                  locationsId: input.eventLocation.id,
                  positions: {
                    create: newPositions.map((item) => ({
                      roleId: item.position.roleId,
                    })),
                  },
                },
                where: {
                  id: oldEvent.id,
                },
              });
            }
          })
        );
        return _promises;
      }

      //new dates is longer so new events will be created
      if (exisitingEvents.length < input.newDates.length) {
        if (exisitingEvents[0] == undefined) {
          throw new TRPCError({ code: "BAD_REQUEST" });
        }

        const differentPositionsId = exisitingEvents[0].positions.filter(
          (item) =>
            !input.positions.map((inp) => inp.eventPositionId).includes(item.id)
        );

        // this takes care of all of the exisitng events
        const _promises = await Promise.all(
          exisitingEvents.map(async (oldEvent, index) => {
            let date = input.newDates[index];
            if (date == undefined) {
              throw new TRPCError({ code: "BAD_REQUEST" });
            }

            if (differentPositionsId.length == 0) {
              const newPositions = input.positions.filter(
                (item) => item.eventPositionId == null
              );

              const event = await ctx.prisma?.event.update({
                data: {
                  name: input.name,
                  recurringId: input?.recurringId,
                  datetime: replaceTime(date, input.eventTime),
                  timezone: input.eventTimeZone,
                  organizationId: input.organization,
                  locationsId: input.eventLocation.id,
                  positions: {
                    create: newPositions.map((position) => ({
                      roleId: position.position.roleId,
                    })),
                  },
                },
                where: {
                  id: oldEvent.id,
                },
              });
            }

            if (differentPositionsId.length > 0) {
              await ctx.prisma?.eventPositions.deleteMany({
                where: {
                  eventId: oldEvent.id,
                  roleId: {
                    in: differentPositionsId.map((item) => item.roleId),
                  },
                },
              });

              let newPositions = input.positions.filter(
                (item) => item.eventPositionId == null
              );

              const event = await ctx.prisma?.event.update({
                data: {
                  name: input.name,
                  recurringId: input?.recurringId,
                  datetime: replaceTime(date, input.eventTime),
                  timezone: input.eventTimeZone,
                  organizationId: input.organization,
                  locationsId: input.eventLocation.id,
                  positions: {
                    create: newPositions.map((item) => ({
                      roleId: item.position.roleId,
                    })),
                  },
                },
                where: {
                  id: oldEvent.id,
                },
              });
            }
          })
        );

        //this takes care of the new events
        const numOfNew = input.newDates.length - exisitingEvents.length;
        const newEvents = input.newDates.slice(-numOfNew);

        const _createdEvents = await Promise.all(
          newEvents.map(async (date) => {
            await ctx.prisma?.event.create({
              data: {
                name: input.name,
                datetime: replaceTime(date, input.eventTime),
                timezone: input.eventTimeZone,
                organizationId: input.organization,
                recurringId: input.recurringId,
                locationsId: input.eventLocation.id,
                positions: {
                  create: input.positions.map((item) => ({
                    roleId: item.position.roleId,
                  })),
                },
              },
            });
          })
        );
        return [..._promises, ..._createdEvents];
      }

      //new dates is shorter so last events will be deleted
      if (exisitingEvents.length > input.newDates.length) {
        if (exisitingEvents[0] == undefined) {
          throw new TRPCError({ code: "BAD_REQUEST" });
        }

        const differentPositionsId = exisitingEvents[0].positions.filter(
          (item) =>
            !input.positions.map((inp) => inp.eventPositionId).includes(item.id)
        );

        const numToDelete = input.newDates.length - exisitingEvents.length;
        const eventsToDelete = exisitingEvents.slice(numToDelete);

        const _deletes = await ctx.prisma?.event.deleteMany({
          where: {
            id: {
              in: eventsToDelete.map((event) => event.id),
            },
          },
        });

        const _promises = await Promise.all(
          input.newDates.map(async (newDate, index) => {
            let date = input.newDates[index];
            if (date == undefined) {
              throw new TRPCError({ code: "BAD_REQUEST" });
            }

            if (differentPositionsId.length == 0) {
              const newPositions = input.positions.filter(
                (item) => item.eventPositionId == null
              );

              const event = await ctx.prisma?.event.update({
                data: {
                  name: input.name,
                  recurringId: input?.recurringId,
                  datetime: replaceTime(date, input.eventTime),
                  timezone: input.eventTimeZone,
                  organizationId: input.organization,
                  locationsId: input.eventLocation.id,
                  positions: {
                    create: newPositions.map((position) => ({
                      roleId: position.position.roleId,
                    })),
                  },
                },
                where: {
                  id: exisitingEvents[index]!.id,
                },
              });
            }

            if (differentPositionsId.length > 0) {
              await ctx.prisma?.eventPositions.deleteMany({
                where: {
                  eventId: exisitingEvents[index]!.id,
                  roleId: {
                    in: differentPositionsId.map((item) => item.roleId),
                  },
                },
              });

              let newPositions = input.positions.filter(
                (item) => item.eventPositionId == null
              );

              const event = await ctx.prisma?.event.update({
                data: {
                  name: input.name,
                  recurringId: input?.recurringId,
                  datetime: replaceTime(date, input.eventTime),
                  timezone: input.eventTimeZone,
                  organizationId: input.organization,
                  locationsId: input.eventLocation.id,
                  positions: {
                    create: newPositions.map((item) => ({
                      roleId: item.position.roleId,
                    })),
                  },
                },
                where: {
                  id: exisitingEvents[index]!.id,
                },
              });
            }
          })
        );
      }
    }),

  deleteEventById: adminProcedure
    .input(z.object({ id: z.string(), deleteRecurring: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      if (input.deleteRecurring == false) {
        return await ctx.prisma?.event.delete({
          where: {
            id: input.id,
          },
        });
      }

      if (input.deleteRecurring == true) {
        const event = await ctx.prisma?.event.findFirst({
          where: {
            id: input.id,
          },
          select: {
            recurringId: true,
          },
        });

        if (
          event == undefined ||
          event == null ||
          event.recurringId == undefined ||
          event.recurringId == null
        ) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        const deletedEvents = await ctx.prisma?.event.deleteMany({
          where: {
            recurringId: event.recurringId,
          },
        });
        const recurringDataDelete = await ctx.prisma?.eventReccurance.delete({
          where: { recurringId: event.recurringId },
        });
        return { ...deletedEvents, ...recurringDataDelete };
      }
    }),
});
