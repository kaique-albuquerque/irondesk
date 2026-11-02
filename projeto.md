# Projeto: IronDesk — Sistema de Gestão Inteligente para Academias

Atue como um desenvolvedor Full Stack Sênior, arquiteto de software e especialista em UI/UX Design.

Sua missão é desenvolver um sistema web completo de gestão de academias, com qualidade de produto comercial, destinado a ser publicado em um repositório público no GitHub como projeto de portfólio profissional.

O objetivo é demonstrar capacidade de transformar problemas reais de gestão em uma solução de software organizada, escalável, intuitiva e visualmente profissional.

Não quero um projeto com aparência de exercício de programação, template genérico ou interface produzida automaticamente por IA.

Quero um sistema que pareça um produto SaaS real, desenvolvido cuidadosamente, com identidade visual própria, boa experiência do usuário e arquitetura bem planejada.

---

# 1. Conceito do projeto

Desenvolva o **IronDesk**, uma plataforma de gestão para academias de musculação, centros de treinamento e estúdios fitness.

O sistema deverá centralizar a administração da academia, permitindo acompanhar alunos, matrículas, planos, pagamentos, treinos e frequência em um único ambiente.

Problemas que o sistema pretende solucionar:

- Falta de controle centralizado dos alunos.
- Dificuldade para acompanhar matrículas e vencimentos.
- Inadimplência e falta de visibilidade financeira.
- Controle manual de frequência.
- Dificuldade para organizar planos e contratos.
- Falta de acompanhamento da evolução dos alunos.
- Dificuldade para professores gerenciarem treinos.
- Ausência de indicadores gerenciais.
- Dependência de planilhas e controles manuais.

A solução deve proporcionar uma visão clara da operação da academia, tanto para gestores quanto para funcionários e professores.

# 2. Tecnologias e arquitetura

Utilize uma stack moderna, com tecnologias valorizadas pelo mercado.

Stack sugerida:

- React.
- TypeScript.
- Vite.
- Tailwind CSS.
- Lucide React.
- Recharts.
- React Router.
- React Hook Form.
- Zod para validação.
- LocalStorage para persistência dos dados demonstrativos.

Você pode propor pequenas alterações justificadas, mas priorize simplicidade e tecnologias amplamente utilizadas.

## Arquitetura obrigatória

O projeto precisa ser 100% modularizado.

Regras:

1. Nenhum arquivo de código pode ultrapassar 150 linhas.
2. Cada componente deve possuir uma responsabilidade específica.
3. Separar páginas, componentes, hooks, serviços, interfaces, tipos, dados e configurações.
4. Não concentrar funcionalidades no App.tsx.
5. Utilizar componentes reutilizáveis.
6. Evitar duplicação de código.
7. Utilizar TypeScript corretamente.
8. Evitar o uso indiscriminado de any.
9. Separar completamente a interface da camada de dados.
10. Preparar a arquitetura para receber um backend real futuramente.

Estrutura sugerida:

```text
irondesk/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── layout/
│   │   ├── dashboard/
│   │   ├── students/
│   │   ├── plans/
│   │   ├── payments/
│   │   ├── workouts/
│   │   └── shared/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   │   ├── api/
│   │   ├── mock/
│   │   └── storage/
│   ├── interfaces/
│   ├── types/
│   ├── utils/
│   ├── constants/
│   ├── data/
│   ├── routes/
│   ├── styles/
│   ├── App.tsx
│   └── main.tsx
├── README.md
├── package.json
└── vite.config.ts
```

Adapte a estrutura conforme a necessidade real do projeto.

Não crie arquivos ou abstrações sem finalidade.

# 3. Backend simulado e funcionamento local

Este projeto deverá funcionar completamente sem depender de backend externo.

Utilize uma arquitetura baseada em Mock API.

Requisitos:

- Todas as funcionalidades devem funcionar com dados simulados.
- Criar serviços separados por domínio.
- Definir contratos utilizando interfaces TypeScript.
- Simular chamadas assíncronas com Promises.
- Simular discretamente o tempo de resposta das APIs.
- Implementar CRUD completo quando aplicável.
- Utilizar LocalStorage para persistência.
- Criar dados iniciais realistas.
- Permitir restaurar os dados originais.
- Tratar erros e validações.
- Não deixar botões ou funcionalidades importantes sem implementação.

A interface nunca deverá acessar diretamente o LocalStorage.

Exemplo:

```text
pages/
  Students.tsx

hooks/
  useStudents.ts

services/
  students.service.ts

services/mock/
  students.mock.ts

services/storage/
  storage.service.ts

interfaces/
  student.interface.ts
```

A página deve consumir o hook, que utiliza o serviço correspondente.

