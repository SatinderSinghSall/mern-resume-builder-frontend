import {
  Plus,
  Sparkles,
  X,
  Lightbulb,
  Code2,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const SkillsForm = ({ data = [], onChange }) => {
  const [newSkill, setNewSkill] = useState("");

  // Add Skill
  const addSkill = () => {
    const skill = newSkill.trim();

    if (!skill) return;

    // Prevent duplicate skills (case-insensitive)
    const alreadyExists = data.some(
      (existingSkill) => existingSkill.toLowerCase() === skill.toLowerCase(),
    );

    if (alreadyExists) {
      toast.error("This skill has already been added.");
      return;
    }

    onChange([...data, skill]);
    setNewSkill("");
  };

  // Remove Skill
  const removeSkill = (indexToRemove) => {
    onChange(data.filter((_, index) => index !== indexToRemove));
  };

  // Handle Enter Key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-blue-50 rounded-xl shrink-0">
          <Code2 className="size-5 text-blue-600" />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900">Skills</h3>

          <p className="text-sm text-gray-500 mt-1">
            Highlight your technical abilities and personal strengths.
          </p>
        </div>
      </div>

      {/* Skill Input */}
      <div className="space-y-2">
        <label
          htmlFor="new-skill"
          className="block text-sm font-medium text-gray-700"
        >
          Add a Skill
        </label>

        <div className="flex items-center gap-2">
          <input
            id="new-skill"
            type="text"
            placeholder="e.g. JavaScript, React, Leadership"
            className="flex-1 min-w-0 px-4 py-3 text-sm
            text-gray-700 bg-white border border-gray-200
            rounded-xl outline-none placeholder:text-gray-400
            focus:border-blue-500 focus:ring-4
            focus:ring-blue-500/10 transition-all duration-200"
            onChange={(e) => setNewSkill(e.target.value)}
            value={newSkill}
            onKeyDown={handleKeyDown}
          />

          <button
            type="button"
            onClick={addSkill}
            disabled={!newSkill.trim()}
            className="inline-flex shrink-0 whitespace-nowrap
            items-center justify-center gap-2 px-4 py-3
            text-sm font-semibold text-white bg-blue-600
            rounded-xl hover:bg-blue-700 transition-all
            duration-200 shadow-sm
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="size-4 shrink-0" />
            <span>Add</span>
          </button>
        </div>

        <p className="text-xs text-gray-400">
          Press Enter or click Add to include a skill.
        </p>
      </div>

      {/* Skills List */}
      <div
        className="p-4 sm:p-5 bg-gray-50/70
      border border-gray-200 rounded-2xl space-y-4"
      >
        <div className="flex items-center justify-between gap-2">
          <div>
            <h4 className="text-sm font-semibold text-gray-800">Your Skills</h4>

            <p className="text-xs text-gray-500 mt-1">
              {data.length} {data.length === 1 ? "skill" : "skills"} added
            </p>
          </div>

          {data.length > 0 && (
            <div
              className="flex items-center gap-1.5 text-xs
            font-medium text-green-700 bg-green-50
            px-2.5 py-1.5 rounded-full"
            >
              <CheckCircle2 className="size-3.5" />
              Added
            </div>
          )}
        </div>

        {/* Empty State */}
        {data.length === 0 ? (
          <div
            className="flex flex-col items-center
          justify-center text-center py-8 px-4
          bg-white border border-dashed
          border-gray-300 rounded-xl"
          >
            <div className="p-3 bg-blue-50 rounded-2xl mb-3">
              <Sparkles className="size-7 text-blue-500" />
            </div>

            <h4 className="text-sm font-semibold text-gray-800">
              No skills added yet
            </h4>

            <p className="text-xs text-gray-500 mt-2 max-w-xs">
              Start adding your technical skills, tools, programming languages,
              and soft skills.
            </p>
          </div>
        ) : (
          /* Skill Tags */
          <div className="flex flex-wrap gap-2.5">
            {data.map((skill, index) => (
              <div
                key={`${skill}-${index}`}
                className="group inline-flex items-center gap-2
                pl-3.5 pr-1.5 py-2 bg-white
                border border-blue-100 rounded-xl
                text-sm font-medium text-blue-800
                shadow-sm hover:border-blue-300
                hover:shadow transition-all duration-200"
              >
                <span>{skill}</span>

                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  aria-label={`Remove ${skill}`}
                  className="p-1.5 rounded-lg
                  text-blue-400 hover:text-red-600
                  hover:bg-red-50 transition-colors"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pro Tip */}
      <div
        className="flex items-start gap-3 p-4
      bg-blue-50/70 border border-blue-100 rounded-xl"
      >
        <div className="p-2 bg-white rounded-lg shrink-0">
          <Lightbulb className="size-4 text-blue-600" />
        </div>

        <div>
          <p className="text-sm font-semibold text-blue-900">Pro Tip</p>

          <p
            className="text-xs text-blue-800/80
          leading-relaxed mt-1"
          >
            Add 8–12 relevant skills that match your target job. Include
            technical skills (JavaScript, React, Node.js) as well as soft skills
            (communication, teamwork, leadership).
          </p>
        </div>
      </div>
    </div>
  );
};

export default SkillsForm;
