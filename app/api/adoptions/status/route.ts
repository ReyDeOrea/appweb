import { NextRequest, NextResponse } from "next/server";
import { AdoptionRepository } from "@/modules/adoption/infraestructure/adoptionDataSource";
import { RequestStatus } from "@/modules/adoption/application/statusRequest";

export async function PATCH(req: NextRequest) {
  try {
    const { requestId, estado } = await req.json();
    const repo = new AdoptionRepository();
    const statusUseCase = new RequestStatus(repo);

    await statusUseCase.execute(requestId, estado);
    return NextResponse.json({ message: "Estado actualizado" });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Error" }, { status: 500 });
  }
}