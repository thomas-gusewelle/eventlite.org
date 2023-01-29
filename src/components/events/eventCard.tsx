import { EventPositions, Locations, Role, User, Event } from "@prisma/client";
import { useContext } from "react";
import { TableOptionsDropdown } from "../../../types/tableMenuOptions";
import { UserContext } from "../../providers/userProvider";
import { shortDate } from "../dateTime/dates";
import { shortTime } from "../dateTime/times";
import { TableDropdown } from "../menus/tableDropdown";
import { PicNameRowSmall } from "../profile/PicNameRow";

type EventType = Event & {
  Locations: Locations | null;
  positions: (EventPositions & {
    User: User | null;
    Role: Role;
  })[];
};

export const EventCard = ({
  event,
  dropdownOptions,
}: {
  event: EventType;
  dropdownOptions: TableOptionsDropdown;
}) => {
  const user = useContext(UserContext);
  return (
    <div
      key={event.id}
      className='flex flex-col rounded-lg border border-gray-300 pt-4 shadow'>
      <div className='mb-4 flex flex-col px-3'>
        <div className='flex justify-between'>
          <h3 className='text-xl font-bold'>{event.name}</h3>
          {user?.status == "ADMIN" && (
            <TableDropdown options={dropdownOptions} />
          )}
        </div>
        <span className='text-lg font-medium'>{event.Locations?.name}</span>
        <span>{shortDate(event.datetime)}</span>
        <span>{shortTime(event.datetime)}</span>
      </div>
      <div className=''>
        {event.positions
          .sort((a, b) => {
            if (a.Role.name < b.Role.name) return -1;
            else if (a.Role.name > b.Role.name) return 1;
            else return 0;
          })
          .map((position) => {
            return (
              <div
                className='grid grid-cols-[1fr_1.5fr] items-center border-t last:rounded-b-lg last:border-b last:pb-0'
                key={position.id}>
                <span className='py-3 px-3 font-medium'>
                  {position.Role.name}
                </span>
                {position.User ? (
                  <div
                    className={`flex h-full py-1 px-3 text-center ${
                      position.userResponse == null && "bg-gray-100"
                    }
${position.userResponse == true && "bg-green-200"}
${position.userResponse == false && "bg-red-200"}
`}>
                    <PicNameRowSmall user={position?.User} />
                  </div>
                ) : (
                  <div className='h-full bg-gray-100' />
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};
