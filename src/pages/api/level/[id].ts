import { promises as fs } from "fs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = JSON.parse(
    await fs.readFile(`${process.cwd()}/src/maps/${req.query.id}.json`, "utf8")
  );

  res.status(200).json({ data });
}
