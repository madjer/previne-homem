import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface QA {
  pergunta: string;
  resposta: string;
}

interface Doenca {
  id: string;
  titulo: string;
  icone: string;
  cor: string;
  corBg: string;
  corBorda: string;
  intro: string;
  qa: QA[];
  aberto: boolean;
}

interface Secao {
  titulo: string;
  doencas: Doenca[];
}

@Component({
  standalone: true,
  selector: 'app-corpo-exames',
  imports: [CommonModule, RouterModule],
  templateUrl: './corpo-exames.html',
})
export class CorpoExamesComponent {

  secoes: Secao[] = [
    {
      titulo: 'Doenças Crônicas',
      doencas: [
        {
          id: 'diabetes',
          titulo: 'Diabetes',
          icone: '🩸',
          cor: 'text-blue-500',
          corBg: 'bg-blue-50',
          corBorda: 'border-blue-100',
          intro: 'O diabetes é silencioso. Muitos homens só descobrem quando já há complicações. Com acompanhamento, é possível viver bem.',
          qa: [
            { pergunta: 'O que é o diabetes?', resposta: 'O diabetes ocorre quando o corpo não consegue controlar adequadamente o açúcar no sangue. O Tipo 2 é o mais comum entre homens adultos — está ligado ao sobrepeso, sedentarismo e histórico familiar.' },
            { pergunta: 'Por que é perigoso se não tratado?', resposta: 'Com o tempo, o excesso de açúcar danifica vasos sanguíneos e nervos, podendo causar cegueira, insuficiência renal, amputações, infarto, AVC e disfunção erétil.' },
            { pergunta: 'O que é a hemoglobina glicada?', resposta: 'É um exame que mostra a média do açúcar no sangue nos últimos 3 meses. É o melhor indicador do controle do diabetes a longo prazo. A meta é abaixo de 7%.' },
            { pergunta: 'Diabetes afeta a vida sexual?', resposta: 'Sim. O diabetes não controlado afeta a circulação e os nervos, sendo uma das principais causas de disfunção erétil. O bom controle glicêmico protege essa função.' },
          ],
          aberto: false,
        },
        {
          id: 'hipertensao',
          titulo: 'Hipertensão (Pressão Alta)',
          icone: '💓',
          cor: 'text-red-700',
          corBg: 'bg-red-50',
          corBorda: 'border-red-200',
          intro: 'A pressão alta raramente dá sintomas. É chamada de "assassina silenciosa". Controlar é a melhor forma de evitar AVC e infarto.',
          qa: [
            { pergunta: 'O que é a pressão arterial?', resposta: 'É a força que o sangue exerce contra as paredes das artérias. Tem dois valores: o maior (sistólica) e o menor (diastólica). Exemplo: 120/80.' },
            { pergunta: 'Por que não dá sintomas?', resposta: 'A maioria das pessoas descobre a pressão alta somente em consulta de rotina — ou após um infarto ou AVC. Por isso o monitoramento regular é essencial.' },
            { pergunta: 'O que a pressão alta faz com o corpo?', resposta: 'Com o tempo, danifica as artérias e força o coração a trabalhar mais. As consequências incluem infarto, AVC, insuficiência renal e problemas de visão.' },
            { pergunta: 'Por que não posso parar o remédio?', resposta: 'Porque a pressão está controlada graças ao medicamento. Ao parar, ela sobe novamente. A sensação de bem-estar não significa que a pressão está normal sem o remédio.' },
          ],
          aberto: false,
        },
        {
          id: 'cardiovascular',
          titulo: 'Doenças Cardiovasculares',
          icone: '❤️',
          cor: 'text-pink-700',
          corBg: 'bg-pink-50',
          corBorda: 'border-pink-200',
          intro: 'Doenças do coração são a principal causa de morte entre homens no Brasil. A maioria pode ser evitada com hábitos saudáveis.',
          qa: [
            { pergunta: 'Como o coração adoece?', resposta: 'As artérias que irrigam o coração podem acumular gordura por dentro (aterosclerose), estreitando o canal de passagem. Quando uma artéria entope completamente, ocorre o infarto.' },
            { pergunta: 'O que é o risco cardiovascular?', resposta: 'É um cálculo feito pelo profissional de saúde que estima a chance de sofrer um evento cardíaco nos próximos 10 anos, considerando pressão, colesterol, tabagismo, diabetes e idade.' },
            { pergunta: 'Homens têm mais risco que mulheres?', resposta: 'Sim. Hormônios femininos protegem o coração das mulheres até a menopausa. Os homens não têm essa proteção, aumentando o risco de infarto especialmente a partir dos 45 anos.' },
            { pergunta: 'O que é infarto silencioso?', resposta: 'Alguns infartos ocorrem sem dor intensa — apenas com cansaço, mal-estar ou dor leve. Por isso o acompanhamento regular é fundamental mesmo sem sintomas.' },
          ],
          aberto: false,
        },
        {
          id: 'dislipidemia',
          titulo: 'Dislipidemia (Colesterol Alto)',
          icone: '🔬',
          cor: 'text-orange-700',
          corBg: 'bg-orange-50',
          corBorda: 'border-orange-200',
          intro: 'O colesterol alto não dói, não dá sintomas — mas entope as veias por dentro. É um dos principais fatores para infarto e AVC.',
          qa: [
            { pergunta: 'O que é colesterol?', resposta: 'O colesterol é uma gordura produzida pelo fígado e ingerida pelos alimentos. Em quantidades certas, é necessário ao organismo. Em excesso, entope as artérias.' },
            { pergunta: 'LDL e HDL: qual a diferença?', resposta: 'LDL ("o ruim"): deposita gordura nas artérias — quanto menor, melhor. HDL ("o bom"): remove gordura das artérias — quanto maior, melhor.' },
            { pergunta: 'O que eleva os triglicérides?', resposta: 'Principalmente o consumo excessivo de açúcar, carboidratos refinados e álcool — não apenas gorduras.' },
            { pergunta: 'A alimentação resolve sozinha?', resposta: 'Para muitos pacientes, mudanças na dieta e exercício são suficientes. Em outros casos, o médico pode indicar medicação (estatinas), segura e eficaz quando usada corretamente.' },
          ],
          aberto: false,
        },
        {
          id: 'obesidade',
          titulo: 'Obesidade (Acima do Peso)',
          icone: '⚖️',
          cor: 'text-yellow-700',
          corBg: 'bg-yellow-50',
          corBorda: 'border-yellow-200',
          intro: 'Estar acima do peso aumenta o risco de diabetes, hipertensão, doenças do coração e alguns tipos de câncer. Tratar é cuidar da saúde.',
          qa: [
            { pergunta: 'Por que a gordura abdominal é mais perigosa?', resposta: 'A gordura na barriga (visceral) envolve os órgãos internos e libera substâncias inflamatórias que aumentam o risco de diabetes, doenças cardíacas e câncer.' },
            { pergunta: 'O que é o IMC?', resposta: 'O Índice de Massa Corporal divide o peso (kg) pela altura ao quadrado (m). É uma referência útil, mas não avalia a composição corporal — por isso a circunferência abdominal também é importante.' },
            { pergunta: 'Existe cirurgia pelo SUS?', resposta: 'Sim. A cirurgia bariátrica está disponível pelo SUS para obesidade grave (IMC acima de 40, ou acima de 35 com doenças associadas) que não respondeu ao tratamento clínico.' },
            { pergunta: 'Obesidade é doença?', resposta: 'Sim. É reconhecida pela OMS como doença crônica. Não é falta de força de vontade — envolve fatores genéticos, hormonais, ambientais e psicológicos.' },
          ],
          aberto: false,
        },
        {
          id: 'prostata',
          titulo: 'Câncer de Próstata',
          icone: '🎗️',
          cor: 'text-indigo-700',
          corBg: 'bg-indigo-50',
          corBorda: 'border-indigo-200',
          intro: 'O câncer de próstata é o mais comum entre os homens no Brasil. Quando descoberto cedo, tem até 95% de chance de cura.',
          qa: [
            { pergunta: 'O que é a próstata?', resposta: 'É uma glândula do sistema reprodutor masculino, do tamanho de uma noz, localizada abaixo da bexiga. Sua função é produzir parte do líquido seminal.' },
            { pergunta: 'O que é o PSA?', resposta: 'O PSA (Antígeno Prostático Específico) é uma proteína produzida pela próstata. Valores elevados no sangue podem indicar inflamação, hiperplasia benigna ou câncer — o médico é quem interpreta.' },
            { pergunta: 'Por que o toque retal é importante?', resposta: 'Permite que o médico avalie o tamanho, forma e textura da próstata. É rápido, indolor e fundamental para o rastreamento. Não tem relação com sexualidade — é um procedimento médico.' },
            { pergunta: 'Câncer de próstata tem cura?', resposta: 'Quando detectado precocemente, a taxa de cura é superior a 95%. O problema é que nos estágios iniciais não dá sintomas — por isso o rastreamento regular salva vidas.' },
          ],
          aberto: false,
        },
      ],
    },
    {
      titulo: 'Saúde Comportamental',
      doencas: [
        {
          id: 'tabagismo',
          titulo: 'Tabagismo (Fumar)',
          icone: '🚬',
          cor: 'text-gray-700',
          corBg: 'bg-gray-50',
          corBorda: 'border-gray-300',
          intro: 'O cigarro é responsável por mais de 40 tipos de câncer e é um dos principais fatores para infarto e AVC. Parar é possível.',
          qa: [
            { pergunta: 'Por que o cigarro vicia?', resposta: 'A nicotina ativa o sistema de recompensa do cérebro, causando sensação de prazer e alívio. Com o tempo, o cérebro passa a depender dessa substância — por isso parar sem apoio é difícil.' },
            { pergunta: 'O cigarro light é menos prejudicial?', resposta: 'Não. O fumante de cigarro light tende a inalar mais profundamente para obter a mesma nicotina, expondo os pulmões a igual ou maior dano.' },
            { pergunta: 'O que acontece quando se para de fumar?', resposta: '20 min: pressão normaliza. 24h: risco de infarto começa a cair. 1 ano: risco de doença coronariana cai 50%. 10 anos: risco de câncer de pulmão reduz 50%.' },
            { pergunta: 'O SUS tem tratamento gratuito?', resposta: 'Sim. O Programa Nacional de Controle do Tabagismo oferece consultas, grupos de apoio e medicamentos como bupropiona e vareniclina gratuitamente. Pergunte na sua UBS.' },
          ],
          aberto: false,
        },
        {
          id: 'alcool',
          titulo: 'Uso Abusivo de Álcool',
          icone: '🍺',
          cor: 'text-amber-700',
          corBg: 'bg-amber-50',
          corBorda: 'border-amber-200',
          intro: 'O álcool em excesso causa doenças no fígado, coração, pâncreas, prejudica a saúde mental e está associado a acidentes e violência.',
          qa: [
            { pergunta: 'O que é uso abusivo de álcool?', resposta: 'É o consumo que causa problemas repetidos na saúde, no trabalho, nas relações ou na lei. Não depende da quantidade — depende do impacto na vida.' },
            { pergunta: 'O álcool afeta a saúde masculina de forma específica?', resposta: 'Sim. O consumo abusivo reduz a testosterona, causa disfunção erétil, aumenta o risco de cânceres e está associado a violência e acidentes.' },
            { pergunta: 'Beber para relaxar é um problema?', resposta: 'Usar o álcool como principal estratégia para lidar com estresse ou ansiedade é um sinal de alerta. Existem formas mais saudáveis e eficazes de gerenciar o estresse.' },
            { pergunta: 'Onde buscar ajuda?', resposta: 'UBS (ponto de partida sempre disponível), CAPS AD (Centro de Atenção Psicossocial Álcool e Drogas) e AA (Alcoólicos Anônimos — grupos gratuitos em todo o Brasil).' },
          ],
          aberto: false,
        },
        {
          id: 'sedentarismo',
          titulo: 'Sedentarismo',
          icone: '🏃',
          cor: 'text-blue-500',
          corBg: 'bg-blue-50',
          corBorda: 'border-blue-100',
          intro: 'A falta de atividade física é um dos maiores riscos à saúde, comparável ao tabagismo. Movimentar o corpo previne diabetes, hipertensão e depressão.',
          qa: [
            { pergunta: 'Por que sentar muito é perigoso?', resposta: 'Ficar sentado por muitas horas reduz o metabolismo e aumenta o risco de trombose, diabetes e doenças cardiovasculares — mesmo em pessoas que se exercitam. Levantar a cada hora já faz diferença.' },
            { pergunta: 'Qual a diferença entre atividade física e exercício?', resposta: 'Atividade física é qualquer movimento (caminhar, subir escadas). Exercício é atividade planejada (academia, futebol, natação). Ambos são benéficos — o importante é sair do sedentarismo.' },
            { pergunta: 'Exercício e testosterona têm relação?', resposta: 'Sim. A atividade física regular — especialmente exercícios de força — estimula a produção de testosterona, melhora o humor, a disposição e a função sexual.' },
            { pergunta: 'Preciso de academia?', resposta: 'Não. Caminhada rápida, subir escadas, ciclismo, dançar, futebol, natação — qualquer atividade que eleve levemente o coração e a respiração já traz benefícios.' },
          ],
          aberto: false,
        },
      ],
    },
    {
      titulo: 'Saúde Mental',
      doencas: [
        {
          id: 'saudeMental',
          titulo: 'Ansiedade, Depressão, Estresse e Insônia',
          icone: '🧠',
          cor: 'text-rose-700',
          corBg: 'bg-rose-50',
          corBorda: 'border-rose-200',
          intro: 'Homens adoecem emocionalmente tanto quanto mulheres, mas pedem menos ajuda. Isso faz com que muitos cheguem ao limite sem apoio.',
          qa: [
            { pergunta: 'Por que homens pedem menos ajuda?', resposta: 'Desde cedo, muitos homens aprendem que demonstrar vulnerabilidade é sinal de fraqueza. Essa crença cultural faz com que adiem a busca por apoio, muitas vezes usando o álcool como "válvula de escape".' },
            { pergunta: 'Depressão em homens: como se manifesta diferente?', resposta: 'Enquanto mulheres costumam demonstrar tristeza, homens com depressão frequentemente apresentam irritabilidade, agressividade, isolamento e queda no desempenho profissional — sintomas menos reconhecidos como depressão.' },
            { pergunta: 'O que é a ansiedade?', resposta: 'É uma resposta normal ao perigo. Torna-se transtorno quando é excessiva, desproporcional e interfere no dia a dia. Tem tratamento eficaz com psicoterapia e, quando necessário, medicação.' },
            { pergunta: 'Insônia e saúde masculina', resposta: 'A privação de sono está associada a aumento de peso, piora da pressão arterial, redução da testosterona, queda no rendimento profissional e maior risco de acidentes.' },
            { pergunta: 'Onde buscar ajuda?', resposta: 'UBS (médico e enfermeiro da equipe), CAPS (casos mais graves) e CVV — Centro de Valorização da Vida: ligue 188 (24h, gratuito).' },
          ],
          aberto: false,
        },
      ],
    },
    {
      titulo: 'Paternidade e Planejamento',
      doencas: [
        {
          id: 'vasectomia',
          titulo: 'Vasectomia',
          icone: '👨‍👧',
          cor: 'text-blue-500',
          corBg: 'bg-blue-50',
          corBorda: 'border-blue-100',
          intro: 'A vasectomia é simples, segura e eficiente (mais de 99%). Não afeta o desempenho sexual.',
          qa: [
            { pergunta: 'Como funciona a vasectomia?', resposta: 'É um procedimento cirúrgico simples, com anestesia local, que corta e fecha os dois canais deferentes — os tubos que conduzem os espermatozoides. Sem espermatozoides no sêmen, a gravidez não ocorre.' },
            { pergunta: 'Quanto tempo dura e como é a recuperação?', resposta: 'O procedimento dura cerca de 20 a 30 minutos. A recuperação é de 2 a 3 dias com repouso relativo. A dor é leve e controlada com analgésico comum.' },
            { pergunta: 'Quando começa a fazer efeito?', resposta: 'A esterilização não é imediata. É necessário espermograma após 3 meses ou 20 ejaculações para confirmar a ausência de espermatozoides. Nesse período, use preservativo.' },
            { pergunta: 'Afeta a vida sexual?', resposta: 'Não. A produção de testosterona, a libido, a ereção e a ejaculação continuam normais. A única diferença é que o sêmen não contém mais espermatozoides.' },
          ],
          aberto: false,
        },
      ],
    },
    {
      titulo: 'Prevenção',
      doencas: [
        {
          id: 'ist',
          titulo: 'ISTs e HIV',
          icone: '❤️‍🔥',
          cor: 'text-purple-700',
          corBg: 'bg-purple-50',
          corBorda: 'border-purple-200',
          intro: 'As ISTs muitas vezes não dão sintomas, mas podem causar complicações graves e ser transmitidas sem que o portador saiba.',
          qa: [
            { pergunta: 'Quais são as ISTs mais comuns entre homens?', resposta: 'Sífilis, gonorreia, clamídia, herpes genital, HPV e HIV. Muitas não apresentam sintomas, mas podem causar complicações sérias.' },
            { pergunta: 'Como o HIV se transmite?', resposta: 'Por relações sexuais sem preservativo, compartilhamento de seringas e, mais raramente, de mãe para filho. Não se transmite por abraço, aperto de mão ou utensílios.' },
            { pergunta: 'O que é a PrEP?', resposta: 'Profilaxia Pré-Exposição: medicamento diário para pessoas com alto risco de exposição ao HIV. Quando usada corretamente, reduz em mais de 99% o risco de infecção. É gratuita no SUS.' },
            { pergunta: 'O que é a PEP?', resposta: 'Profilaxia Pós-Exposição: tratamento de emergência iniciado em até 72 horas após situação de risco. Disponível em UBS e UPAs, gratuitamente.' },
            { pergunta: 'HPV afeta homens?', resposta: 'Sim. O HPV pode causar verrugas genitais e está associado a cânceres de pênis, ânus e orofaringe. A vacina está disponível no SUS para meninos de 9 a 14 anos.' },
          ],
          aberto: false,
        },
        {
          id: 'violencias',
          titulo: 'Prevenção de Violências e Acidentes',
          icone: '🛡️',
          cor: 'text-blue-500',
          corBg: 'bg-blue-50',
          corBorda: 'border-blue-100',
          intro: 'Homens são 4 vezes mais vítimas de assassinato e respondem por 80% das mortes no trânsito. A maior parte é evitável.',
          qa: [
            { pergunta: 'Por que homens morrem mais por causas externas?', resposta: 'Fatores culturais como impulsividade, subestimação do risco, consumo de álcool e necessidade de "provar coragem" contribuem para maior exposição de homens a situações de risco.' },
            { pergunta: 'Violência doméstica: homens também são vítimas?', resposta: 'Sim. Embora em menor proporção, homens também sofrem violência física, psicológica e patrimonial. Procurar ajuda não é fraqueza — é direito.' },
            { pergunta: 'O que fazer em situação de violência?', resposta: 'Procure a UBS, o CRAS ou a delegacia mais próxima. Em caso de risco imediato: ligue 190 (Polícia) ou 192 (SAMU).' },
            { pergunta: 'Acidentes de trabalho: como prevenir?', resposta: 'Use sempre os EPIs fornecidos. Comunique condições inseguras ao responsável. Não trabalhe com cansaço extremo em atividades de risco. Acidentes de trabalho têm cobertura pelo INSS.' },
          ],
          aberto: false,
        },
      ],
    },
  ];

  toggleDoenca(doenca: Doenca) {
    doenca.aberto = !doenca.aberto;
  }
}
