const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001; // Changed to 3001 to avoid conflict with React

// Database connection configuration
const pool = new Pool({
  user: process.env.DB_USER || 'gevorg',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'setup',
  password: process.env.DB_PASSWORD || 'gevorg',
  port: process.env.DB_PORT || 5432,
});

// Middleware setup
app.use(cors({
    origin: 'http://localhost:3002', // Your React app's URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
app.use(express.json({ limit: '50mb' }));
// app.use(express.static(path.join(__dirname, '../build'))); // Serve React build files

// API error handler
const handleApiError = (res, error, operation) => {
  console.error(`Error during ${operation}:`, error);
  res.status(500).json({ 
    error: 'Server error',
    message: `Failed to ${operation}. Please try again.` 
  });
};

/**
 * Helper functions for React Admin compatibility
 */
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
  
  // Handle filtering
  if (req.query.filter) {
    try {
      const filters = JSON.parse(req.query.filter);
      Object.entries(filters).forEach(([field, value]) => {
        if (field === 'id' && value) {
          // Special case for ID filtering (might be array)
          if (Array.isArray(value)) {
            conditions.push(`id IN (${value.map(_ => `$${paramIndex++}`).join(',')})`);
            params.push(...value);
          } else {
            conditions.push(`id = $${paramIndex++}`);
            params.push(value);
          }
        } else if (field.endsWith('_gte')) {
          // Greater than or equal filter
          const realField = field.replace('_gte', '');
          conditions.push(`${realField} >= $${paramIndex++}`);
          params.push(value);
        } else if (field.endsWith('_lte')) {
          // Less than or equal filter
          const realField = field.replace('_lte', '');
          conditions.push(`${realField} <= $${paramIndex++}`);
          params.push(value);
        } else if (typeof value === 'string') {
          // Case-insensitive text search
          conditions.push(`${field} ILIKE $${paramIndex++}`);
          params.push(`%${value}%`);
        } else {
          // Exact match
          conditions.push(`${field} = $${paramIndex++}`);
          params.push(value);
        }
      });
    } catch (error) {
      console.error('Error parsing filter:', error);
    }
  }
  
  // Add WHERE clause if needed
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  
  // Handle sorting
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

/**
 * API Routes
 */

// Get all projects with pagination, sorting, and filtering
app.get('/projects', async (req, res) => {
  try {
    const { query, params } = buildQueryFromParams(req);
    
    // Get total count for pagination
    const countResult = await pool.query('SELECT COUNT(*) FROM projects');
    const count = parseInt(countResult.rows[0].count);
    
    // Execute the query
    const result = await pool.query(query, params);
    
    // Add React Admin headers
    addReactAdminHeaders(res, count);
    
    res.json(result.rows);
  } catch (error) {
    handleApiError(res, error, 'fetch projects');
  }
});

// Get a specific project
app.get('/projects/:id', async (req, res) => {
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

// Create new project
app.post('/projects', async (req, res) => {
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

// Update project with dynamic field checking
app.put('/projects/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // First check if the project exists
    const projectCheck = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
    if (projectCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Get existing columns from the projects table
    const columnCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'projects'
    `);
    
    const existingColumns = columnCheck.rows.map(row => row.column_name);
    console.log('Available columns for update:', existingColumns);
    
    // Filter the updateData to only include fields that exist in the database
    const updateData = {};
    Object.entries(req.body).forEach(([key, value]) => {
      if (existingColumns.includes(key)) {
        // Special handling for estimate_json to ensure proper JSON format
        if (key === 'estimate_json' && typeof value !== 'string') {
          updateData[key] = JSON.stringify(value);
        } else {
          updateData[key] = value;
        }
      } else {
        console.warn(`Skipping non-existent column in update request: ${key}`);
      }
    });
    
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    // Build dynamic query
    const updateFields = [];
    const values = [];
    let paramIndex = 1;
    
    Object.entries(updateData).forEach(([key, value]) => {
      updateFields.push(`${key} = $${paramIndex++}`);
      values.push(value);
    });
    
    // Add id to values array
    values.push(id);
    
    const query = `
      UPDATE projects
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    
    console.log('Update query:', query);
    
    const result = await pool.query(query, values);
    console.log('Update successful for project ID:', id);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Detailed error during update project:', error);
    handleApiError(res, error, 'update project');
  }
});

// Delete project
app.delete('/projects/:id', async (req, res) => {
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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Database schema validation endpoint (for diagnostics)
app.get('/schema', async (req, res) => {
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

// Catch-all route for React app
// app.get('*', (req, res) => {
// res.sendFile(path.join(__dirname, '../build', 'index.html'));
// });

// Server startup
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`API documentation available at http://localhost:${port}/schema`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // In production, you might want to restart the server here
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});