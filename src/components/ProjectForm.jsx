import {
  Plus,
  Trash2,
  FolderKanban,
  Code2,
  FileText,
  Sparkles,
} from "lucide-react";

const ProjectForm = ({ data = [], onChange }) => {
  // Add Project
  const addProject = () => {
    const newProject = {
      name: "",
      type: "",
      description: "",
    };

    onChange([...data, newProject]);
  };

  // Remove Project
  const removeProject = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  // Update Project
  const updateProject = (index, field, value) => {
    const updated = [...data];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    onChange(updated);
  };

  const maxDescriptionLength = 1500;

  // Reusable input styles
  const inputClass =
    "w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200";

  const labelClass = "block mb-2 text-sm font-medium text-gray-700";

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="p-2.5 bg-blue-50 rounded-xl shrink-0">
            <FolderKanban className="size-5 text-blue-600" />
          </div>

          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-gray-900">Projects</h3>

            <p className="text-sm text-gray-500 mt-1">
              Showcase your work, creativity, and technical skills.
            </p>
          </div>
        </div>

        {/* Add Project Button */}
        <button
          type="button"
          onClick={addProject}
          className="inline-flex w-fit min-w-max shrink-0
          whitespace-nowrap items-center justify-center gap-2
          px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold
          text-green-700 bg-green-50 border border-green-100
          rounded-xl hover:bg-green-100 transition-all duration-200"
        >
          <Plus className="size-4 shrink-0" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Empty State */}
      {data.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center
        text-center py-12 px-5 bg-gray-50/70 border
        border-dashed border-gray-300 rounded-2xl"
        >
          <div className="p-4 bg-white rounded-2xl shadow-sm mb-4">
            <FolderKanban className="size-9 text-gray-400" />
          </div>

          <h4 className="text-base font-semibold text-gray-800">
            No projects added yet
          </h4>

          <p className="text-sm text-gray-500 mt-2 max-w-sm">
            Highlight your personal projects, portfolio work, and practical
            experience to make your resume stand out.
          </p>

          <button
            type="button"
            onClick={addProject}
            className="mt-5 inline-flex w-fit whitespace-nowrap
            items-center justify-center gap-2 px-4 py-2.5
            text-sm font-medium text-white bg-blue-600
            rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus className="size-4" />
            Add Your First Project
          </button>
        </div>
      ) : (
        /* Project Cards */
        <div className="space-y-5">
          {data.map((project, index) => (
            <div
              key={index}
              className="p-4 sm:p-6 bg-white border border-gray-200
              rounded-2xl space-y-5 shadow-sm
              hover:shadow-md transition-shadow duration-200"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="flex items-center justify-center
                  size-9 shrink-0 rounded-xl bg-blue-50
                  text-blue-600 font-semibold text-sm"
                  >
                    {index + 1}
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-semibold text-gray-900">
                      Project #{index + 1}
                    </h4>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Add your project details
                    </p>
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => removeProject(index)}
                  aria-label={`Remove project ${index + 1}`}
                  className="p-2 shrink-0 text-gray-400
                  rounded-lg hover:text-red-600
                  hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="border-t border-gray-100" />

              {/* Project Name */}
              <div>
                <label className={labelClass}>Project Name</label>

                <div className="relative">
                  <FolderKanban
                    className="absolute left-3.5 top-1/2
                    -translate-y-1/2 size-4 text-gray-400"
                  />

                  <input
                    type="text"
                    value={project.name || ""}
                    onChange={(e) =>
                      updateProject(index, "name", e.target.value)
                    }
                    placeholder="e.g. Resume Builder Application"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              {/* Project Type */}
              <div>
                <label className={labelClass}>Project Type</label>

                <div className="relative">
                  <Code2
                    className="absolute left-3.5 top-1/2
                    -translate-y-1/2 size-4 text-gray-400"
                  />

                  <input
                    type="text"
                    value={project.type || ""}
                    onChange={(e) =>
                      updateProject(index, "type", e.target.value)
                    }
                    placeholder="e.g. Full Stack Web Application"
                    className={`${inputClass} pl-10`}
                  />
                </div>

                <p className="text-xs text-gray-400 mt-2">
                  Example: Web Development, Mobile App, UI/UX Design.
                </p>
              </div>

              {/* Project Description */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Project Description
                  </label>

                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {(project.description || "").length}/{maxDescriptionLength}
                  </span>
                </div>

                <div className="relative">
                  <FileText
                    className="absolute left-3.5 top-4
                    size-4 text-gray-400"
                  />

                  <textarea
                    rows={5}
                    maxLength={maxDescriptionLength}
                    value={project.description || ""}
                    onChange={(e) =>
                      updateProject(index, "description", e.target.value)
                    }
                    placeholder="Describe what your project does, the technologies you used, the problems you solved, and the key features you implemented..."
                    className={`${inputClass} pl-10 resize-y min-h-32 leading-7`}
                  />
                </div>
              </div>

              {/* Project Tip */}
              <div
                className="flex items-start gap-2.5 p-3.5
              rounded-xl bg-blue-50/70 border border-blue-100"
              >
                <Sparkles
                  className="size-4 mt-0.5
                text-blue-600 shrink-0"
                />

                <div>
                  <p className="text-xs font-semibold text-blue-900">Pro Tip</p>

                  <p className="text-xs text-blue-800/80 leading-relaxed mt-1">
                    Mention the technologies you used, important features, and
                    the impact of your project. Keep your description clear and
                    achievement-focused.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectForm;
