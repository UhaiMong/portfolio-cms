import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderKanban,
  BookOpen,
  Mail,
  Image,
  FileText,
  Star,
  Eye,
  Download,
  TrendingUp,
  Clock,
} from "lucide-react";
import api from "../../src/services/api";
import StatCard from "../../src/components/ui/StatCard";
import Badge from "../../src/components/ui/Badge";
import { useAppSelector } from "../../src/app/hooks";
import LoadingOverlay from "../../src/components/ui/LoadingOverlay";

interface Stats {
  projects: { total: number; featured: number };
  blogs: { total: number; published: number; drafts: number };
  contacts: { total: number; unread: number };
  media: { total: number };
  resume: { fileName: string; version: string; downloadCount: number } | null;
  recentContacts: any[];
  recentProjects: any[];
}

const statusVariant = (s: string) => {
  const m: Record<string, any> = {
    unread: "red",
    read: "blue",
    replied: "green",
    archived: "gray",
    completed: "green",
    "in-progress": "yellow",
    archived2: "gray",
  };
  return m[s] || "gray";
};

export default function DashboardHome() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const { admin } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/auth/stats")
      .then((r) => setStats(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingOverlay title="Dashboard is loading..." />;
  if (!stats) return <p className="text-gray-400">Failed to load stats.</p>;

  const hour = new Date().getHours();
  const greet =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {greet}, {admin?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Here's what's happening with your portfolio today.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-900 border border-gray-800 px-3 py-2 rounded-lg">
          <Clock size={13} />
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Projects"
          value={stats.projects.total}
          subtitle={`${stats.projects.featured} featured`}
          icon={FolderKanban}
          color="indigo"
        />
        <StatCard
          title="Blog Posts"
          value={stats.blogs.total}
          subtitle={`${stats.blogs.published} published · ${stats.blogs.drafts} drafts`}
          icon={BookOpen}
          color="purple"
        />
        <StatCard
          title="Messages"
          value={stats.contacts.total}
          subtitle={`${stats.contacts.unread} unread`}
          icon={Mail}
          color={stats.contacts.unread > 0 ? "rose" : "emerald"}
          trend={
            stats.contacts.unread > 0
              ? { value: stats.contacts.unread, label: "unread" }
              : undefined
          }
        />
        <StatCard
          title="Media Files"
          value={stats.media.total}
          subtitle="Uploaded to Cloudinary"
          icon={Image}
          color="sky"
        />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Featured Projects"
          value={stats.projects.featured}
          icon={Star}
          color="amber"
        />
        <StatCard
          title="Published Blogs"
          value={stats.blogs.published}
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Resume Downloads"
          value={stats.resume?.downloadCount ?? 0}
          subtitle={
            stats.resume ? `v${stats.resume.version}` : "No resume uploaded"
          }
          icon={Download}
          color="purple"
        />
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Mail size={16} className="text-indigo-400" /> Recent Messages
            </h2>
            <button
              onClick={() => navigate("/dashboard/contact")}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View all →
            </button>
          </div>

          {stats.recentContacts.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-6">
              No messages yet
            </p>
          ) : (
            <div className="space-y-3">
              {stats.recentContacts.map((c: any) => (
                <div
                  key={c._id}
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => navigate("/dashboard/contact")}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {c.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {c.subject}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <Badge label={c.status} variant={statusVariant(c.status)} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Projects */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <FolderKanban size={16} className="text-indigo-400" /> Recent
              Projects
            </h2>
            <button
              onClick={() => navigate("/dashboard/projects")}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View all →
            </button>
          </div>

          {stats.recentProjects.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-6">
              No projects yet
            </p>
          ) : (
            <div className="space-y-3">
              {stats.recentProjects.map((p: any) => (
                <div
                  key={p._id}
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => navigate("/dashboard/projects")}
                >
                  <div className="min-w-0 flex items-center gap-2">
                    {p.featured && (
                      <Star size={13} className="text-amber-400 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {p.title}
                      </p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Eye size={11} /> {p.views} views
                      </p>
                    </div>
                  </div>
                  <Badge label={p.status} variant={statusVariant(p.status)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h2 className="font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "New Project",
              icon: FolderKanban,
              to: "/dashboard/projects",
              color: "text-indigo-400",
            },
            {
              label: "New Blog",
              icon: BookOpen,
              to: "/dashboard/blog",
              color: "text-purple-400",
            },
            {
              label: "Upload Resume",
              icon: FileText,
              to: "/dashboard/resume",
              color: "text-emerald-400",
            },
            {
              label: "View Messages",
              icon: Mail,
              to: "/dashboard/contact",
              color: "text-rose-400",
            },
          ].map(({ label, icon: Icon, to, color }) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              className="flex flex-col items-center gap-2 p-4 bg-gray-800 hover:bg-gray-700
                rounded-xl transition-colors group"
            >
              <Icon
                size={22}
                className={`${color} group-hover:scale-110 transition-transform`}
              />
              <span className="text-xs text-gray-300 font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
