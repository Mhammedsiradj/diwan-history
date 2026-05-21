// ==================== DASHBOARD FUNCTIONS ====================

// تحديث الإحصائيات يدوياً (يمكن تعديل الأرقام هنا)
const siteStats = {
    eras: 8,
    figures: 127,
    battles: 15,
    cities: 8,
    references: 9,
    timeline: 12
};

// عرض الإحصائيات عند تحميل الصفحة
function displayStats() {
    const statEras = document.getElementById('statEras');
    const statFigures = document.getElementById('statFigures');
    const statBattles = document.getElementById('statBattles');
    const statCities = document.getElementById('statCities');
    const statReferences = document.getElementById('statReferences');
    const statTimeline = document.getElementById('statTimeline');
    
    if (statEras) statEras.innerText = siteStats.eras;
    if (statFigures) statFigures.innerText = siteStats.figures;
    if (statBattles) statBattles.innerText = siteStats.battles;
    if (statCities) statCities.innerText = siteStats.cities;
    if (statReferences) statReferences.innerText = siteStats.references;
    if (statTimeline) statTimeline.innerText = siteStats.timeline;
}

// تنفيذ عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    displayStats();
    
    // إضافة تأثيرات للبطاقات
    const cards = document.querySelectorAll('.stat-card-dash, .dashboard-card');
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (this.hasAttribute('onclick')) return;
            const links = this.querySelectorAll('a');
            if (links.length > 0 && !e.target.closest('a')) {
                window.location.href = links[0].href;
            }
        });
    });
});