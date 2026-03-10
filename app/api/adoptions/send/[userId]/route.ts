import { NextResponse } from "next/server";
import { AdoptionRepository } from "@/modules/adoption/infraestructure/adoptionDataSource";
import { GetUserRequests } from "@/modules/adoption/application/getRequestSent";

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    const repo = new AdoptionRepository();
    const getUserRequests = new GetUserRequests(repo);
    const requests = await getUserRequests.execute(params.userId);
    return NextResponse.json(requests);
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Error" }, { status: 500 });
  }
}