'use client';

export function ProgressStepper({ step, totalSteps }: { step: number; totalSteps: number }) {
  const progressPercentage = ((step - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="flex items-center justify-between mb-10 max-w-md mx-auto relative">
      <div className="absolute top-1/2 left-0 w-full h-1 bg-secondary -z-10 rounded" />
      <div
        className="absolute top-1/2 left-0 h-1 bg-primary -z-10 rounded transition-all duration-300"
        style={{ width: `${progressPercentage}%` }}
      />
      {[...Array(totalSteps)].map((_, i) => {
        const stepNum = i + 1;
        const isActive = step >= stepNum;
        return (
          <div
            key={stepNum}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 transition-colors duration-300 ${
              isActive
                ? 'bg-background border-primary text-primary'
                : 'bg-secondary border-muted text-muted-foreground'
            }`}
          >
            {stepNum}
          </div>
        );
      })}
    </div>
  );
}
