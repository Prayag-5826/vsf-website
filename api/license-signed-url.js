import { createClient } from "@supabase/supabase-js";

const ALLOWED = new Set([
  "psara-license.pdf",
  "gst-certificate.pdf",
  "epf-registration.pdf",
  "esic-registration.pdf",
  "shop-establishment-license.pdf",
  "labour-welfare-license.pdf",
  "udyam-certificate.pdf"
]);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { doc, mode } = req.body || {};
    const file = String(doc || "").trim();

    if (!ALLOWED.has(file)) return res.status(400).json({ error: "Invalid document" });

    // short expiry: preview 2 min, download 2 min
    const expiresIn = 120;

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase.storage
      .from("licenses")
      .createSignedUrl(file, expiresIn);

    if (error || !data?.signedUrl) {
      return res.status(500).json({ error: "Failed to create signed URL" });
    }

    // Return signed URL (works for preview + download)
    return res.status(200).json({ url: data.signedUrl, doc: file, mode: mode || "preview" });
  } catch (e) {
    return res.status(500).json({ error: "Server error" });
  }
}
