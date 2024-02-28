import { getCategotiesTree } from "@/actions/categories";
import CreateLotForm from "./create-lot-form";

export default async function Page() {
  const categoriesTree = await getCategotiesTree({
    startDepth: 0,
    endDepth: 10,
  });

  return <CreateLotForm categoriesTree={categoriesTree.data} />;
}
