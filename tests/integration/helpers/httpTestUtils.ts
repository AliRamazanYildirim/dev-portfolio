export function createJsonRequest(
  url: string,
  method: string,
  body: unknown,
): Request {
  return new Request(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export async function parseJsonResponse<T>(response: Response): Promise<T> {
  const payload = await response.json();
  return payload as T;
}
