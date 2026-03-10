import { getPets } from "@/modules/animal/infraestructure/petDataSource";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const pets = await getPets(); 
    return NextResponse.json(pets);
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Error al obtener mascotas" },
      { status: 500 }
    );
  }
}