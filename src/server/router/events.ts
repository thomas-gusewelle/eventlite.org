import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { replaceTime, roundHourDown } from "../utils/dateTimeModifers";
import { createRouter } from "./context";

export const eventsRouter = createRouter()
  .query("getUpcomingEventsByOrganization", {
    async resolve({ ctx }) {
      const org = await prisma?.user.findFirst({
        where: { id: ctx.session?.user.id },
        select: { organizationId: true },
      });
      return await prisma?.event.findMany({
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
    },
  })
  .query("getPastEventsByOrganization", {
    async resolve({ ctx }) {
      const org = await prisma?.user.findFirst({
        where: { id: ctx.session?.user.id },
        select: { organizationId: true },
      });
      return await prisma?.event.findMany({
        where: {
          organizationId: org?.organizationId,
          datetime: {
            lt: roundHourDown(),
          },
        },
        include: {
          positions: {
            include: {
              Role: true,
            },
          },
        },
        orderBy: {
          datetime: "desc",
        },
      });
    },
  })

  .middleware(async ({ ctx, next }) => {
    const user = await prisma?.user.findFirst({
      where: { id: ctx.session?.user.id },
      select: {
        status: true,
      },
    });
    if (user?.status != "ADMIN") {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next();
  })
  .query("getEditEvent", {
    input: z.string(),
    async resolve({ ctx, input }) {
      if (ctx.req?.headers.referer == undefined) return;
      const queries: string | null = new URL(
        ctx.req?.headers.referer
      ).searchParams.get("rec");

      if (queries == "true") {
        const idEvent = await prisma?.event.findFirst({
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
        return await prisma?.event.findFirst({
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
      }

      if (queries == "false" || queries == null) {
        return await prisma?.event.findFirst({
          where: { id: input },
          include: {
            Locations: true,
            positions: {
              include: { Role: true },
            },
          },
        });
      }
    },
  })
  .query("getEventRecurranceData", {
    input: z.string(),
    async resolve({ input }) {
      return await prisma?.eventReccurance.findFirst({
        where: {
          recurringId: input,
        },
      });
    },
  })

  .mutation("createEvent", {
    input: z.object({
      name: z.string(),
      eventDate: z.date(),
      eventTime: z.date(),
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
          quantity: z.number(),
        })
        .array(),
    }),

    async resolve({ ctx, input }) {
      const org = await prisma?.user.findFirst({
        where: { id: ctx.session?.user.id },
        select: { organizationId: true },
      });

      return await prisma?.event.create({
        data: {
          name: input.name,
          recurringId: input?.recurringId,
          datetime: replaceTime(input.eventDate, input.eventTime),
          organizationId: org?.organizationId,
          locationsId: input.eventLocation.id,
          positions: {
            create: input.positions.map((item) => ({
              numberNeeded: item.quantity,
              roleId: item.position.id,
            })),
          },
        },
      });
    },
  })
  .mutation("createEventReccurance", {
    input: z.object({
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
          id: z.union([z.literal("Num"), z.literal("Date")]),
          name: z.string(),
        })
        .optional(),

      DNum: z.number().optional(),
      DDate: z.date().optional(),
      WEndSelect: z
        .object({
          id: z.union([z.literal("Num"), z.literal("Date")]),
          name: z.string(),
        })
        .optional(),

      WNum: z.number().optional(),
      WDate: z.date().optional(),
      WCEndSelect: z
        .object({
          id: z.union([z.literal("Num"), z.literal("Date")]),
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
          id: z.union([z.literal("Num"), z.literal("Date")]),
          name: z.string(),
        })
        .optional(),
      MNum: z.number().optional(),
      MDate: z.date().optional(),
    }),
    async resolve({ input }) {
      return await prisma?.eventReccurance.create({
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
    },
  })
  .mutation("EditEventReccuranceData", {
    input: z.object({
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
    }),
    async resolve({ input }) {
      return await prisma?.eventReccurance.update({
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
    },
  })
  .mutation("editEvent", {
    input: z.object({
      id: z.string(),
      name: z.string(),
      eventDate: z.date(),
      eventTime: z.date(),
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
          quantity: z.number(),
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
          quantity: z.number(),
        })
        .array(),
      deletePositions: z.string().array(),
    }),

    async resolve({ ctx, input }) {
      //deletes all connected positions that are not in the posiitons list
      await prisma?.eventPositions.deleteMany({
        where: {
          id: {
            in: input.deletePositions,
          },
        },
      });
      await Promise.all(
        input.updatePositions.map(async (item) => {
          await prisma?.eventPositions.update({
            where: {
              id: item.eventPositionId,
            },
            data: {
              numberNeeded: item.quantity,
              Role: {
                connect: {
                  id: item.position.roleId,
                },
              },
            },
          });
        })
      );

      const events = await prisma?.event.update({
        data: {
          name: input.name,
          recurringId: input?.recurringId,
          datetime: replaceTime(input.eventDate, input.eventTime),
          organizationId: input.organization,
          locationsId: input.eventLocation.id,
          positions: {
            create: input.newPositions.map((item) => ({
              numberNeeded: item.quantity,
              roleId: item.position.roleId,
            })),
          },
        },
        where: {
          id: input.id,
        },
      });
      return events;
    },
  })
  .mutation("editRecurringEvent", {
    input: z.object({
      name: z.string(),
      eventTime: z.date(),
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
          quantity: z.number(),
        })
        .array(),
      newDates: z.date().array(),
    }),
    async resolve({ input }) {
      const exisitingEvents = await prisma?.event.findMany({
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
              const updateNumbers = input.positions.filter((item) => {
                const indexOf = oldEvent.positions.findIndex(
                  (obj) => obj.roleId == item.position.roleId
                );
                if (indexOf == -1) {
                  return;
                }
                return (
                  oldEvent.positions[indexOf]?.numberNeeded != item.quantity
                );
              });
              console.log("this is the old event", oldEvent.positions);
              console.log("This is the update numebrs", updateNumbers);

              if (updateNumbers.length > 0) {
                await Promise.all(
                  updateNumbers.map(async (update) => {
                    let oldNumObj = oldEvent.positions.find(
                      (old) => old.Role.id == update.position.roleId
                    );

                    if (oldNumObj == undefined) {
                      throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Numbers on old positions does not exist.",
                      });
                    }
                    if (update.quantity < oldNumObj.numberNeeded) {
                      let difference = update.quantity - oldNumObj.numberNeeded;
                      const removeItems = oldNumObj.User.slice(0, difference);
                      await prisma?.eventPositions.update({
                        where: { id: oldNumObj.id },
                        data: {
                          User: {
                            disconnect: removeItems.map((item) => ({
                              id: item.id,
                            })),
                          },
                        },
                      });
                    }
                    await prisma?.eventPositions.updateMany({
                      where: {
                        eventId: oldEvent.id,
                        roleId: update.position.roleId,
                      },
                      data: {
                        numberNeeded: update.quantity,
                      },
                    });
                  })
                );
              }

              const newPositions = input.positions.filter(
                (item) => item.eventPositionId == null
              );

              const event = await prisma?.event.update({
                data: {
                  name: input.name,
                  recurringId: input?.recurringId,
                  datetime: replaceTime(date, input.eventTime),
                  organizationId: input.organization,
                  locationsId: input.eventLocation.id,
                  positions: {
                    create: newPositions.map((position) => ({
                      numberNeeded: position.quantity,
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
              await prisma?.eventPositions.deleteMany({
                where: {
                  eventId: oldEvent.id,
                  roleId: {
                    in: differentPositionsId.map((item) => item.roleId),
                  },
                },
              });

              const updateNumbers = input.positions.filter((item) => {
                const indexOf = oldEvent.positions.findIndex(
                  (obj) => obj.roleId == item.position.roleId
                );
                if (indexOf == -1) {
                  return;
                }
                return (
                  oldEvent.positions[indexOf]?.numberNeeded != item.quantity
                );
              });

              if (updateNumbers.length > 0) {
                await Promise.all(
                  updateNumbers.map(async (update) => {
                    let oldNumObj = oldEvent.positions.find(
                      (old) => old.Role.id == update.position.roleId
                    );
                    console.log("OldNum", oldNumObj);
                    if (oldNumObj == undefined) {
                      throw new TRPCError({ code: "BAD_REQUEST" });
                    }
                    if (update.quantity < oldNumObj.numberNeeded) {
                      let difference = update.quantity - oldNumObj.numberNeeded;
                      const removeItems = oldNumObj.User.slice(0, difference);
                      await prisma?.eventPositions.update({
                        where: { id: oldNumObj.id },
                        data: {
                          User: {
                            disconnect: removeItems.map((item) => ({
                              id: item.id,
                            })),
                          },
                        },
                      });
                    }
                    await prisma?.eventPositions.updateMany({
                      where: {
                        eventId: oldEvent.id,
                        roleId: update.position.roleId,
                      },
                      data: {
                        numberNeeded: update.quantity,
                      },
                    });
                  })
                );
              }

              let newPositions = input.positions.filter(
                (item) => item.eventPositionId == null
              );

              const event = await prisma?.event.update({
                data: {
                  name: input.name,
                  recurringId: input?.recurringId,
                  datetime: replaceTime(date, input.eventTime),
                  organizationId: input.organization,
                  locationsId: input.eventLocation.id,
                  positions: {
                    create: newPositions.map((item) => ({
                      numberNeeded: item.quantity,
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
              const updateNumbers = input.positions.filter((item) => {
                const indexOf = oldEvent.positions.findIndex(
                  (obj) => obj.roleId == item.position.roleId
                );
                if (indexOf == -1) {
                  return;
                }
                return (
                  oldEvent.positions[indexOf]?.numberNeeded != item.quantity
                );
              });

              if (updateNumbers.length > 0) {
                await Promise.all(
                  updateNumbers.map(async (update) => {
                    let oldNumObj = oldEvent.positions.find(
                      (old) => old.Role.id == update.position.roleId
                    );
                    console.log("OldNum", oldNumObj);
                    if (oldNumObj == undefined) {
                      throw new TRPCError({ code: "BAD_REQUEST" });
                    }
                    if (update.quantity < oldNumObj.numberNeeded) {
                      let difference = update.quantity - oldNumObj.numberNeeded;
                      const removeItems = oldNumObj.User.slice(0, difference);
                      await prisma?.eventPositions.update({
                        where: { id: oldNumObj.id },
                        data: {
                          User: {
                            disconnect: removeItems.map((item) => ({
                              id: item.id,
                            })),
                          },
                        },
                      });
                    }
                    await prisma?.eventPositions.updateMany({
                      where: {
                        eventId: oldEvent.id,
                        roleId: update.position.roleId,
                      },
                      data: {
                        numberNeeded: update.quantity,
                      },
                    });
                  })
                );
              }

              const newPositions = input.positions.filter(
                (item) => item.eventPositionId == null
              );

              const event = await prisma?.event.update({
                data: {
                  name: input.name,
                  recurringId: input?.recurringId,
                  datetime: replaceTime(date, input.eventTime),
                  organizationId: input.organization,
                  locationsId: input.eventLocation.id,
                  positions: {
                    create: newPositions.map((position) => ({
                      numberNeeded: position.quantity,
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
              await prisma?.eventPositions.deleteMany({
                where: {
                  eventId: oldEvent.id,
                  roleId: {
                    in: differentPositionsId.map((item) => item.roleId),
                  },
                },
              });

              const updateNumbers = input.positions.filter((item) => {
                const indexOf = oldEvent.positions.findIndex(
                  (obj) => obj.roleId == item.position.roleId
                );
                if (indexOf == -1) {
                  return;
                }
                return (
                  oldEvent.positions[indexOf]?.numberNeeded != item.quantity
                );
              });

              if (updateNumbers.length > 0) {
                await Promise.all(
                  updateNumbers.map(async (update) => {
                    let oldNumObj = oldEvent.positions.find(
                      (old) => old.Role.id == update.position.roleId
                    );
                    console.log("OldNum", oldNumObj);
                    if (oldNumObj == undefined) {
                      throw new TRPCError({ code: "BAD_REQUEST" });
                    }
                    if (update.quantity < oldNumObj.numberNeeded) {
                      let difference = update.quantity - oldNumObj.numberNeeded;
                      const removeItems = oldNumObj.User.slice(0, difference);
                      await prisma?.eventPositions.update({
                        where: { id: oldNumObj.id },
                        data: {
                          User: {
                            disconnect: removeItems.map((item) => ({
                              id: item.id,
                            })),
                          },
                        },
                      });
                    }
                    await prisma?.eventPositions.updateMany({
                      where: {
                        eventId: oldEvent.id,
                        roleId: update.position.roleId,
                      },
                      data: {
                        numberNeeded: update.quantity,
                      },
                    });
                  })
                );
              }

              let newPositions = input.positions.filter(
                (item) => item.eventPositionId == null
              );

              const event = await prisma?.event.update({
                data: {
                  name: input.name,
                  recurringId: input?.recurringId,
                  datetime: replaceTime(date, input.eventTime),
                  organizationId: input.organization,
                  locationsId: input.eventLocation.id,
                  positions: {
                    create: newPositions.map((item) => ({
                      numberNeeded: item.quantity,
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
            await prisma?.event.create({
              data: {
                name: input.name,
                datetime: replaceTime(date, input.eventTime),
                organizationId: input.organization,
                recurringId: input.recurringId,
                locationsId: input.eventLocation.id,
                positions: {
                  create: input.positions.map((item) => ({
                    numberNeeded: item.quantity,
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

        const _deletes = await prisma?.event.deleteMany({
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
              const updateNumbers = input.positions.filter((item) => {
                const indexOf = exisitingEvents[index]!.positions.findIndex(
                  (obj) => obj.roleId == item.position.roleId
                );
                if (indexOf == -1) {
                  return;
                }
                return (
                  exisitingEvents[index]!.positions[indexOf]?.numberNeeded !=
                  item.quantity
                );
              });

              if (updateNumbers.length > 0) {
                await Promise.all(
                  updateNumbers.map(async (update) => {
                    let oldNumObj = exisitingEvents[index]!.positions.find(
                      (old) => old.Role.id == update.position.roleId
                    );
                    console.log("OldNum", oldNumObj);
                    if (oldNumObj == undefined) {
                      throw new TRPCError({ code: "BAD_REQUEST" });
                    }
                    if (update.quantity < oldNumObj.numberNeeded) {
                      let difference = update.quantity - oldNumObj.numberNeeded;
                      const removeItems = oldNumObj.User.slice(0, difference);
                      await prisma?.eventPositions.update({
                        where: { id: oldNumObj.id },
                        data: {
                          User: {
                            disconnect: removeItems.map((item) => ({
                              id: item.id,
                            })),
                          },
                        },
                      });
                    }
                    await prisma?.eventPositions.updateMany({
                      where: {
                        eventId: exisitingEvents[index]!.id,
                        roleId: update.position.roleId,
                      },
                      data: {
                        numberNeeded: update.quantity,
                      },
                    });
                  })
                );
              }

              const newPositions = input.positions.filter(
                (item) => item.eventPositionId == null
              );

              const event = await prisma?.event.update({
                data: {
                  name: input.name,
                  recurringId: input?.recurringId,
                  datetime: replaceTime(date, input.eventTime),
                  organizationId: input.organization,
                  locationsId: input.eventLocation.id,
                  positions: {
                    create: newPositions.map((position) => ({
                      numberNeeded: position.quantity,
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
              await prisma?.eventPositions.deleteMany({
                where: {
                  eventId: exisitingEvents[index]!.id,
                  roleId: {
                    in: differentPositionsId.map((item) => item.roleId),
                  },
                },
              });

              const updateNumbers = input.positions.filter((item) => {
                const indexOf = exisitingEvents[index]!.positions.findIndex(
                  (obj) => obj.roleId == item.position.roleId
                );
                if (indexOf == -1) {
                  return;
                }
                return (
                  exisitingEvents[index]!.positions[indexOf]?.numberNeeded !=
                  item.quantity
                );
              });

              if (updateNumbers.length > 0) {
                await Promise.all(
                  updateNumbers.map(async (update) => {
                    let oldNumObj = exisitingEvents[index]!.positions.find(
                      (old) => old.Role.id == update.position.roleId
                    );
                    console.log("OldNum", oldNumObj);
                    if (oldNumObj == undefined) {
                      throw new TRPCError({ code: "BAD_REQUEST" });
                    }
                    if (update.quantity < oldNumObj.numberNeeded) {
                      let difference = update.quantity - oldNumObj.numberNeeded;
                      const removeItems = oldNumObj.User.slice(0, difference);
                      await prisma?.eventPositions.update({
                        where: { id: oldNumObj.id },
                        data: {
                          User: {
                            disconnect: removeItems.map((item) => ({
                              id: item.id,
                            })),
                          },
                        },
                      });
                    }
                    await prisma?.eventPositions.updateMany({
                      where: {
                        eventId: exisitingEvents[index]!.id,
                        roleId: update.position.roleId,
                      },
                      data: {
                        numberNeeded: update.quantity,
                      },
                    });
                  })
                );
              }

              let newPositions = input.positions.filter(
                (item) => item.eventPositionId == null
              );

              const event = await prisma?.event.update({
                data: {
                  name: input.name,
                  recurringId: input?.recurringId,
                  datetime: replaceTime(date, input.eventTime),
                  organizationId: input.organization,
                  locationsId: input.eventLocation.id,
                  positions: {
                    create: newPositions.map((item) => ({
                      numberNeeded: item.quantity,
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
    },
  })
  .mutation("deleteEventById", {
    input: z.object({ id: z.string(), deleteRecurring: z.boolean() }),
    async resolve({ input }) {
      if (input.deleteRecurring == false) {
        return await prisma?.event.delete({
          where: {
            id: input.id,
          },
        });
      }

      if (input.deleteRecurring == true) {
        const event = await prisma?.event.findFirst({
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

        const deletedEvents = await prisma?.event.deleteMany({
          where: {
            recurringId: event.recurringId,
          },
        });
        const recurringDataDelete = await prisma?.eventReccurance.delete({
          where: { recurringId: event.recurringId },
        });
        return { ...deletedEvents, ...recurringDataDelete };
      }
    },
  });
