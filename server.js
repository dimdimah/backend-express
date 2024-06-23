const express = require("express");
const supabase = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();
app.use(express.json());
const PORT = 3221;

const SUPABASE_URL = process.env.SUPABASE_BASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const db = supabase.createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

app.get("/", async (request, response) => {
  const getData = await db.from("blog").select();
  response.json({ getData });
});

app.post("/", async (request, response) => {
  const { title, description } = request.body;
  const createPost = await db.from("blog").insert({ title, description });
  console.log("🚀 success creating-post", title, description);

  response.json({ createPost });
});

app.get("/api/hari", async (request, response) => {
    const getData = await db.from("hari").select();
    response.json({getData});
  }
);

app.get('/api/hari/:id', async (request, response) => {
  try {
    const detailHari = await fetchDetailHari(request.params.id);
    response.json(detailHari);
  } catch (error) {
    handleError(error, response);
  }
});

async function fetchDetailHari(id) {
  const tables = ['hari', 'asisten', 'kuliah', 'piket'];
  const results = await Promise.all(tables.map(table => fetchData(table, id)));
  
  return tables.reduce((acc, table, index) => {
    acc[table] = results[index];
    return acc;
  }, {});
}

async function fetchData(table, id) {
  const { data, error } = await db
    .from(table)
    .select('*')
    .eq(table === 'hari' ? 'id' : 'id_hari', id);
  
  if (error) throw error;
  return table === 'hari' ? data[0] : data;
}

function handleError(error, res) {
  console.error('Error:', error);
  res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data' });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;