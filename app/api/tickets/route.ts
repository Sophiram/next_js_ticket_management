// app/api/tickets/route.ts
import { NextResponse } from "next/server";
import { getTickets, addTicket, updateTicketStatus } from "../../../lib/store";

// ១. មុខងារទាញយកទិន្នន័យសំបុត្រទាំងអស់ (GET)
export async function GET() {
  try {
    const currentTickets = getTickets();
    return NextResponse.json(currentTickets);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch" },
      { status: 500 },
    );
  }
}

// ២. មុខងារចាត់ចែងការ បង្កើត និង កែប្រែស្ថានភាពសំបុត្រ (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, category, id, status } = body;

    // លក្ខខណ្ឌចុចបង្កើតសំបុត្រថ្មីពី Kiosk Side
    if (action === "create" && category) {
      const newTicket = addTicket(category);
      return NextResponse.json({ success: true, data: newTicket });
    }

    // លក្ខខណ្ឌកែប្រែស្ថានភាពសំបុត្រ (Call / Complete) ពី Admin Dashboard
    if (action === "update" && id && status) {
      const updated = updateTicketStatus(id, status);
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json(
      { success: false, message: "Invalid Action Pattern" },
      { status: 400 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
