// 服务端文件存储：先写临时文件再原子替换，保留上一份有效备份。
import { readFileSync, writeFileSync, renameSync, copyFileSync, existsSync } from "node:fs";

export function filePersistence(path) {
  return {
    load() {
      if (!existsSync(path)) return null;
      const raw = readFileSync(path, "utf8");
      try { JSON.parse(raw); return raw; }
      catch {
        const backup = readFileSync(`${path}.bak`, "utf8");
        JSON.parse(backup);
        return backup;
      }
    },
    save(raw) {
      JSON.parse(raw);
      writeFileSync(`${path}.tmp`, raw, "utf8");
      if (existsSync(path)) {
        const previous = readFileSync(path, "utf8");
        try { JSON.parse(previous); copyFileSync(path, `${path}.bak`); } catch { /* 保留已有有效备份 */ }
      }
      renameSync(`${path}.tmp`, path);
    },
  };
}
