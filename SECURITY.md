# Security Policy

[Português](./SECURITY.pt-BR.md) | **English**

## Scope

IronDesk is a **demo application** that runs entirely in the browser.

- It has no backend, remote database or real authentication.
- It does not process payments, does not collect card data and does not store sensitive financial
  information.
- All displayed data is fictional and persists only in the `LocalStorage` of the browser of whoever
  opens the app.

Even so, real flaws deserve attention — especially those that would allow code execution in the page
context (`XSS`), data exposure between users or compromise of dependencies.

## How to report

**Do not open a public issue.** Send an email to **kaique.g.dias14@gmail.com** with:

- a description of the problem and potential impact;
- steps to reproduce or a proof of concept;
- browser and operating system;
- a suggested fix, if you have one.

Initial response within **7 days**. You will be notified when the fix ships, and credit for the report
is given in the advisory — if you want it.

## Dependencies

Dependencies are checked with:

```bash
npm audit
```

Also report any suspicious, abandoned or compromised package that has been added.

## Supported versions

Only the `main` branch receives security fixes. Older tags are historical references.
