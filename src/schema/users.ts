import redis from "@/lib/redis";
import { Schema, Repository } from "redis-om";

export const userSchema = new Schema(
  "user",
  {
    userId: { type: "string" },
    groupNum: { type: "number" },
    mazeResults: { type: "number[]" },
    questionAnswers: { type: "string[]" },
  },
  {
    dataStructure: "JSON",
  }
);

export const userRepo = new Repository(userSchema, redis);
