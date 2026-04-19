import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "../../api";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!accessToken && !refreshToken) {
      return NextResponse.json(null, { status: 200 });
    }

    try {
      const apiRes = await api.get("auth/session", {
        headers: {
          Cookie: cookieStore.toString(),
        },
      });

      const setCookie = apiRes.headers["set-cookie"];

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
        for (const cookieStr of cookieArray) {
          // Parse simple cookie string format: name=value; path=/; etc.
          const parts = cookieStr.split(";");
          if (parts[0]) {
            const [name, value] = parts[0].split("=");
            if (name && value) {
              cookieStore.set(name.trim(), value.trim());
            }
          }
        }
      }

      return NextResponse.json(apiRes.data, { status: 200 });
    } catch {
      return NextResponse.json(null, { status: 200 });
    }
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(null, { status: 200 });
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(null, { status: 200 });
  }
}
