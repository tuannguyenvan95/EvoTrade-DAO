import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: Request) {
  try {
    const { email, role } = await req.json()

    if (!email || !role) {
      return NextResponse.json(
        { error: 'Thiếu email hoặc role' },
        { status: 400 }
      )
    }

    // 1. Tạo Test Account tự động từ Ethereal Mail
    const testAccount = await nodemailer.createTestAccount()

    // 2. Cấu hình Transporter với SMTP của Ethereal
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    })

    // 3. Chuẩn bị nội dung Email chuẩn phong cách Blueprint
    const htmlContent = `
      <div style="font-family: monospace; background-color: #030712; color: #e5e7eb; padding: 40px; border: 1px solid #d4af37;">
        <h2 style="color: #d4af37; text-transform: uppercase; letter-spacing: 2px;">NexusGuard Protocol</h2>
        <hr style="border-color: #374151; margin: 20px 0;" />
        <p>Hệ thống đã nhận lệnh mời tham gia dự án.</p>
        <p><strong>Người nhận:</strong> ${email}</p>
        <p><strong>Vị trí (Role):</strong> <span style="color: #d4af37;">${role}</span></p>
        <p>Bạn đã được cấp quyền truy cập vào bảng điều khiển (Dashboard) của NexusGuard.</p>
        <br/>
        <a href="https://nexusguard.vercel.app/login" style="display: inline-block; background-color: rgba(212, 175, 55, 0.1); border: 1px solid #d4af37; color: #d4af37; padding: 10px 20px; text-decoration: none; text-transform: uppercase; letter-spacing: 1px;">Accept Invitation</a>
        <br/><br/>
        <hr style="border-color: #374151; margin: 20px 0;" />
        <p style="color: #6b7280; font-size: 12px;">This is an automated message from the NexusGuard Treasury & DAO Management System.</p>
      </div>
    `

    // 4. Gửi Email
    const info = await transporter.sendMail({
      from: '"NexusGuard Admin" <admin@nexusguard.dao>',
      to: email,
      subject: `[NexusGuard] Lời mời tham gia với vai trò ${role}`,
      text: `Bạn đã được mời làm ${role} tại NexusGuard.`,
      html: htmlContent,
    })

    // 5. Lấy URL xem trước (Preview URL)
    const previewUrl = nodemailer.getTestMessageUrl(info)

    // Trả về cho Frontend
    return NextResponse.json({
      success: true,
      previewUrl: previewUrl,
      messageId: info.messageId,
    })
  } catch (error: any) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Lỗi máy chủ khi gửi email' },
      { status: 500 }
    )
  }
}
