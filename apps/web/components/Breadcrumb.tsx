import Link from "next/link";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
      <Link href="/" className="hover:text-gold-400 transition-colors">
        Home
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="flex items-center space-x-2">
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            {item.href && !isLast ? (
              <Link href={item.href as any} className="hover:text-gold-400 transition-colors">
                {item.label}
              </Link>
            ) : item.href ? (
              <Link href={item.href as any} aria-current="page" className="hover:text-gold-400 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-300" aria-current={isLast ? "page" : undefined}>{item.label}</span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
