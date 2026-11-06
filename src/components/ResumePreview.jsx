import ClassicTemplate from "./templates/ClassicTemplate";
import MinimalImageTemplate from "./templates/MinimalImageTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import ModernTemplate from "./templates/ModernTemplate";

const ResumePreview = ({ data, template, accentcolor, classes = "" }) => {
  const renderTemplate = () => {
    const templateProps = {
      data,
      accentColor: accentcolor,
    };

    switch (template) {
      case "modern":
        return <ModernTemplate {...templateProps} />;

      case "minimal":
        return <MinimalTemplate {...templateProps} />;

      case "minimal-image":
        return <MinimalImageTemplate {...templateProps} />;

      case "classic":
      default:
        return <ClassicTemplate {...templateProps} />;
    }
  };

  return (
    <div className="w-full rounded-xl bg-gray-100 p-2 sm:p-4 print:bg-white print:p-0">
      <div
        id="resume-preview"
        className={`mx-auto w-full max-w-[850px] overflow-hidden border border-gray-200 bg-white shadow-sm print:max-w-none print:border-none print:shadow-none ${classes}`}
      >
        {renderTemplate()}
      </div>

      <style>{`
        @page {
          size: letter;
          margin: 0;
        }

        @media print {
          html,
          body {
            width: 8.5in;
            min-height: 11in;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body * {
            visibility: hidden !important;
          }

          #resume-preview,
          #resume-preview * {
            visibility: visible !important;
          }

          #resume-preview {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 8.5in !important;
            max-width: none !important;
            min-height: 11in !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            border: none !important;
            box-shadow: none !important;
          }

          #resume-preview * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ResumePreview;
