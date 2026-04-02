import { Link, useLocation } from "react-router-dom";

export default function Breadcrumbs() {
  const location = useLocation();

  // Split pathname into segments
  const pathSegments = location.pathname.split("/").filter(Boolean);

  // Build breadcrumb items with cumulative paths
  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = "/" + pathSegments.slice(0, index + 1).join("/");
    const label = segment.charAt(0).toUpperCase() + segment.slice(1); // Capitalize

    return { label, path };
  });

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600">
      <Link to="/" className="hover:text-blue-600">
        Home
      </Link>
      {breadcrumbs.map((crumb, index) => (
        <span key={crumb.path} className="flex items-center space-x-2">
          <span>/</span>
          {index === breadcrumbs.length - 1 ? (
            <span className="text-gray-900 font-medium">{crumb.label}</span>
          ) : (
            <Link to={crumb.path} className="hover:text-blue-600">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
