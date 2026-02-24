const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Parse date filters from query params or body
    const url = new URL(req.url);
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");

    // Build query
    let query = supabaseAdmin
      .from("rsvp_events")
      .select("event_type, rsvp_status, metadata, created_at")
      .order("created_at", { ascending: true });

    if (from) query = query.gte("created_at", from);
    if (to) query = query.lte("created_at", to);

    const { data: events, error } = await query;

    if (error) throw error;

    // Aggregate data
    const totals: Record<string, number> = {};
    const languageCounts: Record<string, number> = { es: 0, en: 0, it: 0 };
    let confirmations = 0;
    let declines = 0;
    let emailsSent = 0;
    let emailsFailed = 0;
    let ibanClicks = 0;
    let hotelClicks = 0;

    // RSVP funnel
    let formViews = 0;
    let formStarts = 0;
    let formSubmits = 0;

    for (const ev of events || []) {
      const t = ev.event_type;
      totals[t] = (totals[t] || 0) + 1;

      if (t === "rsvp_confirmation_requested") {
        if (ev.rsvp_status === true) confirmations++;
        else declines++;

        const meta = ev.metadata as Record<string, unknown> | null;
        if (meta?.language && typeof meta.language === "string") {
          const lang = meta.language as string;
          if (lang in languageCounts) languageCounts[lang]++;
        }
      }

      if (t === "rsvp_confirm_email_sent" || t === "rsvp_decline_email_sent") emailsSent++;
      if (t === "rsvp_email_failed") emailsFailed++;

      if (t === "iban_copy_click") ibanClicks++;
      if (t === "hotel_info_click") hotelClicks++;

      if (t === "rsvp_form_view") formViews++;
      if (t === "rsvp_form_start") formStarts++;
      if (t === "rsvp_confirmation_requested") formSubmits++;
    }

    const analytics = {
      summary: {
        total_events: (events || []).length,
        confirmations,
        declines,
        emails_sent: emailsSent,
        emails_failed: emailsFailed,
      },
      engagement: {
        iban_clicks: ibanClicks,
        hotel_clicks: hotelClicks,
      },
      languages: languageCounts,
      funnel: {
        form_views: formViews,
        form_starts: formStarts,
        form_submits: formSubmits,
      },
      event_types: totals,
    };

    return new Response(JSON.stringify(analytics), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
