/**
 * BudgetTrackingController.js
 * Complete CRUD operations and UI interactions for Caloocan City Budget Tracker
 * 
 * CRUD Functions:
 * - CREATE: addProject() - Add new budget project
 * - READ: loadProjects(), showProjects() - Display and filter projects  
 * - UPDATE: editProject() - Modify existing project
 * - DELETE: deleteProject() - Remove project with confirmation
 * 
 * Data Persistence: Uses localStorage for data persistence across sessions
 * UI Interactions: Modal handling, form validation, dynamic updates
 */

// ===== DATA MANAGEMENT =====

// Default project data - loaded if no localStorage data exists
const defaultProjects = [
    {
        id: 1,
        name: "EDSA Kalookan Flyover Repair",
        dept: "Roads",
        manager: "Engineer Bautista",
        budget: 8500000,
        status: "Ongoing",
        deadline: "2025-12-15",
        progress: 35
    },
    {
        id: 2,
        name: "Bagong Barrio Elementary School",
        dept: "Schools",
        manager: "Dr. Maria Gonzales",
        budget: 12000000,
        status: "Pending",
        deadline: "2026-03-20",
        progress: 15
    },
    {
        id: 3,
        name: "Caloocan City Medical Center Expansion",
        dept: "Hospital",
        manager: "Dr. Roberto Villanueva",
        budget: 25000000,
        status: "Ongoing",
        deadline: "2025-11-30",
        progress: 60
    },
    {
        id: 4,
        name: "La Loma Cemetery Improvement",
        dept: "Parks",
        manager: "Ms. Carmen dela Rosa",
        budget: 3500000,
        status: "Done",
        deadline: "2025-04-15",
        progress: 100
    },
    {
        id: 5,
        name: "Grace Park Drainage System",
        dept: "Water",
        manager: "Engineer Jose Santos",
        budget: 15000000,
        status: "Ongoing",
        deadline: "2025-10-31",
        progress: 45
    },
    {
        id: 6,
        name: "Camarin Sports Complex",
        dept: "Parks",
        manager: "Coach Miguel Torres",
        budget: 6800000,
        status: "Pending",
        deadline: "2025-09-10",
        progress: 8
    },
    {
        id: 7,
        name: "Monumento High School ICT Lab",
        dept: "Schools",
        manager: "Principal Anna Lim",
        budget: 2200000,
        status: "Done",
        deadline: "2025-05-20",
        progress: 100
    },
    {
        id: 8,
        name: "C-4 Road Widening Project",
        dept: "Roads",
        manager: "Engineer Carlos Ramos",
        budget: 18500000,
        status: "Ongoing",
        deadline: "2026-01-15",
        progress: 25
    },
    {
        id: 9,
        name: "Tala Market Modernization",
        dept: "Public Works",
        manager: "Architect Lisa Cruz",
        budget: 9200000,
        status: "Pending",
        deadline: "2025-08-30",
        progress: 12
    },
    {
        id: 10,
        name: "Bagumbayan Water Treatment Plant",
        dept: "Water",
        manager: "Engineer Pedro Mercado",
        budget: 22000000,
        status: "Ongoing",
        deadline: "2026-02-28",
        progress: 40
    }
];

// Global variables
let allProjects = [];
let filteredProjects = [];
let editingProjectId = null;
let nextProjectId = 11;

// ===== CRUD OPERATIONS =====

/**
 * CREATE: Add new project to the system
 * Validates form data and adds to localStorage
 */
function addProject(projectData) {
    try {
        const newProject = {
            id: nextProjectId++,
            name: projectData.name.trim(),
            dept: projectData.dept,
            manager: projectData.manager.trim(),
            budget: parseInt(projectData.budget),
            status: projectData.status,
            deadline: projectData.deadline,
            progress: parseInt(projectData.progress)
        };
        
        // Validate required fields
        if (!newProject.name || !newProject.dept || !newProject.manager || 
            !newProject.budget || !newProject.status || !newProject.deadline) {
            throw new Error('All fields are required');
        }
        
        if (newProject.budget <= 0) {
            throw new Error('Budget must be greater than 0');
        }
        
        if (newProject.progress < 0 || newProject.progress > 100) {
            throw new Error('Progress must be between 0 and 100');
        }
        
        allProjects.push(newProject);
        saveProjects();
        showMessage('Project added successfully!', 'success');
        return true;
        
    } catch (error) {
        showMessage('Error adding project: ' + error.message, 'error');
        return false;
    }
}

