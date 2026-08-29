import { useState, useRef, useEffect } from "react";
import { Target, Eye, ArrowRight, Sparkles } from "lucide-react";

const THUMBNAIL_BASE_WIDTH_PX = 793.7; // 210mm at 96dpi

export function UniformTemplateThumbnail({ TemplateComponent, resumeData }) {
  const frameRef = useRef(null);
  const [scale, setScale] = useState(0.32);

  useEffect(() => {
    if (!frameRef.current) return;

    const updateScale = () => {
      if (!frameRef.current) return;
      const frameWidth = frameRef.current.clientWidth;
      if (!frameWidth) return;
      setScale(frameWidth / THUMBNAIL_BASE_WIDTH_PX);
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(frameRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="absolute inset-0 p-2.5">
      <div
        ref={frameRef}
        className="relative h-full w-full overflow-hidden rounded-xl border border-gray-200/80 dark:border-zinc-800 bg-white shadow-sm"
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
}

const TEMPLATE_IMAGE_MAP = {
  classic: "/templates/classic.webp",
  modern: "/templates/modern.webp",
  minimal: "/templates/minimal.webp",
  professional: "/templates/professional.webp",
  "professional-2": "/templates/professional2.webp",
  professional2: "/templates/professional2.webp",
  tech: "/templates/tech.webp",
  "creative-2": "/templates/creative2.webp",
  creative2: "/templates/creative2.webp",
  "strategic-leader": "/templates/strategic-leader.webp",
  "impact-pro": "/templates/impact-pro.webp",
  "github-style": "/templates/github-style.webp",
  "structured-photo": "/templates/structured-photo.webp",
};

export default function TemplateCard({
  template,
  sampleResumeData,
  onOpenPreview,
  onUseTemplate,
}) {
  const [imgError, setImgError] = useState(false);
  const imageSrc = TEMPLATE_IMAGE_MAP[template.id] || template.thumbnail;

  return (
    <div
      onClick={() => onOpenPreview(template)}
      className="group relative flex flex-col justify-between bg-white dark:bg-zinc-900/90 rounded-3xl border border-gray-200/90 dark:border-white/[0.08] hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-200 shadow-sm hover:shadow-xl overflow-hidden cursor-pointer active:scale-[0.99]"
    >
      {/* Thumbnail view */}
      <div className="relative h-[380px] bg-slate-50 dark:bg-zinc-950 overflow-hidden">
        {imageSrc && !imgError ? (
          <div className="absolute inset-0 p-2.5">
            <div className="relative h-full w-full overflow-hidden rounded-xl border border-gray-200/80 dark:border-zinc-800 bg-white shadow-sm">
              <img
                src={imageSrc}
                alt={`${template.name} - ${template.category} ATS Resume Template | SmartNShine`}
                title={`${template.name} ATS Resume Template - SmartNShine`}
                loading="lazy"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </div>
          </div>
        ) : (
          <UniformTemplateThumbnail
            TemplateComponent={template.component}
            resumeData={sampleResumeData}
          />
        )}

        {/* Hover overlay with Preview Button */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-gray-900 font-bold text-xs sm:text-sm shadow-xl"
          >
            <Eye className="w-4 h-4" />
            <span>Interactive Preview</span>
          </button>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-3 py-1 rounded-xl bg-gray-900/90 dark:bg-white/90 text-white dark:text-gray-900 text-[11px] font-bold backdrop-blur-md shadow-xs">
            {template.category}
          </span>
        </div>

        {/* ATS Score Badge */}
        <div className="absolute top-3 right-3 z-10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-gray-200/80 dark:border-white/10 shadow-xs flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-[11px] font-bold text-gray-500 dark:text-zinc-400">ATS</span>
          <span
            className={`text-xs font-extrabold ${
              template.atsScore >= 95
                ? "text-emerald-600 dark:text-emerald-400"
                : template.atsScore >= 90
                ? "text-blue-600 dark:text-blue-400"
                : "text-amber-600 dark:text-amber-400"
            }`}
          >
            {template.atsScore}%
          </span>
        </div>
      </div>

      {/* Card Details & Action Footer */}
      <div className="p-5 sm:p-6 space-y-3">
        <div>
          <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {template.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
            {template.description}
          </p>
        </div>

        {/* Color themes swatches preview */}
        {template.colors && template.colors.length > 0 && (
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[11px] font-semibold text-gray-400 dark:text-zinc-500 mr-1">
              Themes:
            </span>
            {template.colors.map((c, i) => (
              <span
                key={i}
                className="w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-zinc-700 shadow-2xs shrink-0"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        )}

        {/* Quick CTA Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onUseTemplate(template.id);
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-gray-800 dark:text-zinc-200 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>Use Template</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
