// GTA Online Daily Money Checklist - Application Logic

class GTAChecklist {
    constructor() {
        this.missionsData = null;
        this.currentTab = 'quick-money';
        this.progress = this.loadProgress() || {};
        this.filtersVisible = true;
        this.completedViewVisible = false;
        this.activeFilters = {
            money: '',
            time: '',
            difficulty: '',
            solo: '',
            priority: '',
            launchLocation: ''
        };
    }

    async init() {
        try {
            // Load missions data
            const response = await fetch('data/missions.json');
            this.missionsData = await response.json();

            // Render the application
            this.renderTabs();
            this.renderContent();
            this.initializeFilters();
            this.updateProgress();

            // Set initial tab
            this.showTab(this.currentTab);
        } catch (error) {
            console.error('Failed to initialize app:', error);
            document.getElementById('app').innerHTML = '<p>Error loading missions data. Please refresh the page.</p>';
        }
    }

    renderTabs() {
        const tabsContainer = document.getElementById('tabs');
        const tabsHTML = this.missionsData.categories.map(category => `
            <button class="tab ${category.id === this.currentTab ? 'active' : ''}" 
                    onclick="app.showTab('${category.id}')">
                ${category.icon} ${category.name}
            </button>
        `).join('');

        tabsContainer.innerHTML = tabsHTML;
    }

    renderContent() {
        const contentContainer = document.getElementById('content');

        this.missionsData.categories.forEach(category => {
            const categoryHTML = `
                <div id="${category.id}" class="tab-content ${category.id === this.currentTab ? 'active' : ''}">
                    ${this.renderSections(category.sections, category.id)}
                </div>
            `;
            contentContainer.innerHTML += categoryHTML;
        });
    }

    renderSections(sections, categoryId) {
        return sections.map(section => `
            <div class="section">
                <div class="section-header" onclick="app.toggleSection(this)">
                    <h3>${section.name}</h3>
                    <span class="toggle-icon">▶</span>
                </div>
                <div class="section-content">
                    ${this.renderActivities(section.activities, categoryId, section.id)}
                </div>
            </div>
        `).join('');
    }

    renderActivities(activities, categoryId, sectionId) {
        return activities.map(activity => {
            const taskId = `${categoryId}-${sectionId}-${activity.id}`;
            const isCompleted = this.progress[taskId] || false;

            return `
                <div class="task ${isCompleted ? 'completed' : ''}" 
                     data-task-id="${taskId}"
                     data-category="${categoryId}"
                     data-section="${sectionId}"
                     data-activity="${activity.id}"
                     onclick="app.toggleTask('${taskId}', this)">
                    <input type="checkbox" ${isCompleted ? 'checked' : ''}>
                    <div class="task-content">
                        <div class="task-title">${activity.name}</div>
                        ${this.renderActivityDetails(activity)}
                        <div class="task-reward">${activity.reward}</div>
                        ${this.renderFilterTags(activity)}
                    </div>
                    <div class="priority ${activity.priority.toLowerCase()}">${activity.priority}</div>
                </div>
            `;
        }).join('');
    }

