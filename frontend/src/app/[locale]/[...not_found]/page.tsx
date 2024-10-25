import { notFound } from "next/navigation";

export default function NotFoundCatchALL() {
  notFound();
}

export async function generateStaticParams() {
  return [
    { locale: "en", not_found: "404" },
    { locale: "es", not_found: "404" },
    // Add other locales and paths as needed
  ];
}
