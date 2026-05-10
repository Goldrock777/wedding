import { seedVendors } from "@/lib/catalog";
import VendorDetail from "./VendorDetail";

export function generateStaticParams() {
  return seedVendors.map((v) => ({ id: v.id }));
}

export default async function Page({ params }) {
  const { id } = await params;
  return <VendorDetail id={id} />;
}
