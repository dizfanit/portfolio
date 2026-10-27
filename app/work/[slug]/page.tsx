import { notFound } from "next/navigation";
import { publishedCases } from "../../../lib/content-store";
import CaseStudyBoard from "../../../components/CaseStudyBoard";
import Header from "../../../components/Header";

type CasePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export default async function CasePage({ params }: CasePageProps) {
  const { slug } = await params;
  const study = (await publishedCases()).find(item => item.slug === slug);
  if (!study || study.singleWork) notFound();
  return <><Header casePage /><CaseStudyBoard key={slug} study={study} /></>;
}
