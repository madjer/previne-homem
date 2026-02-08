export interface Perfil {
  uid: string;
  nome: string;
  email?: string;
  dataNascimento: string;
  peso: number;
  altura: number;
  hipertenso?: boolean;
  diabetico?: boolean;
}
