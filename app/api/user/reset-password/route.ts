import { NextRequest, NextResponse } from "next/server";
import { SupabaseUserRepository } from "@/modules/user/infraestructure/userDataSource";
import { ResetPasswordUseCase } from "@/modules/user/application/resetPassword";

export async function POST(req: NextRequest) {
  try {
    const { userId, newPassword, confirmPassword } = await req.json();

    if (!newPassword || !confirmPassword)
      return NextResponse.json({ message: "Todos los campos son obligatorios" }, { status: 400 });

    if (newPassword !== confirmPassword)
      return NextResponse.json({ message: "Las contraseñas no coinciden" }, { status: 400 });

    const repo = new SupabaseUserRepository();

    const user = await repo.getProfile(userId);
    if (!user) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    const resetUseCase = new ResetPasswordUseCase(repo);

    await resetUseCase.execute({ user, newPassword, confirmPassword });

    return NextResponse.json({ message: "Contraseña actualizada" });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Error" }, { status: 500 });
  }
}