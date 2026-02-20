import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function buildEmailHtml(guest: {
  first_name: string;
  last_name: string;
  language: string;
  rsvp_status: boolean | null;
  bus_ida: boolean;
  bus_vuelta: boolean;
  barco_ida: boolean;
  barco_vuelta: boolean;
  dietary_reqs: string | null;
  preboda: boolean;
  plus_one: boolean | null;
  plus_one_name: string | null;
  children_count: number | null;
  children_needs: string | null;
}): string {
  const isItalian = guest.language === "it";

  const t = {
    title: isItalian
      ? "Grazie per aver confermato!"
      : "¡Gracias por confirmar!",
    greeting: isItalian
      ? `Ciao ${guest.first_name}!`
      : `¡Hola ${guest.first_name}!`,
    intro: isItalian
      ? "Siamo molto felici che possiate accompagnarci nel nostro grande giorno. Abbiamo ricevuto correttamente la vostra conferma."
      : "Estamos muy felices de que podáis acompañarnos en nuestro gran día. Hemos recibido correctamente vuestra confirmación.",
    summaryTitle: isItalian ? "Riepilogo" : "Resumen",
    attendance: isItalian ? "Presenza" : "Asistencia",
    attendanceYes: isItalian ? "Confermata ✓" : "Confirmada ✓",
    attendanceNo: isItalian ? "Non potrà venire" : "No podrá asistir",
    bus: isItalian ? "Autobus" : "Autobús",
    busIda: isItalian ? "Andata" : "Ida",
    busVuelta: isItalian ? "Ritorno" : "Vuelta",
    boat: isItalian ? "Barca" : "Barco",
    boatIda: isItalian ? "Andata" : "Ida",
    boatVuelta: isItalian ? "Ritorno" : "Vuelta",
    dietary: isItalian ? "Esigenze alimentari" : "Requisitos dietéticos",
    none: isItalian ? "Nessuna" : "Ninguno",
    prewedding: isItalian ? "Pre-matrimonio" : "Pre-boda",
    yes: isItalian ? "Sì" : "Sí",
    no: "No",
    plusOne: isItalian ? "Accompagnatore" : "Acompañante",
    children: isItalian ? "Bambini" : "Niños",
    childrenNeeds: isItalian ? "Esigenze bambini" : "Necesidades niños",
    closing: isItalian
      ? "Non vediamo l'ora di vedervi! 💛"
      : "¡Estamos deseando veros! 💛",
    backToWeb: isItalian ? "Torna al sito" : "Volver a la web",
    footer: isItalian
      ? "Con amore, Irene & Marco"
      : "Con cariño, Irene & Marco",
  };

  const transportLines: string[] = [];
  if (guest.bus_ida || guest.bus_vuelta) {
    const parts = [];
    if (guest.bus_ida) parts.push(t.busIda);
    if (guest.bus_vuelta) parts.push(t.busVuelta);
    transportLines.push(`🚌 ${t.bus}: ${parts.join(" + ")}`);
  }
  if (guest.barco_ida || guest.barco_vuelta) {
    const parts = [];
    if (guest.barco_ida) parts.push(t.boatIda);
    if (guest.barco_vuelta) parts.push(t.boatVuelta);
    transportLines.push(`⛵ ${t.boat}: ${parts.join(" + ")}`);
  }

  const plusOneText =
    guest.plus_one && guest.plus_one_name
      ? guest.plus_one_name
      : guest.plus_one
        ? t.yes
        : t.no;

  return `<!DOCTYPE html>
<html lang="${guest.language}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#FAF7F2;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF7F2;">
    <tr><td align="center" style="padding:40px 20px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
        
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#D4A574,#C4956A);padding:48px 40px;text-align:center;">
          <h1 style="margin:0;color:#FFFFFF;font-size:28px;font-weight:400;letter-spacing:1px;line-height:1.4;">
            ¡Gracias por confirmar!<br>
            <span style="font-size:22px;opacity:0.9;">Grazie per aver confermato!</span>
          </h1>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px;">
          <p style="margin:0 0 16px;color:#5C4A3A;font-size:18px;">${t.greeting}</p>
          <p style="margin:0 0 32px;color:#7A6B5D;font-size:15px;line-height:1.7;">${t.intro}</p>

          <!-- Summary -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF7F2;border-radius:12px;padding:24px;margin-bottom:32px;">
            <tr><td style="padding:24px;">
              <h2 style="margin:0 0 20px;color:#5C4A3A;font-size:16px;text-transform:uppercase;letter-spacing:2px;">${t.summaryTitle}</h2>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="color:#7A6B5D;font-size:14px;">
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #E8E0D8;font-weight:bold;">${t.attendance}</td>
                  <td style="padding:8px 0;border-bottom:1px solid #E8E0D8;text-align:right;">${guest.rsvp_status !== false ? t.attendanceYes : t.attendanceNo}</td>
                </tr>
                ${transportLines.length > 0 ? transportLines.map((line) => `<tr><td colspan="2" style="padding:8px 0;border-bottom:1px solid #E8E0D8;">${line}</td></tr>`).join("") : ""}
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #E8E0D8;font-weight:bold;">${t.dietary}</td>
                  <td style="padding:8px 0;border-bottom:1px solid #E8E0D8;text-align:right;">${guest.dietary_reqs || t.none}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #E8E0D8;font-weight:bold;">${t.prewedding}</td>
                  <td style="padding:8px 0;border-bottom:1px solid #E8E0D8;text-align:right;">${guest.preboda ? t.yes : t.no}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #E8E0D8;font-weight:bold;">${t.plusOne}</td>
                  <td style="padding:8px 0;border-bottom:1px solid #E8E0D8;text-align:right;">${plusOneText}</td>
                </tr>
                ${(guest.children_count ?? 0) > 0 ? `
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #E8E0D8;font-weight:bold;">${t.children}</td>
                  <td style="padding:8px 0;border-bottom:1px solid #E8E0D8;text-align:right;">${guest.children_count}</td>
                </tr>
                ${guest.children_needs ? `<tr>
                  <td style="padding:8px 0;border-bottom:1px solid #E8E0D8;font-weight:bold;">${t.childrenNeeds}</td>
                  <td style="padding:8px 0;border-bottom:1px solid #E8E0D8;text-align:right;">${guest.children_needs}</td>
                </tr>` : ""}` : ""}
              </table>
            </td></tr>
          </table>

          <p style="margin:0 0 32px;color:#7A6B5D;font-size:15px;text-align:center;">${t.closing}</p>

          <!-- CTA -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center">
              <a href="https://ireneymarco2026.com" style="display:inline-block;background-color:#D4A574;color:#FFFFFF;text-decoration:none;padding:14px 40px;border-radius:8px;font-size:15px;letter-spacing:1px;">
                ${t.backToWeb}
              </a>
            </td></tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:32px 40px;text-align:center;border-top:1px solid #F0E8E0;">
          <p style="margin:0;color:#B8A89A;font-size:13px;font-style:italic;">${t.footer}</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const payload = await req.json();
    console.log("Webhook payload:", JSON.stringify(payload));

    // Support both direct call and webhook trigger
    const guest = payload.record || payload;

    if (!guest.email || !guest.first_name) {
      throw new Error("Missing required guest data (email, first_name)");
    }

    const isItalian = guest.language === "it";
    const subject = isItalian
      ? `Conferma ricevuta – Irene & Marco 2026`
      : `Confirmación recibida – Irene & Marco 2026`;

    const html = buildEmailHtml(guest);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Irene & Marco <invitaciones@ireneymarco2026.com>",
        to: [guest.email],
        subject,
        html,
      }),
    });

    const data = await res.json();
    console.log("Resend response:", JSON.stringify(data));

    if (!res.ok) {
      throw new Error(`Resend error: ${JSON.stringify(data)}`);
    }

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
