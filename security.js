/**
 * =================================================================
 * DIWAN ISLAMIC HISTORY - ADVANCED SECURITY SYSTEM
 * =================================================================
 * This script provides multi-layered protection for the website:
 * 1. Anti-Scraping (Disable Right Click, Copy, Selection)
 * 2. DevTools Protection (Anti-Debugging)
 * 3. XSS Shield (Sanitization)
 * 4. Content Protection (Shortcut blocking)
 * =================================================================
 */

(function() {
    'use strict';

    const securityConfig = {
        disableRightClick: true,
        disableSelection: false, // Disabled as it may block clicks on some browsers
        disableDevTools: true,
        disableShortcuts: true,
        redirectOnViolation: false
    };

    // 1. ANTI-SCRAPING: Disable Right Click
    if (securityConfig.disableRightClick) {
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            showSecurityToast('عذراً، حماية المحتوى مفعلة. لا يمكن استخدام الزر الأيمن.');
            return false;
        });
    }

    // 2. ANTI-SCRAPING: Disable Text Selection via CSS and JS
    if (securityConfig.disableSelection) {
        document.documentElement.style.webkitUserSelect = 'none';
        document.documentElement.style.mozUserSelect = 'none';
        document.documentElement.style.msUserSelect = 'none';
        document.documentElement.style.userSelect = 'none';

        document.addEventListener('selectstart', function(e) {
            e.preventDefault();
            return false;
        });
    }

    // 3. CONTENT PROTECTION: Block Keyboard Shortcuts
    if (securityConfig.disableShortcuts) {
        document.addEventListener('keydown', function(e) {
            // Block Ctrl+C (Copy), Ctrl+U (View Source), Ctrl+S (Save), Ctrl+Shift+I (DevTools)
            if (
                (e.ctrlKey && (e.key === 'c' || e.key === 'u' || e.key === 's' || e.key === 'p')) ||
                (e.ctrlKey && e.shiftKey && (e.key === 'i' || e.key === 'j' || e.key === 'c')) ||
                (e.key === 'F12')
            ) {
                e.preventDefault();
                showSecurityToast('تم حظر هذا الاختصار لحماية أمن الموقع.');
                return false;
            }
        });
    }

    // 4. DEVTOOLS PROTECTION: Detect and Respond
    if (securityConfig.disableDevTools) {
        let lastCheck = 0;
        const checkDevTools = function() {
            const widthThreshold = window.outerWidth - window.innerWidth > 160;
            const heightThreshold = window.outerHeight - window.innerHeight > 160;
            
            if (widthThreshold || heightThreshold) {
                if (Date.now() - lastCheck > 2000) {
                    console.log('%cتنبيه أمني!', 'color: red; font-size: 30px; font-weight: bold;');
                    console.log('%cمحاولة الوصول إلى أدوات المطور محظورة.', 'font-size: 18px;');
                    lastCheck = Date.now();
                }
            }
        };

        window.addEventListener('resize', checkDevTools);
        setInterval(checkDevTools, 1000);
    }

    // 5. SECURITY TOAST UI
    function showSecurityToast(message) {
        let toast = document.getElementById('security-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'security-toast';
            document.body.appendChild(toast);
            
            const style = document.createElement('style');
            style.textContent = `
                #security-toast {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    background: rgba(18, 10, 35, 0.95);
                    color: #e9c483;
                    padding: 15px 25px;
                    border-radius: 12px;
                    border: 1px solid #e9c483;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    z-index: 99999;
                    font-family: 'Amiri', serif;
                    direction: rtl;
                    transform: translateY(150%);
                    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                #security-toast.show {
                    transform: translateY(0);
                }
            `;
            document.head.appendChild(style);
        }

        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // 6. XSS SANITIZER (Utility)
    window.SecurityShield = {
        sanitizeHTML: function(str) {
            const temp = document.createElement('div');
            temp.textContent = str;
            return temp.innerHTML;
        },
        obfuscateEmail: function(email) {
            return email.split('').map(char => `&#${char.charCodeAt(0)};`).join('');
        }
    };

    console.log('%cتم تفعيل درع الحماية المتطور - ديوان التاريخ الإسلامي', 'color: #e9c483; font-weight: bold; background: #1a142f; padding: 5px 10px; border-radius: 5px;');

})();
