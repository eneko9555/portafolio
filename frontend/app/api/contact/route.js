import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const escapeHtml = (text) =>
  text.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]))

export async function POST (request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ msg: 'Petición no válida' }, { status: 400 })
  }

  const name = String(body.name ?? '').trim()
  const email = String(body.email ?? '').trim()
  const message = String(body.message ?? '').trim()

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ msg: 'Todos los campos son obligatorios' }, { status: 400 })
  }
  if (name.length > 200 || email.length > 200 || message.length > 5000) {
    return NextResponse.json({ msg: 'El mensaje es demasiado largo' }, { status: 400 })
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  try {
    await transporter.sendMail({
      from: '"Mensaje portfolio" <portfolio@correo.com>',
      to: 'eneko.fdez.garcia@gmail.com',
      replyTo: email,
      subject: 'Mensaje de portfolio',
      text: `Mensaje de ${name} con correo ${email}\n\n${message}`,
      html: `
        <div>
            <p>Mensaje de <b>${escapeHtml(name)}</b> con correo <b>${escapeHtml(email)}</b></p>
            <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
        </div>
        `
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ msg: 'No se ha podido enviar el mensaje' }, { status: 500 })
  }

  return NextResponse.json({ msg: 'Mensaje enviado, me pondré en contacto contigo lo antes posible' })
}
