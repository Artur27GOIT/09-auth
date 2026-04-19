import { cookies } from "next/headers";

type AuthCookieName = "accessToken" | "refreshToken";

type ParsedCookie = {
  name: string;
  value: string;
  options: {
    expires?: Date;
    path?: string;
    maxAge?: number;
    httpOnly: boolean;
    sameSite: "lax" | "strict" | "none";
    secure: boolean;
  };
};

const AUTH_COOKIE_NAMES: AuthCookieName[] = ["accessToken", "refreshToken"];

function parseSetCookieHeader(cookieString: string): ParsedCookie {
  const [nameValue, ...rawAttributes] = cookieString.split(";");
  const [name, ...rawValue] = nameValue.trim().split("=");
  const value = rawValue.join("=");

  const parsedCookie: ParsedCookie = {
    name,
    value,
    options: {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  };

  for (const attribute of rawAttributes) {
    const [rawKey, ...rawAttributeValue] = attribute.trim().split("=");
    const key = rawKey.toLowerCase();
    const attributeValue = rawAttributeValue.join("=");

    switch (key) {
      case "expires":
        parsedCookie.options.expires = new Date(attributeValue);
        break;
      case "path":
        parsedCookie.options.path = attributeValue;
        break;
      case "max-age":
        parsedCookie.options.maxAge = Number(attributeValue);
        break;
      case "samesite":
        if (
          attributeValue === "lax" ||
          attributeValue === "strict" ||
          attributeValue === "none"
        ) {
          parsedCookie.options.sameSite = attributeValue;
        }
        break;
      case "secure":
        parsedCookie.options.secure = true;
        break;
      default:
        break;
    }
  }

  return parsedCookie;
}

export async function syncAuthCookies(
  setCookieHeader: string | string[] | undefined,
) {
  if (!setCookieHeader) {
    return false;
  }

  const cookieStore = await cookies();
  const cookieValues = Array.isArray(setCookieHeader)
    ? setCookieHeader
    : [setCookieHeader];

  let hasAuthCookies = false;

  for (const cookieValue of cookieValues) {
    const parsedCookie = parseSetCookieHeader(cookieValue);

    if (
      AUTH_COOKIE_NAMES.includes(parsedCookie.name as AuthCookieName) &&
      parsedCookie.value
    ) {
      cookieStore.set(parsedCookie.name, parsedCookie.value, parsedCookie.options);
      hasAuthCookies = true;
    }
  }

  return hasAuthCookies;
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();

  for (const cookieName of AUTH_COOKIE_NAMES) {
    cookieStore.delete(cookieName);
  }
}

export function logErrorResponse(errorObj: unknown): void {
  const green = '\x1b[32m';
  const yellow = '\x1b[33m';
  const reset = '\x1b[0m';

  // Стрелка зелёная, текст жёлтый
  console.log(`${green}> ${yellow}Error Response Data:${reset}`);
  console.dir(errorObj, { depth: null, colors: true });
}
