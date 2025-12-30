export const apiFetch = async <T>(endpoint: string): Promise<T> => {
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(
      `API request '${endpoint}' failed with status ${response.status}`,
    );
  }
  const json = await response.json();
  return json.data as T;
};
