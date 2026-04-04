import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { X, Upload, Plus, Loader2, ImagePlus, Trash2 } from "lucide-react";
import { useAppDispatch } from "../../src/app/hooks";
import {
  createProject,
  updateProject,
} from "../../src/features/projects/projectSlice";
import type { Project } from "../../src/types";
import MediaPickerModal from "../media/Mediapickermodal";
import RichTextEditor from "../../src/components/common/RichTextEditor";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  longDescription: z.string(),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["completed", "in-progress", "archived"]),
  featured: z.boolean(),
  liveUrl: z.url("Must be a valid URL").or(z.literal("")).optional(),
  githubUrl: z.url("Must be a valid URL").or(z.literal("")).optional(),
  order: z.number().min(0),
});
type ProjectFormData = z.infer<typeof schema>;

interface Props {
  project: Project | null;
  onClose: () => void;
}

const inputCls = (err?: unknown) =>
  `w-full bg-gray-800 border rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors
  ${err ? "border-red-500 focus:border-red-400" : "border-gray-700 focus:border-indigo-500"}`;

// Which picker is open: "thumbnail" | "images" | null
type PickerMode = "thumbnail" | "images" | null;

export default function ProjectModal({ project, onClose }: Props) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  // Track which section triggered the picker
  const [pickerMode, setPickerMode] = useState<PickerMode>(null);

  const openThumbnailPicker = () => setPickerMode("thumbnail");
  const openImagesPicker = () => setPickerMode("images");
  const closePicker = () => setPickerMode(null);

  // Tech Stack state
  const [techInput, setTechInput] = useState("");
  const [techStack, setTechStack] = useState<string[]>(
    project?.techStack ?? [],
  );

  // Thumbnail state
  const [thumbnail, setThumbnail] = useState<string>(project?.thumbnail ?? "");

  //  Project images state
  const [images, setImages] = useState<string[]>(project?.images ?? []);

  // React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: project?.title ?? "",
      description: project?.description ?? "",
      longDescription: project?.longDescription ?? "",
      category: project?.category ?? "",
      status: project?.status ?? "completed",
      featured: project?.featured ?? false,
      liveUrl: project?.liveUrl ?? "",
      githubUrl: project?.githubUrl ?? "",
      order: project?.order ?? 0,
    },
  });
  const contentValue = watch("longDescription");

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Handlers
  const addTech = () => {
    const t = techInput.trim();
    if (t && !techStack.includes(t)) setTechStack((prev) => [...prev, t]);
    setTechInput("");
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const fd = new FormData();
  // Submit
  const onSubmit = async (data: ProjectFormData) => {
    setLoading(true);

    fd.append("title", data.title);
    fd.append("description", data.description);
    fd.append("category", data.category);
    fd.append("status", data.status);
    fd.append("featured", String(data.featured));
    fd.append("order", String(data.order));
    if (data.longDescription)
      fd.append("longDescription", data.longDescription);
    if (data.liveUrl) fd.append("liveUrl", data.liveUrl);
    if (data.githubUrl) fd.append("githubUrl", data.githubUrl);
    if (thumbnail) fd.append("thumbnail", thumbnail);
    techStack.forEach((t) => fd.append("techStack[]", t));
    images.forEach((url) => fd.append("images[]", url));

    const res = project
      ? await dispatch(updateProject({ id: project._id, data: fd }))
      : await dispatch(createProject(fd));

    if (
      createProject.fulfilled.match(res) ||
      updateProject.fulfilled.match(res)
    ) {
      toast.success(project ? "Project updated!" : "Project created!");
      onClose();
    } else {
      toast.error(
        (res.payload as string) || "Something went wrong. Please try again.",
      );
    }

    setLoading(false);
  };

  // Render
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 shrink-0">
            <h2 className="text-lg font-semibold text-white">
              {project ? "Edit Project" : "New Project"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1 px-6 py-5">
            <form
              id="project-form"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >
              {/* Thumbnail */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Thumbnail <span className="text-red-400">*</span>
                </label>
                <div
                  onClick={openThumbnailPicker}
                  className="relative border-2 border-dashed border-gray-700 hover:border-indigo-500 rounded-xl cursor-pointer transition-colors overflow-hidden h-44"
                >
                  {thumbnail ? (
                    <>
                      <img
                        src={thumbnail}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-2 text-white text-sm font-medium">
                          <Upload size={16} />
                          Change Thumbnail
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-500">
                      <Upload size={28} />
                      <span className="text-sm">Click to select thumbnail</span>
                      <span className="text-xs text-gray-600">
                        PNG, JPG, WEBP up to 10MB
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Project Images */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Additional Images
                  <span className="text-gray-500 font-normal ml-1.5">
                    ({images.length} added)
                  </span>
                </label>

                {images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative group aspect-video rounded-lg overflow-hidden border border-gray-700"
                      >
                        <img
                          src={img}
                          alt={`image-${idx}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <Trash2 size={16} className="text-red-400" />
                        </button>
                      </div>
                    ))}

                    {/* Add more slot */}
                    <div
                      onClick={openImagesPicker}
                      className="aspect-video rounded-lg border-2 border-dashed border-gray-700 hover:border-indigo-500 flex flex-col items-center justify-center cursor-pointer transition-colors text-gray-600 hover:text-indigo-400"
                    >
                      <ImagePlus size={18} />
                      <span className="text-[10px] mt-1">Add</span>
                    </div>
                  </div>
                )}

                {images.length === 0 && (
                  <button
                    type="button"
                    onClick={openImagesPicker}
                    className="w-full flex items-center justify-center gap-2 border border-dashed border-gray-700 hover:border-indigo-500 rounded-xl py-3 text-sm text-gray-500 hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    <ImagePlus size={16} />
                    Add project images (optional)
                  </button>
                )}
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    {...register("title")}
                    placeholder="My Awesome Project"
                    className={inputCls(errors.title)}
                  />
                  {errors.title && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <input
                    {...register("category")}
                    placeholder="Web App, Mobile, API..."
                    className={inputCls(errors.category)}
                  />
                  {errors.category && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.category.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Short Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  {...register("description")}
                  rows={2}
                  placeholder="Brief one-line description shown on cards..."
                  className={inputCls(errors.description) + " resize-none"}
                />
                {errors.description && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Long Description */}
              <RichTextEditor
                value={contentValue}
                onChange={(html) =>
                  setValue("longDescription", html, { shouldValidate: true })
                }
                error={!!errors.longDescription}
              />
              {errors.longDescription && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.longDescription.message}
                </p>
              )}
              {/* <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Long Description
                </label>
                <textarea
                  {...register("longDescription")}
                  rows={4}
                  placeholder="Detailed project overview, challenges, solutions..."
                  className={inputCls() + " resize-none"}
                />
              </div> */}

              {/* Tech Stack */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Tech Stack
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTech();
                      }
                    }}
                    placeholder="e.g. React, TypeScript, Node.js..."
                    className={inputCls() + " flex-1"}
                  />
                  <button
                    type="button"
                    onClick={addTech}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                {techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {techStack.map((t) => (
                      <span
                        key={t}
                        className="flex items-center gap-1.5 bg-gray-800 border border-gray-700 text-gray-300 text-xs px-2.5 py-1 rounded-full"
                      >
                        {t}
                        <button
                          type="button"
                          onClick={() =>
                            setTechStack((prev) => prev.filter((x) => x !== t))
                          }
                          className="text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Status · Order · Featured */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Status
                  </label>
                  <select
                    {...register("status")}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Order
                  </label>
                  <input
                    {...register("order", { valueAsNumber: true })}
                    type="number"
                    min={0}
                    placeholder="0"
                    className={inputCls(errors.order)}
                  />
                  {errors.order && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.order.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col justify-end pb-1">
                  <p className="text-sm font-medium text-gray-300 mb-2">
                    Featured
                  </p>
                  <label className="flex items-center gap-2.5 cursor-pointer select-none w-fit">
                    <input
                      {...register("featured")}
                      type="checkbox"
                      className="sr-only peer"
                      id="featured-toggle"
                    />
                    <div
                      className="relative w-10 h-5 rounded-full transition-colors duration-200 bg-gray-700 peer-checked:bg-indigo-600"
                      onClick={() => {
                        const el = document.getElementById(
                          "featured-toggle",
                        ) as HTMLInputElement | null;
                        if (el) el.click();
                      }}
                    />
                    <span className="text-sm text-gray-400 peer-checked:text-gray-200 transition-colors">
                      Featured
                    </span>
                  </label>
                </div>
              </div>

              {/* URLs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Live URL
                  </label>
                  <input
                    {...register("liveUrl")}
                    placeholder="https://myproject.com"
                    className={inputCls(errors.liveUrl)}
                  />
                  {errors.liveUrl && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.liveUrl.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    GitHub URL
                  </label>
                  <input
                    {...register("githubUrl")}
                    placeholder="https://github.com/user/repo"
                    className={inputCls(errors.githubUrl)}
                  />
                  {errors.githubUrl && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.githubUrl.message}
                    </p>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-800 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              form="project-form"
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500
              disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Saving...
                </>
              ) : project ? (
                "Update Project"
              ) : (
                "Create Project"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Thumbnail picker — single select */}
      <MediaPickerModal
        open={pickerMode === "thumbnail"}
        onClose={closePicker}
        allowedTypes={["image"]}
        onSelect={(url) => setThumbnail(url)}
      />

      {/* Additional images picker — multi select  */}
      <MediaPickerModal
        open={pickerMode === "images"}
        onClose={closePicker}
        allowedTypes={["image"]}
        multi
        onSelectMultiple={(urls) =>
          setImages((prev) => [
            ...prev,
            ...urls.filter((u) => !prev.includes(u)),
          ])
        }
      />
    </>
  );
}
