import { getCategotyTree } from "@/actions/categories";
import CreateLotForm from "./create-lot-form";
import { redirect } from "next/navigation";

export default async function Page() {
  const categoriesRes = await getCategotyTree({
    startDepth: 0,
    endDepth: 10,
  });
  if (!categoriesRes.data || categoriesRes.status != 200) {
    redirect("/");
  }

  return <CreateLotForm categoriesTree={categoriesRes.data} />;
}