    renderActivityDetails(activity) {
        let detailsHTML = '';

        // Render time if available
        if (activity.time) {
            detailsHTML += `<div class="task-time">⏱️ ${activity.time}</div>`;
        }

        // Render launch location if available
        if (activity.launchLocation) {
            detailsHTML += `
                <div class="launch-location">
                    <span class="location-icon">${activity.launchLocation.icon}</span>
                    <span class="location-name">${activity.launchLocation.name}</span>
                    ${activity.launchLocation.method ? `<span class="location-method"> - ${activity.launchLocation.method}</span>` : ''}
                </div>
            `;
        }

        // Render requirements
        if (activity.requirements && activity.requirements.length > 0) {
            detailsHTML += `
                <div class="detail-section">
                    <div class="detail-header">📋 Requirements:</div>
                    <div class="detail-content">
                        ${activity.requirements.join('<br>')}
                    </div>
                </div>
            `;
        }

        // Render vehicles
        if (activity.vehicles) {
            detailsHTML += `
                <div class="detail-section">
                    <div class="detail-header">🚗 Vehicles:</div>
                    <div class="detail-content">
                        ${activity.vehicles.setup ? `Setup: ${activity.vehicles.setup.join(', ')}<br>` : ''}
                        ${activity.vehicles.strategy ? `Strategy: ${activity.vehicles.strategy}` : ''}
                    </div>
                </div>
            `;
        }

        // Render main details
        if (activity.details && activity.details.length > 0) {
            detailsHTML += `
                <div class="detail-section">
                    <div class="detail-header">💡 Details:</div>
                    <div class="detail-content">
                        ${activity.details.join('<br>')}
                    </div>
                </div>
            `;
        }

        // Render approaches (for heists)
        if (activity.approaches) {
            detailsHTML += `
                <div class="detail-section">
                    <div class="detail-header">🎯 Approaches:</div>
                    <div class="detail-content">
                        ${activity.approaches.map(approach =>
                `<strong>${approach.name}</strong>: ${approach.description} (${approach.difficulty})`
            ).join('<br>')}
                    </div>
                </div>
            `;
        }

        // Render targets (for casino heist)
        if (activity.targets) {
            detailsHTML += `
                <div class="detail-section">
                    <div class="detail-header">💎 Target Priority:</div>
                    <div class="detail-content">
                        ${activity.targets.map(target =>
                `<strong>${target.name}</strong>: ${target.value}${target.note ? ` - ${target.note}` : ''}`
            ).join('<br>')}
                    </div>
                </div>
            `;
        }

        // Render setup missions (for heists with detailed setup info)
        if (activity.setupMissions) {
            detailsHTML += `
                <div class="detail-section">
                    <div class="detail-header">🔧 Setup Missions:</div>
                    <div class="detail-content">
                        ${activity.setupMissions.map(setup => {
                let setupHTML = `<strong>${setup.approach || setup.name}</strong>:<br>`;
                if (setup.required) setupHTML += `Required: ${setup.required.join(', ')}<br>`;
                if (setup.optional) setupHTML += `Optional: ${setup.optional.join(', ')}<br>`;
                if (setup.options) setupHTML += `Options: ${setup.options.join(', ')}<br>`;
                if (setup.tip) setupHTML += `💡 ${setup.tip}`;
                return setupHTML;
            }).join('<br><br>')}
                    </div>
                </div>
            `;
        }

        return detailsHTML;
    }

    renderFilterTags(activity) {
        let tagsHTML = '<div class="task-filters">';

        if (activity.moneyPotential) {
            tagsHTML += `<span class="filter-tag money">${activity.moneyPotential}</span>`;
        }
        if (activity.timeRequired) {
            tagsHTML += `<span class="filter-tag time">${activity.timeRequired}</span>`;
        }
        if (activity.difficulty) {
            tagsHTML += `<span class="filter-tag difficulty">${activity.difficulty}</span>`;
        }
        if (activity.soloFriendly) {
            tagsHTML += `<span class="filter-tag solo">${activity.soloFriendly}</span>`;
        }

        tagsHTML += '</div>';
        return tagsHTML;
    }

    toggleTask(taskId, taskElement) {
        const checkbox = taskElement.querySelector('input[type="checkbox"]');
        checkbox.checked = !checkbox.checked;

        this.progress[taskId] = checkbox.checked;

        if (checkbox.checked) {
            taskElement.classList.add('completed');
        } else {
            taskElement.classList.remove('completed');
        }

        this.updateProgress();
        this.saveProgress();
    }

    toggleSection(headerElement) {
        const section = headerElement.parentElement;
        const icon = headerElement.querySelector('.toggle-icon');

        section.classList.toggle('expanded');

        if (section.classList.contains('expanded')) {
            icon.textContent = '▼';
        } else {
            icon.textContent = '▶';
        }
    }

    showTab(tabName) {
        this.currentTab = tabName;

        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Remove active from all tab buttons
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // Show selected tab
        const selectedTab = document.getElementById(tabName);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }

