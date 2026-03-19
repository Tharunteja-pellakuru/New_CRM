import fs from "fs";
import path from "path";

async function processDir(dir) {
  try {
    const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
    for (const dirent of dirents) {
      const res = path.resolve(dir, dirent.name);
      if (dirent.isDirectory()) {
        await processDir(res);
      } else if (res.endsWith(".jsx") || res.endsWith(".js")) {
        try {
          let content = await fs.promises.readFile(res, "utf8");
          const newContent = content.replace(/text-\[(\d+)px\]/g, (match, p1) => {
            const num = parseInt(p1, 10);
            if (num >= 8 && num <= 11) {
              return `text-[${num + 3}px]`;
            }
            return match;
          });
          if (content !== newContent) {
            await fs.promises.writeFile(res, newContent, "utf8");
            console.log(`Updated ${res}`);
          }
        } catch (e) {
           console.error(`Failed to read/write ${res}: ${e.message}`);
        }
      }
    }
  } catch (err) {
    console.error(`Failed to read dir ${dir}: ${err.message}`);
  }
}

processDir("c:/Users/Desktop/Parivartan_CRM/CRM_Frontend/src")
  .then(() => console.log("Done!"))
  .catch(console.error);
