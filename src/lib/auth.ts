import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export async function genUserToken(userId: string): Promise<NewTokenObject> {
  let groupNum = Math.floor(Math.random() * 2);
  const token = await new SignJWT({
    userId,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt(Date.now())
    .setIssuer("rabbit:api:jwtservice")
    .setAudience(`rabbit:user:group${groupNum}`)
    .setExpirationTime("7d")
    .sign(secret);

  return {
    token,
    userId,
    groupNum,
    groupName: groupNum === 0 ? "PIRMAJĀ" : "OTRAJĀ",
  };
}

export async function verifyJWT(token: string): Promise<InitData> {
  try {
    //@ts-ignore
    const jwtData: JWTData = await jwtVerify(token, secret, {
      issuer: "rabbit:api:jwtservice",
      requiredClaims: ["iat", "aud"],
      typ: "JWT",
    });

    let groupNum = parseInt(jwtData.payload.aud!.toString().charAt(17));

    return {
      success: true,
      userId: jwtData.payload.userId,
      groupNum,
      groupName: groupNum === 0 ? "PIRMAJĀ" : "OTRAJĀ",
    };
  } catch {
    return {
      success: false,
      userId: null,
      groupNum: null,
      groupName: null,
    };
  }
}
