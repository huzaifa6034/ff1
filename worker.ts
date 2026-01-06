
/**
 * Cloudflare Worker Backend for Free Fire Tournament Website
 * Handles REST API for tournaments and player registration.
 */

export default {
  async fetch(request: Request, env: any) {
    const url = new URL(request.url);
    const method = request.method;

    // CORS Headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Public: Get all tournaments
    if (url.pathname === "/api/tournaments" && method === "GET") {
      const { results } = await env.DB.prepare("SELECT * FROM tournaments ORDER BY dateTime ASC").all();
      return Response.json(results, { headers: corsHeaders });
    }

    // Public: Register player
    if (url.pathname === "/api/register" && method === "POST") {
      try {
        const { tournamentId, ign, uid, whatsapp } = await request.json();
        
        // Check if tournament is still open
        const tournament = await env.DB.prepare("SELECT status, registeredCount, slots FROM tournaments WHERE id = ?")
          .bind(tournamentId)
          .first();
        
        if (!tournament || tournament.status !== 'open' || tournament.registeredCount >= tournament.slots) {
          return new Response("Tournament is full or closed", { status: 400, headers: corsHeaders });
        }

        const id = crypto.randomUUID();
        await env.DB.prepare("INSERT INTO players (id, tournamentId, ign, uid, whatsapp) VALUES (?, ?, ?, ?, ?)")
          .bind(id, tournamentId, ign, uid, whatsapp)
          .run();

        // Increment count
        await env.DB.prepare("UPDATE tournaments SET registeredCount = registeredCount + 1 WHERE id = ?")
          .bind(tournamentId)
          .run();

        return Response.json({ success: true }, { headers: corsHeaders });
      } catch (e) {
        return new Response("Invalid data", { status: 400, headers: corsHeaders });
      }
    }

    // Admin: Login (Simplified for demo)
    if (url.pathname === "/api/admin/login" && method === "POST") {
      const { username, password } = await request.json();
      const admin = await env.DB.prepare("SELECT * FROM admins WHERE username = ?").bind(username).first();
      
      if (admin && admin.passwordHash === password) {
        // Return a simple session token (In production, use JWT)
        return Response.json({ token: "fake-jwt-token" }, { headers: corsHeaders });
      }
      return new Response("Unauthorized", { status: 401, headers: corsHeaders });
    }

    // Admin: Get players for a tournament
    if (url.pathname === "/api/admin/players" && method === "GET") {
      const tournamentId = url.searchParams.get("tournamentId");
      let query = "SELECT * FROM players";
      let params = [];
      
      if (tournamentId) {
        query += " WHERE tournamentId = ?";
        params.push(tournamentId);
      }
      
      const { results } = await env.DB.prepare(query).bind(...params).all();
      return Response.json(results, { headers: corsHeaders });
    }

    // Fallback
    return new Response("Not Found", { status: 404, headers: corsHeaders });
  }
}
