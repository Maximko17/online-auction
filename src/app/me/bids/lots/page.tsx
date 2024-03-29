import { getBidsLots } from "@/actions/users";
import { LotCard } from "@/components/lots/LotCard";
import LotListPagination from "@/components/lot-pagination";
import ToastServerApiErrorMessage from "@/components/ui/toast/toast-api-status";

interface IUserBidsLots {
  searchParams: {
    page?: string;
    limit?: string;
  };
}

export default async function UserBidsLots({ searchParams }: IUserBidsLots) {
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const url = new URL(`/me/bids/lots`, process.env.NEXT_PUBLIC_HOST);
  url.searchParams.set("page", `${page}`);
  url.searchParams.set("limit", `${limit}`);

  const res = await getBidsLots({
    filters: {},
    order: { lotId: "DESC" },
    limit,
    page,
  });

  if (res.status > 200) {
    return <ToastServerApiErrorMessage status={res.status} />;
  }
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