/**
 * READ: Load projects from localStorage or use defaults
 */
function loadProjects() {
    try {
        const stored = localStorage.getItem('caloocan_budget_projects');
        if (stored) {
            allProjects = JSON.parse(stored);
            // Find the highest ID to set nextProjectId
            nextProjectId = Math.max(...allProjects.map(p => p.id)) + 1;
        } else {
            allProjects = [...defaultProjects];
            saveProjects(); // Save defaults to localStorage
        }
        filteredProjects = [...allProjects];
    } catch (error) {
        console.error('Error loading projects:', error);
        allProjects = [...defaultProjects];
        filteredProjects = [...allProjects];
    }
}

/**
 * UPDATE: Modify existing project
 */
function updateProject(projectId, projectData) {
    try {
        const index = allProjects.findIndex(p => p.id === projectId);
        if (index === -1) {
            throw new Error('Project not found');
        }
        
        const updatedProject = {
            id: projectId,
            name: projectData.name.trim(),
            dept: projectData.dept,
            manager: projectData.manager.trim(),
            budget: parseInt(projectData.budget),
            status: projectData.status,
            deadline: projectData.deadline,
            progress: parseInt(projectData.progress)
        };
        
        // Validate required fields
        if (!updatedProject.name || !updatedProject.dept || !updatedProject.manager || 
            !updatedProject.budget || !updatedProject.status || !updatedProject.deadline) {
            throw new Error('All fields are required');
        }
        
        if (updatedProject.budget <= 0) {
            throw new Error('Budget must be greater than 0');
        }
        
        if (updatedProject.progress < 0 || updatedProject.progress > 100) {
            throw new Error('Progress must be between 0 and 100');
        }
        
        allProjects[index] = updatedProject;
        saveProjects();
        showMessage('Project updated successfully!', 'success');
        return true;
        
    } catch (error) {
        showMessage('Error updating project: ' + error.message, 'error');
        return false;
    }
}

/**
 * DELETE: Remove project with confirmation
 */
function deleteProject(projectId) {
    try {
        const index = allProjects.findIndex(p => p.id === projectId);
        if (index === -1) {
            throw new Error('Project not found');
        }
        
        const projectName = allProjects[index].name;
        allProjects.splice(index, 1);
        saveProjects();
        showMessage(`Project "${projectName}" deleted successfully!`, 'success');
        
        // Refresh display
        filterProjects();
        updateStats();
        createCharts();
        
    } catch (error) {
        showMessage('Error deleting project: ' + error.message, 'error');
    }
}

/**
 * Save projects to localStorage
 */
function saveProjects() {
    try {
        localStorage.setItem('caloocan_budget_projects', JSON.stringify(allProjects));
    } catch (error) {
        console.error('Error saving projects:', error);
        showMessage('Warning: Could not save data to browser storage', 'error');
    }
}

// ===== UI DISPLAY FUNCTIONS =====

/**
 * Display projects in the table
 */
