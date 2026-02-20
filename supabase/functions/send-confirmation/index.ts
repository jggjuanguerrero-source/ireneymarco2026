const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface GuestData {
  first_name: string;
  last_name: string;
  email: string;
  language: string;
  rsvp_status: boolean | string;
  bus_ida: boolean;
  dietary_reqs: string | null;
  preboda: boolean;
  plus_one: boolean | null;
  plus_one_name: string | null;
  children_count: number | null;
  children_needs: string | null;
}

const IBAN = "ES12 3456 7890 1234 5678 9012";

function getAttendingTranslations(lang: string) {
  if (lang === "it") {
    return {
      subject: "Conferma ricevuta – Irene & Marco 2026",
      title: "Grazie per aver confermato!",
      greeting: (name: string) => `Ciao ${name}!`,
      intro: "Siamo molto felici che possiate accompagnarci nel nostro grande giorno. Ecco un riepilogo della vostra conferma.",
      summaryTitle: "Riepilogo",
      bus: "Autobus",
      dietary: "Esigenze alimentari",
      none: "Nessuna",
      prewedding: "Pre-matrimonio",
      yes: "Sì",
      no: "No",
      plusOne: "Accompagnatore",
      children: "Bambini",
      childrenNeeds: "Esigenze bambini",
      giftTitle: "Regalo",
      giftText: `Se desiderate farci un regalo, ecco il nostro IBAN:`,
      closing: "Non vediamo l'ora di vedervi! 💛",
      backToWeb: "Torna al sito",
      footer: "Con amore, Irene & Marco",
    };
  }
  return {
    subject: "Confirmación recibida – Irene & Marco 2026",
    title: "¡Gracias por confirmar!",
    greeting: (name: string) => `¡Hola ${name}!`,
    intro: "Estamos muy felices de que podáis acompañarnos en nuestro gran día. Aquí tenéis un resumen de vuestra confirmación.",
    summaryTitle: "Resumen",
    bus: "Autobús",
    dietary: "Requisitos dietéticos",
    none: "Ninguno",
    prewedding: "Pre-boda",
    yes: "Sí",
    no: "No",
    plusOne: "Acompañante",
    children: "Niños",
    childrenNeeds: "Necesidades niños",
    giftTitle: "Regalo",
    giftText: `Si queréis hacernos un regalo, aquí tenéis nuestro IBAN:`,
    closing: "¡Estamos deseando veros! 💛",
    backToWeb: "Volver a la web",
    footer: "Con cariño, Irene & Marco",
  };
}

function getDeclineTranslations(lang: string) {
  if (lang === "it") {
    return {
      subject: "Abbiamo ricevuto la tua risposta – Irene & Marco 2026",
      title: "Grazie per averci risposto",
      greeting: (name: string) => `Caro/a ${name},`,
      body: "Ci dispiace tantissimo che non possiate essere con noi in questo giorno così speciale. Ci avrebbe fatto davvero piacere avervi al nostro fianco, ma apprezziamo moltissimo che abbiate trovato il tempo di farcelo sapere.",
      body2: "Vi porteremo nel cuore quel giorno e speriamo di rivedervi prestissimo per festeggiare insieme! 🤍",
      closing: "Un abbraccio forte,",
      footer: "Con amore, Irene & Marco",
      backToWeb: "Torna al sito",
    };
  }
  return {
    subject: "Hemos recibido tu respuesta – Irene & Marco 2026",
    title: "Gracias por avisarnos",
    greeting: (name: string) => `Querido/a ${name},`,
    body: "Nos da mucha pena que no podáis estar con nosotros en este día tan especial. Nos habría encantado teneros a nuestro lado, pero os agradecemos muchísimo que hayáis encontrado un momento para hacérnoslo saber.",
    body2: "Os llevaremos en el corazón ese día y esperamos veros muy pronto para celebrar juntos. 🤍",
    closing: "Un abrazo enorme,",
    footer: "Con cariño, Irene & Marco",
    backToWeb: "Volver a la web",
  };
}

