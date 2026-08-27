import { Metadata } from "next";
import { notFound } from "next/navigation";
import PublicStudentPortal from "@/components/public/PublicStudentPortal";
import { fetchStudentPublicData } from "@/lib/services/publicStudent";

interface Props {
  params: Promise<{ admissionNo: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { admissionNo } = await params;
  return {
    title: `Student Progress — ${admissionNo} | LV Institute`,
    description: `Academic progress, chapter completion, marks, and attendance for student ${admissionNo} at LV Institute.`,
  };
}

export default async function PublicStudentPage({ params }: Props) {
  const { admissionNo } = await params;
  const data = await fetchStudentPublicData(admissionNo);

  if (!data) {
    notFound();
  }

  // Convert Mongoose ObjectIds and Dates to plain JSON for client component serialization
  const serializedData = JSON.parse(JSON.stringify(data));

  return <PublicStudentPortal data={serializedData} />;
}