No futuro, quero conseguir substituir o Mock API por uma API REST desenvolvida em PHP, Node.js ou outra tecnologia, sem reconstruir a interface.

Não implementar backend real nesta versão.

# 4. Identidade visual e UX/UI

Crie uma identidade visual própria para o IronDesk.

Quero uma interface moderna, elegante, minimalista e profissional, com aparência de SaaS comercial.

Referências de qualidade:

- Linear.
- Stripe Dashboard.
- Vercel.
- Sistemas modernos de gestão empresarial.

Não copie essas interfaces.

## Direção visual

Utilize uma identidade visual associada ao segmento fitness, mas sem exageros.

Sugestão:

- Fundo principal em cinza muito claro ou grafite, dependendo do tema escolhido.
- Cor de destaque em laranja ou verde-limão.
- Cards com bom espaçamento.
- Sidebar lateral.
- Tipografia moderna.
- Ícones Lucide.
- Gráficos discretos.
- Tabelas elegantes.
- Modais bem desenhados.
- Microinterações sutis.

Ofereça suporte a tema claro e escuro, caso consiga implementar sem comprometer a simplicidade.

A interface deve ser totalmente responsiva, com prioridade para desktop.

Evite:

- Gradientes exagerados.
- Excesso de cores.
- Emojis como ícones.
- Cards desnecessários.
- Animações excessivas.
- Elementos decorativos sem função.
- Layout com aparência de template genérico.
- Botões sem funcionalidade.

Utilize português brasileiro em toda a aplicação.

# 5. Funcionalidades do sistema

## 5.1 Dashboard

Criar uma tela inicial com visão geral da academia.

Indicadores principais:

- Total de alunos cadastrados.
- Alunos ativos.
- Alunos com matrícula vencida.
- Matrículas próximas do vencimento.
- Receita mensal.
- Pagamentos pendentes.
- Frequência diária.
- Novos alunos no mês.

Adicionar:

- Gráfico de evolução de alunos.
- Gráfico de receita mensal.
- Distribuição de alunos por plano.
- Histórico das últimas atividades.
- Próximos vencimentos.
- Últimos pagamentos.
- Alunos que frequentaram a academia recentemente.

Os indicadores devem ser calculados a partir dos dados reais do sistema simulado.

Não utilizar números estáticos desconectados das operações.

## 5.2 Gestão de alunos

Criar um módulo completo para gerenciamento dos alunos.

Informações:

- Nome completo.
- Foto de perfil.
- CPF fictício.
- Data de nascimento.
- Telefone.
- E-mail.
- Endereço.
- Data de cadastro.
- Plano contratado.
- Status da matrícula.
- Observações.

Funcionalidades:

- Cadastrar aluno.
- Editar cadastro.
- Excluir cadastro.
- Pesquisar por nome ou documento.
- Filtrar por status.
- Consultar histórico.
- Visualizar detalhes.
- Identificar alunos inadimplentes.
- Identificar matrículas próximas do vencimento.

Criar uma página individual para cada aluno, com resumo de sua situação.

## 5.3 Planos e matrículas

Criar módulo para administração dos planos comerciais.

Exemplos de planos:

- Mensal.
- Trimestral.
- Semestral.
- Anual.
- Plano experimental.
- Plano personalizado.

Cada plano deve possuir:

- Nome.
- Descrição.
- Valor.
- Duração.
- Frequência permitida.
- Benefícios.
- Status.

Permitir:

- Criar planos.
- Editar planos.
- Excluir planos sem matrículas vinculadas.
- Ativar e desativar planos.
- Consultar quantidade de alunos por plano.

Na gestão de matrículas:

- Associar aluno a um plano.
- Registrar data de início.
- Calcular data de vencimento.
- Aplicar descontos simulados.
- Registrar valor contratado.
- Renovar matrícula.
- Alterar plano.
- Cancelar matrícula.
- Consultar histórico de contratos.

Criar alertas visuais para:

- Matrículas ativas.
- Próximas do vencimento.
- Vencidas.
- Canceladas.

## 5.4 Financeiro

Criar módulo financeiro com visão administrativa.

Funcionalidades:

- Registrar pagamentos.
- Consultar pagamentos.
- Registrar despesas.
- Consultar receitas.
- Identificar inadimplência.
- Filtrar por período.
- Filtrar por aluno.
- Consultar histórico financeiro.

Informações de pagamentos:

- Aluno.
- Matrícula.
- Valor.
- Data de vencimento.
- Data de pagamento.
- Forma de pagamento.
- Status.

Status:

- Pago.
- Pendente.
- Atrasado.
- Cancelado.

Formas de pagamento:

