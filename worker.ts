
/**
 * Cloudflare Worker Backend for Free Fire Tournament Website
 * Comprehensive API handling for Users, Tournaments, and Admin.
 */

// Define missing D1 types to fix compilation errors
interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch(statements: D1PreparedStatement[]): Promise<any>;
}

interface D1PreparedStatement {
  bind(...args: any[]): D1PreparedStatement;
  all<T = any>(): Promise<{ results: T[] }>;
  first<T = any>(): Promise<T | null>;
  run(): Promise<any>;
}

export interface Env {
  DB: D1Database;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

async function hashPassword(password: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "salt_123"); 
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;

    if (method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    try {
      // --- PUBLIC: TOURNAMENTS ---
      if (url.pathname === "/api/tournaments" && method === "GET") {
        // Ensure we fetch using camelCase if the D1 tables were created that way
        const { results } = await env.DB.prepare("SELECT * FROM tournaments ORDER BY dateTime ASC").all();
        return Response.json(results, { headers: CORS_HEADERS });
      }

      // --- AUTH: SIGNUP ---
      if (url.pathname === "/api/auth/signup" && method === "POST") {
        const { name, email, password, ff_uid, whatsapp } = await request.json();
        const passHash = await hashPassword(password);
        const id = crypto.randomUUID();
        
        await env.DB.prepare(
          "INSERT INTO users (id, name, email, password_hash, ff_uid, whatsapp) VALUES (?, ?, ?, ?, ?, ?)"
        ).bind(id, name, email, passHash, ff_uid, whatsapp).run();

        return Response.json({ success: true, user: { id, name, email, ff_uid, whatsapp } }, { headers: CORS_HEADERS });
      }

      // --- AUTH: LOGIN ---
      if (url.pathname === "/api/auth/login" && method === "POST") {
        const { email, username, password, type } = await request.json();
        const passHash = await hashPassword(password);

        if (type === 'admin') {
          const admin = await env.DB.prepare("SELECT id, username FROM admins WHERE username = ? AND password_hash = ?")
            .bind(username, passHash).first();
          if (!admin) return new Response("Invalid Admin", { status: 401, headers: CORS_HEADERS });
          return Response.json({ success: true, user: admin, token: "admin-token-" + crypto.randomUUID() }, { headers: CORS_HEADERS });
        } else {
          const user = await env.DB.prepare("SELECT id, name, email, ff_uid, whatsapp FROM users WHERE email = ? AND password_hash = ?")
            .bind(email, passHash).first();
          if (!user) return new Response("Invalid User", { status: 401, headers: CORS_HEADERS });
          return Response.json({ success: true, user, token: "user-token-" + crypto.randomUUID() }, { headers: CORS_HEADERS });
        }
      }

      // --- USER: DASHBOARD ---
      if (url.pathname === "/api/user/dashboard" && method === "GET") {
        const userId = url.searchParams.get("userId");
        const { results } = await env.DB.prepare(`
          SELECT t.* FROM tournaments t 
          JOIN registrations r ON t.id = r.tournament_id 
          WHERE r.user_id = ?
        `).bind(userId).all();
        return Response.json(results, { headers: CORS_HEADERS });
      }

      // --- USER: JOIN ---
      if (url.pathname === "/api/user/join" && method === "POST") {
        const { userId, tournamentId } = await request.json();
        
        // Check registration
        const existing = await env.DB.prepare("SELECT id FROM registrations WHERE user_id = ? AND tournament_id = ?")
          .bind(userId, tournamentId).first();
        if (existing) return new Response("Already registered", { status: 400, headers: CORS_HEADERS });

        // Check slots
        const tourney = await env.DB.prepare("SELECT registeredCount, slots, status FROM tournaments WHERE id = ?")
          .bind(tournamentId).first();
        if (!tourney || tourney.status !== 'open' || tourney.registeredCount >= tourney.slots) {
          return new Response("Closed or Full", { status: 400, headers: CORS_HEADERS });
        }

        const id = crypto.randomUUID();
        await env.DB.batch([
          env.DB.prepare("INSERT INTO registrations (id, user_id, tournament_id) VALUES (?, ?, ?)").bind(id, userId, tournamentId),
          env.DB.prepare("UPDATE tournaments SET registeredCount = registeredCount + 1 WHERE id = ?").bind(tournamentId)
        ]);

        return Response.json({ success: true }, { headers: CORS_HEADERS });
      }

      // --- ADMIN: CREATE TOURNAMENT ---
      if (url.pathname === "/api/admin/tournament/create" && method === "POST") {
        const data = await request.json();
        const id = crypto.randomUUID();
        // Matching column names from clean SQL schema
        await env.DB.prepare(
          "INSERT INTO tournaments (id, title, mode, entryFee, prizePool, dateTime, slots, rules) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        ).bind(id, data.title, data.mode, data.entryFee, data.prizePool, data.startTime, data.maxSlots, data.rules).run();
        return Response.json({ success: true }, { headers: CORS_HEADERS });
      }

      return new Response("Not Found", { status: 404, headers: CORS_HEADERS });
    } catch (e: any) {
      return new Response(e.message, { status: 500, headers: CORS_HEADERS });
    }
  }
}
