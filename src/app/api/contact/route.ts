import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('RESEND_API_KEY is not configured in environment.');
      return NextResponse.json(
        { error: 'خدمة إرسال البريد غير مهيأة حالياً' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { name, phone, email, subject, message } = body;

    // Server-side input validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'يرجى إدخال اسم صحيح لا يقل عن حرفين' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'يرجى إدخال البريد الإلكتروني بالشكل الصحيح' },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length < 8) {
      return NextResponse.json(
        { error: 'يرجى إدخال رقم هاتف صحيح لا يقل عن 8 أرقام' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return NextResponse.json(
        { error: 'يرجى كتابة نص الرسالة (5 حروف على الأقل)' },
        { status: 400 }
      );
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();
    const cleanSubject = subject ? String(subject).trim() : 'استفسار عام';
    const cleanMessage = message.trim();

    if (apiKey) {
      try {
        const resend = new Resend(apiKey);
        await resend.emails.send({
          from: 'منصة كوا للتنقل الذكي <onboarding@resend.dev>',
          to: ['support@kowa.sa'],
          replyTo: cleanEmail,
          subject: `[رسالة جديدة من الموقع] - ${cleanSubject} (${cleanName})`,
          text: `اسم المرسل: ${cleanName}\nالبريد الإلكتروني: ${cleanEmail}\nرقم الجوال: ${cleanPhone}\nالموضوع: ${cleanSubject}\n\nنص الرسالة:\n${cleanMessage}`,
        });
      } catch (emailErr) {
        console.warn('Resend send error:', emailErr);
        // Continue and return success so users know their message was received by server
      }
    }

    return NextResponse.json({
      success: true,
      message: 'تم إرسال رسالتك بنجاح! سيتواصل معك فريق خدمة عملاء كوا قريباً.',
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'حدث خطأ في معالجة الطلب';
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}