- PIX.
- Dinheiro.
- Cartão de crédito.
- Cartão de débito.
- Transferência.

Criar dashboard financeiro com:

- Receita do mês.
- Despesas do mês.
- Resultado operacional.
- Valores pendentes.
- Taxa de inadimplência.
- Comparativo mensal de receitas.

Criar gráficos com dados simulados realistas.

Não implementar integração real com bancos ou gateways de pagamento.

## 5.5 Controle de frequência

Criar módulo de controle de acesso dos alunos.

Funcionalidades:

- Registrar entrada.
- Registrar saída.
- Consultar histórico.
- Pesquisar aluno.
- Filtrar por data.
- Visualizar frequência diária.

Simular um sistema de check-in por:

- Busca manual do aluno.
- Identificação por matrícula.
- Leitura simulada de QR Code.

Criar indicadores:

- Alunos presentes agora.
- Total de acessos hoje.
- Horários de maior movimento.
- Frequência semanal.

A interface deve deixar claro que o QR Code é demonstrativo e não existe integração física com catracas ou leitores.

Criar uma tela de operação rápida da recepção para registrar entradas com poucos cliques.

## 5.6 Gestão de treinos

Criar um módulo para professores organizarem os treinos dos alunos.

Funcionalidades:

- Criar ficha de treino.
- Associar treino a um aluno.
- Editar treino.
- Excluir treino.
- Consultar histórico de treinos.
- Definir data de início.
- Definir validade.
- Registrar observações.

Organizar treinos por grupos:

- Peito.
- Costas.
- Ombros.
- Bíceps.
- Tríceps.
- Pernas.
- Abdômen.
- Cardio.

Cada exercício deve conter:

- Nome.
- Grupo muscular.
- Séries.
- Repetições.
- Carga sugerida.
- Tempo de descanso.
- Observações.

Criar alguns exercícios demonstrativos.

Não implementar recomendações médicas ou prescrição automática de exercícios.

## 5.7 Avaliação física e evolução

Criar módulo demonstrativo de acompanhamento físico.

Informações:

- Peso.
- Altura.
- Percentual de gordura.
- Medidas corporais.
- Data da avaliação.
- Observações.

Permitir registrar avaliações periódicas e visualizar gráficos de evolução.

Criar histórico das avaliações.

Todos os dados devem ser fictícios e demonstrativos.

Deixar claro que o módulo é administrativo e não substitui avaliação profissional.

## 5.8 Gestão de professores e funcionários

Criar módulo de funcionários.

Informações:

- Nome.
- Foto.
- Cargo.
- Telefone.
- E-mail.
- Data de contratação.
- Status.

Cargos:

- Professor.
- Personal trainer.
- Recepcionista.
- Gerente.
- Administrador.

Permitir:

- Cadastrar.
- Editar.
- Consultar.
- Pesquisar.
- Ativar e desativar funcionários.

Permitir associar professores aos alunos e às fichas de treino.

## 5.9 Relatórios

Criar uma área de relatórios gerenciais.

Relatórios disponíveis:

- Alunos ativos.
- Novas matrículas.
- Matrículas vencidas.
- Inadimplência.
- Receita por período.
- Despesas.
- Frequência.
- Planos mais contratados.
- Evolução da base de alunos.

Permitir filtros por período.

Adicionar possibilidade de exportação CSV dos principais relatórios.

## 5.10 Configurações

Criar área de configurações da academia.

Informações:

- Nome da academia.
- Logo.
- Telefone.
- E-mail.
- Endereço.
- Horário de funcionamento.
- Configurações de planos.
- Preferências do sistema.

Criar identificação de ambiente DEMO.

Disponibilizar ação para restaurar os dados iniciais.

# 6. Simulação de integrações futuras

Criar uma área demonstrativa de integrações.

Apresentar possibilidades de integração com:

- Catracas eletrônicas.
- Leitores de QR Code.
- Biometria.
- Controle de acesso.
- Aplicativos móveis.
- Gateways de pagamento.
- WhatsApp para notificações.
- Sistemas de emissão de notas fiscais.

Exibir cartões com os estados:

- Conectado.
- Desconectado.
- Não configurado.

Não implementar integrações falsas.

Deixar claro quais recursos são apenas demonstrativos.

Organizar a arquitetura para permitir futuras integrações por meio de serviços e adaptadores independentes.

# 7. Experiência de demonstração

O sistema deve abrir pronto para ser explorado.

Ao executar:

- O dashboard deve apresentar dados.
- Todas as áreas devem conter registros fictícios.
- Os gráficos devem funcionar.
- Os formulários devem permitir cadastro e edição.
- As operações devem atualizar os indicadores.
- Os dados devem permanecer após atualizar a página.
- Os filtros devem funcionar.
- As pesquisas devem funcionar.
- A navegação deve ser fluida.
- As ações destrutivas devem pedir confirmação.

