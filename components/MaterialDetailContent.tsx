import { Check } from "lucide-react";
import type { Material } from "@/lib/content-store";

export function MaterialDetailContent({ material }: { material: Material }) {
  return <>
    <p className="mt-3 flex-1 text-sm leading-8 text-[#66646e]">{material.description}</p>
    <ul className="mt-5 flex flex-wrap gap-2">
      {material.properties.map(property => (
        <li key={property} className="inline-flex items-center gap-1.5 rounded-full border border-[#e9e8ed] bg-[#f8f8fa] px-2.5 py-1 text-xs font-medium text-[#5e5c66]">
          <Check className="size-3 text-navy-600" aria-hidden="true" />{property}
        </li>
      ))}
    </ul>
    <p className="mt-5 border-t border-[#e9e8ee] pt-3 text-sm leading-7 text-[#66646e]"><span className="font-bold text-navy-900">گریدها و انواع: </span>{material.grades}</p>
  </>;
}
