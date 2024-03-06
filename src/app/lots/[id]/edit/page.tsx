import { getCategotyTree } from "@/actions/categories";
import { getLotData } from "@/actions/lots";
import { notFound, redirect } from "next/navigation";
import EditLotForm from "../../../../components/lots/EditLotForm";
import { Status } from "@/types";

export default async function Lot({ params }: { params: { id: number } }) {
  const lotRes = await getLotData(params.id);
  if (lotRes.status === 404) {
    return notFound();
  } else if (!lotRes.data || lotRes.status !== 200) {
    redirect("/");
  } else if (
    lotRes.status === 200 &&
    lotRes.data.status !== Status.REVIEW &&
    lotRes.data.status !== Status.NEW
  ) {
    redirect("/");
  }

  const catRes = await getCategotyTree({
    startDepth: 0,
    endDepth: 10,
  });
  if (!catRes.data || catRes.status !== 200) {
    redirect("/");
  }

  return <EditLotForm categoriesTree={catRes.data} initLotData={lotRes.data} />;
}
