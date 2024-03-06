import { getLotList } from "@/actions/lots";
import { LotCard } from "@/components/lots/LotCard";
import LotListPagination from "@/components/lot-pagination";
import { notFound } from "next/navigation";

interface IUserLots {
  params: { id: number };
  searchParams: {
    page?: string;
    limit?: string;
  };
}

export default async function UserLots({ params, searchParams }: IUserLots) {
  if (isNaN(Number(params.id))) {
    return notFound();
  }
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const url = new URL(`/user/${params.id}/lots`, "http://localhost:3000");
  url.searchParams.set("page", `${page}`);
  url.searchParams.set("limit", `${limit}`);

  const res = await getLotList({
    filters: { sellerId: +params.id },
    order: { lotId: "DESC" },
    limit,
    page,
  });

  if (!res.data?.content.length) {
    return "Ничего не найдено";
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* <Sidebar /> */}
      <main>
        <div className="space-y-6 p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 py-4">
            {res.data.content.map((lot) => {
              return <LotCard lot={lot} key={lot.id} />;
            })}
          </div>
          <LotListPagination
            page={page}
            totalPages={res.data.totalPages}
            url={url}
          />
        </div>
      </main>
    </div>
  );
}
