import { NextRequest, NextResponse } from "next/server";
import { AdoptionRepository } from "@/modules/adoption/infraestructure/adoptionDataSource";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const repo = new AdoptionRepository();
    const pet = await repo.getPetById(params.id);
    if (!pet) return NextResponse.json({ message: "Mascota no encontrada" }, { status: 404 });

    return NextResponse.json(pet);
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Error" }, { status: 500 });
  }
}