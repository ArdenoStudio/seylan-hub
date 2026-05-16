import { DemoUser } from "@/types";

export const DEMO_USERS: DemoUser[] = [
  {
    id: "SEY-USR-001",
    name: "Nimal Fernando",
    location: "London, UK",
    role: "diaspora_sender",
    defaultRoute: "/wallet",
    personaCode: "P1",
    shortBio:
      "Sri Lankan expat in London who sends money home monthly to support his family.",
  },
  {
    id: "SEY-ACC-002",
    name: "Kumari Perera",
    location: "Colombo, Sri Lanka",
    role: "family_member",
    defaultRoute: "/assistant",
    personaCode: "P2",
    shortBio:
      "Digital-native customer in Colombo who manages household finances via mobile.",
  },
  {
    id: "SEY-USR-003",
    name: "Sunil Bandara",
    location: "Kandy, Sri Lanka",
    role: "borrower",
    defaultRoute: "/loans",
    personaCode: "P3",
    shortBio:
      "Anxious borrower in Kandy who needs clarity on his loan repayment progress.",
  },
  {
    id: "SEY-BIZ-001",
    name: "Suresh Silva",
    location: "Gampaha, Sri Lanka",
    role: "business_owner",
    defaultRoute: "/business",
    personaCode: "P4",
    shortBio:
      "Hardware shop owner (Mudalali) who needs simple bookkeeping and tax savings.",
  },
];
