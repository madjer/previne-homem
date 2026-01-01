export interface Checkup {
  pressaoConhece: boolean | null;
  pressaoStatus?: 'normal' | 'alta' | 'naoLembro';
  diabetes: 'sim' | 'nao' | 'naoSei';
  fuma: 'nao' | 'asVezes' | 'todoDia';
  alcool: 'nao' | 'asVezes' | 'quaseTodoDia' | 'todoDia';
  atividadeFisica: boolean | null;
  peso?: number;
  altura?: number;
  data: Date;
}