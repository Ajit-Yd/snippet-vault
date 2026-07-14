import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  // Create a test user
  const user = await db.user.create({
    data: {
      email: "demo@example.com",
      name: "Demo User",
    },
  });

  console.log(`Created user: ${user.email}`);

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

  console.log(`Created ${notes.length} notes`);

  console.log("\n✅ Seed data created successfully!");
  console.log(`- 1 user (demo@example.com)`);
  console.log(`- ${categories.length} categories`);
  console.log(`- ${tags.length} tags`);
  console.log(`- ${snippets.length} snippets with tag associations`);
  console.log(`- ${notes.length} notes`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
