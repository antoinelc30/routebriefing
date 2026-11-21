exports.handler = async (event) => {
  const { type, ids, bbox } = event.queryStringParameters || {};

  let targetUrl = "";
  if (type === "station" && ids) {
    targetUrl = `https://aviationweather.gov/api/data/stationinfo?ids=${encodeURIComponent(ids)}&format=json`;
  } else if (type === "metar") {
    const query = ids ? `ids=${encodeURIComponent(ids)}` : `bbox=${encodeURIComponent(bbox || "")}`;
    targetUrl = `https://aviationweather.gov/api/data/metar?${query}&format=json`;
  } else if (type === "taf") {
    const query = ids ? `ids=${encodeURIComponent(ids)}` : `bbox=${encodeURIComponent(bbox || "")}`;
    targetUrl = `https://aviationweather.gov/api/data/taf?${query}&format=json`;
  } else {
    return { statusCode: 400, body: JSON.stringify({ error: "Paramètres invalides" }) };
  }

  try {
    const response = await fetch(targetUrl, {
      headers: { "User-Agent": "RouteBriefing-Netlify/1.0" }
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `Erreur AviationWeather: ${response.status}` })
      };
    }

    const text = await response.text();
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: text || "[]"
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};