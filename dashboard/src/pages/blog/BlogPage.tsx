import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Clock,
  Search,
  Filter,
  BookOpen,
  Loader2,
} from "lucide-react";
// import { useAppDispatch, useAppSelector } from "../../src/app/hooks";
import {
  fetchBlogs,
  deleteBlog,
  togglePublish,
  fetchBlogById,
} from "../../src/features/blog/blogSlice";
import Badge from "../../src/components/ui/Badge";
import BlogModal from "./BlogModal";
import { useAppDispatch, useAppSelector } from "../../src/app/hooks";
import LoadingOverlay from "../../src/components/ui/LoadingOverlay";

export default function BlogPage() {
  const dispatch = useAppDispatch();
  const { blogs, loading } = useAppSelector((s) => s.blog);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchBlogs({ status: "" }));
  }, [dispatch]);

  const filtered = blogs.filter((b) => {
    const matchSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter ? b.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog post? This cannot be undone.")) return;
    setDeleting(id);
    const res = await dispatch(deleteBlog(id));
    if (deleteBlog.fulfilled.match(res)) toast.success("Blog post deleted");
    else toast.error("Failed to delete");
    setDeleting(null);
  };

  const handleToggle = async (id: string) => {
    setToggling(id);
    const res = await dispatch(togglePublish(id));
    if (togglePublish.fulfilled.match(res)) toast.success("Status updated!");
    else toast.error("Failed to update status");
    setToggling(null);
  };

  const openCreate = () => {
    setModalOpen(true);
  };
  const openEdit = (id: string) => {
    dispatch(fetchBlogById(id));
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {blogs.length} total posts
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> New Post
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
            placeholder="Search blog posts..."
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
            className="bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-8 py-2.5 text-sm text-white outline-none focus:border-indigo-500 appearance-none cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingOverlay title="Blog fetching..." />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-lg">No blog posts found</p>
          <p className="text-sm mt-1">Create your first blog post</p>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3.5">Post</th>
                <th className="text-left px-4 py-3.5 hidden md:table-cell">
                  Category
                </th>
                <th className="text-left px-4 py-3.5 hidden lg:table-cell">
                  Read Time
                </th>
                <th className="text-left px-4 py-3.5 hidden lg:table-cell">
                  Views
                </th>
                <th className="text-left px-4 py-3.5">Status</th>
                <th className="text-right px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.map((b) => (
                <tr
                  key={b._id}
                  className="hover:bg-gray-800/40 transition-colors"
                >
                  {/* Post */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {b.thumbnail ? (
                        <img
                          loading="lazy"
                          src={b.thumbnail}
                          alt={b.title}
                          className="w-10 h-10 rounded-lg object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-800 shrink-0 flex items-center justify-center">
                          <BookOpen size={16} className="text-gray-600" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-white truncate max-w-50">
                          {b.title}
                        </p>
                        <p className="text-xs text-gray-500 truncate max-w-50">
                          {b.excerpt}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell text-gray-400">
                    {b.category}
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className="flex items-center gap-1 text-gray-400">
                      <Clock size={12} /> {b.readTime} min
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className="flex items-center gap-1 text-gray-400">
                      <Eye size={12} /> {b.views}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <Badge
                      label={b.status}
                      variant={b.status === "published" ? "green" : "yellow"}
                    />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {/* Toggle publish */}
                      <button
                        onClick={() => handleToggle(b._id)}
                        disabled={toggling === b._id}
                        className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                          b.status === "published"
                            ? "bg-yellow-900/40 text-yellow-300 hover:bg-yellow-900/60"
                            : "bg-emerald-900/40 text-emerald-300 hover:bg-emerald-900/60"
                        }`}
                      >
                        {toggling === b._id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : b.status === "published" ? (
                          "Unpublish"
                        ) : (
                          "Publish"
                        )}
                      </button>
                      <button
                        onClick={() => openEdit(b._id)}
                        className="p-1.5 rounded hover:bg-gray-700 text-gray-500 hover:text-indigo-400 transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(b._id)}
                        disabled={deleting === b._id}
                        className="p-1.5 rounded hover:bg-gray-700 text-gray-500 hover:text-red-400 transition-colors"
                      >
                        {deleting === b._id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && <BlogModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
