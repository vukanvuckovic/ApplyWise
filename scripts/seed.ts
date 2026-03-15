import { Client, Databases, Users, ID, Query } from "node-appwrite";

// ---------------------------------------------------------------------------
// Config — loaded from environment variables (run with: npm run seed)
// ---------------------------------------------------------------------------

const SYSTEM_USER_ID = "67aa4f1200056bbee597";

const config = {
  endpoint: process.env.NEXT_PUBLIC_ENDPOINT!,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  databaseId: process.env.NEXT_PUBLIC_DATABASE_ID!,
  notesCollectionId: process.env.NEXT_PUBLIC_NOTES_COLLECTION_ID!,
  usersCollectionId: process.env.NEXT_PUBLIC_USERS_COLLECTION_ID!,
  applicationsCollectionId: process.env.NEXT_PUBLIC_APPLICATIONS_COLLECTION_ID!,
  appwriteSecret: process.env.NEXT_APPWRITE_SECRET!,
};

const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setKey(config.appwriteSecret);

const db = new Databases(client);
const usersApi = new Users(client);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function deleteCollection(collectionId: string): Promise<void> {
  let hasMore = true;
  while (hasMore) {
    const { documents } = await db.listDocuments(config.databaseId, collectionId, [
      Query.limit(100),
    ]);
    if (documents.length === 0) break;
    await Promise.all(
      documents.map((doc) => db.deleteDocument(config.databaseId, collectionId, doc.$id))
    );
    hasMore = documents.length === 100;
  }
}

async function deleteAllAuthUsers(): Promise<void> {
  let hasMore = true;
  while (hasMore) {
    const { users: list } = await usersApi.list([Query.limit(100)]);
    if (list.length === 0) break;
    await Promise.all(list.map((u) => usersApi.delete(u.$id)));
    hasMore = list.length === 100;
  }
}

async function createAuthUser(
  userId: string,
  email: string,
  password: string,
  name: string
) {
  return usersApi.create(userId, email, undefined, password, name);
}

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

const DEMO_APPLICATIONS = [
  {
    businessName: "Google",
    position: "Senior Frontend Engineer",
    description:
      "Applied for the senior frontend role on the Chrome DevTools team. Great fit for my experience with web performance and developer tooling.",
    status: "Accepted",
  },
  {
    businessName: "Stripe",
    position: "Staff Frontend Engineer",
    description:
      "Exciting opportunity on the Dashboard team. Strong emphasis on TypeScript, React, and financial UI at scale.",
    status: "Progressing",
  },
  {
    businessName: "GitHub",
    position: "Software Engineer II",
    description:
      "Working on GitHub Copilot integrations and IDE tooling. Aligns perfectly with my open-source contributions.",
    status: "Pending",
  },
  {
    businessName: "Figma",
    position: "Frontend Platform Engineer",
    description:
      "Canvas rendering and plugin system work. Very technical role — brushed up on WebGL and WASM before applying.",
    status: "Rejected",
  },
  {
    businessName: "Airbnb",
    position: "UI Engineer",
    description:
      "Design system and component library role. Loved their design-engineering culture and the impact of the work.",
    status: "Accepted",
  },
  {
    businessName: "Netflix",
    position: "Web Platform Engineer",
    description:
      "Streaming UI performance and A/B testing infrastructure. Strong focus on scale and reliability.",
    status: "Progressing",
  },
  {
    businessName: "Shopify",
    position: "Senior React Developer",
    description:
      "Merchant-facing checkout UI and Polaris design system contributions. Solid role with real impact on sellers.",
    status: "Pending",
  },
  {
    businessName: "Notion",
    position: "Product Engineer",
    description:
      "Editor engine and real-time collaboration. Fascinating technical challenges around CRDT and offline sync.",
    status: "Rejected",
  },
  {
    businessName: "Linear",
    position: "Frontend Engineer",
    description:
      "Extremely fast issue-tracker UI. They care deeply about performance and keyboard-driven UX — right up my alley.",
    status: "Pending",
  },
  {
    businessName: "Vercel",
    position: "Frontend Developer",
    description:
      "Deployment platform dashboard and analytics UI. As a heavy Next.js user, this role feels like a natural fit.",
    status: "Progressing",
  },
  {
    businessName: "Discord",
    position: "Frontend Engineer",
    description:
      "Real-time messaging UI and WebSocket integrations. Fun tech challenges around presence and latency.",
    status: "Rejected",
  },
  {
    businessName: "Spotify",
    position: "Web Developer",
    description:
      "Web player and podcast platform. Combining music and engineering is a dream — passionate about this one.",
    status: "Accepted",
  },
  {
    businessName: "Atlassian",
    position: "Senior Frontend Engineer",
    description:
      "Jira and Confluence UI work at enterprise scale. Accessibility-first development with a large design system.",
    status: "Pending",
  },
  {
    businessName: "Meta",
    position: "React Developer",
    description:
      "React core team–adjacent work. Contributing to the open-source ecosystem while building at massive scale.",
    status: "Rejected",
  },
  {
    businessName: "Apple",
    position: "UI/UX Developer",
    description:
      "Apple.com and developer documentation sites. Incredible attention to detail required — very high bar.",
    status: "Pending",
  },
];

