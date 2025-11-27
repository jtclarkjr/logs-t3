import { createTRPCRouter } from "@/server/api/trpc";

import { analyticsRouter } from "./analytics";
import { crudRouter } from "./crud";

export const logsRouter = createTRPCRouter({
  ...crudRouter._def.procedures,
  ...analyticsRouter._def.procedures,
});
