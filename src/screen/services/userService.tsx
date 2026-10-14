import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, set } from "firebase/database";

import { auth, database } from "../../services/firebaseConfig";
import { UserModel } from "../models/UserModel";

class UserService {
  async cadastrarUsuario(
    nome: string,
    celular: string,
    email: string,
    senha: string
  ): Promise<UserModel> {
    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      );

    const uid = userCredential.user.uid;

    if (userCredential.user) {
      try {
        await updateProfile(userCredential.user, {
          displayName: nome,
        });
      } catch (e) {
        console.warn("Não foi possível atualizar o displayName:", e);
      }
    }

    const usuario: UserModel = {
      id: uid,
      nome: nome,
      celular: celular,
      email: email,
      createdAt: new Date().toISOString(),
    };

    await set(
      ref(database, `usuarios/${uid}`),
      usuario
    );

    return usuario;
  }
}

export const userService = new UserService();