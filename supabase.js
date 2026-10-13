
// VoiceStar — Supabase connection

export const SUPABASE_URL =
  "https://kdpqbdytfvnbtiwnaafo.supabase.co";

// Replace this value with your Supabase anon/public key.
export const SUPABASE_ANON_KEY =
  "PASTE_YOUR_SUPABASE_ANON_KEY_HERE";

export async function supabaseRequest(
  table,
  {
    method = "GET",
    body,
    query = "",
    headers = {},
  } = {}
) {
  if (
    !SUPABASE_ANON_KEY ||
    SUPABASE_ANON_KEY === "PASTE_YOUR_SUPABASE_ANON_KEY_HERE"
  ) {
    throw new Error(
      "Add your Supabase anon/public key in supabase.js."
    );
  }

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}${query ? `?${query}` : ""}`,
    {
      method,
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        ...(body !== undefined
          ? { Prefer: "return=representation" }
          : {}),
        ...headers,
      },
      ...(body !== undefined
        ? { body: JSON.stringify(body) }
        : {}),
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Supabase error ${response.status}: ${responseText}`
    );
  }

  if (!responseText) {
    return null;
  }

  return JSON.parse(responseText);
}
