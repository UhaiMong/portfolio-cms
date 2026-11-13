import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";
import Seo from "../components/Seo";

export default function RouteError() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : "Something broke while rendering this page.";

  if (import.meta.env.DEV) console.error(error);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center bg-gray-200 text-gray-900 dark:bg-slate-950 dark:text-gray-200">
      <Seo title="Something went wrong" noindex />
      <p className="text-xs tracking-[0.4em] uppercase">Unexpected error</p>
      <h1 className="text-3xl md:text-5xl font-bold">{message}</h1>
      <p className="text-sm max-w-md">
        Try reloading the page. If it keeps happening, please let me know.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="px-6 py-3 text-xs tracking-widest uppercase border border-current rounded-full"
        >
          Reload
        </button>
        <Link
          to="/"
          reloadDocument
          className="px-6 py-3 text-xs tracking-widest uppercase rounded-full bg-gray-900 text-gray-100 dark:bg-white dark:text-gray-900"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}
