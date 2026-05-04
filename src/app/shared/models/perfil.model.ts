export interface Perfil {
  uid: string;
  nome: string;
  email?: string;
  dataNascimento: string;
  peso?: number;
  altura?: number;
  municipio?: string;
  ubsReferencia?: string;
  temMedicoNaUbs?: boolean;
  // Hábitos de vida
  tabagismo?: 'fumante' | 'exFumante' | 'nuncaFumou';
  alcool?: 'naoConsome' | 'ocasionalmente' | 'frequentemente';
  atividadeFisica?: 'sedentario' | 'ativo';
  alimentacao?: 'saudavel' | 'irregular' | 'naoSabe';
  // Condições de saúde
  hipertenso?: 'sim' | 'nao' | 'naoSei';
  diabetico?: 'sim' | 'nao' | 'naoSei';
  doencaCardiaca?: 'sim' | 'nao' | 'naoSei';
  colesterolElevado?: 'sim' | 'nao' | 'naoSei';
  depressaoAnsiedade?: 'sim' | 'nao' | 'naoSei';
  cancer?: 'sim' | 'nao';
}