const SARAH_APPLICATIONS = [
  {
    businessName: "Amazon",
    position: "Backend Engineer",
    description: "AWS Lambda and DynamoDB services team.",
    status: "Accepted",
  },
  {
    businessName: "Microsoft",
    position: "Full Stack Developer",
    description: "Azure DevOps UI and pipelines team.",
    status: "Progressing",
  },
  {
    businessName: "Twilio",
    position: "API Engineer",
    description: "Communication APIs and developer platform.",
    status: "Pending",
  },
  {
    businessName: "Slack",
    position: "Platform Engineer",
    description: "Slack platform API and third-party integrations.",
    status: "Rejected",
  },
  {
    businessName: "HubSpot",
    position: "Software Engineer",
    description: "CRM platform and marketing automation engineering.",
    status: "Pending",
  },
  {
    businessName: "Datadog",
    position: "Full Stack Engineer",
    description: "Monitoring dashboard and real-time metrics UI.",
    status: "Accepted",
  },
];

const MARCUS_APPLICATIONS = [
  {
    businessName: "Cloudflare",
    position: "Backend Engineer",
    description: "Edge network infrastructure and Workers platform.",
    status: "Accepted",
  },
  {
    businessName: "HashiCorp",
    position: "Site Reliability Engineer",
    description: "Terraform and Vault infrastructure tooling.",
    status: "Progressing",
  },
  {
    businessName: "MongoDB",
    position: "Developer Advocate",
    description: "MongoDB Atlas and aggregation pipeline documentation.",
    status: "Pending",
  },
  {
    businessName: "Elastic",
    position: "Backend Developer",
    description: "Elasticsearch and Kibana backend development.",
    status: "Pending",
  },
  {
    businessName: "Redis",
    position: "Software Engineer",
    description: "Redis Cloud platform and caching infrastructure.",
    status: "Rejected",
  },
];

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------

