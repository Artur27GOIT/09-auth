import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "../../api";
import { isAxiosError } from "axios";
import {
  clearAuthCookies,
  logErrorResponse,
  syncAuthCookies,
} from "../../_utils/utils";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!accessToken && !refreshToken) {
      return NextResponse.json(null, { status: 200 });
    }

    const apiRes = await api.get("auth/session", {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    await syncAuthCookies(apiRes.headers["set-cookie"]);

    return NextResponse.json(apiRes.data ?? null, { status: apiRes.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      await clearAuthCookies();
      return NextResponse.json(null, { status: 200 });
    }
    logErrorResponse({ message: (error as Error).message });
    await clearAuthCookies();
    return NextResponse.json(null, { status: 200 });
  }
}
