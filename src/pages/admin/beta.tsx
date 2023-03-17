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
import { api } from "../../server/utils/api"

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

const AdminBetaPage = () => {
  const getBetaRequest = api.admin.getBetaRequests.useQuery();
  const sendInvite = api.admin.sendBetaInvite.useMutation();
  const deleteBetaRequest = api.admin.deleteBetaRegister.useMutation();
  const deleteRef = useRef<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  if (getBetaRequest.isLoading) {
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
            <th>Org Name</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {getBetaRequest.data?.map((req) => (
            <tr className='border-t last:border-b' key={req.id}>
              <td className='hidden md:table-cell'>{req.id}</td>
              <td className='py-4'>{req.orgName}</td>
              <td>{req.firstName + " " + req.lastName}</td>
              <td className='truncate'>{req.email}</td>
              <td>
                <TableDropdown
                  options={[
                    {
                      name: req.inviteSent ? "Resend Invite" : "Send invite",
                      function: () => sendInvite.mutate({ id: req.id }),
                    },
                    {
                      name: "Delete",
                      function: () => {
                        deleteRef.current = req.id;
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
                deleteBetaRequest.mutate(
                  { id: deleteRef.current },
                  {
                    onSuccess: () => {
                      deleteRef.current = null;
                      getBetaRequest.refetch();
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
            Are you sure you want to delete the request?
          </AreYouSureModal>,
          document.body
        )}
    </AdminLayout>
  );
};

AdminBetaPage.getLayout = sidebar;
export default AdminBetaPage;
