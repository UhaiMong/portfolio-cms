import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Mail, Trash2, Filter, Search, Loader2, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../src/app/hooks";
import Badge from "../../src/components/ui/Badge";
import type { Contact } from "../../src/types";
import {
  bulkDelete,
  deleteContact,
  fetchContacts,
  updateStatus,
} from "../../src/features/contact/contactSlice";
import LoadingOverlay from "../../src/components/ui/LoadingOverlay";

const statusVariant = (s: string) =>
  (
    ({ unread: "red", read: "blue", replied: "green", archived: "gray" }) as any
  )[s] || "gray";

export default function ContactPage() {
  const dispatch = useAppDispatch();
  const { contacts, unreadCount, loading } = useAppSelector((s) => s.contact);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<Contact | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [checked, setChecked] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchContacts({}));
  }, [dispatch]);

  const filtered = contacts.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter ? c.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  const handleView = async (c: Contact) => {
    setSelected(c);
    if (c.status === "unread") {
      await dispatch(updateStatus({ id: c._id, status: "read" }));
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    const res = await dispatch(updateStatus({ id, status }));
    if (updateStatus.fulfilled.match(res)) toast.success("Status updated");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    setDeleting(id);
    const res = await dispatch(deleteContact(id));
    if (deleteContact.fulfilled.match(res)) {
      toast.success("Deleted");
      if (selected?._id === id) setSelected(null);
    } else toast.error("Failed to delete");
    setDeleting(null);
  };

  const handleBulkDelete = async () => {
    if (!checked.length || !confirm(`Delete ${checked.length} messages?`))
      return;
    const res = await dispatch(bulkDelete(checked));
    if (bulkDelete.fulfilled.match(res)) {
      toast.success("Messages deleted");
      setChecked([]);
    }
  };

  const toggleCheck = (id: string) =>
    setChecked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Messages</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {contacts.length} total ·{" "}
            <span className="text-red-400">{unreadCount} unread</span>
          </p>
        </div>
        {checked.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <Trash2 size={15} /> Delete ({checked.length})
          </button>
        )}
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
            placeholder="Search messages..."
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
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Layout: list + detail */}
      <div className="flex gap-4 h-[calc(100vh-280px)] min-h-100">
        {/* Message list */}
        <div
          className={`flex flex-col bg-gray-900 border border-gray-800 rounded-xl overflow-hidden transition-all ${selected ? "w-2/5" : "w-full"}`}
        >
          {loading ? (
            <LoadingOverlay title="Contact is loading..." />
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 text-gray-500">
              <Mail size={36} className="mb-3 opacity-30" />
              <p>No messages found</p>
            </div>
          ) : (
            <div className="overflow-y-auto flex-1">
              {filtered.map((c) => (
                <div
                  key={c._id}
                  onClick={() => handleView(c)}
                  className={`flex items-start gap-3 p-4 cursor-pointer border-b border-gray-800 transition-colors
                    ${selected?._id === c._id ? "bg-indigo-900/20 border-l-2 border-l-indigo-500" : "hover:bg-gray-800/50"}
                    ${c.status === "unread" ? "bg-gray-800/30" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={checked.includes(c._id)}
                    onChange={() => toggleCheck(c._id)}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-1 accent-indigo-500 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span
                        className={`text-sm font-medium truncate ${c.status === "unread" ? "text-white" : "text-gray-300"}`}
                      >
                        {c.name}
                      </span>
                      <Badge
                        label={c.status}
                        variant={statusVariant(c.status)}
                      />
                    </div>
                    <p
                      className={`text-xs truncate ${c.status === "unread" ? "text-gray-300" : "text-gray-500"}`}
                    >
                      {c.subject}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {fmtDate(c.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message detail */}
        {selected && (
          <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl flex flex-col overflow-hidden">
            {/* Detail header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 shrink-0">
              <div>
                <h3 className="font-semibold text-white">{selected.subject}</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  From: {selected.name} · {selected.email}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-1.5 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Message body */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                {selected.message}
              </p>
              <p className="text-xs text-gray-600 mt-4">
                {fmtDate(selected.createdAt)}
              </p>
            </div>

            {/* Detail actions */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-800 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Mark as:</span>
                {(["read", "replied", "archived"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(selected._id, s)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors capitalize
                      ${
                        selected.status === s
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handleDelete(selected._id)}
                disabled={deleting === selected._id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-900/20 transition-colors"
              >
                {deleting === selected._id ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Trash2 size={13} />
                )}
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