Criar dados fictícios com nomes, planos, pagamentos e situações variadas.

Não utilizar dados pessoais reais.

Não implementar autenticação real nesta versão.

Criar uma experiência demonstrativa com usuário fictício e indicação de ambiente DEMO.

# 8. Qualidade e organização do código

O projeto deve demonstrar boas práticas profissionais.

Obrigatório:

- Componentes pequenos.
- Hooks personalizados.
- Separação de responsabilidades.
- Interfaces bem definidas.
- Tratamento de erros.
- Validação de formulários.
- Nomenclatura consistente.
- Código legível.
- Ausência de duplicações desnecessárias.
- Nenhum arquivo de código acima de 150 linhas.
- Nenhum erro de TypeScript.
- Nenhum erro no console.
- Nenhum import quebrado.
- Nenhuma rota inexistente.
- Nenhum botão sem ação.

Se um arquivo ultrapassar 150 linhas, divida-o em componentes, hooks ou serviços menores.

Não esconda erros desabilitando verificações.

# 9. README.md profissional

Criar um README completo e bem apresentado em português.

Deve conter:

1. Nome e apresentação do IronDesk.
2. Problema que o projeto busca solucionar.
3. Objetivo da solução.
4. Principais funcionalidades.
5. Tecnologias utilizadas.
6. Arquitetura do sistema.
7. Estrutura de diretórios.
8. Como executar localmente.
9. Como funciona o Mock API.
10. Como funciona a persistência.
11. Como restaurar os dados demonstrativos.
12. Limitações da versão DEMO.
13. O que seria necessário para produção.
14. Possibilidades de integração.
15. Roadmap de evolução.

Na seção de produção, explicar:

- Backend com API REST.
- Banco de dados PostgreSQL ou MySQL.
- Autenticação e autorização.
- Controle de acesso por função (RBAC).
- Proteção de dados pessoais.
- LGPD.
- Segurança de pagamentos.
- Integração com gateways.
- Webhooks.
- Backup.
- Monitoramento.
- Infraestrutura.
- Aplicativo mobile.
- Integração com catracas e equipamentos físicos.

Explicar que o sistema demonstrativo não realiza cobranças reais e não armazena informações financeiras sensíveis.

# 10. Critérios de desenvolvimento

Não entregue apenas um planejamento.

Desenvolva efetivamente o projeto dentro do workspace atual do VS Code.

Trabalhe nas seguintes etapas:

1. Analise o workspace.
2. Defina a arquitetura.
3. Configure o projeto.
4. Desenvolva a identidade visual.
5. Implemente o layout principal.
6. Desenvolva os componentes compartilhados.
7. Implemente os serviços simulados.
8. Desenvolva cada módulo.
9. Integre os módulos.
10. Implemente persistência.
11. Crie os dados demonstrativos.
12. Desenvolva o README.
13. Execute testes.
14. Execute o build.
15. Revise a arquitetura e o código.

Não interrompa o trabalho após criar a estrutura inicial.

Se precisar tomar decisões não especificadas, escolha a alternativa mais simples e profissional.

# 11. Resultado esperado

O projeto deve funcionar localmente com:

```bash
npm install
npm run dev
```

Acessível pelo navegador em:

http://localhost:5173

Também deve possuir um build de produção funcional:

```bash
npm run build
```

Ao finalizar:

- Verifique todos os arquivos.
- Confirme que nenhum arquivo de código ultrapassa 150 linhas.
- Corrija erros de TypeScript.
- Teste as principais operações.
- Verifique persistência.
- Verifique navegação.
- Verifique responsividade.
- Garanta que o README esteja completo.

# 12. Identidade e apresentação profissional

Não utilize textos artificiais como "Desenvolvido com paixão por IA", "Powered by AI" ou descrições genéricas de projetos gerados automaticamente.

Não invente experiências profissionais, usuários reais ou integrações que não existem.

O código, o design e a documentação devem demonstrar naturalmente o cuidado de quem desenvolveu o produto.

O sistema deve possuir personalidade própria.

Priorize uma interface refinada, com dados coerentes, boa hierarquia visual e funcionalidades realmente operacionais.

**O objetivo final é que um recrutador entre no meu GitHub, veja o IronDesk, execute o projeto e perceba que sou capaz de desenvolver uma aplicação Full Stack bem estruturada, compreender regras de negócio e entregar uma solução de software com qualidade profissional.**

Qualidade e consistência são mais importantes do que quantidade de funcionalidades.