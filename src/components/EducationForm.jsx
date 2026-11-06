import {
  GraduationCap,
  Plus,
  Trash2,
  CalendarDays,
  School,
  BookOpen,
} from "lucide-react";

const EducationForm = ({ data = [], onChange }) => {
  // Add Education
  const addEducation = () => {
    const newEducation = {
      institution: "",
      degree: "",
      field: "",
      graduation_date: "",
      gpa: "",
    };

    onChange([...data, newEducation]);
  };

  // Remove Education
  const removeEducation = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  // Update Education
  const updateEducation = (index, field, value) => {
    const updated = [...data];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    onChange(updated);
  };

  // Reusable Input Style
  const inputClass =
    "w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200";

  const labelClass = "block mb-2 text-sm font-medium text-gray-700";

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="p-2.5 bg-blue-50 rounded-xl shrink-0">
            <GraduationCap className="size-5 text-blue-600" />
          </div>

          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-gray-900">Education</h3>

            <p className="text-sm text-gray-500 mt-1">
              Showcase your academic background and qualifications.
            </p>
          </div>
        </div>

        {/* Add Education Button */}
        <button
          type="button"
          onClick={addEducation}
          className="inline-flex w-fit min-w-max shrink-0
          whitespace-nowrap items-center justify-center gap-2
          px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold
          text-green-700 bg-green-50 border border-green-100
          rounded-xl hover:bg-green-100 transition-all duration-200"
        >
          <Plus className="size-4 shrink-0" />
          <span>Add Education</span>
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
            <GraduationCap className="size-9 text-gray-400" />
          </div>

          <h4 className="text-base font-semibold text-gray-800">
            No education added yet
          </h4>

          <p className="text-sm text-gray-500 mt-2 max-w-sm">
            Add your educational qualifications to highlight your academic
            achievements and background.
          </p>

          <button
            type="button"
            onClick={addEducation}
            className="mt-5 inline-flex w-fit whitespace-nowrap
            items-center justify-center gap-2 px-4 py-2.5
            text-sm font-medium text-white bg-blue-600
            rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus className="size-4" />
            Add Your First Education
          </button>
        </div>
      ) : (
        /* Education Cards */
        <div className="space-y-5">
          {data.map((education, index) => (
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
                      Education #{index + 1}
                    </h4>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Add your academic details
                    </p>
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  aria-label={`Remove education ${index + 1}`}
                  className="p-2 shrink-0 text-gray-400
                  rounded-lg hover:text-red-600
                  hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="border-t border-gray-100" />

              {/* Institution and Degree */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Institution Name</label>

                  <div className="relative">
                    <School
                      className="absolute left-3.5 top-1/2
                    -translate-y-1/2 size-4 text-gray-400"
                    />

                    <input
                      type="text"
                      value={education.institution || ""}
                      onChange={(e) =>
                        updateEducation(index, "institution", e.target.value)
                      }
                      placeholder="e.g. Harvard University"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Degree</label>

                  <div className="relative">
                    <BookOpen
                      className="absolute left-3.5 top-1/2
                    -translate-y-1/2 size-4 text-gray-400"
                    />

                    <input
                      type="text"
                      value={education.degree || ""}
                      onChange={(e) =>
                        updateEducation(index, "degree", e.target.value)
                      }
                      placeholder="e.g. Bachelor's, Master's"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
              </div>

              {/* Field of Study */}
              <div>
                <label className={labelClass}>Field of Study</label>

                <input
                  type="text"
                  value={education.field || ""}
                  onChange={(e) =>
                    updateEducation(index, "field", e.target.value)
                  }
                  placeholder="e.g. Computer Science"
                  className={inputClass}
                />
              </div>

              {/* Graduation Date and GPA */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="size-4 text-gray-400" />
                      Graduation Date
                    </span>
                  </label>

                  <input
                    type="month"
                    value={education.graduation_date || ""}
                    onChange={(e) =>
                      updateEducation(index, "graduation_date", e.target.value)
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    GPA / Percentage
                    <span className="text-gray-400 font-normal ml-1">
                      (Optional)
                    </span>
                  </label>

                  <input
                    type="text"
                    value={education.gpa || ""}
                    onChange={(e) =>
                      updateEducation(index, "gpa", e.target.value)
                    }
                    placeholder="e.g. 3.8 / 4.0 or 85%"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EducationForm;
