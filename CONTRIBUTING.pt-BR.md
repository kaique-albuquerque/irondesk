# Contribuindo com o IronDesk

**Português** | [English](./CONTRIBUTING.md)

Obrigado pelo interesse. Este documento descreve o fluxo de trabalho do repositório — leia antes de
abrir uma issue ou um pull request.

## Antes de começar

- O IronDesk é um projeto de portfólio. Ele é mantido por uma pessoa, então revisões podem levar
  alguns dias.
- **A branch `main` é protegida.** Nenhuma alteração entra nela por push direto: todo trabalho passa
  por um pull request. Isso vale inclusive para quem mantém o projeto.
- Para mudanças grandes (nova funcionalidade, refatoração de arquitetura, troca de dependência
  principal), **abra uma issue primeiro**. Assim evitamos que você implemente algo que não será
  aceito.

## Pré-requisitos

- Node.js 20 ou superior
- npm 10 ou superior
- Git

## Configurando o ambiente

```bash
git clone https://github.com/kaique-albuquerque/irondesk.git
cd irondesk
npm install
npm run dev
```

A aplicação sobe em [http://localhost:5173](http://localhost:5173).

## Fluxo de trabalho

1. **Sincronize a `main`**

   ```bash
   git checkout main
   git pull origin main
   ```

2. **Crie uma branch a partir da `main`.** Use um prefixo que indique a natureza do trabalho:

   | Prefixo | Uso | Exemplo |
   | --- | --- | --- |
   | `feat/` | nova funcionalidade | `feat/exportacao-excel` |
   | `fix/` | correção de bug | `fix/checkin-duplicado` |
   | `docs/` | documentação | `docs/guia-deploy` |
   | `refactor/` | refatoração sem mudança de comportamento | `refactor/servico-pagamentos` |
   | `chore/` | configuração, dependências, build | `chore/atualiza-vite` |

   ```bash
   git checkout -b feat/minha-contribuicao
   ```

3. **Implemente, validando localmente** (veja [Verificação obrigatória](#verificação-obrigatória)).

4. **Faça commits pequenos e com mensagem clara**, no padrão
   [Conventional Commits](https://www.conventionalcommits.org/pt-br/):

   ```text
   feat(financeiro): permite estornar pagamento parcial

   Adiciona a ação de estorno com valor informado e registra o
   histórico da alteração na cobrança original.
   ```

5. **Envie a branch e abra o pull request**

   ```bash
   git push -u origin feat/minha-contribuicao
   ```

   O template do PR aparece automaticamente. Preencha o contexto, o que mudou e como você testou.

## Verificação obrigatória

Todo pull request precisa passar nestas três verificações antes de ser mesclado:

```bash
npm run typecheck    # TypeScript sem erros
npm run build        # build de produção funcional
```

E na revisão manual:

- **Nenhum arquivo de código pode passar de 150 linhas.** É uma regra do projeto. Confira com:

  ```powershell
  Get-ChildItem -Path src -Recurse -Include *.ts,*.tsx |
    ForEach-Object { [pscustomobject]@{ Lines = (Get-Content $_.FullName).Count; Path = $_.FullName } } |
    Sort-Object Lines -Descending | Select-Object -First 10
  ```

- **Nenhum `any` explícito.** Tudo tipado por interfaces de domínio.
- **Nenhum botão morto.** Se aparece na interface, funciona — ou não aparece.
- **Console limpo.** Navegue pelo fluxo alterado e confirme que não há erros no console do navegador.

## Padrões de código

### Estrutura em camadas

Respeite a direção das dependências. A interface **nunca** acessa o `LocalStorage` diretamente:

```text
pages → hooks → services/api → services/mock → services/storage → LocalStorage
```

- **Regra de negócio** mora em `src/services/api/*.service.ts`.
- **Componente** não calcula regra de negócio; recebe dados prontos.
- **Validação de formulário** mora em `src/schemas/*.schema.ts` (Zod).
- **Acesso a dados** passa por `services/storage`; nenhum componente lê `localStorage`.

### Convenções

- Componentes: `PascalCase.tsx`, uma responsabilidade por arquivo.
- Serviços, hooks e utilitários: `camelCase.ts` (`students.service.ts`, `useAsyncData.ts`).
- Interfaces: `*.interface.ts`, sufixo `View` para tipos derivados com dados agregados.
- Textos da interface em **português do Brasil**.
- Estilo com Tailwind e os tokens do design system (`bg-surface`, `text-ink`, `text-muted`,
  `border-line`, `text-accent-ink`...). Não introduza cores hexadecimais soltas — use os tokens de
  `src/styles/index.css`.
- Antes de criar um componente de UI, verifique se o primitivo já existe em `src/components/ui`.

### Commits

- Um assunto por commit.
- Mensagem no imperativo, em português: `corrige`, `adiciona`, `remove`, `ajusta`.
- Referencie a issue quando existir: `closes #12`.

## Abrindo uma issue

Use os templates disponíveis em **Issues → New issue**:

- **Bug** — comportamento inesperado, com passos para reproduzir.
- **Sugestão de funcionalidade** — problema que a mudança resolve, antes da solução proposta.

Inclua sempre:

- o que você esperava e o que aconteceu;
- passos para reproduzir;
- navegador e sistema;
- print ou gravação de tela quando for visual.

## Revisão do pull request

- O mantenedor pode pedir ajustes, dividir a mudança em partes menores ou recusar a contribuição se
  ela fugir do escopo do projeto.
- PRs que quebram `typecheck`/`build`, que introduzem `any` ou que ultrapassam 150 linhas por arquivo
  não são mesclados.
- Ao mesclar, a branch é removida. Sincronize sua `main` antes de começar o próximo trabalho.

## Escopo do projeto

O IronDesk é deliberadamente uma demonstração **sem backend**. Contribuições que adicionem servidor,
banco de dados, autenticação real ou cobrança real estão fora do escopo deste repositório — o
[README](./README.pt-BR.md#12-o-que-seria-necessário-para-produção) descreve o que seria necessário para
produção.

## Segurança e dados

- **Nunca** faça commit de segredos, tokens, `.env` ou dados pessoais reais.
- Todos os dados do projeto são fictícios. Não insira informações de pessoas reais nos seeds.
- Encontrou uma vulnerabilidade? Veja [SECURITY.pt-BR.md](./SECURITY.pt-BR.md) — não abra issue pública.

## Código de conduta

Ao participar, você concorda com o [Código de Conduta](./CODE_OF_CONDUCT.pt-BR.md).
