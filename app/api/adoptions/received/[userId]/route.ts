import { NextResponse } from "next/server";
import { AdoptionRepository } from "@/modules/adoption/infraestructure/adoptionDataSource";
import { GetRequestsForMyPets } from "@/modules/adoption/application/getRequestReceived";

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    const repo = new AdoptionRepository();
    const getRequests = new GetRequestsForMyPets(repo);
    const requests = await getRequests.execute(params.userId);
    return NextResponse.json(requests);
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Error" }, { status: 500 });
  }
}