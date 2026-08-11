import { cn } from "./ui";

export function Faq({
  items,
  tone = "light",
}: {
  items: { question: string; answer: string }[];
  tone?: "light" | "dark";
}) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-3">
      {items.map((item, index) => (
        <details
          key={item.question}
          open={index === 0}
          className={cn(
            "group faq-item rounded-2xl border transition-[border-color,box-shadow] duration-300",
            tone === "light"
              ? "border-navy-100 bg-brand-white open:border-navy-300 open:shadow-md open:shadow-navy-900/5"
              : "border-brand-white/10 bg-brand-white/5 open:border-brand-yellow/40",
          )}
          style={{ animationDelay: `${index * 70}ms` }}
        >
          <summary
            className={cn(
              "flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-bold marker:content-none md:px-6 md:py-5 [&::-webkit-details-marker]:hidden",
              tone === "light" ? "text-navy-900" : "text-brand-white",
            )}
          >
            <h3 className="text-base font-bold md:text-lg">{item.question}</h3>
            <span
              aria-hidden="true"
              className={cn(
                "grid size-7 shrink-0 place-items-center rounded-full text-lg transition-transform duration-300 group-open:rotate-45",
                tone === "light"
                  ? "bg-navy-100 text-navy-700"
                  : "bg-brand-white/10 text-brand-yellow",
              )}
            >
              +
            </span>
          </summary>
          <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-open:grid-rows-[1fr] motion-reduce:transition-none">
            <div className="overflow-hidden">
              <p
                className={cn(
                  "px-5 pb-5 leading-8 md:px-6 md:pb-6",
                  tone === "light" ? "text-navy-700/85" : "text-brand-white/75",
                )}
              >
                {item.answer}
              </p>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
