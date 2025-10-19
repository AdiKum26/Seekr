
interface ProgressProps {
  value: number;
  className?: string;
  indicatorClassName?: string;
}

export function Progress({ value, className = "", indicatorClassName = "" }: ProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={`relative w-full overflow-hidden rounded-full bg-gray-200 ${className}`}>
      <div
        className={`h-full bg-gradient-to-r from-[var(--university-primary)] to-[var(--university-secondary)] transition-all duration-300 ease-in-out ${indicatorClassName}`}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}

