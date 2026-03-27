import {useEffect, useMemo, useRef, useState} from "react";
import {Check} from "lucide-react";

const THUMBNAIL_BASE_WIDTH_PX = 793.7; // 210mm at 96dpi

const TemplateThumbnail = ({TemplateComponent, resumeData}) => {
  const wrapperRef = useRef(null);
  const [scale, setScale] = useState(0.2);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const updateScale = () => {
      if (!wrapperRef.current) return;
      const wrapperWidth = wrapperRef.current.clientWidth;
      if (!wrapperWidth) return;
      setScale(wrapperWidth / THUMBNAIL_BASE_WIDTH_PX);
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(wrapperRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="absolute inset-0 p-3">
      <div
        ref={wrapperRef}
        className="relative h-full w-full overflow-hidden rounded-md border border-gray-300 dark:border-zinc-700 bg-white shadow-[0_8px_18px_rgba(15,23,42,0.18)]"
      >
        <div
          className="pointer-events-none"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width: "210mm",
            height: "297mm",
          }}
        >
          <TemplateComponent resumeData={resumeData} />
        </div>
      </div>
    </div>
  );
};

const TemplateSelectorModal = ({
  isOpen,
  onClose,
  templates,
  resumeData,
  selectedTemplate,
  onApplyTemplate,
}) => {
  const [templateSearchQuery, setTemplateSearchQuery] = useState("");
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState("All");
  const [templateDraftSelection, setTemplateDraftSelection] =
    useState(selectedTemplate);

  useEffect(() => {
    if (!isOpen) return;
    setTemplateDraftSelection(selectedTemplate);
    setTemplateSearchQuery("");
    setTemplateCategoryFilter("All");
  }, [isOpen, selectedTemplate]);

  const templateCategories = useMemo(() => {
    return ["All", ...new Set(templates.map((template) => template.category))];
  }, [templates]);

  const filteredTemplateOptions = useMemo(() => {
    const query = templateSearchQuery.trim().toLowerCase();

    let filtered = templates.filter((template) => {
      const matchCategory =
        templateCategoryFilter === "All" ||
        template.category === templateCategoryFilter;
      const matchQuery =
        !query ||
        template.name.toLowerCase().includes(query) ||
        template.category.toLowerCase().includes(query);

      return matchCategory && matchQuery;
    });

    filtered = [...filtered].sort((a, b) => b.atsScore - a.atsScore);

    return filtered;
  }, [templates, templateSearchQuery, templateCategoryFilter]);

  const draftTemplateName = useMemo(() => {
    return templates.find((template) => template.id === templateDraftSelection)
      ?.name;
  }, [templates, templateDraftSelection]);

  const applyAndClose = () => {
    if (templateDraftSelection) {
      onApplyTemplate(templateDraftSelection);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-2 sm:p-4 no-print"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-950 rounded-none sm:rounded-xl w-full max-w-7xl h-[100dvh] sm:h-auto sm:max-h-[90vh] overflow-hidden border-0 sm:border border-gray-200 dark:border-zinc-800 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white dark:bg-zinc-950 p-4 sm:p-6 border-b border-gray-200 dark:border-zinc-800 shrink-0">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Change Resume Template
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Pick a style, compare quickly, and apply when ready.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-900 p-2 rounded-lg transition-colors flex-shrink-0"
            >
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2">
              <input
                value={templateSearchQuery}
                onChange={(e) => setTemplateSearchQuery(e.target.value)}
                placeholder="Search templates"
                className="w-full sm:max-w-sm px-3 py-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-zinc-500"
              />
              <button
                onClick={applyAndClose}
                disabled={!templateDraftSelection}
                className="px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Apply
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {templateCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setTemplateCategoryFilter(category)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap border transition-colors ${
                    templateCategoryFilter === category
                      ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white"
                      : "bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-500"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-auto p-3 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredTemplateOptions.length} template
              {filteredTemplateOptions.length === 1 ? "" : "s"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Current: {templates.find((t) => t.id === selectedTemplate)?.name}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredTemplateOptions.map((template) => {
              const isCurrent = selectedTemplate === template.id;
              const isDraft = templateDraftSelection === template.id;
              const TemplateComponent = template.component;

              return (
                <div
                  key={template.id}
                  onClick={() => setTemplateDraftSelection(template.id)}
                  className={`group relative bg-white dark:bg-zinc-900 rounded-xl transition-all duration-200 overflow-hidden cursor-pointer border-2 ${
                    isDraft
                      ? "border-gray-900 dark:border-white shadow-[0_0_0_3px_rgba(17,24,39,0.15)] dark:shadow-[0_0_0_3px_rgba(255,255,255,0.15)]"
                      : "border-gray-200 dark:border-zinc-800 hover:border-gray-400 dark:hover:border-zinc-600"
                  }`}
                >
                  <div className="absolute top-2 left-2 z-10 flex items-center gap-2">
                    {isCurrent && (
                      <span className="bg-white/95 dark:bg-zinc-900/95 text-gray-800 dark:text-gray-100 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-gray-200 dark:border-zinc-700">
                        Current
                      </span>
                    )}
                  </div>

                  <div className="absolute top-2 right-2 z-10 bg-white/95 dark:bg-zinc-900/95 px-2.5 py-1 rounded-md border border-gray-200 dark:border-zinc-700">
                    <span
                      className={`text-[11px] font-bold ${
                        template.atsScore >= 95
                          ? "text-green-500"
                          : template.atsScore >= 90
                            ? "text-blue-500"
                            : "text-orange-500"
                      }`}
                    >
                      ATS {template.atsScore}%
                    </span>
                  </div>

                  <div className="relative h-56 overflow-hidden bg-gradient-to-b from-slate-100 to-slate-200 dark:from-zinc-800 dark:to-zinc-900">
                    <TemplateThumbnail
                      TemplateComponent={TemplateComponent}
                      resumeData={resumeData}
                    />

                    <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center pb-4">
                      <span className="text-white font-semibold text-sm">
                        Click to select
                      </span>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-zinc-800">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white leading-tight">
                        {template.name}
                      </h3>
                      {isDraft && <Check className="w-4 h-4 text-green-500" />}
                    </div>
                    <span className="inline-block text-[11px] bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-md border border-gray-200 dark:border-zinc-700">
                      {template.category}
                    </span>
                    <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                      Optimized for {template.category.toLowerCase()} roles.
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="hidden sm:flex p-3 sm:p-4 bg-gray-50 dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 flex-col sm:flex-row justify-between items-center gap-3 shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]">
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
            Your content stays unchanged. Only the visual design is applied.
          </div>
          <div className="w-full sm:w-auto flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-zinc-700 transition-colors font-medium text-sm"
            >
              Close
            </button>
            <button
              onClick={applyAndClose}
              disabled={!templateDraftSelection}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Apply Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelectorModal;