function buildAttendingEmailHtml(guest: GuestData): string {
  const t = getAttendingTranslations(guest.language);

  const rows: string[] = [];

  if (guest.bus_ida) {
    rows.push(summaryRow(`🚌 ${t.bus}`, t.yes));
  }
  rows.push(summaryRow(`🍽️ ${t.dietary}`, guest.dietary_reqs || t.none));
  rows.push(summaryRow(`🎉 ${t.prewedding}`, guest.preboda ? t.yes : t.no));

  const plusOneText =
    guest.plus_one && guest.plus_one_name
      ? guest.plus_one_name
      : guest.plus_one
        ? t.yes
        : t.no;
  rows.push(summaryRow(`💑 ${t.plusOne}`, plusOneText));

  if ((guest.children_count ?? 0) > 0) {
    rows.push(summaryRow(`👶 ${t.children}`, String(guest.children_count)));
    if (guest.children_needs) {
      rows.push(summaryRow(`📝 ${t.childrenNeeds}`, guest.children_needs));
    }
  }

  return emailShell(guest.language, `
    <!-- Header -->
    <tr><td style="background:linear-gradient(135deg,#8B7355,#B8A07A);padding:48px 40px;text-align:center;">
      <h1 style="margin:0;color:#FFFFFF;font-size:28px;font-weight:400;letter-spacing:1px;line-height:1.4;">
        ${t.title}
      </h1>
    </td></tr>

    <!-- Body -->
    <tr><td style="padding:40px;">
      <p style="margin:0 0 16px;color:#2C3E50;font-size:18px;">${t.greeting(guest.first_name)}</p>
      <p style="margin:0 0 32px;color:#6B7B8C;font-size:15px;line-height:1.7;">${t.intro}</p>

      <!-- Summary -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8F5F0;border-radius:12px;margin-bottom:32px;">
        <tr><td style="padding:24px;">
          <h2 style="margin:0 0 20px;color:#2C3E50;font-size:16px;text-transform:uppercase;letter-spacing:2px;">${t.summaryTitle}</h2>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="color:#6B7B8C;font-size:14px;">
            ${rows.join("")}
          </table>
        </td></tr>
      </table>

      <!-- IBAN -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F3EDE4;border-radius:12px;margin-bottom:32px;">
        <tr><td style="padding:24px;text-align:center;">
          <h3 style="margin:0 0 12px;color:#2C3E50;font-size:15px;text-transform:uppercase;letter-spacing:2px;">🎁 ${t.giftTitle}</h3>
          <p style="margin:0 0 12px;color:#6B7B8C;font-size:14px;line-height:1.6;">${t.giftText}</p>
          <p style="margin:0;color:#2C3E50;font-size:16px;font-weight:bold;letter-spacing:1px;font-family:monospace;">${IBAN}</p>
        </td></tr>
      </table>

      <p style="margin:0 0 32px;color:#6B7B8C;font-size:15px;text-align:center;">${t.closing}</p>

      <!-- CTA -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td align="center">
          <a href="https://ireneymarco2026.com" style="display:inline-block;background-color:#8B7355;color:#FFFFFF;text-decoration:none;padding:14px 40px;border-radius:8px;font-size:15px;letter-spacing:1px;">
            ${t.backToWeb}
          </a>
        </td></tr>
      </table>
    </td></tr>

    <!-- Footer -->
    <tr><td style="padding:32px 40px;text-align:center;border-top:1px solid #E8E2D8;">
      <p style="margin:0;color:#B8A07A;font-size:13px;font-style:italic;">${t.footer}</p>
    </td></tr>
  `);
}

function buildDeclineEmailHtml(guest: GuestData): string {
  const t = getDeclineTranslations(guest.language);

  return emailShell(guest.language, `
    <!-- Header -->
    <tr><td style="background:linear-gradient(135deg,#B8A07A,#C4B59A);padding:48px 40px;text-align:center;">
      <h1 style="margin:0;color:#FFFFFF;font-size:28px;font-weight:400;letter-spacing:1px;line-height:1.4;">
        ${t.title}
      </h1>
    </td></tr>

    <!-- Body -->
    <tr><td style="padding:40px;">
      <p style="margin:0 0 20px;color:#2C3E50;font-size:18px;">${t.greeting(guest.first_name)}</p>
      <p style="margin:0 0 20px;color:#6B7B8C;font-size:15px;line-height:1.8;">${t.body}</p>
      <p style="margin:0 0 32px;color:#6B7B8C;font-size:15px;line-height:1.8;">${t.body2}</p>

      <p style="margin:0 0 8px;color:#2C3E50;font-size:15px;font-style:italic;">${t.closing}</p>

      <!-- CTA -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
        <tr><td align="center">
          <a href="https://ireneymarco2026.com" style="display:inline-block;background-color:#B8A07A;color:#FFFFFF;text-decoration:none;padding:14px 40px;border-radius:8px;font-size:15px;letter-spacing:1px;">
            ${t.backToWeb}
          </a>
        </td></tr>
      </table>
    </td></tr>

    <!-- Footer -->
    <tr><td style="padding:32px 40px;text-align:center;border-top:1px solid #E8E2D8;">
      <p style="margin:0;color:#B8A07A;font-size:13px;font-style:italic;">${t.footer}</p>
    </td></tr>
  `);
}

function summaryRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 0;border-bottom:1px solid #E8E2D8;font-weight:bold;">${label}</td>
    <td style="padding:8px 0;border-bottom:1px solid #E8E2D8;text-align:right;">${value}</td>
  </tr>`;
}

function emailShell(lang: string, content: string): string {
  return `<!DOCTYPE html>
<html lang="${lang}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#F8F5F0;font-family:Georgia,'Playfair Display','Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8F5F0;">
    <tr><td align="center" style="padding:40px 20px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
        ${content}
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
    console.log("Payload received:", JSON.stringify(payload));

    const guest: GuestData = payload.record || payload;

    if (!guest.email || !guest.first_name) {
      throw new Error("Missing required guest data (email, first_name)");
    }

    // Normalize language to es/it only (default to es)
    const lang = guest.language === "it" ? "it" : "es";
    guest.language = lang;

    // Robust check: handle both boolean and string values
    const attending = guest.rsvp_status === true || guest.rsvp_status === "true";
    console.log("rsvp_status raw:", guest.rsvp_status, "type:", typeof guest.rsvp_status, "attending:", attending);

    const subject = attending
      ? getAttendingTranslations(lang).subject
      : getDeclineTranslations(lang).subject;
    const html = attending
      ? buildAttendingEmailHtml(guest)
      : buildDeclineEmailHtml(guest);

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
