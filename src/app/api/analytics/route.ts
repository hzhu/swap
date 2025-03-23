import { NextRequest, NextResponse } from "next/server";

const AMPLITUDE_URL = "https://api2.amplitude.com/2/httpapi";

export async function POST(request: NextRequest) {
  const body = await request.json();

  console.log(body);

  const response = await fetch(AMPLITUDE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (response.ok) {
    console.log("---SUCCESS---");
    console.log("Amplitude response:", data);
    console.log("-------------");

    return NextResponse.json(data);
  } else {
    console.error("---ERROR---");
    console.error("Amplitude response:", data);
    console.error("-------------");

    return NextResponse.json(data, {
      status: response.status,
      statusText: response.statusText,
    });
  }
}
