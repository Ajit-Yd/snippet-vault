import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const userCount = await db.user.count();

  if (userCount === 0) {
    console.log("\n✨ Snippet Vault - Fresh Setup");
    console.log("━".repeat(50));
    console.log("\nTo populate with dummy data:");
    console.log("1. Open http://localhost:3000");
    console.log("2. Click 'Sign up'");
    console.log("3. Create your account");
    console.log("4. Run: npm run seed");
    console.log("   (after signup to auto-populate content)\n");
    process.exit(0);
  }

  // If user exists, populate demo content
  const user = await db.user.findFirst();

  if (!user) {
    console.log("No users found!");
    process.exit(0);
  }

  // Check if already seeded
  const snippetCount = await db.snippet.count({ where: { userId: user.id } });

  if (snippetCount > 0) {
    console.log(`✅ Demo content already created for ${user.email}`);
    process.exit(0);
  }

  console.log(`🌱 Creating demo content for ${user.email}...`);

  // Create categories
  const categories = await Promise.all([
    db.category.create({
      data: {
        name: "JavaScript",
        userId: user.id,
      },
    }),
    db.category.create({
      data: {
        name: "React",
        userId: user.id,
      },
    }),
    db.category.create({
      data: {
        name: "Database",
        userId: user.id,
      },
    }),
    db.category.create({
      data: {
        name: "CSS",
        userId: user.id,
      },
    }),
    db.category.create({
      data: {
        name: "Sales",
        userId: user.id,
      },
    }),
    db.category.create({
      data: {
        name: "Finance",
        userId: user.id,
      },
    }),
    db.category.create({
      data: {
        name: "Customer Support",
        userId: user.id,
      },
    }),
    db.category.create({
      data: {
        name: "Marketing",
        userId: user.id,
      },
    }),
    db.category.create({
      data: {
        name: "HR",
        userId: user.id,
      },
    }),
    db.category.create({
      data: {
        name: "Operations",
        userId: user.id,
      },
    }),
  ]);

  console.log(`Created ${categories.length} categories`);

  // Create tags
  const tags = await Promise.all([
    db.tag.create({ data: { name: "es6" } }),
    db.tag.create({ data: { name: "async" } }),
    db.tag.create({ data: { name: "hooks" } }),
    db.tag.create({ data: { name: "state" } }),
    db.tag.create({ data: { name: "postgres" } }),
    db.tag.create({ data: { name: "query" } }),
    db.tag.create({ data: { name: "flexbox" } }),
    db.tag.create({ data: { name: "grid" } }),
    db.tag.create({ data: { name: "customer" } }),
    db.tag.create({ data: { name: "sales" } }),
    db.tag.create({ data: { name: "finance" } }),
    db.tag.create({ data: { name: "invoice" } }),
    db.tag.create({ data: { name: "follow-up" } }),
    db.tag.create({ data: { name: "reminder" } }),
    db.tag.create({ data: { name: "onboarding" } }),
    db.tag.create({ data: { name: "approval" } }),
    db.tag.create({ data: { name: "meeting" } }),
    db.tag.create({ data: { name: "update" } }),
    db.tag.create({ data: { name: "thank-you" } }),
    db.tag.create({ data: { name: "urgent" } }),
  ]);

  console.log(`Created ${tags.length} tags`);

  // Create snippets
  const snippets = await Promise.all([
    db.snippet.create({
      data: {
        title: "Arrow Function with Multiple Parameters",
        content: `const add = (a, b) => a + b;
const result = add(5, 3);
console.log(result); // 8`,
        categoryId: categories[0].id, // JavaScript
        userId: user.id,
        tags: {
          create: [
            { tagId: tags[0].id }, // es6
            { tagId: tags[1].id }, // async
          ],
        },
      },
    }),
    db.snippet.create({
      data: {
        title: "React useState Hook",
        content: `import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`,
        categoryId: categories[1].id, // React
        userId: user.id,
        isFavorite: true,
        tags: {
          create: [
            { tagId: tags[2].id }, // hooks
            { tagId: tags[3].id }, // state
          ],
        },
      },
    }),
    db.snippet.create({
      data: {
        title: "PostgreSQL Common Query",
        content: `-- Get all users with snippet count
SELECT u.id, u.email, u.name, COUNT(s.id) as snippet_count
FROM "User" u
LEFT JOIN "Snippet" s ON u.id = s."userId"
WHERE s."isDeleted" = false
GROUP BY u.id
ORDER BY snippet_count DESC;`,
        categoryId: categories[2].id, // Database
        userId: user.id,
        tags: {
          create: [
            { tagId: tags[4].id }, // postgres
            { tagId: tags[5].id }, // query
          ],
        },
      },
    }),
    db.snippet.create({
      data: {
        title: "Flexbox Centering",
        content: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.centered {
  text-align: center;
}`,
        categoryId: categories[3].id, // CSS
        userId: user.id,
        tags: {
          create: [
            { tagId: tags[6].id }, // flexbox
          ],
        },
      },
    }),
    db.snippet.create({
      data: {
        title: "Async/Await Error Handling",
        content: `async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
  }
}`,
        categoryId: categories[0].id, // JavaScript
        userId: user.id,
        tags: {
          create: [
            { tagId: tags[1].id }, // async
          ],
        },
      },
    }),
    db.snippet.create({
      data: {
        title: "CSS Grid Layout",
        content: `.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  padding: 20px;
}

.grid-item {
  background: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
}`,
        categoryId: categories[3].id, // CSS
        userId: user.id,
        isFavorite: true,
        tags: {
          create: [
            { tagId: tags[7].id }, // grid
          ],
        },
      },
    }),
    db.snippet.create({
      data: {
        title: "Post-Meeting Follow-Up",
        content: `Hi {{firstName}},

Thank you for taking the time to meet today. I enjoyed discussing your goals and how our solution can help.

Please let me know if you have any follow-up questions or need additional detail.

Best,
{{yourName}}`,
        categoryId: categories[4].id, // Sales
        userId: user.id,
        tags: {
          create: [
            { tagId: tags[9].id },
            { tagId: tags[12].id },
          ],
        },
      },
    }),
    db.snippet.create({
      data: {
        title: "Proposal Introduction",
        content: `Hello {{firstName}},

I enjoyed our conversation and have attached a proposal with next steps, pricing, and timing.

Please review and share any feedback so we can move forward.

Thanks,
{{yourName}}`,
        categoryId: categories[4].id,
        userId: user.id,
        isFavorite: true,
        tags: {
          create: [
            { tagId: tags[9].id },
            { tagId: tags[16].id },
          ],
        },
      },
    }),
    db.snippet.create({
      data: {
        title: "New Opportunity Outreach",
        content: `Hi {{firstName}},

I wanted to introduce myself and share how we help teams like yours reduce costs and improve efficiency.

Would you be open to a short call next week?

Best regards,
{{yourName}}`,
        categoryId: categories[4].id,
        userId: user.id,
        tags: {
          create: [
            { tagId: tags[9].id },
            { tagId: tags[12].id },
          ],
        },
      },
    }),
    db.snippet.create({
      data: {
        title: "Pricing Summary Email",
        content: `Hello {{firstName}},

Here is a quick summary of the options we discussed:

• Basic Plan: $X/month
• Pro Plan: $Y/month
• Enterprise Plan: custom pricing

Let me know which option works best, and I’ll send next steps.

Thanks,
{{yourName}}`,
        categoryId: categories[4].id,
        userId: user.id,
        tags: {
          create: [
            { tagId: tags[9].id },
            { tagId: tags[17].id },
          ],
        },
      },
    }),
    db.snippet.create({
      data: {
        title: "Sales Meeting Reminder",
        content: `Hi {{firstName}},

Just a quick reminder about our call tomorrow at {{time}}. I look forward to discussing how we can help your team.

If anything changes, please let me know.

Thanks,
{{yourName}}`,
        categoryId: categories[4].id,
        userId: user.id,
        tags: {
          create: [
            { tagId: tags[8].id },
            { tagId: tags[13].id },
          ],
        },
      },
    }),
    db.snippet.create({
      data: {
        title: "Contract Renewal Notice",
        content: `Hello {{firstName}},

Your contract is up for renewal on {{renewalDate}}. Please review the attached terms and let me know if you’d like to continue with the same plan.

Best,
{{yourName}}`,
        categoryId: categories[4].id,
        userId: user.id,
        tags: {
          create: [
            { tagId: tags[9].id },
            { tagId: tags[15].id },
          ],
        },
      },
    }),
    db.snippet.create({
      data: {
        title: "Invoice Reminder",
        content: `Hello {{firstName}},

This is a friendly reminder that invoice #{{invoiceNumber}} is due on {{dueDate}}.

Please let me know if you need any additional information.

Thank you,
{{yourName}}`,
        categoryId: categories[5].id, // Finance
        userId: user.id,
        tags: {
          create: [
            { tagId: tags[10].id },
            { tagId: tags[11].id },
            { tagId: tags[13].id },
          ],
        },
      },
    }),
    db.snippet.create({
      data: {
        title: "Payment Confirmation",
        content: `Hi {{firstName}},

We have received your payment for invoice #{{invoiceNumber}}. Thank you for your prompt attention.

Please let me know if you need a receipt or any additional details.

Best,
{{yourName}}`,
        categoryId: categories[5].id,
        userId: user.id,
        isFavorite: true,
        tags: {
          create: [
            { tagId: tags[10].id },
            { tagId: tags[17].id },
          ],
        },
      },
    }),
    db.snippet.create({
      data: {
        title: "Subscription Renewal Notice",
        content: `Hi {{firstName}},

Your subscription will renew on {{renewalDate}}. If you'd like to review your plan or make changes before then, please reach out.

Thanks for your continued business.

Regards,
{{yourName}}`,
        categoryId: categories[5].id,
        userId: user.id,
        tags: {
          create: [
            { tagId: tags[10].id },
            { tagId: tags[17].id },
          ],
        },
      },
    }),
    db.snippet.create({
      data: {
        title: "Billing Dispute Acknowledgement",
        content: `Hello {{firstName}},

Thank you for raising this billing concern. We are reviewing the details and will provide an update shortly.

We appreciate your patience.

Best,
{{yourName}}`,
        categoryId: categories[5].id,
        userId: user.id,
        tags: {
          create: [
            { tagId: tags[10].id },
            { tagId: tags[19].id },
          ],
        },
      },
    }),
    db.snippet.create({
      data: {
        title: "Expense Approval Request",
        content: `Hello {{firstName}},

I’m requesting approval for the following expense:
• Amount: {{amount}}
• Description: {{description}}
• Date: {{date}}

Please let me know if you need additional information.

Thank you,
{{yourName}}`,
        categoryId: categories[5].id,
        userId: user.id,
        tags: {
          create: [
            { tagId: tags[10].id },
            { tagId: tags[15].id },
          ],
        },
      },
    }),
    db.snippet.create({
      data: {
        title: "Payment Overdue Notice",
        content: `Hi {{firstName}},

Invoice #{{invoiceNumber}} is now overdue. Please submit payment by {{dueDate}} to avoid any late fees.

If you need more time, let me know and we can work out an arrangement.

Best,
{{yourName}}`,
        categoryId: categories[5].id,
        userId: user.id,
        tags: {
          create: [
            { tagId: tags[10].id },
            { tagId: tags[11].id },
            { tagId: tags[19].id },
          ],
        },
      },
    }),
    db.snippet.create({
      data: {
        title: "Issue Acknowledgement",
        content: `Hi {{firstName}},

Thanks for contacting us. We’ve received your request and are working on a resolution.

We’ll update you again soon.

Sincerely,
{{yourName}}`,
        categoryId: categories[6].id, // Customer Support
        userId: user.id,
        tags: {
          create: [
            { tagId: tags[8].id },
            { tagId: tags[19].id },
          ],
        },
      },
    }),
    db.snippet.create({
      data: {
        title: "Ticket Status Update",
        content: `Hello {{firstName}},

We’ve made progress on your support ticket and are now testing the fix. We expect to provide a final update by {{date}}.

Thanks for your patience.

Best,
{{yourName}}`,
        categoryId: categories[6].id,
        userId: user.id,
        tags: {
          create: [
            { tagId: tags[8].id },
            { tagId: tags[17].id },
          ],
        },
      },
    }),
    db.snippet.create({
      data: {
        title: "Feature Request Confirmation",
        content: `Hi {{firstName}},

Thank you for your suggestion. I’ve shared your request with the product team and we’re tracking it for future improvements.

We’ll keep you posted on any updates.

Regards,
{{yourName}}`,
        categoryId: categories[6].id,
        userId: user.id,
        tags: {
          create: [
            { tagId: tags[8].id },
            { tagId: tags[12].id },
          ],
        },
      },
    }),
    db.snippet.create({
      data: {
        title: "Customer Satisfaction Survey",
        content: `Hello {{firstName}},

We’d love your feedback on your recent experience. Please complete this short survey: {{surveyLink}}.

Your input helps us improve.

Thank you,
{{yourName}}`,
        categoryId: categories[6].id,
        userId: user.id,
        tags: {
          create: [
            { tagId: tags[8].id },
            { tagId: tags[18].id },
          ],
        },
      },
    }),
    db.snippet.create({
      data: {
        title: "Escalation Response",
        content: `Hi {{firstName}},

I’m sorry for the inconvenience. I’ve escalated this to our senior team and we’re prioritizing your case.

I’ll follow up with a status update by {{date}}.

Best,
{{yourName}}`,
        categoryId: categories[6].id,
        userId: user.id,
        tags: {
          create: [
            { tagId: tags[8].id },
            { tagId: tags[19].id },
          ],
        },
      },
    }),
    db.snippet.create({
      data: {
        title: "Product Launch Announcement",
        content: `Hi {{firstName}},

We’re excited to announce the launch of {{productName}}. It includes new features to help your team work faster and smarter.

Learn more here: {{launchLink}}.

Best,
{{yourName}}`,
        categoryId: categories[7].id, // Marketing
        userId: user.id,
        tags: {
          create: [
            { tagId: tags[9].id },
            { tagId: tags[17].id },
          ],
        },
      },
    }),
    db.snippet.create({
      data: {
        title: "Newsletter Teaser",
        content: `Hi {{firstName}},

This month’s newsletter includes customer stories, product tips, and upcoming events.

Read the full update here: {{newsletterLink}}.

Cheers,
{{yourName}}`,
        categoryId: categories[7].id,
        userId: user.id,
        tags: {
          create: [
            { tagId: tags[9].id },
            { tagId: tags[18].id },
          ],
        },
      },
    }),
    db.snippet.create({
      data: {
        title: "Event Invitation",
        content: `Hello {{firstName}},

You’re invited to our event on {{eventDate}}. We’ll cover industry trends and strategies for growth.

Reserve your spot here: {{eventLink}}.

Best regards,
{{yourName}}`,
        categoryId: categories[7].id,
        userId: user.id,
        tags: {
          create: [
            { tagId: tags[9].id },
            { tagId: tags[16].id },
          ],
        },
      },
    }),
    db.snippet.create({
      data: {
        title: "Referral Program Invitation",
        content: `Hi {{firstName}},

We’re launching a referral program. Refer a friend and earn {{reward}} for each successful signup.

Share your referral link: {{referralLink}}.

Thanks,
{{yourName}}`,
        categoryId: categories[7].id,
        userId: user.id,
        tags: {
          create: [
            { tagId: tags[9].id },
            { tagId: tags[15].id },
          ],
        },
      },
    }),
    db.snippet.create({
      data: {
        title: "Marketing Feedback Request",
        content: `Hello {{firstName}},

We’d love your thoughts on our latest campaign. Can you share what you liked most and what could be improved?

Your feedback helps us make better content.

Best,
{{yourName}}`,
        categoryId: categories[7].id,
        userId: user.id,
        tags: {
          create: [
            { tagId: tags[9].id },
            { tagId: tags[18].id },
          ],
        },
      },
    }),
    db.snippet.create({
      data: {
        title: "Welcome Onboarding Email",
        content: `Hello {{firstName}},

Welcome to the team! Your first day is {{startDate}}, and we’re excited to get you started.

Please review the onboarding schedule attached.

Best,
{{yourName}}`,
        categoryId: categories[8].id, // HR
        userId: user.id,
        tags: {
          create: [
            { tagId: tags[6].id },
            { tagId: tags[14].id },
          ],
        },
      },
    }),
    db.snippet.create({
      data: {
        title: "Policy Update Notification",
        content: `Hi {{firstName}},

We’ve updated our policy on {{policyTopic}}. Please review the new guidelines and reach out if you have questions.

Thank you,
{{yourName}}`,
        categoryId: categories[8].id,
        userId: user.id,
        tags: {
          create: [
            { tagId: tags[8].id },
            { tagId: tags[17].id },
          ],
        },
      },
    }),
    db.snippet.create({
      data: {
        title: "Interview Invitation",
        content: `Hello {{firstName}},

We’d like to invite you to interview for the {{position}} role. Please choose a time here: {{interviewLink}}.

Looking forward to speaking with you.

Best,
{{yourName}}`,
        categoryId: categories[8].id,
        userId: user.id,
        tags: {
          create: [
            { tagId: tags[8].id },
            { tagId: tags[16].id },
          ],
        },
      },
    }),
    db.snippet.create({
      data: {
        title: "Time-Off Request Approval",
        content: `Hi {{firstName}},

Your time-off request from {{startDate}} to {{endDate}} has been approved. Please complete your handoff notes before leaving.

Enjoy your break!

Thanks,
{{yourName}}`,
        categoryId: categories[8].id,
        userId: user.id,
        tags: {
          create: [
            { tagId: tags[15].id },
            { tagId: tags[13].id },
          ],
        },
      },
    }),
    db.snippet.create({
      data: {
        title: "Performance Review Schedule",
        content: `Hello {{firstName}},

Your performance review is scheduled for {{reviewDate}}. Please complete the self-assessment beforehand.

Let me know if you need to reschedule.

Best,
{{yourName}}`,
        categoryId: categories[8].id,
        userId: user.id,
        tags: {
          create: [
            { tagId: tags[9].id },
            { tagId: tags[16].id },
          ],
        },
      },
    }),
    db.snippet.create({
      data: {
        title: "Maintenance Notice",
        content: `Hello {{firstName}},

Our system will undergo maintenance on {{maintenanceDate}} from {{startTime}} to {{endTime}}. Some services may be unavailable during this period.

Thank you for your patience.

Regards,
{{yourName}}`,
        categoryId: categories[9].id, // Operations
        userId: user.id,
        tags: {
          create: [
            { tagId: tags[17].id },
            { tagId: tags[19].id },
          ],
        },
      },
    }),
    db.snippet.create({
      data: {
        title: "Shipment Update",
        content: `Hi {{firstName}},

Your order {{orderNumber}} has shipped and is expected to arrive on {{deliveryDate}}.

Track your shipment here: {{trackingLink}}.

Thanks,
{{yourName}}`,
        categoryId: categories[9].id,
        userId: user.id,
        tags: {
          create: [
            { tagId: tags[9].id },
            { tagId: tags[17].id },
          ],
        },
      },
    }),
    db.snippet.create({
      data: {
        title: "Project Update Summary",
        content: `Hello {{firstName}},

Here’s the latest project update:
• Status: {{status}}
• Completed: {{completedTasks}}
• Next steps: {{nextSteps}}

Please let me know if you have any questions.

Best,
{{yourName}}`,
        categoryId: categories[9].id,
        userId: user.id,
        tags: {
          create: [
            { tagId: tags[9].id },
            { tagId: tags[17].id },
          ],
        },
      },
    }),
  ]);

  console.log(`Created ${snippets.length} snippets`);

  // Create notes
  const notes = await Promise.all([
    db.note.create({
      data: {
        content:
          "Remember to check PostgreSQL performance on large queries with EXPLAIN ANALYZE",
        userId: user.id,
      },
    }),
    db.note.create({
      data: {
        content:
          "TODO: Add search functionality with full-text search in PostgreSQL",
        userId: user.id,
      },
    }),
    db.note.create({
      data: {
        content: "React 19 hooks documentation is now available on the official site",
        userId: user.id,
      },
    }),
  ]);

  console.log("\n✅ Demo content created successfully!");
  console.log(`   📁 ${categories.length} categories`);
  console.log(`   🏷️  ${tags.length} tags`);
  console.log(`   📝 ${snippets.length} snippets with tags`);
  console.log(`   📌 ${notes.length} notes`);
  console.log(`\n🎉 Open http://localhost:3000 to see your content!\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
