import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabaseServer";
import { cookies } from "next/headers";

const getSessionIdFromToken = (token: string): string | null => {
  try {
    const parts = token.split(".");
    if (parts.length === 3) {
      const payload = JSON.parse(
        Buffer.from(parts[1], "base64").toString("utf-8")
      );
      return payload.session_id || payload.sid || null;
    }
  } catch (err) {
    console.error("Error decoding access token payload:", err);
  }
  return null;
};

const getSessionIdFromCookies = async (): Promise<string | null> => {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    
    // Find all chunks of the auth token
    const chunks = allCookies
      .filter((c) => c.name.includes("-auth-token"))
      .sort((a, b) => {
        const aIndex = parseInt(a.name.split(".").pop() || "-1", 10);
        const bIndex = parseInt(b.name.split(".").pop() || "-1", 10);
        return aIndex - bIndex;
      });

    if (chunks.length > 0) {
      const rawValue = chunks.map((c) => c.value).join("");
      const decodedValue = decodeURIComponent(rawValue);
      
      let parsedValue = "";
      if (decodedValue.startsWith("base64-")) {
        const base64Str = decodedValue.substring(7); // strip "base64-"
        parsedValue = Buffer.from(base64Str, "base64").toString("utf-8");
      } else {
        parsedValue = decodedValue;
      }

      const parsed = JSON.parse(parsedValue);
      
      let token: string | null = null;
      if (Array.isArray(parsed)) {
        token = parsed[0] || null;
      } else if (parsed && typeof parsed === "object") {
        token = parsed.access_token || null;
      }

      if (token) {
        return getSessionIdFromToken(token);
      }
    }
  } catch (err) {
    console.error("Error manually parsing auth cookie:", err);
  }
  return null;
};

export async function GET(request: Request) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = (await createSupabaseServerClient()) as any;
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Call the database function to fetch active sessions for this user
    const { data: sessions, error } = await supabase.rpc("get_user_sessions");

    if (error) {
      console.error("Error fetching sessions via RPC:", error);
      return NextResponse.json({ error: "Failed to retrieve active sessions" }, { status: 500 });
    }

    // Identify current session ID:
    // 1. Try custom header passed from browser client
    let currentSessionId = request.headers.get("x-current-session-id");

    // 2. Try standard getSession()
    if (!currentSessionId) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        currentSessionId = getSessionIdFromToken(session.access_token);
      }
    }

    // 3. Try manual cookie parsing
    if (!currentSessionId) {
      currentSessionId = await getSessionIdFromCookies();
    }

    return NextResponse.json({
      sessions: sessions || [],
      currentSessionId,
    });
  } catch (error) {
    console.error("Sessions GET route exception:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = (await createSupabaseServerClient()) as any;
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("id");
    const revokeOthers = searchParams.get("others") === "true";

    if (revokeOthers) {
      // Identify current session ID:
      // 1. Try custom header passed from browser client
      let currentSessionId = request.headers.get("x-current-session-id");

      // 2. Try standard getSession()
      if (!currentSessionId) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          currentSessionId = getSessionIdFromToken(session.access_token);
        }
      }

      // 3. Try manual cookie parsing
      if (!currentSessionId) {
        currentSessionId = await getSessionIdFromCookies();
      }

      if (!currentSessionId) {
        return NextResponse.json(
          { error: "Could not identify current session to preserve" },
          { status: 400 }
        );
      }

      // Call the RPC to revoke all other sessions
      const { error } = await supabase.rpc("revoke_other_user_sessions", {
        current_session_id: currentSessionId,
      });

      if (error) {
        console.error("Error revoking other sessions via RPC:", error);
        return NextResponse.json({ error: "Failed to revoke other sessions" }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: "Logged out from all other devices successfully.",
      });
    } else {
      if (!sessionId) {
        return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
      }

      // Call the RPC to revoke the specific session
      const { error } = await supabase.rpc("revoke_user_session", {
        session_id: sessionId,
      });

      if (error) {
        console.error("Error revoking session via RPC:", error);
        return NextResponse.json({ error: "Failed to revoke session" }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: "Session revoked successfully.",
      });
    }
  } catch (error) {
    console.error("Sessions DELETE route exception:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
