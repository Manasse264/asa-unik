import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email, resetLink, lang } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Configure Nodemailer with Gmail
    // NOTE: For real Gmail, you need to use an "App Password" 
    // and enable 2-Step Verification on your Google account.
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_PASS, // Your Gmail App Password
      },
    });

    const subjects: any = {
      en: 'Password Reset - ASA RP NGOMA COLLEGE',
      rw: 'Guhindura Ijambo ry\'ibanga - ASA RP NGOMA COLLEGE',
      fr: 'Réinitialisation du mot de passe - ASA RP NGOMA COLLEGE'
    };

    const messages: any = {
      en: `Hello,\n\nYou requested a password reset. Click the link below to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.`,
      rw: `Muraho,\n\nMwasabye guhindura ijambo ry'ibanga. Kanda kuri iyi mpanuro kugira ngo uhindure ijambo ry'ibanga:\n\n${resetLink}\n\nNiba utarabihisemo, siba iyi imeli.`,
      fr: `Bonjour,\n\nVous avez demandé une réinitialisation de mot de passe. Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe:\n\n${resetLink}\n\nSi vous n'avez pas demandé cela, veuillez ignorer cet e-mail.`
    };

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: subjects[lang] || subjects.en,
      text: messages[lang] || messages.en,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: error.message || 'Failed to send email' }, { status: 500 });
  }
}
