# Política de segurança

## Escopo

O IronDesk é uma **aplicação demonstrativa** que roda inteiramente no navegador.

- Não possui backend, banco de dados remoto ou autenticação real.
- Não processa pagamentos, não coleta dados de cartão e não armazena informação financeira sensível.
- Todos os dados exibidos são fictícios e persistem apenas no `LocalStorage` do navegador de quem
  acessa.

Ainda assim, falhas reais merecem atenção — principalmente as que permitirem execução de código no
contexto da página (`XSS`), exposição de dados entre usuários ou comprometimento de dependências.

## Como reportar

**Não abra uma issue pública.** Envie um e-mail para **kaique.g.dias14@gmail.com** com:

- descrição do problema e impacto potencial;
- passos para reproduzir ou prova de conceito;
- navegador e sistema operacional;
- sugestão de correção, se houver.

Retorno inicial em até **7 dias**. Você será avisado quando a correção for publicada, e o crédito pelo
reporte é dado no aviso — se você quiser.

## Dependências

As dependências são verificadas com:

```bash
npm audit
```

Relate também qualquer pacote suspeito, abandonado ou comprometido que tenha sido adicionado.

## Versões suportadas

Apenas a branch `main` recebe correções de segurança. Tags antigas são referências históricas.
