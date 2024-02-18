import { getLotData } from "@/actions/lots";
import ToastApiErrorMessage from "../../../components/ui/toast/toast-api-status";
import LotCard from "./lot-card";
import LotImages from "./lot-images";

export default async function Lot({ params }: { params: { id: number } }) {
  const res = await getLotData(params.id);
  return (
    <main className="py-10">
      <ToastApiErrorMessage status={401} />
      <div className="flex">
        <LotImages />
        <LotCard />
      </div>
    </main>
  );
}
