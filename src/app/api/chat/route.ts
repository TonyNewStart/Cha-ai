// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

// Route accepts { prompt, targetLang } and returns { answer }

export async function POST(req: NextRequest) {
  const { prompt, targetLang } = await req.json();

  if (!prompt?.trim() || !targetLang) {
    return NextResponse.json(
      { error: 'Missing prompt or targetLang' },
      { status: 400 }
    );
  }

  let answer: string;
  switch (targetLang) {
    case 'zh-CN':
      answer = `这是对 “${prompt}” 的模拟翻译。`;
      break;
    case 'es':
      answer = `Esta es una traducción simulada de: “${prompt}”`;
      break;
    default:
      answer = `Unsupported language: ${targetLang}`;
  }

  // Log each translation request
  const sb = supabaseServer();
  await sb.from('usage_logs').insert({
    prompt,
    target_lang: targetLang,
    translation: answer,
    created_at: new Date(),
  });

  return NextResponse.json({ answer });
}