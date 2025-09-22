// controllers/agentController.js - Business logic ที่แยกจาก routes
const { Agent, agents } = require('../models/Agent');
const { AGENT_STATUS, VALID_STATUS_TRANSITIONS, API_MESSAGES } = require('../utils/constants');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const agentController = {
  // ✅ ให้ code สำเร็จเป็นตัวอย่าง
  // GET /api/agents/:id
  getAgentById: (req, res) => {
    try {
      const { id } = req.params;
      const agent = agents.get(id);

      if (!agent) {
        return sendError(res, API_MESSAGES.AGENT_NOT_FOUND, 404);
      }

      console.log(`📋 Retrieved agent: ${agent.agentCode}`);
      return sendSuccess(res, 'Agent retrieved successfully', agent.toJSON());
    } catch (error) {
      console.error('Error in getAgentById:', error);
      return sendError(res, API_MESSAGES.INTERNAL_ERROR, 500);
    }
  },

  // 🔄 TODO #1: นักศึกษาทำเอง (10 นาที)
  // GET /api/agents
  // Solution hints:
getAllAgents: (req, res) => {
  try {
    const { status, department } = req.query;
    let agentList = Array.from(agents.values());

    // Filter by status
    if (status) {
      agentList = agentList.filter(agent => agent.status === status);
    }
    
    // Filter by department  
    if (department) {
      agentList = agentList.filter(agent => agent.department === department);
    }

    console.log(`📋 Retrieved ${agentList.length} agents`);
    return sendSuccess(res, 'Agents retrieved successfully', 
      agentList.map(agent => agent.toJSON())
    );
  } catch (error) {
    console.error('Error in getAllAgents:', error);
    return sendError(res, API_MESSAGES.INTERNAL_ERROR, 500);
  }
},
      // Hint: sendSuccess(res, message, data)

  // 🔄 TODO #2: นักศึกษาทำเอง (15 นาที)  
  // POST /api/agents
  createAgent: (req, res) => {
    try {
      const agentData = req.body;

      // TODO: ตรวจสอบว่า agentCode ซ้ำไหม
      const isDuplicate = Array
        .from(agents.values())
        .find(agent => agent.agentCode === agentData.agentCode);

      if (isDuplicate) {
        return sendError(res, `Agent code already exists: ${agentData.agentCode}`, 409);
      }

      // TODO: สร้าง Agent ใหม่
      const newAgent = new Agent(agentData);
      
      // TODO: เก็บลง Map
      agents.set(newAgent.id, newAgent);
      console.log(`➕ Created new agent: ${newAgent.agentCode}`);
      
      // TODO: ส่ง response พร้อม status 201
      return sendSuccess(res, 'Agent created successfully', newAgent.toJSON(), 201);
    } catch (error) {
      console.error('Error in createAgent:', error);
      return sendError(res, API_MESSAGES.INTERNAL_ERROR, 500);
    }
  },

  // PUT /api/agents/:id
  updateAgent: (req, res) => {
    try {
      const { id } = req.params;
      const agent = agents.get(id);

      if (!agent) {
        return sendError(res, API_MESSAGES.AGENT_NOT_FOUND, 404);
      }

      const { name, email, department, skills } = req.body;
      
      // Update allowed fields
      if (name) agent.name = name;
      if (email) agent.email = email;
      if (department) agent.department = department;
      if (skills) agent.skills = skills;
      
      agent.updatedAt = new Date();
      
      console.log(`✏️ Updated agent: ${agent.agentCode}`);
      return sendSuccess(res, API_MESSAGES.AGENT_UPDATED, agent.toJSON());
    } catch (error) {
      console.error('Error in updateAgent:', error);
      return sendError(res, API_MESSAGES.INTERNAL_ERROR, 500);
    }
  },

  // 🔄 TODO #3: นักศึกษาทำเอง (15 นาที - ยากสุด)
  // PATCH /api/agents/:id/status  
  updateAgentStatus: (req, res) => {
    try {
      const { id } = req.params;
      const { status, reason } = req.body;

      // TODO: หา agent จาก id
      const agent = agents.get(id);
      if (!agent) {
        return sendError(res, API_MESSAGES.AGENT_NOT_FOUND, 404);
      }
      // TODO: ตรวจสอบว่า agent มีอยู่ไหม
      // TODO: validate status ด้วย AGENT_STATUS
      const validStatuses = Object.values(AGENT_STATUS);
      if (!validationStatuses.includes(status)) {
        return sendError(res, `Invalid status: ${status}`, 400);
      }
    
      // TODO: ตรวจสอบ valid transition ด้วย VALID_STATUS_TRANSITIONS
      const current = agent.status;
      const allowed = VALID_STATUS_TRANSITIONS[current] || [];
      if (!allowed.includes(status)) {
        return sendError(res, `Invalid status transition from ${current} to ${status}`, 400);
      }
      // TODO: เรียก agent.updateStatus(status, reason)
      agent.updateAgentStatus(status, reason);
      
      // TODO: ส่ง response กลับ
    return sendError(res, 'Status updated successfully', agent.toJSON());  
    } catch (error) {
      console.error('Error in updateAgentStatus:', error);
      return sendError(res, API_MESSAGES.INTERNAL_ERROR, 500);
    }
  },

  // ✅ ให้ code สำเร็จ
  // DELETE /api/agents/:id
  deleteAgent: (req, res) => {
    try {
      const { id } = req.params;
      const agent = agents.get(id);

      if (!agent) {
        return sendError(res, API_MESSAGES.AGENT_NOT_FOUND, 404);
      }

      agents.delete(id);
      
      console.log(`🗑️ Deleted agent: ${agent.agentCode} - ${agent.name}`);
      return sendSuccess(res, API_MESSAGES.AGENT_DELETED);
    } catch (error) {
      console.error('Error in deleteAgent:', error);
      return sendError(res, API_MESSAGES.INTERNAL_ERROR, 500);
    }
  },

  // ✅ ให้ code สำเร็จ - Dashboard API
  // GET /api/agents/status/summary
  getStatusSummary: (req, res) => {
    try {
      const agentList = Array.from(agents.values());
      const totalAgents = agentList.length;
      
      const statusCounts = {};
      Object.values(AGENT_STATUS).forEach(status => {
        statusCounts[status] = agentList.filter(agent => agent.status === status).length;
      });

      const statusPercentages = {};
      Object.entries(statusCounts).forEach(([status, count]) => {
        statusPercentages[status] = totalAgents > 0 ? Math.round((count / totalAgents) * 100) : 0;
      });

      const summary = {
        totalAgents,
        statusCounts,
        statusPercentages,
        lastUpdated: new Date().toISOString()
      };

      return sendSuccess(res, 'Status summary retrieved successfully', summary);
    } catch (error) {
      console.error('Error in getStatusSummary:', error);
      return sendError(res, API_MESSAGES.INTERNAL_ERROR, 500);
    }
  }
};

module.exports = agentController;