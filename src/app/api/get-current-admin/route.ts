import { getCurrentAdmin } from "@/firebase/actions/general.action";
import { NextResponse } from "next/server";

export async function GET() {
  const admin = await getCurrentAdmin();
  return NextResponse.json({ admin: admin ?? null });
}
