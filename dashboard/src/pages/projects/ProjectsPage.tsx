import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  Eye,
  ExternalLink,
  Github,
  Filter,
  Search,
  Loader2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../src/app/hooks";
import {
  fetchProjects,
  deleteProject,
  toggleFeatured,
} from "../../src/features/projects/projectSlice";
import Badge from "../../src/components/ui/Badge";
import ProjectModal from "./ProjectModal";
import type { Project } from "../../src/types";
import LoadingOverlay from "../../src/components/ui/LoadingOverlay";

const statusVariant = (s: string) =>
  (({ completed: "green", "in-progress": "yellow", archived: "gray" }) as any)[
    s
  ] || "gray";

export default function ProjectsPage() {
  const dispatch = useAppDispatch();
  const { projects, loading } = useAppSelector((s) => s.projects);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProjects({}));
  }, [dispatch]);

  const filtered = projects.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter ? p.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    setDeleting(id);
    const res = await dispatch(deleteProject(id));
    if (deleteProject.fulfilled.match(res)) toast.success("Project deleted");
    else toast.error("Failed to delete project");
    setDeleting(null);
  };

  const handleToggleFeatured = async (id: string) => {
    const res = await dispatch(toggleFeatured(id));
    if (toggleFeatured.fulfilled.match(res)) toast.success("Updated!");
  };

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (p: Project) => {
    setEditing(p);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {projects.length} total projects
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> New Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <div className="relative">
          <Filter
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-8 py-2.5 text-sm text-white outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingOverlay title="Project is fetching..." />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">No projects found</p>
          <p className="text-sm mt-1">
            Try adjusting your search or create a new project
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div
              key={p._id}
              className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all group"
            >
              {/* Thumbnail */}
              <div className="relative h-44 bg-gray-800 overflow-hidden">
                {p.thumbnail ? (
                  <img
                    loading="lazy"
                    src={p.thumbnail}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">
                    No image
                  </div>
                )}
                {/* Featured badge */}
                {p.featured && (
                  <span className="absolute top-2 left-2 flex items-center gap-1 bg-amber-500/90 text-white text-xs px-2 py-0.5 rounded-full">
                    <Star size={10} /> Featured
                  </span>
                )}
                {/* Status */}
                <span className="absolute top-2 right-2">
                  <Badge label={p.status} variant={statusVariant(p.status)} />
                </span>
              </div>

              {/* Body */}
              <div className="p-4">
                <h3 className="font-semibold text-white truncate">{p.title}</h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                  {p.description}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {p.techStack.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full border border-gray-700"
                    >
                      {t}
                    </span>
                  ))}
                  {p.techStack.length > 4 && (
                    <span className="text-xs text-gray-500">
                      +{p.techStack.length - 4}
                    </span>
                  )}
                </div>

                {/* Stats & links */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye size={12} /> {p.views}
                    </span>
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-indigo-400 transition-colors"
                      >
                        <ExternalLink size={13} />
                      </a>
                    )}
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-indigo-400 transition-colors"
                      >
                        <Github size={13} />
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleFeatured(p._id)}
                      className={`p-1.5 rounded hover:bg-gray-800 transition-colors ${p.featured ? "text-amber-400" : "text-gray-500 hover:text-amber-400"}`}
                      title={p.featured ? "Unfeature" : "Feature"}
                    >
                      <Star size={15} />
                    </button>
                    <button
                      onClick={() => openEdit(p)}
                      className="p-1.5 rounded hover:bg-gray-800 text-gray-500 hover:text-indigo-400 transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      disabled={deleting === p._id}
                      className="p-1.5 rounded hover:bg-gray-800 text-gray-500 hover:text-red-400 transition-colors"
                    >
                      {deleting === p._id ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <ProjectModal project={editing} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}
