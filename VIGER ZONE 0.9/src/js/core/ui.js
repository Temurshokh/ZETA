/**
 * ZETA Centralized UI Utilities
 * Handles modals, notifications, and common UI patterns.
 */

const UI = {
    /**
     * Show a premium toast notification
     * @param {string} message 
     * @param {string} type 'success' | 'error' | 'info' | 'warning'
     */
    activeTimeout: null,
    showNotification(message, type = 'info') {
        let container = document.getElementById('notif-stack-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notif-stack-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 11000;
                display: flex;
                flex-direction: column;
                align-items: center;
                pointer-events: none;
                width: 100%;
                max-width: 320px;
            `;
            document.body.appendChild(container);
        }

        // Clear existing
        while (container.firstChild) container.removeChild(container.firstChild);
        if (this.activeTimeout) clearTimeout(this.activeTimeout);

        const notification = document.createElement('div');
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-times-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        notification.className = `zeta-notification ${type}`;
        notification.style.cssText = `
            background: hsla(0, 0%, 0%, 0.9);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            color: white;
            padding: 10px 24px;
            border-radius: 30px;
            border: 1px solid rgba(255,255,255,0.1);
            box-shadow: 0 10px 40px rgba(0,0,0,0.6);
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 700;
            font-size: 0.95rem;
            pointer-events: auto;
            animation: notifSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            white-space: nowrap;
        `;
        notification.innerHTML = `
            <i class="fas ${icons[type] || icons.info}"></i>
            <span>${message}</span>
        `;

        container.appendChild(notification);

        this.activeTimeout = setTimeout(() => {
            notification.style.animation = 'notifSlideOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    /**
     * Centralized Modal Toggle
     */
    toggleModal(modalId, show = true) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        if (show) {
            modal.style.display = 'flex';
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            modal.style.display = 'none';
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
};

// Global Exposure
window.showNotification = UI.showNotification;
window.toggleModal = UI.toggleModal;
