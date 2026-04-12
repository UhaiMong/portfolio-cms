import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Plus,
  Trash2,
  Pencil,
  CheckCircle,
  Upload,
  X,
  Loader2,
  Image,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../src/app/hooks";
import type { Banner, CTAButton } from "../../src/types";
import {
  activateBanner,
  createBanner,
  deleteBanner,
  fetchBanners,
  updateBanner,
} from "../../src/features/banner/bannerSlice";
import LoadingOverlay from "../../src/components/ui/LoadingOverlay";
import MediaPickerModal from "../media/Mediapickermodal";

const inputCls =
  "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-indigo-500 transition-colors";
const labelCls = "block text-xs font-medium text-gray-400 mb-1.5";

const emptyForm = {
  greeting: "Hi, I'm",
  name: "",
  bannerURL: "",
  description: "",
};

export default function BannerPage() {
  const dispatch = useAppDispatch();
  const { banners, loading } = useAppSelector((s) => s.banner);

  const [editing, setEditing] = useState<Banner | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [acting, setActing] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [typingTexts, setTypingTexts] = useState<string[]>([""]);
  const [ctaButtons, setCtaButtons] = useState<CTAButton[]>([]);

  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setTypingTexts([""]);
    setCtaButtons([]);
    setShowForm(true);
  };

  const openEdit = (b: Banner) => {
    setEditing(b);
    setForm({
      greeting: b.greeting,
      name: b.name,
      bannerURL: b.bannerURL,
      description: b.description,
    });
    setTypingTexts(b.typingTexts?.length ? b.typingTexts : [""]);
    setCtaButtons(b.ctaButtons || []);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);

    const payload: Partial<Banner> = {
      greeting: form.greeting,
      name: form.name,
      bannerURL: form.bannerURL,
      description: form.description,
      typingTexts: typingTexts.filter((t) => t.trim()),
      ctaButtons,
    };

    const res = editing
      ? await dispatch(updateBanner({ id: editing._id, data: payload }))
      : await dispatch(createBanner(payload));

    if (
      createBanner.fulfilled.match(res) ||
      updateBanner.fulfilled.match(res)
    ) {
      toast.success(editing ? "Banner updated!" : "Banner created!");
      setShowForm(false);
    } else {
      toast.error((res.payload as string) || "Failed to save banner");
    }
    setSaving(false);
  };

  const handleActivate = async (id: string) => {
    setActing(id);
    const res = await dispatch(activateBanner(id));
    if (activateBanner.fulfilled.match(res)) toast.success("Banner activated!");
    else toast.error("Failed to activate");
    setActing(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    setActing(id);
    const res = await dispatch(deleteBanner(id));
    if (deleteBanner.fulfilled.match(res)) {
      toast.success("Deleted");
      if (editing?._id === id) setShowForm(false);
    } else {
      toast.error("Failed to delete");
    }
    setActing(null);
  };

  const addTypingText = () => setTypingTexts((p) => [...p, ""]);
  const removeTypingText = (i: number) =>
    setTypingTexts((p) => p.filter((_, idx) => idx !== i));
  const updateTypingText = (i: number, val: string) =>
    setTypingTexts((p) => p.map((t, idx) => (idx === i ? val : t)));

  const addCTA = () =>
    setCtaButtons((p) => [...p, { label: "", url: "", variant: "primary" }]);
  const removeCTA = (i: number) =>
    setCtaButtons((p) => p.filter((_, idx) => idx !== i));
  const updateCTA = (i: number, key: keyof CTAButton, val: string) =>
    setCtaButtons((p) =>
      p.map((b, idx) => (idx === i ? { ...b, [key]: val } : b)),
    );

  const handleMediaSelect = (url: string) => {
    setForm((p) => ({ ...p, bannerURL: url }));
    setPickerOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Banner</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Manage your portfolio hero section
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> New Banner
        </button>
      </div>

      <div className="flex gap-6">
        {/* Banner list */}
        <div className={`space-y-3 ${showForm ? "w-2/5" : "w-full"}`}>
          {loading ? (
            <LoadingOverlay title="Banner is loading..." />
          ) : banners.length === 0 ? (
            <div className="text-center py-16 text-gray-500 bg-gray-900 border border-gray-800 rounded-xl">
              <Image size={40} className="mx-auto mb-3 opacity-30" />
              <p>No banners yet. Create your first one.</p>
            </div>
          ) : (
            banners.map((b) => (
              <div
                key={b._id}
                className={`bg-gray-900 border rounded-xl overflow-hidden transition-all
                  ${b.isActive ? "border-indigo-500/50" : "border-gray-800"}
                  ${editing?._id === b._id ? "ring-2 ring-indigo-500" : ""}`}
              >
                <div className="h-28 bg-gray-800 relative overflow-hidden">
                  {b.bannerURL ? (
                    <img
                      loading="lazy"
                      src={b.bannerURL}
                      alt={b.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-600 text-sm">
                      No image
                    </div>
                  )}
                  {b.isActive && (
                    <span className="absolute top-2 left-2 flex items-center gap-1 bg-indigo-600/90 text-white text-xs px-2 py-0.5 rounded-full">
                      <CheckCircle size={10} /> Active
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <p className="text-xs text-gray-500">{b.greeting}</p>
                  <h3 className="font-semibold text-white mt-0.5">{b.name}</h3>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {b.typingTexts?.slice(0, 3).map((t, i) => (
                      <span
                        key={i}
                        className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
                    <div className="flex items-center gap-2">
                      {!b.isActive && (
                        <button
                          onClick={() => handleActivate(b._id)}
                          disabled={acting === b._id}
                          className="px-2.5 py-1 bg-indigo-900/40 text-indigo-300 hover:bg-indigo-900/60 rounded text-xs font-medium transition-colors"
                        >
                          {acting === b._id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            "Set Active"
                          )}
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(b)}
                        className="p-1.5 rounded hover:bg-gray-800 text-gray-500 hover:text-indigo-400 transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(b._id)}
                        disabled={acting === b._id}
                        className="p-1.5 rounded hover:bg-gray-800 text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Form panel */}
        {showForm && (
          <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 shrink-0">
              <h2 className="font-semibold text-white">
                {editing ? "Edit Banner" : "New Banner"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
              {/* Image picker */}
              <div>
                <label className={labelCls}>Hero Image</label>
                <div
                  onClick={() => setPickerOpen(true)}
                  className="relative border-2 border-dashed border-gray-700 hover:border-indigo-500 rounded-xl cursor-pointer transition-colors h-36 overflow-hidden"
                >
                  {form.bannerURL ? (
                    <img
                      loading="lazy"
                      src={form.bannerURL}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-500">
                      <Upload size={22} />
                      <span className="text-sm">Click to pick image</span>
                    </div>
                  )}
                  {form.bannerURL && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-medium flex items-center gap-1.5">
                        <Upload size={14} /> Change image
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Greeting & Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Greeting</label>
                  <input
                    value={form.greeting}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, greeting: e.target.value }))
                    }
                    placeholder="Hi, I'm"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="Uhai Mong"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className={labelCls}>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  rows={3}
                  placeholder="Short intro about yourself..."
                  className={inputCls + " resize-none"}
                />
              </div>

              {/* Typing texts */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={labelCls + " mb-0"}>
                    Typing Animation Texts
                  </label>
                  <button
                    onClick={addTypingText}
                    className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <Plus size={12} /> Add
                  </button>
                </div>
                <div className="space-y-2">
                  {typingTexts.map((t, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={t}
                        onChange={(e) => updateTypingText(i, e.target.value)}
                        placeholder="e.g. Full Stack Developer"
                        className={inputCls + " flex-1"}
                      />
                      {typingTexts.length > 1 && (
                        <button
                          onClick={() => removeTypingText(i)}
                          className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={labelCls + " mb-0"}>CTA Buttons</label>
                  <button
                    onClick={addCTA}
                    className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <Plus size={12} /> Add Button
                  </button>
                </div>
                <div className="space-y-2">
                  {ctaButtons.map((btn, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-12 gap-2 bg-gray-800/50 p-3 rounded-lg"
                    >
                      <div className="col-span-3">
                        <label className={labelCls}>Label</label>
                        <input
                          value={btn.label}
                          onChange={(e) =>
                            updateCTA(i, "label", e.target.value)
                          }
                          placeholder="Hire Me"
                          className={inputCls}
                        />
                      </div>
                      <div className="col-span-5">
                        <label className={labelCls}>URL</label>
                        <input
                          value={btn.url}
                          onChange={(e) => updateCTA(i, "url", e.target.value)}
                          placeholder="/contact"
                          className={inputCls}
                        />
                      </div>
                      <div className="col-span-3">
                        <label className={labelCls}>Variant</label>
                        <select
                          value={btn.variant}
                          onChange={(e) =>
                            updateCTA(i, "variant", e.target.value)
                          }
                          className={inputCls}
                        >
                          <option value="primary">Primary</option>
                          <option value="secondary">Secondary</option>
                          <option value="outline">Outline</option>
                        </select>
                      </div>
                      <div className="col-span-1 flex items-end justify-center pb-0.5">
                        <button
                          onClick={() => removeCTA(i)}
                          className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form footer */}
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-800 shrink-0">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
              >
                {saving ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Saving...
                  </>
                ) : editing ? (
                  "Update Banner"
                ) : (
                  "Create Banner"
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <MediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        allowedTypes={["image", "video"]}
        onSelect={handleMediaSelect}
      />
    </div>
  );
}