        // Activate clicked tab button
        const activeTabButton = document.querySelector(`.tab[onclick*="${tabName}"]`);
        if (activeTabButton) {
            activeTabButton.classList.add('active');
        }
    }

    expandAll() {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.add('expanded');
            const icon = section.querySelector('.toggle-icon');
            if (icon) icon.textContent = '▼';
        });
    }

    collapseAll() {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('expanded');
            const icon = section.querySelector('.toggle-icon');
            if (icon) icon.textContent = '▶';
        });
    }

    updateProgress() {
        const totalTasks = document.querySelectorAll('.task').length;
        const completedTasks = document.querySelectorAll('.task.completed').length;
        const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        document.getElementById('progressBar').style.width = progress + '%';
        document.getElementById('progressText').textContent = Math.round(progress) + '%';
        document.getElementById('completedCount').textContent = completedTasks;
        document.getElementById('totalCount').textContent = totalTasks;

        // Update completed view if visible
        if (this.completedViewVisible) {
            this.renderCompletedView();
        }
    }

    resetChecklist() {
        if (confirm('Are you sure you want to reset all progress?')) {
            this.progress = {};
            document.querySelectorAll('.task').forEach(task => {
                task.classList.remove('completed');
                task.querySelector('input[type="checkbox"]').checked = false;
            });
            this.updateProgress();
            this.saveProgress();
        }
    }

    saveProgress() {
        localStorage.setItem('gtaChecklistProgress', JSON.stringify(this.progress));
    }

    loadProgress() {
        const saved = localStorage.getItem('gtaChecklistProgress');
        return saved ? JSON.parse(saved) : null;
    }

    // Filter functionality
    initializeFilters() {
        if (!this.missionsData.filters) return;

        // Populate filter dropdowns
        this.populateFilterOptions('moneyFilter', this.missionsData.filters.moneyPotential);
        this.populateFilterOptions('timeFilter', this.missionsData.filters.timeRequired);
        this.populateFilterOptions('difficultyFilter', this.missionsData.filters.difficulty);
        this.populateFilterOptions('soloFilter', this.missionsData.filters.soloFriendly);
        this.populateFilterOptions('launchLocationFilter', this.missionsData.filters.launchLocation);
    }

    populateFilterOptions(selectId, options) {
        const select = document.getElementById(selectId);
        if (!select || !options) return;

        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            select.appendChild(optionElement);
        });
    }

    toggleFilters() {
        const container = document.getElementById('filtersContainer');
        const toggle = document.getElementById('filterToggle');

        this.filtersVisible = !this.filtersVisible;

        if (this.filtersVisible) {
            container.style.display = 'block';
            toggle.textContent = 'Hide Filters';
        } else {
            container.style.display = 'none';
            toggle.textContent = 'Show Filters';
        }
    }

    applyFilters() {
        // Get current filter values
        this.activeFilters.money = document.getElementById('moneyFilter').value;
        this.activeFilters.time = document.getElementById('timeFilter').value;
        this.activeFilters.difficulty = document.getElementById('difficultyFilter').value;
        this.activeFilters.solo = document.getElementById('soloFilter').value;
        this.activeFilters.priority = document.getElementById('priorityFilter').value;
        this.activeFilters.launchLocation = document.getElementById('launchLocationFilter').value;

        // Apply filters to all tasks
        const tasks = document.querySelectorAll('.task');

        tasks.forEach(task => {
            const taskData = this.getTaskDataFromElement(task);
            const isVisible = this.shouldShowTask(taskData);

            if (isVisible) {
                task.classList.remove('filtered-hidden');
            } else {
                task.classList.add('filtered-hidden');
            }
        });

        // Update section visibility
        this.updateSectionVisibility();
        this.updateProgress();
    }

    shouldShowTask(taskData) {
        if (!taskData) return true;

        // Check each filter
        if (this.activeFilters.money && taskData.moneyPotential !== this.activeFilters.money) {
            return false;
        }
        if (this.activeFilters.time && taskData.timeRequired !== this.activeFilters.time) {
            return false;
        }
        if (this.activeFilters.difficulty && taskData.difficulty !== this.activeFilters.difficulty) {
            return false;
        }
        if (this.activeFilters.solo && taskData.soloFriendly !== this.activeFilters.solo) {
            return false;
        }
        if (this.activeFilters.priority && taskData.priority !== this.activeFilters.priority) {
            return false;
        }
        if (this.activeFilters.launchLocation && taskData.launchLocation && taskData.launchLocation.name !== this.activeFilters.launchLocation) {
            return false;
        }

        return true;
    }

    getTaskDataFromElement(taskElement) {
        const categoryId = taskElement.dataset.category;
        const sectionId = taskElement.dataset.section;
        const activityId = taskElement.dataset.activity;

        if (!categoryId || !sectionId || !activityId) return null;

        const category = this.missionsData.categories.find(c => c.id === categoryId);
        if (!category) return null;

        const section = category.sections.find(s => s.id === sectionId);
        if (!section) return null;

        const activity = section.activities.find(a => a.id === activityId);
        return activity;
    }

    updateSectionVisibility() {
        const sections = document.querySelectorAll('.section');

        sections.forEach(section => {
            const visibleTasks = section.querySelectorAll('.task:not(.filtered-hidden)');

            if (visibleTasks.length === 0) {
                section.classList.add('filtered-empty');
            } else {
                section.classList.remove('filtered-empty');
            }
        });
    }

    clearAllFilters() {
        // Reset all filter selects
        document.getElementById('moneyFilter').value = '';
        document.getElementById('timeFilter').value = '';
        document.getElementById('difficultyFilter').value = '';
        document.getElementById('soloFilter').value = '';
        document.getElementById('priorityFilter').value = '';
        document.getElementById('launchLocationFilter').value = '';

        // Clear active filters
        this.activeFilters = {
            money: '',
            time: '',
            difficulty: '',
            solo: '',
            priority: '',
            launchLocation: ''
        };

        // Show all tasks
        const tasks = document.querySelectorAll('.task');
        tasks.forEach(task => {
            task.classList.remove('filtered-hidden');
        });

        // Show all sections
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.classList.remove('filtered-empty');
        });

        this.updateProgress();
    }

    toggleCompletedView() {
        const completedView = document.getElementById('completedView');
        const content = document.getElementById('content');
        const tabs = document.getElementById('tabs');
        const toggle = document.getElementById('completedToggle');

        this.completedViewVisible = !this.completedViewVisible;

        if (this.completedViewVisible) {
            completedView.style.display = 'block';
            content.style.display = 'none';
            tabs.style.display = 'none';
            toggle.textContent = 'Show Tasks';
            toggle.classList.add('active');
            this.renderCompletedView();
        } else {
            completedView.style.display = 'none';
            content.style.display = 'block';
            tabs.style.display = 'flex';
            toggle.textContent = 'Show Completed';
            toggle.classList.remove('active');
        }
    }

    renderCompletedView() {
        const completedList = document.getElementById('completedList');
        const completedTasks = [];

        // Collect all completed tasks
        this.missionsData.categories.forEach(category => {
            category.sections.forEach(section => {
                section.activities.forEach(activity => {
                    const taskId = `${category.id}-${section.id}-${activity.id}`;
                    if (this.progress[taskId]) {
                        completedTasks.push({
                            ...activity,
                            categoryName: category.name,
                            categoryIcon: category.icon,
                            sectionName: section.name
                        });
                    }
                });
            });
        });

        if (completedTasks.length === 0) {
            completedList.innerHTML = `
                <div class="completed-empty">
                    <p>No tasks completed yet. Start checking off some activities!</p>
                </div>
            `;
            return;
        }

        const completedHTML = completedTasks.map(task => `
            <div class="completed-item">
                <div class="completed-item-left">
                    <span class="completed-check">✅</span>
                    <span class="completed-name">${task.name}</span>
                    <span class="completed-category">${task.categoryIcon} ${task.categoryName}</span>
                </div>
                <div class="completed-item-right">
                    <span class="completed-reward">${task.reward}</span>
                    ${task.launchLocation ? `
                        <div class="completed-location">
                            <span class="completed-location-icon">${task.launchLocation.icon}</span>
                            <span>${task.launchLocation.name}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');

        completedList.innerHTML = completedHTML;
    }
}

// Initialize the app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new GTAChecklist();
    app.init();
});