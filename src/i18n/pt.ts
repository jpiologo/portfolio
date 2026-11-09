import type { Messages } from "./en";

const NUMBER_WORDS = [
	"zero",
	"um",
	"dois",
	"três",
	"quatro",
	"cinco",
	"seis",
	"sete",
	"oito",
	"nove",
	"dez",
	"onze",
	"doze",
	"treze",
	"catorze",
	"quinze",
	"dezesseis",
	"dezessete",
	"dezoito",
	"dezenove",
	"vinte",
];

const toWordsPt = (value: number) => NUMBER_WORDS[value] ?? String(value);

export const pt: Messages = {
	locale: "pt-BR",
	htmlLang: "pt-BR",

	common: {
		siteTitle: "João Piologo - Engenheiro de Software",
		homeLabel: "João Piologo – início",
		minRead: (minutes: number) => `${minutes} min de leitura`,
		backToTop: "Voltar ao topo",
		copyCode: "Copiar código",
		copy: "Copiar",
		codeCopied: "Código copiado",
		copied: "Copiado!",
	},

	header: {
		nav: {
			about: "Sobre",
			blog: "Blog",
			projects: "Projetos",
			testimonials: "Depoimentos",
			contact: "Contato",
		},
		toggleMenu: "Abrir menu",
		menu: "Menu",
		closeMenu: "Fechar menu",
		switchToLight: "Mudar para o modo claro",
		switchToDark: "Mudar para o modo escuro",
		lightMode: "Modo claro",
		darkMode: "Modo escuro",
	},

	hero: {
		titlePlain: "Desenvolvedor ",
		titleHighlight: "Full Stack;",
		subtitle: "Transformando ideias em",
		subtitleHighlight: "código",
		viewWork: "Ver Meus Projetos",
		getInTouch: "Entre em Contato",
	},

	about: {
		heading: "Sobre Mim",
		intro: (years: number) =>
			`Com mais de ${toWordsPt(years)} anos de experiência prática em desenvolvimento full-stack e formado em Engenharia de Software, minha atuação abrange desenvolvimento web, backend e pipelines de CI/CD. Também sou especialista na plataforma TOTVS Fluig.`,
		story:
			"Minha trajetória na tecnologia começou como aprendiz, escrevendo VBA no Excel para automatizar processos manuais — e me apaixonei por resolver problemas. Essa paixão inicial me levou à graduação em Engenharia de Software e a uma carreira arquitetando soluções corporativas complexas e escaláveis. Hoje, atuo como Consultor B2B e Engenheiro Sênior, apoiado em uma stack robusta e poliglota para construir software que entrega valor real ao negócio.",
		yearsOfExperience: "Anos de Experiência",
		projects: "Projetos",
		photoAlt: "João Piologo no Universo TOTVS 2026",
		photoCaption: "Universo TOTVS 2026, São Paulo - Brasil",
	},

	blog: {
		heading: "Blog",
		intro:
			"Notas, tutoriais e lições aprendidas sobre engenharia de software, ferramentas e as tecnologias com que trabalho todos os dias.",
		viewAll: "Ver todos os posts",
		emptyTitle: "Primeiro post em breve",
		emptyText: "Estou escrevendo sobre o que construo e aprendo. Volte em breve!",
	},

	blogIndex: {
		documentTitle: "Blog | João Piologo",
		backHome: "Voltar ao início",
		intro: "Todos os posts que escrevi sobre engenharia de software e tecnologia.",
		searchPlaceholder: "Busque posts por título ou conteúdo...",
		searchLabel: "Buscar posts",
		clearSearch: "Limpar busca",
		results: (count: number, query: string) =>
			`${count} ${count === 1 ? "resultado" : "resultados"} para "${query}"`,
		noResultsTitle: "Nenhum post encontrado",
		noResultsText: "Tente outras palavras-chave ou limpe a busca para ver todos os posts.",
	},

	blogPost: {
		notFoundDocumentTitle: "Post não encontrado | João Piologo",
		notFoundTitle: "Post não encontrado",
		notFoundText: "Este post não existe ou foi removido.",
		backToBlog: "Voltar ao blog",
		allPosts: "Todos os posts",
	},

	projects: {
		heading: "Projetos em Destaque",
		introBefore: "Aqui você encontra ",
		introBold: "apenas algumas",
		introAfter: " das soluções que construí de ponta a ponta — das decisões de arquitetura aos produtos em produção.",
		quote: "Tudo o que você pode imaginar é real.",
		quoteAuthor: "Pablo Picasso",
		carouselLabel: "Projetos em destaque",
		previous: "Projetos anteriores",
		next: "Próximos projetos",
		pageLabel: (page: number, titles: string[]) => `Página ${page}: ${titles.join(", ")}`,
		inDevelopment: "Em Desenvolvimento",
		viewCaseStudy: "Ver Estudo de Caso",
		challenge: "O Desafio",
		solution: "A Solução",
		techStack: "Stack",
		deliverables: "Principais Entregas",
		liveDemo: "Ver Demo",
		viewSource: "Ver Código",
		items: {
			cleanUp: {
				title: "CleanUp",
				subtitle: "Arquitetura Full-Stack",
				description:
					"Marketplace de serviços de ponta a ponta que conecta moradores a profissionais de limpeza — com agendamento em tempo real, painéis por perfil de acesso e agendamento automatizado.",
				details: {
					challenge:
						"Projetar e entregar um marketplace de serviços pronto para produção, com fluxos separados para usuários e administradores, horários de agendamento em tempo real e autenticação segura — do schema do banco de dados ao frontend publicado.",
					solution:
						"Construí uma arquitetura desacoplada, com o Next.js cuidando do SSR e das interações no cliente e o Nest.js fornecendo uma API REST modular baseada em decorators. O Prisma ORM mapeou os relacionamentos complexos de agendamento para o PostgreSQL, enquanto guards JWT garantem o controle de acesso por perfil em toda a plataforma.",
					techStack: ["TypeScript", "Next.js", "Nest.js", "PostgreSQL", "Prisma ORM", "TailwindCSS", "JWT Auth"],
					features: [
						"Autenticação por perfil (usuário / administrador)",
						"Sistema de agendamento com disponibilidade em tempo real",
						"Painel administrativo de gestão de serviços",
						"Interface responsiva com TailwindCSS",
					],
				},
			},
			caseCobra: {
				title: "CaseCobra",
				subtitle: "SaaS de E-Commerce",
				description:
					"Criador de capas de iPhone personalizadas com pré-visualização ao vivo, checkout com Stripe e confirmação automática de pedidos — publicado como um SaaS totalmente operacional na Vercel.",
				details: {
					challenge:
						"Construir um produto SaaS voltado ao consumidor que permita enviar imagens, pré-visualizar capas personalizadas em tempo real e concluir a compra por um fluxo de pagamento seguro — tudo em uma experiência visualmente refinada.",
					solution:
						"Implementei um configurador de capas interativo com pré-visualização ao vivo em estilo 3D usando Next.js. Integrei o Stripe para pagamentos em conformidade com o PCI, o Uploadthing para gestão de arquivos, o Kinde para autenticação e o Resend para confirmações automáticas de pedidos. Publicado na Vercel com SSR otimizado na edge.",
					techStack: [
						"TypeScript",
						"Next.js",
						"PostgreSQL",
						"Prisma ORM",
						"Stripe",
						"Kinde Auth",
						"Uploadthing",
						"Resend",
					],
					features: [
						"Pré-visualização da capa com envio de imagem",
						"Integração de pagamentos com Stripe",
						"Confirmações automáticas por e-mail via Resend",
						"Checkout protegido por autenticação",
					],
				},
			},
			inventoryCount: {
				title: "Contagem de Inventário",
				subtitle: "Digitalizando as Operações de Inventário com Fluig e Protheus",
				description:
					"O cliente tinha pouca confiança na precisão dos seus dados de inventário, que representavam milhões de reais em estoque. O processo de inventário era totalmente manual, feito com papel e caneta. Depois que o departamento de suprimentos concluía a contagem, centenas de páginas escritas à mão eram enviadas à contabilidade, onde os dados eram digitados manualmente no ERP.",
				details: {
					challenge:
						"O principal desafio foi substituir um processo de inventário altamente manual e em papel por um fluxo digital que os colaboradores pudessem adotar com facilidade, garantindo uma integração confiável e transparente com o ERP TOTVS Protheus da empresa. A solução também precisava reduzir erros, aumentar a confiança nos dados de inventário e eliminar os gargalos operacionais causados pelas passagens manuais entre departamentos.",
					solution:
						"Desenvolvi um processo mobile na plataforma TOTVS Fluig, totalmente integrado ao ERP TOTVS Protheus da empresa, permitindo que o departamento de suprimentos realizasse as contagens de inventário de forma mais confiável e integrada. Isso eliminou o trabalho manual antes necessário entre os departamentos.",
					techStack: [
						"JavaScript",
						"HTML5",
						"CSS3",
						"TOTVS Fluig",
						"TOTVS Protheus",
						"APIs REST",
						"Datasets",
						"Formulários",
						"Microsserviços",
					],
					features: [
						"Fluxo de contagem de inventário adaptado para dispositivos móveis",
						"Integração com o ERP TOTVS Protheus",
						"Captura digital de dados substituindo a contagem em papel",
						"Fluxo de dados automatizado entre suprimentos e contabilidade",
						"Redução da digitação manual no ERP",
						"Maior confiabilidade e rastreabilidade dos registros de inventário",
					],
				},
			},
			purchasingFlow: {
				title: "Fluxo de Compras",
				subtitle: "Um Fluxo de Compras de Ponta a Ponta Integrado ao TOTVS Protheus",
				description:
					"O projeto cobriu todo o fluxo de compras da empresa, incluindo solicitações de compra, pedidos de compra, conferência de recebimento, lançamento de notas fiscais de entrada e classificação de estoque. Cada etapa exigia aprovações estruturadas, prazos definidos, responsabilidades por perfil e comunicação fluida entre os departamentos. O processo também demandava integração completa com o TOTVS Protheus, com tratamento robusto de erros, logs de integração e mecanismos de contingência para garantir a continuidade operacional.",
				details: {
					challenge:
						"O principal desafio foi projetar e implementar um fluxo de compras de ponta a ponta confiável, capaz de suportar diversas etapas críticas para o negócio, aprovações hierárquicas, prazos rigorosos e responsabilidades por perfil. Ao mesmo tempo, a solução precisava garantir uma integração transparente com o TOTVS Protheus, dar visibilidade aos eventos de integração por meio de logs e se manter resiliente com estratégias de contingência em caso de falhas de comunicação ou processamento.",
					solution:
						"Projetei e implementei um fluxo de compras completo na plataforma TOTVS Fluig, totalmente integrado ao TOTVS Protheus. A solução cobriu todo o ciclo de compras, da solicitação à classificação de estoque, com formulários personalizados para cada etapa, fluxos de aprovação hierárquicos, notificações automáticas, alertas por e-mail, atribuição de responsáveis por perfil, logs de integração e mecanismos de contingência para tratar erros de integração com o ERP de forma segura e eficiente.",
					techStack: [
						"JavaScript",
						"HTML5",
						"CSS3",
						"TOTVS Fluig",
						"TOTVS Protheus",
						"APIs REST",
						"Datasets",
						"Formulários",
						"Motor de Workflow",
						"Notificações por E-mail",
					],
					features: [
						"Fluxo de compras de ponta a ponta",
						"Gestão de solicitações e pedidos de compra",
						"Conferência de recebimento e processo de nota fiscal de entrada",
						"Fluxo de classificação de estoque",
						"Regras de aprovação hierárquica",
						"Atribuição de responsáveis por perfil",
						"Formulários personalizados para cada etapa do fluxo",
						"Notificações personalizadas e alertas por e-mail",
						"Integração completa com o TOTVS Protheus",
						"Logs de integração para monitoramento e rastreabilidade",
						"Mecanismos de contingência para falhas de integração",
						"Prazos definidos e controle de processo orientado a SLA",
					],
				},
			},
			vehicleSales: {
				title: "Fluxo de Venda de Veículos",
				subtitle: "Um Fluxo Inteligente de Faturamento de Veículos com Integração a ERP e IA",
				description:
					"Atuei em um fluxo de venda e faturamento de veículos na plataforma TOTVS Fluig para uma grande concessionária. O processo incluía validação de documentos no momento da compra, consulta direta a dados do ERP, gateways de decisão para direcionar o fluxo corretamente e automações de venda que reduziram drasticamente o tempo necessário para faturar um veículo. Combinando inteligência de workflow, análise de documentos com IA e integração com órgãos reguladores, a solução tornou o processo de vendas mais rápido, confiável e eficiente.",
				details: {
					challenge:
						"O principal desafio foi simplificar um processo complexo de venda e faturamento de veículos, que envolvia validação de documentos, consulta a dados do ERP, exigências regulatórias e diversos pontos de decisão. A solução precisava reduzir o tempo para concluir uma venda, impedir o envio de documentos inválidos e garantir que cada transação seguisse o caminho correto de negócio e conformidade com o mínimo de esforço manual.",
					solution:
						"Contribuí para a implementação e evolução de um fluxo de venda de veículos na plataforma TOTVS Fluig, com foco em velocidade, confiabilidade e automação. A solução incluiu integração com IA para análise de documentos durante a compra, consulta direta aos dados do ERP da empresa, gateways de decisão para definir o caminho correto do processo e automações de venda que permitiram aos vendedores faturar veículos em poucos minutos, usando apenas as informações essenciais. O fluxo também contemplou as integrações necessárias com órgãos reguladores, mantendo o processo em conformidade e eficiente.",
					techStack: [
						"JavaScript",
						"HTML5",
						"CSS3",
						"TOTVS Fluig",
						"Integração com ERP",
						"Análise de Documentos com IA",
						"APIs REST",
						"Datasets",
						"Formulários",
						"Motor de Workflow",
					],
					features: [
						"Validação de documentos com IA na compra do veículo",
						"Consulta direta a dados do ERP",
						"Gateways de decisão para roteamento dinâmico do fluxo",
						"Automação do faturamento de veículos",
						"Redução do tempo para concluir uma venda",
						"Prevenção do envio de documentos inválidos",
						"Orientação do processo com base em regras de negócio",
						"Integração com órgãos reguladores",
						"Apoio à conformidade operacional",
						"Experiência simplificada para o vendedor, com o mínimo de digitação",
					],
				},
			},
			hrWorkflows: {
				title: "Fluxos de RH",
				subtitle: "Automatizando o Ciclo de Vida do Colaborador com Fluig, Protheus e Active Directory",
				description:
					"Desenvolvi fluxos de RH na plataforma TOTVS Fluig para apoiar os processos de admissão e movimentação interna de colaboradores. A solução foi profundamente integrada ao ERP TOTVS Protheus da empresa, usando os departamentos e a hierarquia cadastrados para conduzir os fluxos de aprovação automaticamente. Também automatizou a criação e a atualização de acessos aos sistemas e ao Active Directory conforme o cargo de cada colaborador, garantindo integrações mais rápidas, transições mais seguras e controle de acesso consistente em toda a organização.",
				details: {
					challenge:
						"O principal desafio foi construir fluxos de RH capazes de tratar admissões e movimentações internas com agilidade, confiabilidade e governança. A solução precisava refletir a estrutura organizacional da empresa definida no TOTVS Protheus, direcionar as aprovações de acordo com departamentos e hierarquias e automatizar a concessão de acessos e as mudanças de permissão nos sistemas e no Active Directory conforme o cargo e a movimentação de cada colaborador.",
					solution:
						"Projetei e implementei fluxos de RH na plataforma TOTVS Fluig para automatizar processos-chave do ciclo de vida do colaborador, incluindo admissão e movimentação interna. Os fluxos foram totalmente integrados ao TOTVS Protheus para identificar departamentos, hierarquias e cargos, permitindo o roteamento dinâmico das aprovações. Além disso, a solução automatizou a criação de contas nos sistemas e no Active Directory, definiu os níveis de acesso de acordo com o cargo e atualizou direitos e permissões sempre que um colaborador mudava de função na empresa.",
					techStack: [
						"JavaScript",
						"HTML5",
						"CSS3",
						"TOTVS Fluig",
						"TOTVS Protheus",
						"Active Directory",
						"APIs REST",
						"Datasets",
						"Formulários",
						"Motor de Workflow",
					],
					features: [
						"Fluxo de admissão de colaboradores",
						"Fluxo de movimentação de colaboradores",
						"Fluxos de aprovação baseados em departamentos e hierarquias do TOTVS Protheus",
						"Concessão automática de acessos aos sistemas",
						"Criação automática de contas no Active Directory",
						"Atribuição de níveis de acesso por cargo",
						"Atualização automática de permissões conforme a movimentação",
						"Governança de acessos consistente entre sistemas",
						"Menos esforço manual na integração de novos colaboradores",
						"Transições de colaboradores mais seguras e rápidas",
					],
				},
			},
			fluigPipeline: {
				title: "Pipeline de Deploy do Fluig",
				subtitle: "Automatizando Deploys do Fluig com Jenkins e Entrega Baseada em Branches",
				description:
					"Desenvolvi um pipeline de deploy automatizado com Jenkins para publicar formulários, datasets, workflows e widgets na plataforma Fluig. O pipeline monitorava merges em branches predefinidas e disparava o deploy automaticamente, reduzindo a intervenção manual e acelerando significativamente o tempo de entrega. Isso trouxe mais consistência, confiabilidade e velocidade ao processo de release dos projetos Fluig.",
				details: {
					challenge:
						"O principal desafio foi criar um pipeline de deploy confiável, capaz de identificar e publicar automaticamente diferentes artefatos do Fluig, como formulários, datasets, workflows e widgets, a partir de merges em branches específicas. A solução precisava reduzir o tempo de deploy, minimizar erros manuais e tornar o processo de release mais consistente e escalável.",
					solution:
						"Projetei e implementei um pipeline automatizado no Jenkins, responsável por publicar os artefatos do Fluig sempre que ocorriam merges em branches predefinidas. O pipeline cuidava da publicação de formulários, datasets, workflows e widgets, tornando a entrega mais rápida, segura e muito menos dependente de execução manual. Como resultado, o tempo de deploy caiu drasticamente e o fluxo de release ficou mais eficiente e padronizado.",
					techStack: ["Jenkins", "Groovy", "Fluig", "CI/CD", "APIs REST", "Git", "Automação", "DevOps"],
					features: [
						"Deploy automático disparado por merges em branches",
						"Publicação de formulários do Fluig",
						"Publicação de datasets",
						"Publicação de workflows",
						"Publicação de widgets",
						"Menos esforço manual nos deploys",
						"Ciclo de release mais rápido e consistente",
						"Estratégia de deploy baseada em branches",
						"Maior confiabilidade no processo de entrega",
						"Fluxo de CI/CD escalável para projetos Fluig",
					],
				},
			},
			taskManager: {
				title: "Sistema de Gestão de Tarefas",
				subtitle: "Ferramenta de Produtividade",
				description:
					"Gerenciador de tarefas baseado na técnica Pomodoro, com armazenamento local persistente — ajudando a organizar sessões de trabalho focado e acompanhar o progresso sem a necessidade de criar conta.",
				details: {
					challenge:
						"Criar uma ferramenta de produtividade sem atritos, que combine gestão de tarefas com a técnica Pomodoro e armazene todos os dados no navegador, sem exigir contas de usuário.",
					solution:
						"Construí um CRUD leve em JavaScript puro com persistência em localStorage. O timer alterna automaticamente entre períodos de foco e de pausa, incentivando sessões de trabalho estruturadas. A interface limpa garante curva de aprendizado zero.",
					techStack: ["JavaScript", "HTML5", "CSS3", "LocalStorage API"],
					features: [
						"Timer Pomodoro com ciclos de foco / pausa",
						"Gestão de tarefas (CRUD) com persistência",
						"Arquitetura sem dependências",
						"Publicado na Vercel",
					],
				},
			},
			weatherApp: {
				title: "App de Previsão do Tempo",
				subtitle: "Integração com API",
				description:
					"Painel de clima em tempo real que consome a API do OpenWeatherMap — demonstrando padrões limpos de integração com APIs e visualização de dados responsiva.",
				details: {
					challenge:
						"Construir um app de clima limpo e responsivo, que busque dados em tempo real de uma API externa e apresente informações meteorológicas complexas em um layout intuitivo e fácil de ler.",
					solution:
						"Implementei a busca assíncrona de dados com tratamento de erros e estados de carregamento adequados. A interface exibe temperatura, umidade, velocidade do vento e ícones de condição em uma hierarquia visual clara. Debounce na digitação e validação de cidade garantem uma busca fluida.",
					techStack: ["JavaScript", "OpenWeatherMap API", "APIs REST", "JSON"],
					features: [
						"Dados do clima em tempo real por cidade",
						"Exibição de temperatura, umidade e vento",
						"Tratamento de erros para buscas inválidas",
						"Layout responsivo e adaptado para celular",
					],
				},
			},
			vocalVault: {
				title: "Vocal Vault",
				subtitle: "Interface por Voz",
				description:
					"Jogo no navegador controlado inteiramente por voz — explorando a Web Speech API para criar interações acessíveis e sem uso das mãos.",
				details: {
					challenge:
						"Explorar os recursos de reconhecimento de fala nativos do navegador para criar uma experiência interativa totalmente controlada por voz — indo além das interfaces tradicionais baseadas em cliques.",
					solution:
						"Usei a API webkitSpeechRecognition para capturar e interpretar a voz em tempo real. Construí um jogo de adivinhação de números com retorno claro por voz, mostrando como interfaces de fala podem criar experiências envolventes e acessíveis sem nenhuma entrada manual.",
					techStack: ["JavaScript", "Web Speech API", "HTML5", "CSS3"],
					features: [
						"Reconhecimento de comandos de voz em tempo real",
						"Jogo interativo de adivinhação de números",
						"Retorno em áudio para as respostas do usuário",
						"API nativa do navegador, sem dependências",
					],
				},
			},
		},
	},

	testimonials: {
		heading: "Depoimentos",
		intro:
			"Não precisa acreditar só na minha palavra. Veja o que dizem as pessoas que trabalharam comigo sobre o meu impacto, minhas habilidades e a nossa colaboração.",
		leaveComment: "Deixe um comentário!",
		loading: "Carregando comentários incríveis...",
		errorTitle: "Ops! Algo deu errado",
		errorText: "Não foi possível carregar os depoimentos agora. Tente novamente mais tarde.",
		tryAgain: "Tentar novamente",
		emptyTitle: "Nenhum comentário ainda",
		emptyText: "Seja o primeiro a compartilhar sua experiência trabalhando comigo. Seu feedback é muito bem-vindo!",
		writeFirst: "Escrever o primeiro comentário",
	},

	commentForm: {
		title: "Deixe um depoimento",
		close: "Fechar",
		successTitle: "Obrigado!",
		successText: "Seu comentário foi enviado com sucesso e aparecerá publicamente após a revisão.",
		closeWindow: "Fechar janela",
		nameLabel: "Seu nome",
		namePlaceholder: "João da Silva",
		companyLabel: "Empresa / Cargo",
		companyPlaceholder: "Empresa X / CEO",
		commentLabel: "Seu comentário",
		commentPlaceholder: "Conte como foi trabalhar comigo. Como enfrentamos juntos os desafios e projetos?",
		cancel: "Cancelar",
		submit: "Enviar",
		reviewNotice: "Os comentários são enviados com segurança e revisados manualmente antes de serem exibidos.",
		requiredError: "Nome e comentário são campos obrigatórios.",
		genericError: "Ocorreu um erro inesperado ao enviar. Tente novamente.",
	},

	contact: {
		heading: "Entre em Contato",
		intro: "Estou sempre aberto a conversar sobre novos projetos, ideias criativas ou oportunidades de fazer parte da sua visão.",
		location: "Curitiba, PR - Brasil",
		nameLabel: "Nome",
		namePlaceholder: "Seu nome",
		messageLabel: "Mensagem",
		messagePlaceholder: "Sua mensagem...",
		send: "Enviar",
		mailSubject: (name: string) => `Contato pelo portfólio - ${name}`,
	},

	footer: {
		rights: "Todos os direitos reservados.",
		downloads: "Downloads",
		resumes: {
			en: "Currículo (Inglês)",
			ptBr: "Currículo (Português)",
		},
	},
};
