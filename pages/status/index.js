import useSWR from "swr";

export default function StatusPage() {
  return (
    <div>
      <h1>Status</h1>
      <UpdateAt />
      <Database />
    </div>
  );
}

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

function HookUseSWR() {
  const { data, error, isLoading } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  return { data, error, isLoading };
}

function UpdateAt() {
  const { data, error, isLoading } = HookUseSWR();

  let updatedAt = "loading...";

  if (!isLoading && data && !error) {
    updatedAt = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return (
    <>
      <p>Última atualização: {updatedAt}</p>
    </>
  );
}

function Database() {
  const { data, error, isLoading } = HookUseSWR();

  let databaseVersion = "loading...";
  let databaseMaxConnections = "loading...";
  let databaseOpenedConnections = "loading...";

  if (!isLoading && data && !error) {
    databaseVersion = data.dependencies.database.version;
    databaseMaxConnections = data.dependencies.database.max_connections;
    databaseOpenedConnections = data.dependencies.database.opened_connections;
  }

  return (
    <>
      <h2>Database</h2>
      <p>Versão: {databaseVersion}</p>
      <p>Conexões máximas: {databaseMaxConnections}</p>
      <p>Conexões abertas: {databaseOpenedConnections}</p>
    </>
  );
}
