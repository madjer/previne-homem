import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { Perfil } from '../../shared/models/perfil.model';

@Injectable({ providedIn: 'root' })
export class PerfilService {

  constructor(private auth: Auth, private fs: Firestore) {}

  async salvar(perfil: Omit<Perfil, 'uid' | 'nome'>) {
    const user = this.auth.currentUser;
    if (!user) return;

    const ref = doc(this.fs, `perfis/${user.uid}`);
    await setDoc(ref, {
      uid: user.uid,
      nome: user.displayName,
      ...perfil
    });
  }

  obter() {
    const user = this.auth.currentUser;
    if (!user) return null;
    const ref = doc(this.fs, `perfis/${user.uid}`);
    return docData(ref);
  }
}
