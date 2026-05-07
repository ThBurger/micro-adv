# 🧭 Project: Micro Adventures

This project is a mobile-first web application built with:

- Angular (latest, standalone components preferred)
- Supabase (PostgreSQL + Auth + RLS)
- TypeScript (strict mode)

The goal is to build an MVP that allows users to:

- Discover micro adventures on a map
- Create their own adventures
- Save adventures
- Mark adventures as completed

This is NOT a generic CRUD app. It is an experience-driven product.
Code should reflect simplicity, clarity, and speed of iteration.

---

# 🧠 Core Principles

## 1. Keep it simple (MVP first)

- Do NOT over-engineer
- Avoid unnecessary abstractions
- Prefer readable code over “clever” code

## 2. Separation of concerns

- Components → UI only
- Services → data access & business logic
- Models → typed interfaces only

## 3. Consistency > Perfection

- Follow existing patterns in the codebase
- Do not introduce new architectural styles without reason

---

# 🏗️ Angular Guidelines

## General

- Use standalone components
- Use OnPush change detection
- Prefer Signals or RxJS, but do not mix randomly
- Avoid large components (>300 lines)

## File Structure

/src/app/
/core/  
 /features/  
 /shared/  
 /models/

---

## Components

- Keep components dumb/presentational when possible
- Move logic into services
- Avoid direct Supabase calls inside components

---

## Services

- All Supabase interaction goes through services
- Services return typed data
- Always handle errors

---

# 🗄️ Database (Supabase)

Tables:

- adventures
- saved_adventures
- completed_adventures
- profiles

Rules:

- RLS is enabled
- Always include user_id where required

Important:

- adventures.creator_id uses ON DELETE SET NULL

---

# 🔐 Auth

Always fetch user via:
const user = await supabase.auth.getUser();

Never trust client-only state.

---

# ⚡ Performance

- Avoid unnecessary data fetching
- Prefer selecting only required fields

---

# ❌ Avoid

- Overengineering
- Nested subscriptions
- Global mutable state

---

# ✅ Prefer

- Small functions
- Clear naming
- Flat logic

---

# 🧪 Error Handling

Always check errors:
if (error) throw error;

---

# 🎯 MVP Scope

Only:

- Adventures CRUD
- Save / Unsave
- Complete

Not included:

- Comments
- Ratings
- Social features

---

# 🧠 Final Rule

Choose the simplest solution that works today.
