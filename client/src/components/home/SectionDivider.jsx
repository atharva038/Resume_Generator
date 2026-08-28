export default function SectionDivider() {
  return (
    <div
      className="relative z-10 h-10 sm:h-12 bg-white dark:bg-[#09090b] overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent" />
    </div>
  );
}
