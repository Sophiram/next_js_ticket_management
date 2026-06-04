// lib/store.ts

export interface Ticket {
  id: string;
  category: string;
  status: "Pending" | "Approved" | "Completed";
  date: string;
  time: string;
}

export let ticketsDb: Ticket[] = [
  {
    id: "TICKET-03",
    category: "ដកប្រាក់",
    status: "Completed",
    date: "2026-06-03",
    time: "09:30:00",
  },
];

let ticketCounter = 3;

// 💡 ត្រូវប្រាកដថាមានពាក្យ 'export const' នៅពីមុខមុខងារទាំង ៣ នេះ
export const getTickets = () => ticketsDb;

export const addTicket = (category: string) => {
  ticketCounter++;
  const id = `TICKET-${String(ticketCounter).padStart(2, "0")}`;
  const now = new Date();

  const newTicket: Ticket = {
    id,
    category,
    status: "Pending",
    date: now.toISOString().split("T")[0],
    time: now.toTimeString().split(" ")[0],
  };

  ticketsDb = [newTicket, ...ticketsDb];
  return newTicket;
};

export const updateTicketStatus = (
  id: string,
  status: "Approved" | "Completed",
) => {
  ticketsDb = ticketsDb.map((t) => (t.id === id ? { ...t, status } : t));
  return ticketsDb.find((t) => t.id === id);
};
