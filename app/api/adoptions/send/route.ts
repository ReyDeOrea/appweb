import { NextRequest, NextResponse } from "next/server";
import { AdoptionRepository } from "@/modules/adoption/infraestructure/adoptionDataSource";
import { CreateAdoptionRequest } from "@/modules/adoption/application/createAdoption";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const repo = new AdoptionRepository();
    const createRequest = new CreateAdoptionRequest(repo);

    await createRequest.execute(body);
    return NextResponse.json({ message: "Solicitud enviada" }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Error" }, { status: 500 });
  }
}