// ==================== MODAL FUNCTIONALITY ====================

// Modal configuration
const modalConfig = {
    modal: null,
    title: null,
    body: null,
    isOpen: false
};

// Initialize modal
function initModal() {
    modalConfig.modal = document.getElementById('readingModal');
    modalConfig.title = document.getElementById('modalTitle');
    modalConfig.body = document.getElementById('modalBody');
    
    if (!modalConfig.modal) {
        createModalStructure();
    }
}

// Create modal structure if not exists
function createModalStructure() {
    const modalHTML = `
        <div id="readingModal" class="modal">
            <div class="modal-content">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <div class="modal-title" id="modalTitle"></div>
                <div class="modal-body" id="modalBody"></div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    modalConfig.modal = document.getElementById('readingModal');
    modalConfig.title = document.getElementById('modalTitle');
    modalConfig.body = document.getElementById('modalBody');
}

// Open modal with content
function openModal(title, content) {
    if (!modalConfig.modal) initModal();
    
    modalConfig.title.innerHTML = title;
    modalConfig.body.innerHTML = content;
    modalConfig.modal.style.display = 'flex';
    modalConfig.isOpen = true;
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    if (modalConfig.modal) {
        modalConfig.modal.style.display = 'none';
        modalConfig.isOpen = false;
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
}

// Open reading for era
function openReading(id) {
    const historicalData = window.historicalData || {};
    const data = historicalData[id];
    
    if (data) {
        openModal(data.title, data.content);
    }
}

// Open event reading
function openEventReading(year, desc) {
    const content = `
        <div style="font-size: 1.2rem; margin-bottom: 1rem;">${desc}</div>
        <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(233,196,131,0.3);">
            <strong><i class="fas fa-book"></i> المصادر:</strong><br>
            يمكن الرجوع إلى:
            <ul style="margin-top: 0.5rem; padding-right: 1.5rem;">
                <li>تاريخ الطبري</li>
                <li>البداية والنهاية لابن كثير</li>
                <li>الكامل في التاريخ لابن الأثير</li>
            </ul>
        </div>
        <div style="margin-top: 1rem;">
            <strong><i class="fas fa-link"></i> مواضيع ذات صلة:</strong><br>
            <a href="#" style="color: var(--gold-primary);">المزيد من أحداث ${year}</a>
        </div>
    `;
    openModal(`📅 حدث تاريخي: ${year}`, content);
}

// Open figure reading
function openFigureReading(name, role, detail) {
    const content = `
        <div style="margin-bottom: 1rem;">
            <strong><i class="fas fa-user-circle"></i> ${role}</strong>
        </div>
        <div>${detail}</div>
        <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(233,196,131,0.3);">
            <strong><i class="fas fa-book"></i> للمزيد:</strong><br>
            يمكن الرجوع إلى كتب التراجم مثل "سير أعلام النبلاء" و"البداية والنهاية".
        </div>
        <div style="margin-top: 1rem;">
            <strong><i class="fas fa-link"></i> شخصيات ذات صلة:</strong><br>
            <a href="#" style="color: var(--gold-primary);">شخصيات أخرى من نفس العصر</a>
        </div>
    `;
    openModal(`<i class="fas fa-user"></i> ${name}`, content);
}

// Open index reading
function openIndexReading(topic) {
    const content = `
        <p>يمكنك استكشاف هذا الموضوع بالتفصيل من خلال الموسوعة الشاملة.</p>
        <div style="margin: 1rem 0; padding: 1rem; background: rgba(233,196,131,0.1); border-radius: 20px;">
            <strong><i class="fas fa-book-open"></i> المصادر المقترحة للمطالعة:</strong>
            <ul style="margin-top: 0.5rem; padding-right: 1.5rem;">
                <li>📖 تاريخ الطبري</li>
                <li>📖 البداية والنهاية لابن كثير</li>
                <li>📖 الكامل في التاريخ لابن الأثير</li>
                <li>📖 مروج الذهب للمسعودي</li>
            </ul>
        </div>
        <p>للمزيد من التفاصيل، يُرجى الرجوع إلى بطاقات الموسوعة حسب الحقبة الزمنية.</p>
    `;
    openModal(`<i class="fas fa-list-ul"></i> ${topic}`, content);
}

// Open custom content
function openCustomContent(title, content) {
    openModal(title, content);
}

// Close modal on outside click
window.onclick = function(event) {
    if (event.target === modalConfig.modal) {
        closeModal();
    }
};

// Close modal on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modalConfig.isOpen) {
        closeModal();
    }
});

// Initialize modal when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initModal();
});