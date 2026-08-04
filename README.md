# Movi Body

Web app funcional (Next.js + Supabase) do protocolo de 90 dias, check-in diário, comunidade e journal.

## Stack

- **Next.js 16 (App Router)** + TypeScript
- **Supabase**: autenticação (email/senha), Postgres, Realtime (chat), Storage (fotos/vídeos)
- CSS global (sem Tailwind), fiel ao protótipo original

## Rodando localmente

1. Instale as dependências:
   ```
   npm install
   ```
2. Crie um projeto gratuito em [supabase.com](https://supabase.com) (Project Settings → API para pegar URL e chave anon).
3. No SQL Editor do Supabase, rode nesta ordem:
   - `supabase/migrations/0001_init.sql`
   - `supabase/migrations/0002_storage.sql`
4. Copie `.env.example` para `.env.local` e preencha:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
5. Rode o servidor:
   ```
   npm run dev
   ```

Por padrão, o Supabase exige confirmação de email no cadastro. Para testar rapidamente,
desative em **Authentication → Providers → Email → Confirm email** (Supabase dashboard).

## Deploy na Vercel

1. Suba este repositório para o GitHub (branch já configurada).
2. Em [vercel.com](https://vercel.com) → **Add New → Project** → importe o repositório.
3. Em **Environment Variables**, adicione as mesmas duas variáveis do `.env.local`.
4. Deploy.
5. Para usar `movibody.com`: **Project Settings → Domains** → adicione o domínio e siga as
   instruções de DNS (registro `A`/`CNAME`) no seu provedor de domínio.

## Estrutura

```
src/app/                 rotas (App Router)
src/app/(app)/           área logada (home, wall, journal, daily, community, profile, protocol)
src/app/actions.ts       Server Actions (auth, check-in, uploads, chat, etc.)
src/components/          componentes de UI
src/lib/data/            conteúdo estático (esportes, frases diárias, passos do protocolo)
src/lib/supabase/        clientes Supabase (browser/server) + sessão
supabase/migrations/     schema SQL + policies de storage
```
