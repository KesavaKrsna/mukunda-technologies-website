const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map();
const EMAIL = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const PHONE = /^[0-9+().\-\s]{7,30}$/;

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function htmlPage(status, title, body) {
  const page = `<!doctype html>
<html lang="en-ZA">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title} | Mukunda Technologies</title>
<link rel="stylesheet" href="/styles.css" />
</head>
<body class="section-dark">
<main class="section">
  <div class="container contact-card">
    <h1>${title}</h1>
    ${body}
    <p class="contact-actions"><a class="button button-primary" href="/contact">Back to contact</a></p>
  </div>
</main>
</body>
</html>`;
  return new Response(page, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function clientIp(request) {
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  const forwarded = request.headers.get("x-forwarded-for") || "";
  const parts = forwarded.split(",").map((part) => part.trim()).filter(Boolean);
  return parts[parts.length - 1] || "unknown";
}

function limited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      const kept = times.filter((time) => now - time < WINDOW_MS);
      if (kept.length) hits.set(key, kept);
      else hits.delete(key);
    }
  }
  return false;
}

function text(value, max, keepBreaks) {
  if (typeof value !== "string") return "";
  const pattern = keepBreaks ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g;
  return value.replace(pattern, "").trim().slice(0, max);
}

function sameOrigin(request) {
  const site = request.headers.get("sec-fetch-site");
  if (site && site !== "same-origin" && site !== "none") return false;
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

async function readFields(request) {
  const type = request.headers.get("content-type") || "";
  if (type.includes("application/json")) {
    const data = await request.json();
    if (!data || typeof data !== "object" || Array.isArray(data)) return null;
    return data;
  }
  if (type.includes("application/x-www-form-urlencoded") || type.includes("multipart/form-data")) {
    const form = await request.formData();
    return Object.fromEntries(form.entries());
  }
  return null;
}

function wantsHtml(request) {
  const type = request.headers.get("content-type") || "";
  return !type.includes("application/json");
}

function fail(request, status, error, title, message) {
  if (wantsHtml(request)) {
    const mailto = `<p><a href="mailto:info@mukundatech.co.za?subject=Enquiry%20from%20mukundatech.co.za">Email info@mukundatech.co.za</a></p>`;
    return htmlPage(status, title, `<p class="hero-lede">${message}</p>${mailto}`);
  }
  return json(status, { ok: false, error });
}

export async function POST(request) {
  if (!sameOrigin(request)) return fail(request, 403, "origin", "Could not send", "That request did not come from this site.");

  const ip = clientIp(request);

  let fields;
  try {
    fields = await readFields(request);
  } catch {
    return fail(request, 400, "fields", "Could not send", "The message could not be read.");
  }
  if (!fields) return fail(request, 415, "fields", "Could not send", "The message could not be read.");

  if (text(fields.company_website, 200)) {
    if (limited(ip)) {
      console.error("contact rate limited");
      return fail(request, 429, "rate", "Please wait", "Too many messages from this network. Please wait a little while.");
    }
    return json(200, { ok: true });
  }

  const name = text(fields.name, 100);
  const email = text(fields.email, 254);
  const phone = text(fields.phone, 30);
  const message = text(fields.message, 5000, true);

  if (!name || !EMAIL.test(email) || email.length > 254 || (phone && !PHONE.test(phone)) || !message) {
    return fail(request, 400, "fields", "Check the form", "Name, a valid email and a message are required.");
  }

  const key = process.env.RESEND_API_KEY_MUKUNDA;
  if (!key) {
    console.error("RESEND_API_KEY_MUKUNDA is not set");
    return fail(request, 503, "send", "Could not send", "The message could not be sent just now.");
  }

  if (limited(ip)) {
    console.error("contact rate limited");
    return fail(request, 429, "rate", "Please wait", "Too many messages from this network. Please wait a little while.");
  }

  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "Not given"}`,
    "",
    message,
  ];

  let sent;
  try {
    sent = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Mukunda Technologies <info@mukundatech.co.za>",
        to: ["info@mukundatech.co.za"],
        reply_to: email,
        subject: "Enquiry from mukundatech.co.za",
        text: lines.join("\n"),
      }),
    });
  } catch (error) {
    console.error("contact send failed", error instanceof Error ? error.message : "network");
    return fail(request, 502, "send", "Could not send", "The message could not be sent just now.");
  }

  if (!sent.ok) {
    console.error("contact send failed", sent.status);
    return fail(request, 502, "send", "Could not send", "The message could not be sent just now.");
  }

  if (wantsHtml(request)) {
    return htmlPage(200, "Message sent", "<p class=\"hero-lede\">We’ll reply to the email you gave us.</p>");
  }
  return json(200, { ok: true });
}
