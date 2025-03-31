import { Check } from "lucide-react";

export function Steps({ steps, currentStep }) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step, index) => (
          <li key={step.name} className="md:flex-1">
            <div
              className={`group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 ${
                index + 1 < currentStep
                  ? "border-primary"
                  : index + 1 === currentStep
                  ? "border-primary"
                  : "border-gray-200"
              }`}
            >
              <span className="text-sm font-medium">
                {index + 1 < currentStep ? (
                  <span className="flex items-center text-primary">
                    <Check className="mr-1.5 h-4 w-4" />
                    {step.name}
                  </span>
                ) : index + 1 === currentStep ? (
                  <span className="text-primary">{step.name}</span>
                ) : (
                  <span className="text-gray-500">{step.name}</span>
                )}
              </span>
              <span className="text-sm text-muted-foreground">
                {step.description}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
