import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEMO_DATA } from "@/generated/demo-data";
import { AssociationDetailBody } from "@/components/site/association-detail";

export function generateStaticParams() {
  return DEMO_DATA.associations.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = DEMO_DATA.associations.find((x) => x.slug === slug);
  if (!a) return { title: "جمعية غير موجودة" };
  return {
    title: a.name,
    description: a.description.slice(0, 150),
    alternates: { canonical: `/associations/${slug}/` },
  };
}

export default async function AssociationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = DEMO_DATA.associations.find((x) => x.slug === slug);
  if (!a) notFound();

  const events = DEMO_DATA.events
    .filter((e) => e.associationSlug === a.slug)
    .slice(0, 4);

  return <AssociationDetailBody association={a} events={events} />;
}
