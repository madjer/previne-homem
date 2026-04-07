export interface Checkup {
  pressaoConhece: boolean | null;
  pressaoStatus?: 'normal' | 'alta' | 'naoLembro';
  pressaoAlta: 'sim' | 'nao' | 'naoSei';
  diabetes: 'sim' | 'nao' | 'naoSei';
  fuma: 'nao' | 'asVezes' | 'todoDia';
  alcool: 'nao' | 'asVezes' | 'quaseTodoDia' | 'todoDia';
  atividadeFisica: boolean | null;
  sedentario: 'sim' | 'nao' | 'naoSei';
  humor: 'mal' | 'ruim' | 'neutro' | 'bem' | 'otimo';
  peso?: number;
  altura?: number;
  data: Date;
}
