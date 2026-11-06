import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  User,
  ImagePlus,
  X,
  LoaderCircle,
} from "lucide-react";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const PersonalInfoForm = ({
  data,
  onChange,
  removeBackground,
  setRemoveBackground,
  isSaving = false,
}) => {
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState("");

  // Safely create and clean up the selected image preview URL
  useEffect(() => {
    if (
      data.image &&
      typeof File !== "undefined" &&
      data.image instanceof File
    ) {
      const previewUrl = URL.createObjectURL(data.image);
      setImagePreview(previewUrl);

      return () => URL.revokeObjectURL(previewUrl);
    }

    setImagePreview(typeof data.image === "string" ? data.image : "");
  }, [data.image]);

  const fields = [
    {
      key: "full_name",
      label: "Full Name",
      placeholder: "Enter your full name",
      icon: User,
      type: "text",
      required: true,
      maxLength: 80,
    },
    {
      key: "email",
      label: "Email Address",
      placeholder: "name@example.com",
      icon: Mail,
      type: "email",
      required: true,
      maxLength: 120,
    },
    {
      key: "phone",
      label: "Phone Number",
      placeholder: "+91 98765 43210",
      icon: Phone,
      type: "tel",
      maxLength: 20,
    },
    {
      key: "location",
      label: "Location",
      placeholder: "City, Country",
      icon: MapPin,
      type: "text",
      maxLength: 100,
    },
    {
      key: "profession",
      label: "Profession",
      placeholder: "e.g. Full Stack Developer",
      icon: BriefcaseBusiness,
      type: "text",
      maxLength: 100,
    },
    {
      key: "linkedin",
      label: "LinkedIn Profile",
      placeholder: "https://linkedin.com/in/your-profile",
      icon: Linkedin,
      type: "url",
      maxLength: 200,
    },
    {
      key: "website",
      label: "Personal Website",
      placeholder: "https://yourwebsite.com",
      icon: Globe,
      type: "url",
      maxLength: 200,
    },
  ];

  const validateField = (key, value) => {
    const val = String(value || "").trim();

    if (key === "full_name") {
      if (!val) return "Full name is required.";
      if (val.length < 2) return "Name must contain at least 2 characters.";
    }

    if (key === "email") {
      if (!val) return "Email address is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        return "Please enter a valid email address.";
      }
    }

    if (key === "phone" && val) {
      if (!/^[+]?[\d\s()-]{7,20}$/.test(val)) {
        return "Please enter a valid phone number.";
      }
    }

    if (["linkedin", "website"].includes(key) && val) {
      try {
        const url = new URL(
          val.startsWith("http://") || val.startsWith("https://")
            ? val
            : `https://${val}`,
        );

        if (!["http:", "https:"].includes(url.protocol)) {
          return "Please enter a valid website URL.";
        }
      } catch {
        return "Please enter a valid website URL.";
      }
    }

    return "";
  };

  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: validateField(field, value),
      }));
    }
  };

  const handleBlur = (field) => {
    const error = validateField(field, data[field]);

    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        image: "Only JPG and PNG images are allowed.",
      }));
      e.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setErrors((prev) => ({
        ...prev,
        image: "Image size must be less than 5 MB.",
      }));
      e.target.value = "";
      return;
    }

    setErrors((prev) => ({ ...prev, image: "" }));
    handleChange("image", file);
  };

  const removeImage = () => {
    handleChange("image", "");
    setRemoveBackground(false);
  };

  return (
    <fieldset
      disabled={isSaving}
      className={`w-full min-w-0 space-y-6 ${
        isSaving ? "cursor-not-allowed opacity-70" : ""
      }`}
    >
      {/* Section heading */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <User size={19} />
          </div>

          <h3 className="text-lg font-bold tracking-tight text-slate-900">
            Personal Information
          </h3>
        </div>

        <p className="text-sm text-slate-500">
          Add your contact details so employers can reach you.
        </p>
      </div>

      {/* Saving indicator */}
      {isSaving && (
        <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
          <LoaderCircle className="h-5 w-5 animate-spin shrink-0" />
          <div>
            <p className="font-semibold">Saving your resume...</p>
            <p className="text-xs text-blue-600">
              Please wait. Editing is temporarily disabled.
            </p>
          </div>
        </div>
      )}

      {/* Profile image */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-700">
          Profile Photo
          <span className="ml-2 font-normal text-slate-400">(Optional)</span>
        </label>

        <div className="flex flex-wrap items-center gap-4">
          <label
            className={`relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition ${
              isSaving
                ? "cursor-not-allowed"
                : "cursor-pointer hover:border-blue-400 hover:bg-blue-50"
            }`}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <ImagePlus className="h-7 w-7 text-slate-400" />
            )}

            <input
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              disabled={isSaving}
              onChange={handleImageChange}
            />
          </label>

          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-sm font-semibold text-slate-700">
              Upload your photo
            </p>
            <p className="text-xs text-slate-500">JPG or PNG, maximum 5 MB.</p>

            {imagePreview && (
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <input
                    type="checkbox"
                    checked={removeBackground}
                    disabled={isSaving}
                    onChange={(e) => setRemoveBackground(e.target.checked)}
                    className="h-4 w-4 accent-blue-600"
                  />
                  Remove background
                </label>

                <button
                  type="button"
                  onClick={removeImage}
                  disabled={isSaving}
                  className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700 disabled:cursor-not-allowed"
                >
                  <X size={13} />
                  Remove photo
                </button>
              </div>
            )}
          </div>
        </div>

        {errors.image && (
          <p className="text-xs font-medium text-red-500">{errors.image}</p>
        )}
      </div>

      {/* Personal information fields */}
      <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
        {fields.map((field) => {
          const Icon = field.icon;
          const error = errors[field.key];

          return (
            <div
              key={field.key}
              className={`min-w-0 space-y-2 ${
                ["location", "profession"].includes(field.key)
                  ? "sm:col-span-2"
                  : ""
              }`}
            >
              <label
                htmlFor={field.key}
                className="flex items-center gap-2 text-sm font-semibold text-slate-700"
              >
                <Icon size={16} className="text-slate-400" />
                {field.label}

                {field.required && <span className="text-red-500">*</span>}
              </label>

              <input
                id={field.key}
                type={field.type}
                value={data[field.key] || ""}
                maxLength={field.maxLength}
                required={field.required || false}
                disabled={isSaving}
                placeholder={field.placeholder}
                autoComplete={
                  field.key === "full_name"
                    ? "name"
                    : field.key === "email"
                      ? "email"
                      : field.key === "phone"
                        ? "tel"
                        : "off"
                }
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${field.key}-error` : undefined}
                onChange={(e) => handleChange(field.key, e.target.value)}
                onBlur={() => handleBlur(field.key)}
                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 ${
                  error
                    ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                }`}
              />

              {error && (
                <p
                  id={`${field.key}-error`}
                  className="text-xs font-medium text-red-500"
                  role="alert"
                >
                  {error}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-slate-400">
        Fields marked with <span className="text-red-500">*</span> are required.
      </p>
    </fieldset>
  );
};

export default PersonalInfoForm;
