import { getTrackingLots } from "@/actions/users";
import Breadcrumb from "@/components/breadcrumb";
import { Icons } from "@/components/icons";
import { LotCard } from "@/components/lot-card";
import LotListPagination from "@/components/lot-pagination";
import { SidebarFilters } from "@/components/sidebar-filters";
import ToastServerApiErrorMessage from "@/components/ui/toast/toast-api-status";

interface IUserTrackingLots {
  searchParams: {
    page?: string;
    limit?: string;
  };
}

export default async function UserTrackingLots({
  searchParams,
}: IUserTrackingLots) {
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const url = new URL(`/me/lots/tracking`, process.env.NEXT_PUBLIC_HOST);
  url.searchParams.set("page", `${page}`);
  url.searchParams.set("limit", `${limit}`);

  const res = await getTrackingLots({
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
    <main>
      <Breadcrumb
        headIcon={<Icons.user className="w-4 h-4 mr-2" />}
        sections={[{ name: "Мой профиль" }, { name: "Отслеживаемые лоты" }]}
      />
      <div className="flex flex-1 overflow-hidden">
        <SidebarFilters />
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
      </div>
    </main>
  );
}