async function seed() {
  console.log("🧹  Clearing existing data...");
  await deleteCollection(config.notesCollectionId);
  await deleteCollection(config.applicationsCollectionId);
  await deleteCollection(config.usersCollectionId);
  await deleteAllAuthUsers();
  console.log("✅  Database cleared\n");

  // System / default friend account — ID must stay stable so the sign-up flow works
  await createAuthUser(SYSTEM_USER_ID, "system@applywise.app", "Syst3m!ApplyW1se#", "ApplyWise");
  await db.createDocument(config.databaseId, config.usersCollectionId, SYSTEM_USER_ID, {
    name: "ApplyWise",
    profession: "Platform",
    friends: [],
  });
  console.log("✅  System user created");

  // Friend accounts
  const sarah = await createAuthUser(ID.unique(), "sarah.chen@example.com", "S@rah#Secure2024!", "Sarah Chen");
  await db.createDocument(config.databaseId, config.usersCollectionId, sarah.$id, {
    name: "Sarah Chen",
    profession: "Full Stack Developer",
    friends: [],
  });

  const marcus = await createAuthUser(ID.unique(), "marcus.williams@example.com", "M@rcus#Secure2024!", "Marcus Williams");
  await db.createDocument(config.databaseId, config.usersCollectionId, marcus.$id, {
    name: "Marcus Williams",
    profession: "Backend Developer",
    friends: [],
  });
  console.log("✅  Friend accounts created");

  // Demo user
  const demo = await createAuthUser(ID.unique(), "demo@applywise.app", "demo1234", "Alex Johnson");
  const demoId = demo.$id;
  await db.createDocument(config.databaseId, config.usersCollectionId, demoId, {
    name: "Alex Johnson",
    profession: "Frontend Developer",
    friends: [SYSTEM_USER_ID, sarah.$id, marcus.$id],
  });

  // Wire up mutual friend connections
  await db.updateDocument(config.databaseId, config.usersCollectionId, SYSTEM_USER_ID, {
    friends: [demoId],
  });
  await db.updateDocument(config.databaseId, config.usersCollectionId, sarah.$id, {
    friends: [demoId],
  });
  await db.updateDocument(config.databaseId, config.usersCollectionId, marcus.$id, {
    friends: [demoId],
  });
  console.log("✅  Demo user and friend connections created");

  // Demo user applications
  const createdApps = [];
  for (const app of DEMO_APPLICATIONS) {
    const doc = await db.createDocument(
      config.databaseId,
      config.applicationsCollectionId,
      ID.unique(),
      { ...app, AccountId: demoId }
    );
    createdApps.push(doc);
  }
  console.log(`✅  Created ${createdApps.length} applications for demo user`);

  // Notes tied to demo user applications
  const NOTES = [
    {
      appIndex: 0,
      title: "Offer Received!",
      description:
        "Got the offer — L5 level with a strong comp package. Negotiated a signing bonus. Start date TBD.",
      color: "green",
    },
    {
      appIndex: 0,
      title: "Interview Breakdown",
      description:
        "4 rounds: coding (easy/medium LC), system design (rate limiter), behavioural, and team-fit chat. All went well.",
      color: "blue",
    },
    {
      appIndex: 1,
      title: "Round 2 Scheduled",
      description:
        "Technical deep dive with the Dashboard team lead next Tuesday. Reviewing Stripe's API design internals beforehand.",
      color: "yellow",
    },
    {
      appIndex: 1,
      title: "Prep Checklist",
      description:
        "Focus areas: TypeScript advanced patterns, React concurrent features, micro-frontend architecture at scale.",
      color: "orange",
    },
    {
      appIndex: 4,
      title: "Offer Accepted",
      description:
        "Signed the offer! Great TC, remote-first team, and an amazing design culture. Very excited.",
      color: "green",
    },
    {
      appIndex: 5,
      title: "Phone Screen Passed",
      description:
        "Had a great 45-min call about their CDN edge rendering work. Moving to the virtual onsite.",
      color: "blue",
    },
    {
      appIndex: 8,
      title: "Referral Submitted",
      description:
        "Friend on the Linear team submitted an internal referral. They love keyboard-driven UI work.",
      color: "yellow",
    },
    {
      appIndex: 9,
      title: "Follow-up Sent",
      description:
        "Two weeks since applying with no response. Sent a polite follow-up to the recruiter.",
      color: "orange",
    },
    {
      appIndex: 11,
      title: "Offer Signed",
      description:
        "Joining the Spotify web player team! Super excited about the personalised music recommendation UI work.",
      color: "green",
    },
  ];

  for (const note of NOTES) {
    await db.createDocument(config.databaseId, config.notesCollectionId, ID.unique(), {
      title: note.title,
      description: note.description,
      color: note.color,
      application: createdApps[note.appIndex].$id,
    });
  }
  console.log(`✅  Created ${NOTES.length} notes`);

  // Friend applications
  for (const app of SARAH_APPLICATIONS) {
    await db.createDocument(
      config.databaseId,
      config.applicationsCollectionId,
      ID.unique(),
      { ...app, AccountId: sarah.$id }
    );
  }
  for (const app of MARCUS_APPLICATIONS) {
    await db.createDocument(
      config.databaseId,
      config.applicationsCollectionId,
      ID.unique(),
      { ...app, AccountId: marcus.$id }
    );
  }
  console.log("✅  Created applications for friend accounts");

  // Discoverable users — not connected to demo account, appear in friend search
  const DISCOVERABLE_USERS = [
    { name: "Emma Thompson", profession: "Product Manager", email: "emma.thompson@example.com" },
    { name: "Carlos Rivera", profession: "Backend Developer", email: "carlos.rivera@example.com" },
    { name: "Priya Sharma", profession: "UX Designer", email: "priya.sharma@example.com" },
    { name: "James Chen", profession: "DevOps Engineer", email: "james.chen@example.com" },
    { name: "Olivia Park", profession: "Data Scientist", email: "olivia.park@example.com" },
    { name: "Luca Moretti", profession: "Mobile Developer", email: "luca.moretti@example.com" },
  ];

  for (const u of DISCOVERABLE_USERS) {
    const authUser = await createAuthUser(ID.unique(), u.email, "Disc0verable#2024!", u.name);
    await db.createDocument(config.databaseId, config.usersCollectionId, authUser.$id, {
      name: u.name,
      profession: u.profession,
      friends: [],
    });
  }
  console.log(`✅  Created ${DISCOVERABLE_USERS.length} discoverable users for friend search\n`);

  console.log("🎉  Seed complete!");
  console.log("────────────────────────────────");
  console.log("Demo credentials");
  console.log("  Email:    demo@applywise.app");
  console.log("  Password: demo1234");
  console.log("────────────────────────────────");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
