import express from 'express';
import pool from '../db.js';
import { protect, adminCheck } from '../middleware/authMiddleware.js';

const router = express.Router();

const generateComplaintId = () => 'COMP-' + Math.floor(10000 + Math.random() * 90000);

router.post('/', protect, async (req, res) => {
    try {
        const { title, description } = req.body;
        const complaint_id = generateComplaintId();
        
        const newComplaint = await pool.query(
            "INSERT INTO complaints (complaint_id, student_id, title, description) VALUES ($1, $2, $3, $4) RETURNING *",
            [complaint_id, req.user.id, title, description]
        );
        res.status(201).json(newComplaint.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/my', protect, async (req, res) => {
    try {
        const complaints = await pool.query("SELECT * FROM complaints WHERE student_id = $1 ORDER BY created_at DESC", [req.user.id]);
        res.json(complaints.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', protect, adminCheck, async (req, res) => {
    try {
        const complaints = await pool.query(`
            SELECT c.*, u.name as student_name, u.email as student_email 
            FROM complaints c JOIN users u ON c.student_id = u.id ORDER BY c.created_at DESC
        `);
        res.json(complaints.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id/status', protect, adminCheck, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updated = await pool.query("UPDATE complaints SET status = $1 WHERE id = $2 RETURNING *", [status, id]);
        if (updated.rows.length === 0) return res.status(404).json({ error: "Complaint not found" });
        res.json(updated.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/track/:complaint_id', protect, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM complaints WHERE complaint_id = $1", [req.params.complaint_id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Complaint not found" });
        
        if (req.user.role !== 'admin' && result.rows[0].student_id !== req.user.id) {
            return res.status(403).json({ error: "Not authorized" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
