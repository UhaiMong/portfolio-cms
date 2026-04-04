import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  User,
  Briefcase,
  GraduationCap,
  Code2,
  Link2,
  Save,
  Plus,
  Trash2,
  Loader2,
  Upload,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../src/app/hooks";
import type { Education, Experience, Skill, SocialLink } from "../../src/types";
import {
  createBio,
  fetchBio,
  updateBio,
} from "../../src/features/bio/bioSlice";
import LoadingOverlay from "../../src/components/ui/LoadingOverlay";
import MediaPickerModal from "../media/Mediapickermodal";

type Tab = "basic" | "skills" | "experience" | "education" | "social";

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: "basic", label: "Basic Info", icon: User },
  { id: "skills", label: "Skills", icon: Code2 },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "social", label: "Social Links", icon: Link2 },
];

const inputCls =
  "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-indigo-500 transition-colors";
const labelCls = "block text-xs font-medium text-gray-400 mb-1.5";

type PickerMode = "avatar" | null;

export default function BioPage() {
  const dispatch = useAppDispatch();
  const { bio, loading } = useAppSelector((s) => s.bio);
  const [tab, setTab] = useState<Tab>("basic");
  const [saving, setSaving] = useState(false);
  const [newAvatar, setNewAvatar] = useState<string>("");
  const [pickerMode, setPickerMode] = useState<PickerMode>(null);
  const openAvatarPicker = () => setPickerMode("avatar");
  const closePicker = () => setPickerMode(null);

  // Basic fields
  const [basic, setBasic] = useState({
    avatar: "",
    name: "",
    title: "",
    subtitle: "",
    about: "",
    email: "",
    phone: "",
    location: "",
    availability: "available" as "available" | "busy" | "not-available",
  });

  // Arrays
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [social, setSocial] = useState<SocialLink[]>([]);

  useEffect(() => {
    dispatch(fetchBio());
  }, [dispatch]);

  useEffect(() => {
    if (!bio) return;
    setBasic({
      avatar: bio.avatar,
      name: bio.name,
      title: bio.title,
      subtitle: bio.subtitle,
      about: bio.about,
      email: bio.email,
      phone: bio.phone || "",
      location: bio.location,
      availability: bio.availability,
    });
    setSkills(bio.skills || []);
    setExperience(bio.experience || []);
    setEducation(bio.education || []);
    setSocial(bio.socialLinks || []);
  }, [bio]);

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...basic,
      avatar: newAvatar,
      skills,
      experience,
      education,
      socialLinks: social,
    };
    const res = bio
      ? await dispatch(updateBio({ id: bio._id, data: payload }))
      : await dispatch(createBio(payload));

    if (updateBio.fulfilled.match(res) || createBio.fulfilled.match(res))
      toast.success("Bio saved successfully!");
    else toast.error("Failed to save bio");
    setSaving(false);
  };
  console.log("new avatar: ", newAvatar);

  // Skills helpers
  const addSkill = () =>
    setSkills((p) => [...p, { name: "", level: 80, category: "Frontend" }]);
  // Remove skill
  const removeSkill = (i: number) =>
    setSkills((p) => p.filter((_, idx) => idx !== i));
  const updateSkill = (i: number, key: keyof Skill, val: any) =>
    setSkills((p) => p.map((s, idx) => (idx === i ? { ...s, [key]: val } : s)));

  //  Experience helpers
  const addExp = () =>
    setExperience((p) => [
      ...p,
      {
        company: "",
        position: "",
        duration: "",
        description: "",
        current: false,
      },
    ]);
  // Remove experience
  const removeExp = (i: number) =>
    setExperience((p) => p.filter((_, idx) => idx !== i));
  const updateExp = (i: number, key: keyof Experience, val: any) =>
    setExperience((p) =>
      p.map((e, idx) => (idx === i ? { ...e, [key]: val } : e)),
    );

  // Education helpers
  const addEdu = () =>
    setEducation((p) => [
      ...p,
      { institution: "", degree: "", field: "", duration: "", grade: "" },
    ]);
  // Remove education
  const removeEdu = (i: number) =>
    setEducation((p) => p.filter((_, idx) => idx !== i));
  const updateEdu = (i: number, key: keyof Education, val: any) =>
    setEducation((p) =>
      p.map((e, idx) => (idx === i ? { ...e, [key]: val } : e)),
    );

  // Social helpers
  const addSocial = () =>
    setSocial((p) => [...p, { platform: "", url: "", icon: "" }]);
  const removeSocial = (i: number) =>
    setSocial((p) => p.filter((_, idx) => idx !== i));
  const updateSocial = (i: number, key: keyof SocialLink, val: string) =>
    setSocial((p) => p.map((s, idx) => (idx === i ? { ...s, [key]: val } : s)));

  if (loading) return <LoadingOverlay title="Bio is loading..." />;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Bio</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Manage your personal information
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
        >
          {saving ? (
            <>
              <Loader2 size={15} className="animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save size={15} /> Save Changes
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1.5">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-1 justify-center
              ${tab === id ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}
          >
            <Icon size={15} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        {/*  Basic Info */}
        {tab === "basic" && (
          <div className="space-y-4">
            {/* Image: Avatar */}
            <div className="flex items-center justify-start gap-4">
              <div className="">
                <label className={labelCls}>Avatar</label>
                <div
                  onClick={openAvatarPicker}
                  className="relative border-2 border-dashed border-gray-700 hover:border-indigo-500 rounded-xl cursor-pointer transition-colors w-32 h-32 overflow-hidden"
                >
                  {bio?.avatar ? (
                    <img
                      src={newAvatar ? newAvatar : bio.avatar}
                      alt={bio?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-500">
                      <Upload size={22} />
                      <span className="text-sm">Upload Avatar</span>
                    </div>
                  )}
                </div>
              </div>
              {/* Name */}
              <div className="flex-1">
                <label className={labelCls}>Full Name</label>
                <input
                  value={basic.name}
                  onChange={(e) =>
                    setBasic((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Your Name"
                  className={inputCls}
                />
              </div>
            </div>
            {/* Avatar Image Input+Preview end */}

            {/* title */}
            <div>
              <label className={labelCls}>Professional Title</label>
              <input
                value={basic.title}
                onChange={(e) =>
                  setBasic((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Full Stack Developer"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Subtitle / Tagline</label>
              <input
                value={basic.subtitle}
                onChange={(e) =>
                  setBasic((p) => ({ ...p, subtitle: e.target.value }))
                }
                placeholder="Building modern web experiences"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>About Me</label>
              <textarea
                value={basic.about}
                onChange={(e) =>
                  setBasic((p) => ({ ...p, about: e.target.value }))
                }
                rows={5}
                placeholder="Write a short bio about yourself..."
                className={inputCls + " resize-none"}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Email</label>
                <input
                  value={basic.email}
                  onChange={(e) =>
                    setBasic((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="you@example.com"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Phone</label>
                <input
                  value={basic.phone}
                  onChange={(e) =>
                    setBasic((p) => ({ ...p, phone: e.target.value }))
                  }
                  placeholder="+1 234 567 890"
                  className={inputCls}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Location</label>
                <input
                  value={basic.location}
                  onChange={(e) =>
                    setBasic((p) => ({ ...p, location: e.target.value }))
                  }
                  placeholder="City, Country"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Availability</label>
                <select
                  value={basic.availability}
                  onChange={(e) =>
                    setBasic((p) => ({
                      ...p,
                      availability: e.target.value as any,
                    }))
                  }
                  className={inputCls}
                >
                  <option value="available">Available for work</option>
                  <option value="busy">Busy</option>
                  <option value="not-available">Not Available</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Skills  */}
        {tab === "skills" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-400">
                {skills.length} skills added
              </p>
              <button
                onClick={addSkill}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg transition-colors"
              >
                <Plus size={13} /> Add Skill
              </button>
            </div>
            {skills.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No skills added yet. Click "Add Skill" to start.
              </p>
            ) : (
              skills.map((s, i) => (
                <div
                  key={i}
                  className="grid grid-cols-12 gap-3 items-center bg-gray-800/50 rounded-lg p-3"
                >
                  <div className="col-span-4">
                    <label className={labelCls}>Skill Name</label>
                    <input
                      value={s.name}
                      onChange={(e) => updateSkill(i, "name", e.target.value)}
                      placeholder="React"
                      className={inputCls}
                    />
                  </div>
                  <div className="col-span-3">
                    <label className={labelCls}>Category</label>
                    <input
                      value={s.category}
                      onChange={(e) =>
                        updateSkill(i, "category", e.target.value)
                      }
                      placeholder="Frontend"
                      className={inputCls}
                    />
                  </div>
                  <div className="col-span-4">
                    <label className={labelCls}>Level: {s.level}%</label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={s.level}
                      onChange={(e) =>
                        updateSkill(i, "level", Number(e.target.value))
                      }
                      className="w-full accent-indigo-500 mt-2"
                    />
                  </div>
                  <div className="col-span-1 flex justify-end pt-4">
                    <button
                      onClick={() => removeSkill(i)}
                      className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Experience */}
        {tab === "experience" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-400">
                {experience.length} positions added
              </p>
              <button
                onClick={addExp}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg transition-colors"
              >
                <Plus size={13} /> Add Position
              </button>
            </div>
            {experience.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No experience added yet.
              </p>
            ) : (
              experience.map((e, i) => (
                <div
                  key={i}
                  className="bg-gray-800/50 rounded-xl p-4 space-y-3 border border-gray-700/50"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-indigo-400 font-medium">
                      Position {i + 1}
                    </span>
                    <button
                      onClick={() => removeExp(i)}
                      className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Company</label>
                      <input
                        value={e.company}
                        onChange={(ev) =>
                          updateExp(i, "company", ev.target.value)
                        }
                        placeholder="Company Name"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Position</label>
                      <input
                        value={e.position}
                        onChange={(ev) =>
                          updateExp(i, "position", ev.target.value)
                        }
                        placeholder="Senior Developer"
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Duration</label>
                      <input
                        value={e.duration}
                        onChange={(ev) =>
                          updateExp(i, "duration", ev.target.value)
                        }
                        placeholder="Jan 2022 – Present"
                        className={inputCls}
                      />
                    </div>
                    <div className="flex items-end pb-1">
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={e.current}
                            onChange={(ev) =>
                              updateExp(i, "current", ev.target.checked)
                            }
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-700 peer-checked:bg-indigo-600 rounded-full transition-colors" />
                          <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
                        </div>
                        <span className="text-sm text-gray-300">
                          Current job
                        </span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Description</label>
                    <textarea
                      value={e.description}
                      onChange={(ev) =>
                        updateExp(i, "description", ev.target.value)
                      }
                      rows={2}
                      placeholder="What did you do here?"
                      className={inputCls + " resize-none"}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Education */}
        {tab === "education" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-400">
                {education.length} entries added
              </p>
              <button
                onClick={addEdu}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg transition-colors"
              >
                <Plus size={13} /> Add Education
              </button>
            </div>
            {education.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No education entries added yet.
              </p>
            ) : (
              education.map((e, i) => (
                <div
                  key={i}
                  className="bg-gray-800/50 rounded-xl p-4 space-y-3 border border-gray-700/50"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-indigo-400 font-medium">
                      Education {i + 1}
                    </span>
                    <button
                      onClick={() => removeEdu(i)}
                      className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Institution</label>
                      <input
                        value={e.institution}
                        onChange={(ev) =>
                          updateEdu(i, "institution", ev.target.value)
                        }
                        placeholder="University Name"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Degree</label>
                      <input
                        value={e.degree}
                        onChange={(ev) =>
                          updateEdu(i, "degree", ev.target.value)
                        }
                        placeholder="Bachelor of Science"
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className={labelCls}>Field of Study</label>
                      <input
                        value={e.field}
                        onChange={(ev) =>
                          updateEdu(i, "field", ev.target.value)
                        }
                        placeholder="Computer Science"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Grade / GPA</label>
                      <input
                        value={e.grade || ""}
                        onChange={(ev) =>
                          updateEdu(i, "grade", ev.target.value)
                        }
                        placeholder="3.8 / 4.0"
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Duration</label>
                    <input
                      value={e.duration}
                      onChange={(ev) =>
                        updateEdu(i, "duration", ev.target.value)
                      }
                      placeholder="2018 – 2022"
                      className={inputCls}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Social Links */}
        {tab === "social" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-400">
                {social.length} links added
              </p>
              <button
                onClick={addSocial}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg transition-colors"
              >
                <Plus size={13} /> Add Link
              </button>
            </div>
            {social.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No social links added yet.
              </p>
            ) : (
              social.map((s, i) => (
                <div
                  key={i}
                  className="grid grid-cols-12 gap-3 items-end bg-gray-800/50 rounded-lg p-3"
                >
                  <div className="col-span-3">
                    <label className={labelCls}>Platform</label>
                    <input
                      value={s.platform}
                      onChange={(e) =>
                        updateSocial(i, "platform", e.target.value)
                      }
                      placeholder="GitHub"
                      className={inputCls}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className={labelCls}>Icon</label>
                    <input
                      value={s.icon}
                      onChange={(e) => updateSocial(i, "icon", e.target.value)}
                      placeholder="github"
                      className={inputCls}
                    />
                  </div>
                  <div className="col-span-6">
                    <label className={labelCls}>URL</label>
                    <input
                      value={s.url}
                      onChange={(e) => updateSocial(i, "url", e.target.value)}
                      placeholder="https://github.com/username"
                      className={inputCls}
                    />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button
                      onClick={() => removeSocial(i)}
                      className="p-1.5 text-gray-500 hover:text-red-400 transition-colors mb-0.5"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {/* single select */}
      <MediaPickerModal
        open={pickerMode === "avatar"}
        onClose={closePicker}
        allowedTypes={["image"]}
        onSelect={(url) => setNewAvatar(url)}
      />
    </div>
  );
}
