import redis from "@/lib/redis";
import { Schema, Repository, Entity } from "redis-om";

export interface User extends Entity {
  userId: string;
  groupNum: number;
  mazeResults: number[];
  surveyAnswers: string;
  feedbackAnswers: string;
  iss: number;
  st: string;
}

export const userSchema = new Schema(
  "user",
  {
    userId: { type: "string" },
    groupNum: { type: "number" },
    mazeResults: { type: "number[]" },
    surveyAnswers: { type: "string" },
    feedbackAnswers: { type: "string" },
    iss: { type: "number" },
    st: { type: "string" },
  },
  {
    dataStructure: "JSON",
  }
);

export const userRepo = new Repository(userSchema, redis);
