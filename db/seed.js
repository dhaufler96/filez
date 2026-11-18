import db from "#db/client";
import { createFolder } from "#db/queries/folders";
import { createFile } from "#db/queries/files";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const folders = [
    { name: "Documents", files: ["resume.pdf", "notes.txt", "report.docx", "budget.xlsx", "letter.pdf"] },
    { name: "Pictures", files: ["beach.jpg", "family.png", "dog.jpg", "mountains.png", "friends.jpg"] },
    { name: "Music", files: ["I'mTheProblem.mp3", "BeenByNow.mp3", "IGotBetter.mp3", "LastNight.mp3", "IHadSomeHelp.mp3"] },
  ];

  for (const folderData of folders) {
    const folder = await createFolder(folderData.name);
    for (let i = 0; i < folderData.files.length; i++) {
      await createFile({
        name: folderData.files[i],
        size: (i + 1) * 1000,
        folder_id: folder.id,
      });
    }
  }
}
