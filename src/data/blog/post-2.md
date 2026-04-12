---
title: TanStack Query with Astro Islands
description: How to use TanStack Query across Astro islands without hydration issues
author: Igor
date: 2026-04-11
tags: [tanstack, react, astro]
draft: false
---

# TanStack Query with Astro Islands

No hydration issues, no QueryClientProvider needed.

## The pattern

Use a singleton QueryClient shared across all islands.
