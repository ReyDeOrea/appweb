import { registerUser } from "@/modules/user/application/registerUser";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, username, password, phone, avatar_url } = body;

    if (!email || !username || !password || !phone)
      return NextResponse.json({ message: "Datos incompletos" }, { status: 400 });

    // Ya no necesitamos instanciar repo aquí si registerUser lo maneja
    const user = await registerUser({ email, username, password, phone, avatar_url });

    return NextResponse.json({ message: "Usuario creado", user }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Error" }, { status: 500 });
  }
}