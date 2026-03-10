import { UserProfile } from "../domain/user";
import { UserRepository } from "../domain/userRepository";


interface ResetPassword {
  user: UserProfile;
  newPassword: string;
  confirmPassword: string;
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export class ResetPasswordUseCase {
  constructor(private userRepo: UserRepository) {}

  async execute({ user, newPassword, confirmPassword }: ResetPassword) {

    if (!newPassword || !confirmPassword) {
      throw new Error("Todos los campos son obligatorios");
    }

    if (newPassword !== confirmPassword) {
      throw new Error("Las contraseñas no coinciden");
    }

   const newHash = await hashPassword(newPassword);

    if (newHash === user.password) {
      throw new Error("La nueva contraseña no puede ser igual a la anterior");
    }

    if (newPassword.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres");
    }

 await this.userRepo.updateProfile({ ...user, password: newHash });  }
}