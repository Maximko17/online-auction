import { getLotList } from "@/actions/lots";
import Breadcrumb from "@/components/breadcrumb";
import { Icons } from "@/components/icons";
import { LotCard } from "@/components/lots/LotCard";
import LotListPagination from "@/components/lot-pagination";
import { SidebarFilters } from "@/components/lots/SidebarFilters";
import ToastServerApiErrorMessage from "@/components/ui/toast/toast-api-status";
import { getCategotyTree, getRootCategories } from "@/actions/categories";

interface IHome {
  params: { id: number };
  searchParams: { categoryId: string };
}

export default async function Home({ searchParams }: IHome) {
  const categRes = searchParams?.categoryId
    ? await getCategotyTree(+searchParams.categoryId)
    : await getRootCategories();
  if (!categRes.data) {
    return "Ничего не найдено";
  }
  const lotRes = await getLotList({
    filters: {},
    order: { lotId: "DESC" },
    limit: 10,
    page: 1,
  });

  if (lotRes.status > 200) {
    return <ToastServerApiErrorMessage status={lotRes.status} />;
  }
  if (!lotRes.data?.content.length) {
    return "Ничего не найдено";
  }
  return (
    <main className="py-5">
      <Breadcrumb
        headIcon={<Icons.home className="w-4 h-4 mr-2" />}
        sections={[{ name: "Главная" }]}
      />
      <div className="flex flex-1 overflow-hidden">
        <SidebarFilters categoryList={categRes.data} />
        <div className="w-full">
          <div className="flex flex-col gap-6 py-4 px-5">
            {lotRes.data.content.map((lot) => {
              return <LotCard lot={lot} key={lot.id} />;
            })}
          </div>
          <LotListPagination
            page={1}
            totalPages={lotRes.data.totalPages}
            url={new URL(`/lots`, process.env.NEXT_PUBLIC_HOST)}
          />
        </div>
      </div>
    </main>
  );
}
