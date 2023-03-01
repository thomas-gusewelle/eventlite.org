import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
  PreviewData,
} from "next";
import { ParsedUrlQuery } from "querystring";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CircularProgress } from "../../components/circularProgress";
import { SectionHeading } from "../../components/headers/SectionHeading";
import { AdminLayout } from "../../components/layout/admin";
import { sidebar } from "../../components/layout/sidebar";
import { TableDropdown } from "../../components/menus/tableDropdown";
import { AreYouSureModal } from "../../components/modal/areYouSure";
import { trpc } from "../../utils/trpc";

export async function getServerSideProps(
  context:
    | GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
    | {
        req: NextApiRequest;
        res: NextApiResponse;
      }
) {
  const supabase = createServerSupabaseClient(context);
  const user = await supabase.auth.getUser();
  if (user.data.user?.email != "tgusewelle@eventlite.org") {
    return {
      redirect: {
        destination: "/dashboard",
      },
    };
  }
  return {
    props: {},
  };
}

const OrgsPage = () => {
  const getOrgs = trpc.useQuery(["admin.getOrgs"]);
  const deleteOrg = trpc.useMutation("admin.deleteOrg");
  const deleteRef = useRef<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  if (getOrgs.isLoading) {
    return (
      <AdminLayout>
        <div className='flex justify-center'>
          <CircularProgress />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <SectionHeading>Beta Requests</SectionHeading>
      <table className='mt-6 w-full table-auto text-left'>
        <thead>
          <tr>
            <th className='hidden md:table-cell'>ID</th>
            <th>Name</th>
            <th>Phone #</th>
          </tr>
        </thead>
        <tbody>
          {getOrgs.data?.map((org) => (
            <tr className='border-t last:border-b' key={org.id}>
              <td className='hidden md:table-cell'>{org.id}</td>
              <td className='py-4'>{org.name}</td>

              <td className='truncate'>{org.phone_number}</td>
              <td>
                <TableDropdown
                  options={[
                    {
                      name: "Delete",
                      function: () => {
                        deleteRef.current = org.id;
                        setDeleteConfirm(true);
                      },
                    },
                  ]}
                />
              </td>
            </tr>
          ))}
          <td></td>
        </tbody>
      </table>

      {deleteConfirm == true &&
        createPortal(
          <AreYouSureModal
            onConfirm={() => {
              if (deleteRef.current) {
                deleteOrg.mutate(
                  { id: deleteRef.current },
                  {
                    onSuccess: () => {
                      deleteRef.current = null;
                      getOrgs.refetch();
                      setDeleteConfirm(false);
                    },
                  }
                );
              }
            }}
            onCancel={() => {
              deleteRef.current = null;
              setDeleteConfirm(false);
            }}
            open={deleteConfirm}
            setOpen={setDeleteConfirm}
            title='Are you sure?'>
            Are you sure you want to delete the organization?
          </AreYouSureModal>,
          document.body
        )}
    </AdminLayout>
  );
};

OrgsPage.getLayout = sidebar;
export default OrgsPage;
