import z from "zod";

import { config } from "dotenv";
import { expand } from "dotenv-expand";

expand(config());

const EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(3000),
  MONGO_URI: z.string().url(),
  JWT_SECRET: z.string(),
});

let env;

try {
  env = EnvSchema.parse(process.env);
} catch (error) {
  console.error("❌ Invalid env:");
  console.error(error.flatten().fieldErrors);

  process.exit(1);
}

export default env;
