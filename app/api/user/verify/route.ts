import { NextRequest, NextResponse } from "next/server";
import { SupabaseUserRepository } from "@/modules/user/infraestructure/userDataSource";
import { VerifyUserUseCase } from "@/modules/user/application/verifyUserCase";

export async function POST(req: NextRequest) {
  try {
    const { username, email } = await req.json();
    const repo = new SupabaseUserRepository();
    const verifyUseCase = new VerifyUserUseCase(repo);

    const user = await verifyUseCase.execute(username, email);
    return NextResponse.json({ user });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Usuario no encontrado" }, { status: 404 });
  }
}