const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// Database connection configuration
const pool = new Pool({
  user: process.env.DB_USER || 'gevorg',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'setup',
  password: process.env.DB_PASSWORD || '67271991',
  port: process.env.DB_PORT || 5432,
});

// Middleware setup
app.use(cors({
  origin: '*',  // Allow requests from any origin (during troubleshooting)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));

// API error handler
const handleApiError = (res, error, operation) => {
  console.error(`Error during ${operation}:`, error);
  res.status(500).json({ 
    error: 'Server error',
    message: `Failed to ${operation}. Please try again.` 
  });
};

// Add headers for React Admin
const addReactAdminHeaders = (res, count) => {
  if (count !== undefined) {
    res.set('Access-Control-Expose-Headers', 'Content-Range');
    res.set('Content-Range', `projects 0-${count - 1}/${count}`);
  }
};

// Handle sorting and filtering
const buildQueryFromParams = (req) => {
  let query = 'SELECT * FROM projects';
  let conditions = [];
  let params = [];
  let paramIndex = 1;

  if (req.query.filter) {
    try {
      const filters = JSON.parse(req.query.filter);
      Object.entries(filters).forEach(([field, value]) => {
        if (field === 'id' && value) {
          if (Array.isArray(value)) {
            conditions.push(`id IN (${value.map(_ => `$${paramIndex++}`).join(',')})`);
            params.push(...value);
          } else {
            conditions.push(`id = $${paramIndex++}`);
            params.push(value);
          }
        } else if (field.endsWith('_gte')) {
          const realField = field.replace('_gte', '');
          conditions.push(`${realField} >= $${paramIndex++}`);
          params.push(value);
        } else if (field.endsWith('_lte')) {
          const realField = field.replace('_lte', '');
          conditions.push(`${realField} <= $${paramIndex++}`);
          params.push(value);
        } else if (typeof value === 'string') {
          conditions.push(`${field} ILIKE $${paramIndex++}`);
          params.push(`%${value}%`);
        } else {
          conditions.push(`${field} = $${paramIndex++}`);
          params.push(value);
        }
      });
    } catch (error) {
      console.error('Error parsing filter:', error);
    }
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  if (req.query.sort) {
    try {
      const [field, order] = JSON.parse(req.query.sort);
      query += ` ORDER BY ${field} ${order === 'DESC' ? 'DESC' : 'ASC'}`;
    } catch (error) {
      console.error('Error parsing sort:', error);
      query += ' ORDER BY creation_date DESC';
    }
  } else {
    query += ' ORDER BY creation_date DESC';
  }

  return { query, params };
};

// API Routes ( prefixed with /api/ to match Nginx )
app.get('/api/projects', async (req, res) => {
  try {
    const { query, params } = buildQueryFromParams(req);
    const countResult = await pool.query('SELECT COUNT(*) FROM projects');
    const count = parseInt(countResult.rows[0].count);
    const result = await pool.query(query, params);
    addReactAdminHeaders(res, count);
    res.json(result.rows);
  } catch (error) {
    handleApiError(res, error, 'fetch projects');
  }
});

app.get('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    handleApiError(res, error, 'fetch project');
  }
});

app.post('/api/projects', async (req, res) => {
  const { project_name, client_name, producer, status = 'New' } = req.body;
  if (!project_name || !client_name || !producer) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO projects (project_name, client_name, producer, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [project_name, client_name, producer, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    handleApiError(res, error, 'create project');
  }
});

app.put('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const projectCheck = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
    if (projectCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const columnCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'projects'
    `);
    const existingColumns = columnCheck.rows.map(row => row.column_name);
    console.log('Available columns for update:', existingColumns);

    const updateData = {};
    Object.entries(req.body).forEach(([key, value]) => {
      if (existingColumns.includes(key)) {
        if (key === 'estimate_json' && typeof value !== 'string') {
          updateData[key] = JSON.stringify(value);
        } else {
          updateData[key] = value;
        }
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const updateFields = [];
    const values = [];
    let paramIndex = 1;
    Object.entries(updateData).forEach(([key, value]) => {
      updateFields.push(`${key} = $${paramIndex++}`);
      values.push(value);
    });
    values.push(id);

    const query = `
      UPDATE projects
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    handleApiError(res, error, 'update project');
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const checkResult = await pool.query('SELECT id FROM projects WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    await pool.query('DELETE FROM projects WHERE id = $1', [id]);
    res.json({ message: 'Project deleted successfully', id });
  } catch (error) {
    handleApiError(res, error, 'delete project');
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/api/schema', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'projects'
      ORDER BY ordinal_position
    `);
    res.json(result.rows);
  } catch (error) {
    handleApiError(res, error, 'fetch schema');
  }
});

// Server startup
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`API documentation available at http://localhost:${port}/api/schema`);
});

// Error handlers
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});