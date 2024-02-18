import Link from "next/link";
import { Icons } from "./icons";
import { getAuthUserData } from "@/actions/auth";
import { buttonVariants } from "./ui/button";
import UserAccountNav from "./user-account-nav";

function Navbar() {
  const user = getAuthUserData();
  return (
    <div className="fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-2">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
        <Link href="/" className="flex gap-2 items-center">
          <Icons.logo />
          <p className="hidden text-zinc-700 text-sm font-medium md:block">
            BidZone
          </p>
        </Link>

        {user ? (
          <UserAccountNav user={user} />
        ) : (
          <Link href="/sign-in" className={buttonVariants()}>
            Войти
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
