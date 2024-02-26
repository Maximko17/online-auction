import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

interface ILotListPagination {
  url: URL;
  page: number;
  totalPages: number;
}

export default function LotListPagination({
  url,
  page,
  totalPages,
}: ILotListPagination) {
  const currentPage = Math.min(Math.max(Number(page), 1), totalPages);
  const isLastPage = currentPage >= totalPages;
  const isFirstPage = currentPage <= 1;

  const getPageUrl = (page: number) => {
    url.searchParams.set("page", `${page}`);
    return url.toString();
  };

  const generatePages = () => {
    return Array(totalPages)
      .fill(".")
      .map((_, i) => {
        i = i + 1;
        return (
          <PaginationItem key={i}>
            <PaginationLink isActive={i === currentPage} href={getPageUrl(i)}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      });
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem className={cn(isFirstPage && "cursor-not-allowed")}>
          <PaginationPrevious
            isActive={!isFirstPage}
            className={cn(isFirstPage && "pointer-events-none")}
            href={getPageUrl(currentPage - 1)}
          />
        </PaginationItem>
        {generatePages()}
        <PaginationItem className={cn(isLastPage && "cursor-not-allowed")}>
          <PaginationNext
            isActive={!isLastPage}
            className={cn(isLastPage && "pointer-events-none")}
            href={getPageUrl(currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
