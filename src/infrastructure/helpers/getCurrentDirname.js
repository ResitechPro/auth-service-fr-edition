import { fileURLToPath } from "url";
import { dirname } from "path";

const getCurrentDirname = (importMetaUrl) => {
  const __filename = fileURLToPath(importMetaUrl);
  return dirname(__filename);
};

export default getCurrentDirname;
