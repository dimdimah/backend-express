const express = require("express");
const db = require("../services/supabase");
const handleError = require("../utils/errorHandler");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { data: hariData, error: hariError } = await db.from("hari").select();
    if (hariError) throw hariError;

    const countsPromises = hariData.map(async (hari) => {
      const asistenCount = await getCount("asisten", hari.id);
      const kuliahCount = await getCount("kuliah", hari.id);
      const piketCount = await getCount("piket", hari.id);
      return {
        ...hari,
        asisten_count: asistenCount,
        kuliah_count: kuliahCount,
        piket_count: piketCount,
      };
    });

    const hariWithCounts = await Promise.all(countsPromises);
    res
      .status(200)
      .json({ status: 200, message: "Success", data: hariWithCounts });
  } catch (error) {
    handleError(error, res);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const detailHari = await fetchDetailHari(req.params.id);
    if (!detailHari.hari) {
      return res.status(404).json({ status: 404, message: "data not found" });
    }
    res.status(200).json({ status: 200, message: "Success", data: detailHari });
  } catch (error) {
    handleError(error, res);
  }
});

async function fetchDetailHari(id) {
  const tables = ["hari", "asisten", "kuliah", "piket"];
  const results = await Promise.all(
    tables.map((table) => fetchData(table, id))
  );

  const dataCounts = results.reduce((acc, result, index) => {
    acc[tables[index] + "_count"] = Array.isArray(result) ? result.length : 1;
    return acc;
  }, {});

  const detailHari = tables.reduce((acc, table, index) => {
    acc[table] = results[index];
    return acc;
  }, {});

  return { ...detailHari, ...dataCounts };
}

async function fetchData(table, id) {
  const { data, error } = await db
    .from(table)
    .select("*")
    .eq(table === "hari" ? "id" : "id_hari", id);

  if (error) throw error;
  return table === "hari" ? data[0] : data;
}

async function getCount(table, id_hari) {
  const { count, error } = await db
    .from(table)
    .select("*", { count: "exact" })
    .eq("id_hari", id_hari);

  if (error) throw error;
  return count;
}

module.exports = router;
