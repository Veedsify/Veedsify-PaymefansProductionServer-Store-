import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/prisma";
import { inngest } from "@/inngest/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        {
          error: true,
          message: "Name, email, and message are required",
        },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          error: true,
          message: "Invalid email format",
        },
        { status: 400 },
      );
    }

    // Save contact to database
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        message,
      },
    });

    // Get all admin users
    const adminUsers = await prisma.user.findMany({
      where: {
        admin: true,
      },
      select: {
        email: true,
        name: true,
      },
    });

    // Send email notification to all admins via Inngest
    if (adminUsers.length > 0) {
      const subject = `New Contact Form Submission from ${name}`;
      const emailMessage = `New Contact Form Submission\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\nSubmitted at: ${new Date().toLocaleString()}`;

      // Queue emails for all admins using Inngest
      await Promise.all(
        adminUsers.map((admin) =>
          inngest
            .send({
              name: "contact/email.send",
              data: {
                email: admin.email,
                name: admin.name || "Admin",
                subject,
                message: emailMessage,
              },
            })
            .catch((err) => {
              console.error(`Failed to queue email to ${admin.email}:`, err);
            }),
        ),
      );
    }

    return NextResponse.json(
      {
        error: false,
        message: "Contact form submitted successfully",
        data: {
          id: contact.id,
          name: contact.name,
          email: contact.email,
          created_at: contact.created_at,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error submitting contact form:", error);
    return NextResponse.json(
      {
        error: true,
        message: "Failed to submit contact form",
      },
      { status: 500 },
    );
  }
}
