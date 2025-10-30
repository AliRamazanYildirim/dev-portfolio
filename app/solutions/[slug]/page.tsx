import { Metadata } from "next";
import { notFound } from "next/navigation";
import SolutionPageClient from "@/components/sections/solutions/SolutionPageClient";
import { solutionDetails, solutionSlugs, type SolutionSlug } from "@/constants/solutionsContent";

interface SolutionPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return solutionSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: SolutionPageProps): Promise<Metadata> {
  const resolvedParams = (await params) as { slug: string };
  const slug = resolvedParams.slug as SolutionSlug;
  const content = solutionDetails.en[slug];

  if (!content) {
    return {
      title: "Solution",
    };
  }

  return {
    title: content.hero.title,
    description: content.hero.subtitle,
  };
}

export default async function SolutionPage({ params }: SolutionPageProps) {
  const resolvedParams = (await params) as { slug: string };
  const slug = resolvedParams.slug as SolutionSlug;

  if (!solutionSlugs.includes(slug)) {
    notFound();
  }

  return <SolutionPageClient slug={slug} />;
}
