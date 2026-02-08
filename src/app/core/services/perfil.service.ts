import { EnvironmentInjector, Injectable, runInInjectionContext } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Perfil } from '../../shared/models/perfil.model';

@Injectable({ providedIn: 'root' })
export class PerfilService {

  constructor(
    private auth: Auth,
    private fs: Firestore,
    private injector: EnvironmentInjector
  ) {}

  async salvar(perfil: Omit<Perfil, 'uid' | 'nome' | 'email'>) {
    const user = this.auth.currentUser;
    if (!user) return;

    const ref = doc(this.fs, `perfis/${user.uid}`);
    await setDoc(ref, {
      uid: user.uid,
      nome: user.displayName,
      email: user.email,
      ...perfil
    });
  }

  async obterPorUid(uid: string) {
    if (!uid) return null;
    const ref = doc(this.fs, `perfis/${uid}`);
    return runInInjectionContext(this.injector, async () => {
      const snap = await getDoc(ref);
      return snap.exists() ? snap.data() : null;
    });
  }
}
