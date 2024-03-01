import Link from "next/link";

interface IBreadcrumb {
  headIcon: any | null;
  sections: { name: string }[];
}
export default function Breadcrumb({ headIcon, sections }: IBreadcrumb) {
  return (
    <nav
      className="flex px-5 py-4 text-gray-800 border border-gray-200 rounded-lg "
      aria-label="Breadcrumb"
    >
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        {sections.map(({ name }, i) => {
          return i === 0 ? (
            <li className="inline-flex items-center">
              <Link
                href="#"
                className="inline-flex items-center text-sm font-medium text-gray-800 hover:text-blue-600 "
              >
                {headIcon}
                {name}
              </Link>
            </li>
          ) : (
            <li>
              <div className="flex items-center">
                <svg
                  className="rtl:rotate-180 block w-3 h-3 mx-1 text-gray-400 "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                {i !== sections.length - 1 ? (
                  <Link
                    href="#"
                    className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                  >
                    {name}
                  </Link>
                ) : (
                  <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                    {name}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
