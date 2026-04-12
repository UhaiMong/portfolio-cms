import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { X, Upload, Plus, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../src/app/hooks";
import { createBlog, updateBlog } from "../../src/features/blog/blogSlice";
import RichTextEditor from "../../src/components/common/RichTextEditor";
import LoadingOverlay from "../../src/components/ui/LoadingOverlay";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z
    .string()
    .min(1, "Excerpt is required")
    .max(300, "Max 300 characters"),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["published", "draft"]),
  featured: z.boolean(),
});
type FormData = z.infer<typeof schema>;

interface Props {
  onClose: () => void;
}

export default function BlogModal({ onClose }: Props) {
  const dispatch = useAppDispatch();
  const { selectedBlog, loading } = useAppSelector((s) => s.blog);

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbPrev, setThumbPrev] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const isEditMode = !!selectedBlog;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      category: "",
      status: "draft",
      featured: false,
    },
  });

  const contentValue = watch("content");

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (selectedBlog) {
      reset({
        title: selectedBlog.title,
        excerpt: selectedBlog.excerpt,
        content: selectedBlog.content,
        category: selectedBlog.category,
        status: selectedBlog.status,
        featured: selectedBlog.featured,
      });
      setTags(selectedBlog.tags || []);
      setThumbPrev(selectedBlog.thumbnail || "");
    }
  }, [selectedBlog, reset]);

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput("");
  };

  const onThumbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setThumbnail(f);
    setThumbPrev(URL.createObjectURL(f));
  };

  const onSubmit = async (data: FormData) => {
    if (!isEditMode && !thumbnail) {
      toast.error("Please upload a thumbnail");
      return;
    }

    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => fd.append(k, String(v)));
    fd.append("tags", JSON.stringify(tags));
    if (thumbnail) fd.append("thumbnail", thumbnail);

    const res = isEditMode
      ? await dispatch(updateBlog({ id: selectedBlog._id, data: fd }))
      : await dispatch(createBlog(fd));

    if (createBlog.fulfilled.match(res) || updateBlog.fulfilled.match(res)) {
      toast.success(isEditMode ? "Blog updated!" : "Blog created!");
      onClose();
    } else {
      toast.error("Something went wrong");
    }
  };

  const inp = (err?: any) =>
    `w-full bg-gray-800 border rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors ${
      err ? "border-red-500" : "border-gray-700 focus:border-indigo-500"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 shrink-0">
          <h2 className="text-lg font-semibold text-white">
            {isEditMode ? "Edit Post" : "New Blog Post"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Loading overlay */}
        {loading ? (
          <LoadingOverlay title="Blog Modal Loading..." />
        ) : (
          <div className="overflow-y-auto flex-1 px-6 py-5">
            <form
              id="blog-form"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >
              {/* Thumbnail */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Thumbnail {!isEditMode && "*"}
                </label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="relative border-2 border-dashed border-gray-700 hover:border-indigo-500 rounded-xl cursor-pointer transition-colors h-36 overflow-hidden"
                >
                  {thumbPrev ? (
                    <img
                      loading="lazy"
                      src={thumbPrev}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-500">
                      <Upload size={22} />
                      <span className="text-sm">Click to upload thumbnail</span>
                    </div>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onThumbChange}
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Title *
                </label>
                <input
                  {...register("title")}
                  placeholder="Post title"
                  className={inp(errors.title)}
                />
                {errors.title && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Excerpt *
                </label>
                <textarea
                  {...register("excerpt")}
                  rows={2}
                  placeholder="Short summary (max 300 chars)..."
                  className={inp(errors.excerpt) + " resize-none"}
                />
                {errors.excerpt && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.excerpt.message}
                  </p>
                )}
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Content *
                </label>
                <RichTextEditor
                  value={contentValue}
                  onChange={(html) =>
                    setValue("content", html, { shouldValidate: true })
                  }
                  error={!!errors.content}
                />
                {errors.content && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.content.message}
                  </p>
                )}
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Category *
                  </label>
                  <input
                    {...register("category")}
                    placeholder="e.g. Tutorial"
                    className={inp(errors.category)}
                  />
                  {errors.category && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.category.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Status
                  </label>
                  <select
                    {...register("status")}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Add tag and press Enter..."
                    className={inp() + " flex-1"}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="flex items-center gap-1.5 bg-gray-800 border border-gray-700 text-gray-300 text-xs px-2.5 py-1 rounded-full"
                    >
                      #{t}
                      <button
                        type="button"
                        onClick={() =>
                          setTags((prev) => prev.filter((x) => x !== t))
                        }
                        className="text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Featured */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    {...register("featured")}
                    type="checkbox"
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-700 peer-checked:bg-indigo-600 rounded-full transition-colors" />
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
                </div>
                <span className="text-sm text-gray-300">Mark as featured</span>
              </label>
            </form>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-800 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            form="blog-form"
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Saving...
              </>
            ) : isEditMode ? (
              "Update Post"
            ) : (
              "Create Post"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
