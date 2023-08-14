"use server";

import { cookies } from "next/headers";

export async function setCookie(name: string, value: string, options: any) {
  cookies().set(name, value, options);
}
