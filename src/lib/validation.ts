import { z } from "zod";

export const MessageSchema = z.object({
  user: z.string(),
  text: z.string(),
});

export const AnalyseRequestSchema = z.object({
  messages: z.array(MessageSchema),
});

export type AnalyseRequest = z.infer<typeof AnalyseRequestSchema>;
