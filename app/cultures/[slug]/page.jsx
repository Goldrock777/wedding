import { cultures } from "@/lib/catalog";
import CultureView from "./CultureView";

export function generateStaticParams() {
  return cultures.map((c) => ({ slug: c.slug }));
}

export default async function Page({ params }) {
  const { slug } = await params;
  return <CultureView slug={slug} />;
}