function showProjects(projectList) {
    const tableBody = document.getElementById("tableData");
    if (!tableBody) return;
    
    tableBody.innerHTML = "";
    
    if (projectList.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 20px; color: #666;">
                    No projects found
                </td>
            </tr>
        `;
        return;
    }
    
    projectList.forEach(project => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${escapeHtml(project.name)}</td>
            <td>${escapeHtml(project.dept)}</td>
            <td>${escapeHtml(project.manager)}</td>
            <td class="money">${formatMoney(project.budget)}</td>
            <td><span class="${getStatusClass(project.status)}">${project.status}</span></td>
            <td>${formatDate(project.deadline)}</td>
            <td>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${project.progress}%"></div>
                </div>
                ${project.progress}%
            </td>
            <td>
                <button class="action-btn edit-btn" onclick="openEditModal(${project.id})">Edit</button>
                <button class="action-btn delete-btn" onclick="confirmDelete(${project.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

/**
 * Update statistics dashboard
 */
function updateStats() {
    const totalBudget = allProjects.reduce((sum, project) => sum + project.budget, 0);
    
    const usedBudget = allProjects.reduce((sum, project) => {
        if (project.status === "Ongoing" || project.status === "Done") {
            return sum + (project.budget * project.progress / 100);
        }
        return sum;
    }, 0);
    
    const remainingBudget = totalBudget - usedBudget;
    
    // Update DOM elements
    updateElement("totalBudget", formatMoney(totalBudget));
    updateElement("usedBudget", formatMoney(Math.round(usedBudget)));
    updateElement("remainingBudget", formatMoney(Math.round(remainingBudget)));
    updateElement("totalProjects", allProjects.length.toString());
}

/**
 * Filter projects based on selected criteria
 */
function filterProjects() {
    const deptFilter = document.getElementById("deptFilter")?.value || "";
    const statusFilter = document.getElementById("statusFilter")?.value || "";
    
    filteredProjects = allProjects.filter(project => {
        const matchesDept = !deptFilter || project.dept === deptFilter;
        const matchesStatus = !statusFilter || project.status === statusFilter;
        return matchesDept && matchesStatus;
    });
    
    showProjects(filteredProjects);
}

/**
 * Clear all filters and show all projects
 */
function clearFilters() {
    document.getElementById("deptFilter").value = "";
    document.getElementById("statusFilter").value = "";
    filteredProjects = [...allProjects];
    showProjects(filteredProjects);
}

// ===== CHART FUNCTIONS =====

/**
 * Create department budget and status charts
 */
function createCharts() {
    createDepartmentChart();
    createStatusChart();
}

/**
 * Create department budget distribution chart
 */
function createDepartmentChart() {
    const deptData = {};
    
    allProjects.forEach(project => {
        const dept = project.dept;
        deptData[dept] = (deptData[dept] || 0) + project.budget;
    });
    
    const chartData = Object.entries(deptData).map(([dept, budget]) => ({
        label: dept,
        value: budget
    }));
    
    const colors = ["#4169e1", "#1e90ff", "#87ceeb", "#b0e0e6", "#add8e6", "#6495ed"];
    drawSimpleChart("deptChart", chartData, colors, true);
}

/**
 * Create project status distribution chart
 */
function createStatusChart() {
    const statusData = {};
    
    allProjects.forEach(project => {
        const status = project.status;
        statusData[status] = (statusData[status] || 0) + 1;
    });
    
    const chartData = Object.entries(statusData).map(([status, count]) => ({
        label: status,
        value: count
    }));
    
    const colors = ["#ffeb3b", "#2196f3", "#4caf50"];
    drawSimpleChart("statusChart", chartData, colors, false);
}

/**
 * Draw simple bar chart
 */
function drawSimpleChart(chartId, data, colors, isMoney = false) {
    const chart = document.getElementById(chartId);
    if (!chart || data.length === 0) return;
    
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    let html = "";
    data.forEach((item, index) => {
        const percentage = Math.round((item.value / total) * 100);
        const color = colors[index % colors.length];
        const displayValue = isMoney ? formatMoney(item.value) : item.value;
        
        html += `
            <div style="margin: 5px 0; padding: 8px; background-color: ${color}; color: white; border-radius: 4px; font-size: 0.85rem;">
                <strong>${escapeHtml(item.label)}</strong><br>
                ${displayValue} (${percentage}%)
            </div>
        `;
    });
    
    chart.innerHTML = html;
}

// ===== MODAL FUNCTIONS =====

/**
 * Open modal for adding new project
 */
function openAddModal() {
    editingProjectId = null;
    document.getElementById("modalTitle").textContent = "Add New Project";
    document.getElementById("projectForm").reset();
    
    // Set default values
    document.getElementById("projectProgress").value = "0";
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById("projectDeadline").min = today;
    
    document.getElementById("projectModal").style.display = "block";
    document.body.style.overflow = "hidden"; // Prevent background scrolling
}

/**
 * Open modal for editing existing project
 */
function openEditModal(projectId) {
    const project = allProjects.find(p => p.id === projectId);
    if (!project) {
        showMessage('Project not found', 'error');
        return;
    }
    
    editingProjectId = projectId;
    document.getElementById("modalTitle").textContent = "Edit Project";
    
    // Populate form with project data
    document.getElementById("projectName").value = project.name;
    document.getElementById("projectDept").value = project.dept;
    document.getElementById("projectManager").value = project.manager;
    document.getElementById("projectBudget").value = project.budget;
    document.getElementById("projectStatus").value = project.status;
    document.getElementById("projectDeadline").value = project.deadline;
    document.getElementById("projectProgress").value = project.progress;
    
    document.getElementById("projectModal").style.display = "block";
    document.body.style.overflow = "hidden";
}

/**
 * Close project modal
 */
function closeModal() {
    document.getElementById("projectModal").style.display = "none";
    document.body.style.overflow = "auto";
    editingProjectId = null;
}

/**
 * Show delete confirmation modal
 */
function confirmDelete(projectId) {
    const project = allProjects.find(p => p.id === projectId);
    if (!project) return;
    
    document.querySelector('#confirmModal .modal-body p').textContent = 
        `Are you sure you want to delete "${project.name}"? This action cannot be undone.`;
    
    document.getElementById("confirmDelete").onclick = () => {
        deleteProject(projectId);
        closeConfirmModal();
    };
    
    document.getElementById("confirmModal").style.display = "block";
    document.body.style.overflow = "hidden";
}

/**
 * Close confirmation modal
 */
function closeConfirmModal() {
    document.getElementById("confirmModal").style.display = "none";
    document.body.style.overflow = "auto";
}

// ===== FORM HANDLING =====

/**
 * Handle project form submission
 */
function handleProjectForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const projectData = {
        name: formData.get('projectName'),
        dept: formData.get('projectDept'),
        manager: formData.get('projectManager'),
        budget: formData.get('projectBudget'),
        status: formData.get('projectStatus'),
        deadline: formData.get('projectDeadline'),
        progress: formData.get('projectProgress')
    };
    
    let success = false;
    
    if (editingProjectId) {
        success = updateProject(editingProjectId, projectData);
    } else {
        success = addProject(projectData);
    }
    
    if (success) {
        closeModal();
        filterProjects(); // Refresh display with current filters
        updateStats();
        createCharts();
    }
}

// ===== UTILITY FUNCTIONS =====

/**
 * Format number as Philippine Peso currency
 */
function formatMoney(amount) {
    return "₱" + amount.toLocaleString('en-PH');
}

/**
 * Get CSS class for status badge
 */
function getStatusClass(status) {
    const classes = {
        "Pending": "status-pending",
        "Ongoing": "status-ongoing", 
        "Done": "status-done"
    };
    return classes[status] || "status-pending";
}

/**
 * Format date for display
 */
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch {
        return dateString;
    }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Update DOM element content safely
 */
function updateElement(id, content) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = content;
    }
}

/**
 * Show success/error messages
 */
function showMessage(message, type = 'success') {
    const container = document.getElementById('messageContainer');
    if (!container) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    
    container.appendChild(messageDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 5000);
    
    // Remove on click
    messageDiv.addEventListener('click', () => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    });
}

// ===== EVENT LISTENERS =====

/**
 * Initialize application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // Load data and initialize display
    loadProjects();
    showProjects(allProjects);
    updateStats();
    createCharts();
    
    // Set up form submission handler
    const projectForm = document.getElementById('projectForm');
    if (projectForm) {
        projectForm.addEventListener('submit', handleProjectForm);
    }
    
    // Set up filter change handlers
    const deptFilter = document.getElementById('deptFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (deptFilter) {
        deptFilter.addEventListener('change', filterProjects);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterProjects);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const projectModal = document.getElementById('projectModal');
        const confirmModal = document.getElementById('confirmModal');
        
        if (event.target === projectModal) {
            closeModal();
        }
        
        if (event.target === confirmModal) {
            closeConfirmModal();
        }
    });
    
    // Handle escape key to close modals
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const projectModal = document.getElementById('projectModal');
            const confirmModal = document.getElementById('confirmModal');
            
            if (projectModal.style.display === 'block') {
                closeModal();
            }
            
            if (confirmModal.style.display === 'block') {
                closeConfirmModal();
            }
        }
    });
    
    console.log('Caloocan City Budget Tracker initialized successfully');
});

// ===== GLOBAL FUNCTION EXPORTS =====
// These functions are called from HTML onclick handlers

window.openAddModal = openAddModal;
window.openEditModal = openEditModal;
window.closeModal = closeModal;
window.confirmDelete = confirmDelete;
window.closeConfirmModal = closeConfirmModal;
window.filterProjects = filterProjects;
window.clearFilters = clearFilters;