import { Metadata } from "next";
import { notFound } from "next/navigation";
import PublicStudentPortal from "@/components/public/PublicStudentPortal";

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

async function getStudentPublicData(admissionNo: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/students/${admissionNo}/public`, {
      next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.data : null;
  } catch {
    return null;
  }
}

export default async function PublicStudentPage({ params }: Props) {
  const { admissionNo } = await params;
  const data = await getStudentPublicData(admissionNo);

  if (!data) {
    notFound();
  }

  return <PublicStudentPortal data={data} />;
}
