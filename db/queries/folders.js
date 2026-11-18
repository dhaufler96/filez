import db from "#db/client";

export async function createFolder(name) {
  const { rows } = await db.query(
    "INSERT INTO folders (name) VALUES ($1) RETURNING *",
    [name],
  );
  return rows[0];
}

export async function getFolders() {
  const { rows } = await db.query("SELECT * FROM folders");
  return rows;
}

export async function getFolder(id) {
  const sql = `
    SELECT folders.*,
      COALESCE(
        json_agg(files.* ORDER BY files.id) FILTER (WHERE files.id IS NOT NULL),
        '[]'::json
      ) AS files
    FROM folders
    LEFT JOIN files ON files.folder_id = folders.id
    WHERE folders.id = $1
    GROUP BY folders.id
  `;
  const { rows } = await db.query(sql, [id]);
  return rows[0];
}
