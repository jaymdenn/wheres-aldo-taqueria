/* ========================================
   Where's Aldo? Taqueria - Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initSmoothScroll();
    initCookieBanner();
    initContactForm();
    initScrollEffects();
    initCalendar();
    initConfetti();

    // Fiesta Features
    initPapelPicado();
    initTacoCounter();
    initPinataBurst();
    initAldoTracker();
});

/* ========================================
   Navigation
   ======================================== */
function initNavigation() {
    const header = document.querySelector('.header');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('show');
            this.classList.toggle('active');

            // Toggle icon
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Header background on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* ========================================
   Smooth Scrolling
   ======================================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#"
            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                const navToggle = document.querySelector('.nav-toggle');
                if (navLinks && navLinks.classList.contains('show')) {
                    navLinks.classList.remove('show');
                    if (navToggle) {
                        navToggle.classList.remove('active');
                        const icon = navToggle.querySelector('i');
                        if (icon) {
                            icon.classList.remove('fa-times');
                            icon.classList.add('fa-bars');
                        }
                    }
                }
            }
        });
    });
}

/* ========================================
   Cookie Banner
   ======================================== */
function initCookieBanner() {
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('accept-cookies');

    // Check if cookies have been accepted
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');

    if (!cookiesAccepted && cookieBanner) {
        // Show banner after a short delay
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1000);

        // Handle accept button
        if (acceptButton) {
            acceptButton.addEventListener('click', function() {
                localStorage.setItem('cookiesAccepted', 'true');
                cookieBanner.classList.remove('show');

                // Hide banner after transition
                setTimeout(() => {
                    cookieBanner.classList.add('hidden');
                }, 300);
            });
        }
    } else if (cookieBanner) {
        cookieBanner.classList.add('hidden');
    }
}

/* ========================================
   Contact Form
   ======================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');

            // Basic validation
            if (!email) {
                showNotification('Please enter your email address.', 'error');
                return;
            }

            // Create mailto link with form data
            const subject = encodeURIComponent('Contact Form Submission from ' + (name || 'Website Visitor'));
            const body = encodeURIComponent(
                'Name: ' + (name || 'Not provided') + '\n' +
                'Email: ' + email + '\n\n' +
                'Message:\n' + (message || 'No message provided')
            );

            // Open email client
            window.location.href = 'mailto:info@wheresaldotaqueria.com?subject=' + subject + '&body=' + body;

            // Show success message
            showNotification('Opening your email client...', 'success');

            // Reset form
            form.reset();
        });
    }
}

/* ========================================
   Notification System
   ======================================== */
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification notification-' + type;
    notification.textContent = message;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        padding: 1rem 2rem;
        background-color: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        border-radius: 4px;
        font-family: 'Source Sans Pro', sans-serif;
        font-size: 0.9375rem;
        z-index: 1002;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    // Add animation keyframes if not exists
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        notification.style.transition = 'all 0.3s ease';

        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

/* ========================================
   Scroll Effects
   ======================================== */
function initScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    const animateElements = document.querySelectorAll('.about-card, .contact-info, .contact-form-wrapper');

    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // Add visible class styles
    const style = document.createElement('style');
    style.textContent = `
        .about-card.visible,
        .contact-info.visible,
        .contact-form-wrapper.visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/* ========================================
   Mobile Navigation Styles (Dynamic)
   ======================================== */
(function addMobileNavStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            .nav-social {
                position: absolute;
                top: var(--header-height, 60px);
                left: 0;
                right: 0;
                background-color: var(--color-dark, #333);
                flex-direction: column;
                padding: 1rem;
                gap: 0;
                transform: translateY(-100%);
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }

            .nav-social.show {
                transform: translateY(0);
                opacity: 1;
                visibility: visible;
            }

            .nav-social a {
                padding: 0.75rem;
                border-bottom: 1px solid rgba(255,255,255,0.1);
                width: 100%;
                justify-content: flex-start;
            }

            .nav-toggle.active {
                color: var(--color-accent, #f23030);
            }
        }

        .header.scrolled {
            background-color: rgba(51, 51, 51, 0.95);
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
    `;
    document.head.appendChild(style);
})();

/* ========================================
   Interactive Calendar
   ======================================== */
function initCalendar() {
    const calendarDays = document.getElementById('calendar-days');
    const calendarTitle = document.getElementById('calendar-month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const eventDetailsPanel = document.getElementById('event-details-panel');

    if (!calendarDays) return;

    // Events data - easily editable
    const events = [
        // April 2026
        { date: '2026-04-01', events: [
            { title: 'Cannon Building', time: '11:00 AM - 2:00 PM', location: '288 North 1460 West, Salt Lake City, Utah, 84116' },
            { title: 'World Cup Trophy Tour', time: '12:00 PM - 8:00 PM', location: 'America First Field' }
        ]},
        { date: '2026-04-02', events: [
            { title: 'Gallivan Center', time: '11:00 AM - 1:30 PM', location: '50 E 200 S, Salt Lake City, Utah 84111' }
        ]},
        { date: '2026-04-03', events: [
            { title: 'U of U Health Sciences', time: '11:00 AM - 2:00 PM', location: '10 North 1900 East, Salt Lake City, Utah, 84132' },
            { title: 'Cottonwood Corp', time: '11:00 AM - 2:00 PM', location: '2795 E Cottonwood Pkwy, Salt Lake City, Utah' }
        ]},
        { date: '2026-04-04', events: [
            { title: 'Real Salt Lake vs Kansas City', time: '1:00 PM - 6:00 PM', location: 'America First Field - 9256 S State St, Sandy, UT' }
        ]},
        { date: '2026-04-06', events: [
            { title: 'Nelson Labs', time: '11:00 AM - 2:00 PM', location: '6280 S Redwood Rd, Salt Lake City, Utah' },
            { title: 'Sandy League Night', time: '5:00 PM - 8:00 PM', location: '1245 E 9400 S, Sandy' }
        ]},
        { date: '2026-04-07', events: [
            { title: 'Towne Ridge Towers', time: '11:00 AM - 2:00 PM', location: '100 West Towne Ridge Parkway, Sandy, Utah, 84070' },
            { title: 'Private Lunch', time: '11:00 AM - 1:30 PM', location: '11493 Regal Ridge Ct, Kamas, UT' }
        ]},
        { date: '2026-04-08', events: [
            { title: '3Form/HQ', time: '11:00 AM - 2:00 PM', location: '2300 W 2300 S, WVC' },
            { title: 'Morgan Stanley', time: '11:00 AM - 2:00 PM', location: '698 W Shields Ln, South Jordan, UT' },
            { title: 'Veranda Apts', time: '5:00 PM - 7:00 PM', location: '448 W 13490 S, Draper, UT' },
            { title: 'Bria Apartments', time: '5:30 PM - 7:30 PM', location: '3330 W 4000 S, West Haven, UT' }
        ]},
        { date: '2026-04-09', events: [
            { title: 'Silver King Beverage Co.', time: '11:00 AM - 2:00 PM', location: '5454 W 150 S Poplar Grove, Salt Lake' },
            { title: 'Davis Technical College', time: '4:30 PM - 8:00 PM', location: 'Davis Technical College (550 S 300 E, Kaysville, UT 84037)' }
        ]},
        { date: '2026-04-10', events: [
            { title: 'Centerville Junior High', time: '11:30 AM - 1:30 PM', location: 'Centerville Junior High' }
        ]},
        { date: '2026-04-11', events: [
            { title: 'U of U Student Event', time: '11:00 AM - 1:30 PM', location: 'University of Utah' }
        ]},
        { date: '2026-04-13', events: [
            { title: 'North Salt Lake League Night', time: '5:00 PM - 8:00 PM', location: '1140 West 1100 North, North Salt Lake, Utah, 84054' }
        ]},
        { date: '2026-04-14', events: [
            { title: 'Eccles Broadcast Center', time: '11:00 AM - 2:00 PM', location: '101 S Wasatch Dr, Salt Lake City, UT' }
        ]},
        { date: '2026-04-15', events: [
            { title: 'Dell Technologies - Food Truck Battle', time: '11:00 AM - 2:00 PM', location: 'Dell Technologies (13197 Frontrunner Blvd, Draper, UT 84020)' },
            { title: 'Jackson Peterbilt', time: '11:00 AM - 2:00 PM', location: '1910 S 5500 W' }
        ]},
        { date: '2026-04-16', events: [
            { title: 'SL County Sheriff/Metro Jail', time: '11:00 AM - 2:00 PM', location: '3415 South 900 West, South Salt Lake, Utah, 84119' },
            { title: 'Moog Medical', time: '11:00 AM - 1:00 PM', location: '4314 Zevex Park Ln, Murray' },
            { title: 'Salt Lake Crossing Apts', time: '5:30 PM - 8:30 PM', location: '470 W 200 N, Salt Lake City, UT' }
        ]},
        { date: '2026-04-18', events: [
            { title: 'Private Appointment', time: '11:30 AM - 1:30 PM', location: 'Private Location' },
            { title: 'Real Salt Lake vs San Diego', time: '6:00 PM - 11:00 PM', location: 'America First Field - 9256 S State St, Sandy, UT' }
        ]},
        { date: '2026-04-20', events: [
            { title: 'Herriman League Night', time: '5:00 PM - 8:00 PM', location: '5373 Main Street, Herriman' }
        ]},
        { date: '2026-04-21', events: [
            { title: 'Wasatch 16 Campus', time: '10:30 AM - 1:30 PM', location: '121 West Election Road, Draper, Utah, 84020' },
            { title: 'Biomerics', time: '11:00 AM - 1:30 PM', location: '6030 Harold Gatty Drive, Salt Lake City, Utah, 84116' }
        ]},
        { date: '2026-04-22', events: [
            { title: 'Center 53', time: '11:00 AM - 2:00 PM', location: '434 W Ascension Way, Murray, UT' },
            { title: 'Northrop Grumman/Clearfield', time: '11:00 AM - 2:00 PM', location: '11th Street, G-12, Clearfield, UT' },
            { title: 'Real Salt Lake vs Miami', time: '6:00 PM - 11:00 PM', location: 'America First Field - 9256 S State St, Sandy, UT' }
        ]},
        { date: '2026-04-23', events: [
            { title: 'Private Breakfast', time: '6:30 AM - 8:30 AM', location: '3010 S West Temple St, South Salt Lake, UT' },
            { title: 'JRC Illuminates', time: '11:00 AM - 2:00 PM', location: '3041 W 2100 S, West Valley City, UT' },
            { title: 'Tesla', time: '11:00 AM - 2:00 PM', location: '12832 Frontrunner Blvd, Draper' },
            { title: 'Cyprus Credit Union', time: '11:00 AM - 2:00 PM', location: '3876 Center View Way, West Jordan, Utah 84084' }
        ]},
        { date: '2026-04-27', events: [
            { title: 'Sandy League Night', time: '5:00 PM - 8:00 PM', location: '1245 E 9400 S, Sandy' }
        ]},
        { date: '2026-04-28', events: [
            { title: 'Lone Peak Center', time: '11:00 AM - 2:00 PM', location: 'Lone Peak Center Campus (11781 S Lone Peak Pkwy Ste 230, Draper, UT 84020)' }
        ]},
        { date: '2026-04-29', events: [
            { title: 'Minuteman Office Park', time: '11:00 AM - 2:00 PM', location: '13961 S Minuteman Dr, Draper, UT' },
            { title: 'Neil Armstrong Academy', time: '4:45 PM - 7:00 PM', location: 'Neil Armstrong Academy - 5194 W Highbury Pkwy, West Valley City, UT 84120' }
        ]},
        { date: '2026-04-30', events: [
            { title: 'Albany Engineered Composites', time: '10:30 AM - 1:30 PM', location: '5995 West Amelia Earhart Drive, Salt Lake City, Utah, 84116' },
            { title: 'UDC Lunch', time: '11:00 AM - 2:00 PM', location: '1480 North 8000 West, Salt Lake City, Utah, 84116' }
        ]},
        // May 2026
        { date: '2026-05-01', events: [
            { title: 'Bountiful League Night', time: '5:00 PM - 8:00 PM', location: '54 East 100 South, Bountiful, Utah, 84010' }
        ]},
        { date: '2026-05-02', events: [
            { title: 'Real Salt Lake vs Portland', time: '1:00 PM - 6:00 PM', location: 'America First Field - 9256 S State St, Sandy, UT' }
        ]},
        { date: '2026-05-04', events: [
            { title: 'Mountain View Pharmacy', time: '11:00 AM - 2:00 PM', location: '230 S Main St, Bountiful' },
            { title: 'North Salt Lake League Night', time: '5:00 PM - 8:00 PM', location: '1140 West 1100 North, North Salt Lake, Utah, 84054' },
            { title: 'Community Night', time: '5:00 PM - 7:00 PM', location: 'Cottonwood Heights' }
        ]},
        { date: '2026-05-05', events: [
            { title: 'Gallivan Center', time: '11:00 AM - 1:30 PM', location: '50 E 200 S, Salt Lake City, Utah 84111' },
            { title: 'Draper Cinco de Mayo Festival', time: '6:00 PM - 8:00 PM', location: 'Draper City Park - 12501 S 1300 E, Draper, UT 84020' }
        ]},
        { date: '2026-05-06', events: [
            { title: 'U of U Employee Appreciation Event (private)', time: '11:00 AM - 12:30 PM', location: '50 N 2030 E, Salt Lake City, UT' },
            { title: 'Lehi League Night', time: '5:00 PM - 8:00 PM', location: '1999 N 600 E, Lehi, UT' }
        ]},
        { date: '2026-05-07', events: [
            { title: 'UTA/Frontrunner HQ', time: '11:00 AM - 2:00 PM', location: '669 W 200 S, Salt Lake City, UT' },
            { title: 'Taylorsville State Offices', time: '11:00 AM - 2:00 PM', location: '4315 South 2700 West, Taylorsville, Utah, 84129' }
        ]},
        { date: '2026-05-08', events: [
            { title: 'Unforgettable Coatings', time: '12:00 PM - 1:00 PM', location: '213 4860 S, Murray' }
        ]},
        { date: '2026-05-11', events: [
            { title: 'U of U Health Sciences', time: '11:00 AM - 2:00 PM', location: '10 North 1900 East, Salt Lake City, Utah, 84132' }
        ]},
        { date: '2026-05-12', events: [
            { title: 'MASOB Office Buildings', time: '11:00 AM - 2:00 PM', location: '195 North 1950 West, Salt Lake City, Utah, 84116' }
        ]},
        { date: '2026-05-13', events: [
            { title: 'Nelson Labs', time: '11:00 AM - 2:00 PM', location: '6280 S Redwood Rd, Salt Lake City, Utah' },
            { title: 'St Mark\'s Hospital', time: '11:00 AM - 2:00 PM', location: '1200 East 3900 South, Millcreek, Utah, 84124' },
            { title: 'Real Salt Lake vs Houston', time: '6:00 PM - 11:00 PM', location: 'America First Field - 9256 S State St, Sandy, UT' }
        ]},
        { date: '2026-05-14', events: [
            { title: 'Morgan Stanley', time: '11:00 AM - 2:00 PM', location: '698 W Shields Ln, South Jordan, UT' },
            { title: 'Jordan Commons', time: '11:00 AM - 1:30 PM', location: '9350 S 150 E, Sandy, UT' },
            { title: 'Wilshire Place Apts', time: '4:30 PM - 7:30 PM', location: '6447 Wilshire Park Avenue, West Jordan, Utah, 84081' }
        ]},
        { date: '2026-05-16', events: [
            { title: 'Real Salt Lake vs Colorado', time: '6:00 PM - 11:00 PM', location: 'America First Field - 9256 S State St, Sandy, UT' }
        ]},
        { date: '2026-05-18', events: [
            { title: 'South Towne', time: '11:00 AM - 2:00 PM', location: '200 W Civic Center Dr, Sandy, Utah' },
            { title: 'Sandy League Night', time: '5:00 PM - 8:00 PM', location: '1245 E 9400 S, Sandy' }
        ]},
        { date: '2026-05-19', events: [
            { title: 'Cottonwood Corp', time: '11:00 AM - 2:00 PM', location: '2795 E Cottonwood Pkwy, Salt Lake City, Utah' }
        ]},
        { date: '2026-05-20', events: [
            { title: 'Intermountain Health/TOSH', time: '11:00 AM - 2:00 PM', location: '5848 Fashion Blvd, Murray' },
            { title: 'Northrop Grumman/Clearfield Dinner', time: '6:00 PM - 8:00 PM', location: '14 13th Street C-14, Clearfield' }
        ]},
        { date: '2026-05-21', events: [
            { title: 'Gallivan Center', time: '11:00 AM - 1:30 PM', location: '50 E 200 S, Salt Lake City, Utah 84111' }
        ]},
        { date: '2026-05-22', events: [
            { title: 'Teal Drones', time: '11:00 AM - 1:00 PM', location: '2800 S West Temple, South Salt Lake, Utah 84115' }
        ]},
        { date: '2026-05-25', events: [
            { title: 'West Jordan Memorial Day Car Show', time: '10:00 AM - 2:00 PM', location: 'West Jordan' }
        ]},
        { date: '2026-05-26', events: [
            { title: 'Prestige Financial', time: '12:00 PM - 2:00 PM', location: '351 Opportunity Way, Draper, Utah, 84020' }
        ]},
        { date: '2026-05-27', events: [
            { title: 'Cannon Building', time: '11:00 AM - 2:00 PM', location: '288 North 1460 West, Salt Lake City, Utah, 84116' },
            { title: 'Bridge Investment Group', time: '11:00 AM - 2:00 PM', location: '111 E Sego Lily Dr, Sandy, Utah' },
            { title: 'Soleil Lofts', time: '5:00 PM - 7:00 PM', location: 'Soleil Lofts Apartments - 3753 W Suri Rise Ln, Herriman, UT 84096' }
        ]},
        { date: '2026-05-28', events: [
            { title: 'Select Health Golf Tournament', time: '7:00 AM - 3:00 PM', location: 'Eaglewood Golf Course - 1110 E Eaglewood Dr, North Salt Lake, UT 84054' },
            { title: 'Herriman City Rodeo', time: '5:00 PM - 10:00 PM', location: '14101 S 6400 W, Herriman, UT' }
        ]},
        { date: '2026-05-29', events: [
            { title: 'Herriman City Rodeo', time: '5:00 PM - 10:00 PM', location: '14101 S 6400 W, Herriman, UT' }
        ]},
        { date: '2026-05-30', events: [
            { title: 'Private Wedding', time: '4:30 PM - 6:30 PM', location: 'Centerville' },
            { title: 'Herriman City Rodeo', time: '5:00 PM - 10:00 PM', location: '14101 S 6400 W, Herriman, UT' }
        ]},
        // June 2026
        { date: '2026-06-01', events: [
            { title: 'Center 53', time: '11:00 AM - 2:00 PM', location: '434 W Ascension Way, Murray, UT' }
        ]},
        { date: '2026-06-02', events: [
            { title: 'Salt Lake County Sheriff/Metro Jail', time: '11:00 AM - 2:00 PM', location: '3415 S 900 W, South Salt Lake, Utah' }
        ]},
        { date: '2026-06-03', events: [
            { title: 'SoJo Station', time: '11:00 AM - 2:00 PM', location: '10377 South Jordan Gateway' }
        ]},
        { date: '2026-06-04', events: [
            { title: 'SH Golf Tournament', time: '7:00 AM - 3:00 PM', location: 'Eaglewood Golf Course - 1110 E Eaglewood Dr, North Salt Lake, UT 84054' },
            { title: 'Gallivan Center', time: '11:00 AM - 1:30 PM', location: '50 E 200 S, Salt Lake City, Utah 84111' },
            { title: 'Private graduation party', time: '5:00 PM - 8:00 PM', location: 'Park City' }
        ]},
        { date: '2026-06-08', events: [
            { title: 'Tesla', time: '11:00 AM - 2:00 PM', location: '12832 Frontrunner Blvd, Draper' }
        ]},
        { date: '2026-06-09', events: [
            { title: 'Biomerics', time: '11:00 AM - 1:30 PM', location: '6030 Harold Gatty Drive, Salt Lake City, Utah, 84116' }
        ]},
        { date: '2026-06-10', events: [
            { title: '3Form/HQ', time: '11:00 AM - 2:00 PM', location: '2300 W 2300 S, WVC' }
        ]},
        { date: '2026-06-11', events: [
            { title: 'Silver King Beverage Co.', time: '11:00 AM - 2:00 PM', location: '5454 W 150 S Poplar Grove, Salt Lake' }
        ]},
        { date: '2026-06-12', events: [
            { title: 'U of U Health Sciences', time: '11:00 AM - 2:00 PM', location: '10 North 1900 East, Salt Lake City, Utah, 84132' }
        ]},
        { date: '2026-06-13', events: [
            { title: 'Heart and Soul Event', time: '3:00 PM - 8:00 PM', location: 'Heart and Soul Event' },
            { title: 'Los Muros 2026', time: '4:00 PM - 9:00 PM', location: '7505 S Holden St, Midvale, UT' },
            { title: 'Hold for Private Wedding', time: '6:00 PM - 8:00 PM', location: 'Private Location' }
        ]},
        { date: '2026-06-16', events: [
            { title: 'Wasatch 16 Campus', time: '10:30 AM - 1:30 PM', location: '121 West Election Road, Draper, Utah, 84020' },
            { title: 'Eccles Broadcast Center', time: '11:00 AM - 2:00 PM', location: '101 S Wasatch Dr, Salt Lake City, UT' }
        ]},
        { date: '2026-06-17', events: [
            { title: 'UDC Lunch', time: '11:00 AM - 2:00 PM', location: '1480 North 8000 West, Salt Lake City, Utah, 84116' }
        ]},
        { date: '2026-06-18', events: [
            { title: 'Better Being (Day shift)', time: '10:30 AM - 1:30 PM', location: '580 West 300 North, Ogden, Utah, 84404' },
            { title: 'Better Being Swing Shift', time: '4:30 PM - 7:30 PM', location: '580 W 300 N, Ogden, Utah' }
        ]}
    ];

    // Current date tracking
    let currentDate = new Date(2026, 3, 1); // April 2026
    let selectedDay = null; // Track currently selected day

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    function getEventsForDate(dateStr) {
        const eventData = events.find(e => e.date === dateStr);
        return eventData ? eventData.events : [];
    }

    function formatDateStr(year, month, day) {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    function clearSelection() {
        if (selectedDay) {
            selectedDay.classList.remove('selected');
            selectedDay = null;
        }
        hideEventDetails();
    }

    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // Update title
        calendarTitle.textContent = `${monthNames[month]} ${year}`;

        // Get first day of month and total days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        // Clear calendar
        calendarDays.innerHTML = '';

        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day other-month';
            dayEl.textContent = day;
            calendarDays.appendChild(dayEl);
        }

        // Current month days
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            dayEl.textContent = day;

            const dateStr = formatDateStr(year, month, day);
            const dayEvents = getEventsForDate(dateStr);

            // Check if today
            if (today.getFullYear() === year && today.getMonth() === month && today.getDate() === day) {
                dayEl.classList.add('today');
            }

            // Check if has events
            if (dayEvents.length > 0) {
                dayEl.classList.add('has-event');
                if (dayEvents.length > 1) {
                    dayEl.classList.add('has-multiple');
                }

                // Add event dot indicator
                const dot = document.createElement('span');
                dot.className = 'event-dot';
                dayEl.appendChild(dot);

                // Store events data
                dayEl.dataset.events = JSON.stringify(dayEvents);
                dayEl.dataset.date = dateStr;

                // Click to select and show events
                dayEl.addEventListener('click', function(e) {
                    e.stopPropagation();

                    // If clicking the same day, deselect it
                    if (selectedDay === dayEl) {
                        clearSelection();
                        return;
                    }

                    // Clear previous selection
                    if (selectedDay) {
                        selectedDay.classList.remove('selected');
                    }

                    // Select this day
                    selectedDay = dayEl;
                    dayEl.classList.add('selected');
                    showEventDetails(e);
                });
            }

            calendarDays.appendChild(dayEl);
        }

        // Next month days
        const totalCells = firstDay + daysInMonth;
        const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
        for (let day = 1; day <= remainingCells; day++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day other-month';
            dayEl.textContent = day;
            calendarDays.appendChild(dayEl);
        }
    }

    function showEventDetails(e) {
        const dayEl = e.target.closest('.calendar-day');
        if (!dayEl || !dayEl.dataset.events) return;

        const dayEvents = JSON.parse(dayEl.dataset.events);
        const dateStr = dayEl.dataset.date;
        const date = new Date(dateStr + 'T12:00:00');
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);

        let html = `<div class="event-popup show">`;
        html += `<p style="font-weight: 600; color: #333; margin-bottom: 0.75rem;">${formattedDate}</p>`;

        dayEvents.forEach((event, index) => {
            if (index > 0) {
                html += `<div class="event-popup-divider"></div>`;
            }
            html += `
                <h4>${event.title}</h4>
                <p><i class="fas fa-clock"></i> ${event.time}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
            `;
        });

        html += `</div>`;

        eventDetailsPanel.querySelector('.event-details-content').innerHTML = html;
    }

    function hideEventDetails() {
        eventDetailsPanel.querySelector('.event-details-content').innerHTML = `
            <p class="event-details-hint"><i class="fas fa-hand-pointer"></i> Click on a highlighted date to see event details</p>
        `;
    }

    // Navigation
    prevMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        clearSelection();
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        clearSelection();
        renderCalendar();
    });

    // Click outside calendar to deselect
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.calendar-container') && !e.target.closest('.event-details-panel')) {
            clearSelection();
        }
    });

    // Populate upcoming events list (next 7 days)
    function renderUpcomingEvents() {
        const eventsListContainer = document.getElementById('events-list-items');
        if (!eventsListContainer) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const weekFromNow = new Date(today);
        weekFromNow.setDate(weekFromNow.getDate() + 7);

        const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        function getOrdinalSuffix(day) {
            if (day > 3 && day < 21) return 'th';
            switch (day % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        }

        let upcomingHtml = '';
        let eventCount = 0;

        // Sort events by date and filter to upcoming week
        const upcomingEvents = [];
        events.forEach(eventDay => {
            const eventDate = new Date(eventDay.date + 'T12:00:00');
            if (eventDate >= today && eventDate <= weekFromNow) {
                eventDay.events.forEach(evt => {
                    upcomingEvents.push({
                        date: eventDate,
                        dateStr: eventDay.date,
                        ...evt
                    });
                });
            }
        });

        // Sort by date
        upcomingEvents.sort((a, b) => a.date - b.date);

        upcomingEvents.forEach(evt => {
            const weekday = weekdayNames[evt.date.getDay()];
            const month = monthNames[evt.date.getMonth()];
            const day = evt.date.getDate();
            const ordinal = getOrdinalSuffix(day);

            upcomingHtml += `
                <div class="event-list-item">
                    <div class="event-list-date">
                        <span class="event-weekday">${weekday}</span>
                        <span class="event-day-num">${month.slice(0, 3)} ${day}${ordinal}</span>
                    </div>
                    <div class="event-list-info">
                        <h4>${evt.title}</h4>
                        <p><i class="fas fa-clock"></i> ${evt.time}</p>
                        <p><i class="fas fa-map-marker-alt"></i> ${evt.location}</p>
                    </div>
                </div>
            `;
            eventCount++;
        });

        if (eventCount === 0) {
            upcomingHtml = '<p class="no-events">No events scheduled for the next 7 days. Check the calendar for future events!</p>';
        }

        eventsListContainer.innerHTML = upcomingHtml;
    }

    // Initial render
    renderCalendar();
    renderUpcomingEvents();
}

/* ========================================
   Mexican Confetti Party!
   ======================================== */
function initConfetti() {
    const logo = document.querySelector('.nav-logo');

    if (!logo) return;

    // Mexican flag colors + festive colors
    const colors = [
        '#CE1126',  // Mexican Red
        '#006847',  // Mexican Green
        '#FFFFFF',  // White
        '#F8B334',  // Gold
        '#E84A8A',  // Pink
        '#F26522',  // Orange
        '#00CED1',  // Turquoise
    ];

    // Confetti shapes
    const shapes = ['circle', 'square', 'triangle', 'taco'];

    function createConfettiPiece() {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';

        const color = colors[Math.floor(Math.random() * colors.length)];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const size = Math.random() * 15 + 8;
        const startX = Math.random() * window.innerWidth;
        const drift = (Math.random() - 0.5) * 200;
        const rotation = Math.random() * 360;
        const duration = Math.random() * 2 + 3;

        confetti.style.cssText = `
            position: fixed;
            top: -20px;
            left: ${startX}px;
            width: ${size}px;
            height: ${size}px;
            background-color: ${color};
            z-index: 10000;
            pointer-events: none;
            animation: confettiFall ${duration}s ease-out forwards;
            --drift: ${drift}px;
            --rotation: ${rotation}deg;
        `;

        // Shape styling
        if (shape === 'circle') {
            confetti.style.borderRadius = '50%';
        } else if (shape === 'triangle') {
            confetti.style.width = '0';
            confetti.style.height = '0';
            confetti.style.backgroundColor = 'transparent';
            confetti.style.borderLeft = `${size/2}px solid transparent`;
            confetti.style.borderRight = `${size/2}px solid transparent`;
            confetti.style.borderBottom = `${size}px solid ${color}`;
        } else if (shape === 'taco') {
            confetti.innerHTML = '🌮';
            confetti.style.backgroundColor = 'transparent';
            confetti.style.fontSize = `${size + 5}px`;
            confetti.style.width = 'auto';
            confetti.style.height = 'auto';
        }

        document.body.appendChild(confetti);

        // Remove after animation
        setTimeout(() => {
            confetti.remove();
        }, duration * 1000);
    }

    function launchConfetti() {
        // Create confetti burst
        const totalPieces = 150;

        for (let i = 0; i < totalPieces; i++) {
            setTimeout(() => {
                createConfettiPiece();
            }, i * 20);
        }

        // Play a fun message
        showFiestaMessage();
    }

    function showFiestaMessage() {
        const messages = [
            "¡FIESTA TIME! 🎉",
            "¡ARRIBA! 🌮",
            "¡OLÉ! 💃",
            "TACO PARTY! 🎊",
            "¡VIVA LOS TACOS! 🌮"
        ];

        const message = messages[Math.floor(Math.random() * messages.length)];

        const popup = document.createElement('div');
        popup.className = 'fiesta-message';
        popup.textContent = message;
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            font-family: 'Fjalla One', sans-serif;
            font-size: clamp(2rem, 8vw, 5rem);
            color: #F8B334;
            text-shadow: 3px 3px 0 #CE1126, 6px 6px 0 #006847;
            z-index: 10001;
            pointer-events: none;
            animation: fiestaPopup 2s ease-out forwards;
        `;

        document.body.appendChild(popup);

        setTimeout(() => {
            popup.remove();
        }, 2000);
    }

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes confettiFall {
            0% {
                transform: translateY(0) translateX(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) translateX(var(--drift)) rotate(var(--rotation));
                opacity: 0;
            }
        }

        @keyframes fiestaPopup {
            0% {
                transform: translate(-50%, -50%) scale(0) rotate(-10deg);
                opacity: 0;
            }
            20% {
                transform: translate(-50%, -50%) scale(1.2) rotate(5deg);
                opacity: 1;
            }
            40% {
                transform: translate(-50%, -50%) scale(1) rotate(-3deg);
            }
            60% {
                transform: translate(-50%, -50%) scale(1.1) rotate(2deg);
            }
            80% {
                transform: translate(-50%, -50%) scale(1) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translate(-50%, -50%) scale(0.8) rotate(0deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Click handler
    logo.addEventListener('click', function(e) {
        e.preventDefault();
        launchConfetti();
    });

    // Add cursor hint
    logo.style.cursor = 'pointer';
    logo.title = 'Click for a fiesta! 🎉';
}

/* ========================================
   Papel Picado (Paper Banner)
   ======================================== */
function initPapelPicado() {
    const containers = document.querySelectorAll('.papel-picado');
    const colors = ['green', 'white', 'red', 'gold', 'pink', 'green', 'white', 'red'];

    containers.forEach(container => {
        const containerWidth = window.innerWidth;
        const flagWidth = 80;
        const numFlags = Math.ceil(containerWidth / flagWidth) + 2;

        for (let i = 0; i < numFlags; i++) {
            const flag = document.createElement('div');
            flag.className = `papel-picado-flag ${colors[i % colors.length]}`;
            flag.style.left = `${i * flagWidth - 40}px`;
            flag.style.animationDelay = `${(i * 0.1)}s`;
            container.appendChild(flag);
        }
    });
}

/* ========================================
   Floating Fiesta Elements
   ======================================== */
function initFloatingElements() {
    const container = document.getElementById('floating-elements');
    if (!container) return;

    const elements = ['🌮', '🌶️', '🥑', '🍋', '🎉', '💃', '🪇', '🎺'];

    function createFloatingElement() {
        const el = document.createElement('div');
        el.className = 'floating-item';
        el.textContent = elements[Math.floor(Math.random() * elements.length)];
        el.style.left = `${Math.random() * 100}%`;
        el.style.animationDuration = `${15 + Math.random() * 20}s`;
        el.style.animationDelay = `${Math.random() * 5}s`;
        el.style.fontSize = `${1.5 + Math.random() * 1.5}rem`;

        container.appendChild(el);

        // Remove after animation
        setTimeout(() => {
            el.remove();
        }, 35000);
    }

    // Create initial elements
    for (let i = 0; i < 8; i++) {
        setTimeout(createFloatingElement, i * 2000);
    }

    // Continue creating elements
    setInterval(createFloatingElement, 4000);
}

/* ========================================
   Taco Counter Widget
   ======================================== */
function initTacoCounter() {
    const counterEl = document.getElementById('taco-count');
    if (!counterEl) return;

    // Start with a base number and increment throughout the day
    const baseCount = 847;
    const now = new Date();
    const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();

    // More tacos during lunch and dinner hours
    let multiplier = 1;
    if (minutesSinceMidnight >= 660 && minutesSinceMidnight <= 840) { // 11am-2pm
        multiplier = 3;
    } else if (minutesSinceMidnight >= 1020 && minutesSinceMidnight <= 1260) { // 5pm-9pm
        multiplier = 2.5;
    }

    let currentCount = baseCount + Math.floor(minutesSinceMidnight * 0.5 * multiplier);
    counterEl.textContent = currentCount.toLocaleString();

    // Increment counter randomly
    function incrementCounter() {
        const increment = Math.floor(Math.random() * 3) + 1;
        currentCount += increment;
        counterEl.textContent = currentCount.toLocaleString();

        // Add a little bounce animation
        counterEl.style.transform = 'scale(1.2)';
        setTimeout(() => {
            counterEl.style.transform = 'scale(1)';
        }, 200);
    }

    // Random intervals between 3-8 seconds
    function scheduleIncrement() {
        const delay = 3000 + Math.random() * 5000;
        setTimeout(() => {
            incrementCounter();
            scheduleIncrement();
        }, delay);
    }

    scheduleIncrement();
}

/* ========================================
   Pinata Burst Animation
   ======================================== */
/* ========================================
   Live Aldo Tracker Map
   ======================================== */
function initAldoTracker() {
    const mapContainer = document.getElementById('aldo-map');
    if (!mapContainer) return;

    // Aldo's current/scheduled locations - update these as needed!
    const aldoLocations = [
        {
            name: "Gallivan Center",
            address: "50 E 200 S, Salt Lake City, Utah 84111",
            hours: "11:00 AM - 1:30 PM",
            lat: 40.7637,
            lng: -111.8882,
            isLive: true
        },
        {
            name: "America First Field",
            address: "9256 S State St, Sandy, UT 84070",
            hours: "1:00 PM - 6:00 PM",
            lat: 40.5829,
            lng: -111.8932,
            isLive: false
        },
        {
            name: "U of U Health Sciences",
            address: "10 North 1900 East, Salt Lake City, Utah 84132",
            hours: "11:00 AM - 2:00 PM",
            lat: 40.7705,
            lng: -111.8375,
            isLive: false
        }
    ];

    // Get current location (first one marked as live, or first in list)
    const currentLocation = aldoLocations.find(loc => loc.isLive) || aldoLocations[0];

    // Update the status display
    const locationName = document.getElementById('current-location-name');
    const locationAddress = document.getElementById('current-location-address');
    const locationHours = document.getElementById('current-location-hours');
    const statusIndicator = document.querySelector('.status-indicator');

    if (locationName) locationName.textContent = currentLocation.name;
    if (locationAddress) locationAddress.innerHTML = `<i class="fas fa-map-marker-alt"></i> <span>${currentLocation.address}</span>`;
    if (locationHours) locationHours.innerHTML = `<i class="fas fa-clock"></i> <span>${currentLocation.hours}</span>`;

    // Check if currently open based on time
    const now = new Date();
    const currentHour = now.getHours();
    const isOpen = currentHour >= 11 && currentHour < 20; // Assume open 11am-8pm

    if (!isOpen && statusIndicator) {
        statusIndicator.classList.add('offline');
        statusIndicator.querySelector('.status-text').textContent = "ALDO IS RESTING";
    }

    // Initialize the map
    const map = L.map('aldo-map', {
        scrollWheelZoom: false
    }).setView([currentLocation.lat, currentLocation.lng], 14);

    // Add tile layer (using a stylish dark theme)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    // Create custom taco marker icon
    const tacoIcon = L.divIcon({
        className: 'aldo-marker',
        html: `
            <div class="aldo-marker-inner">
                <div class="aldo-marker-pin"></div>
                <div class="aldo-marker-pulse"></div>
            </div>
        `,
        iconSize: [50, 60],
        iconAnchor: [25, 60],
        popupAnchor: [0, -60]
    });

    // Add marker for current location
    const marker = L.marker([currentLocation.lat, currentLocation.lng], {
        icon: tacoIcon
    }).addTo(map);

    // Create festive popup
    const popupContent = `
        <div style="text-align: center; padding: 10px; min-width: 200px;">
            <h3 style="font-family: 'Fjalla One', sans-serif; color: #CE1126; margin: 0 0 8px 0; font-size: 1.1rem;">
                🌮 ALDO IS HERE! 🌮
            </h3>
            <p style="margin: 0 0 5px 0; font-weight: 600;">${currentLocation.name}</p>
            <p style="margin: 0 0 5px 0; font-size: 0.85rem; color: #666;">${currentLocation.address}</p>
            <p style="margin: 0 0 10px 0; font-size: 0.85rem; color: #006847;">
                <strong>${currentLocation.hours}</strong>
            </p>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${currentLocation.lat},${currentLocation.lng}"
               target="_blank"
               rel="noopener noreferrer"
               style="display: inline-block; background: #CE1126; color: white; padding: 8px 16px; border-radius: 20px; text-decoration: none; font-family: 'Fjalla One', sans-serif; font-size: 0.85rem;">
                GET DIRECTIONS 🚗
            </a>
        </div>
    `;

    marker.bindPopup(popupContent, {
        maxWidth: 300
    });

    // Open popup by default
    marker.openPopup();

    // Add other locations as smaller markers
    aldoLocations.forEach(location => {
        if (location !== currentLocation) {
            const smallIcon = L.divIcon({
                className: 'aldo-marker-small',
                html: `<div style="
                    width: 20px;
                    height: 20px;
                    background: #F8B334;
                    border: 2px solid #fff;
                    border-radius: 50%;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 10px;
                ">📍</div>`,
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });

            L.marker([location.lat, location.lng], { icon: smallIcon })
                .addTo(map)
                .bindPopup(`
                    <div style="text-align: center; padding: 5px;">
                        <strong>${location.name}</strong><br>
                        <small>${location.hours}</small>
                    </div>
                `);
        }
    });
}

function initPinataBurst() {
    const triggerElements = document.querySelectorAll('.btn-primary, .about-card, .gallery-item');
    const candies = ['🍬', '🍭', '🎊', '⭐', '🌟', '💫', '🍫', '🎁'];

    triggerElements.forEach(el => {
        el.addEventListener('click', function(e) {
            // Only trigger sometimes (30% chance)
            if (Math.random() > 0.3) return;

            const rect = el.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            // Create candy burst
            for (let i = 0; i < 12; i++) {
                const candy = document.createElement('div');
                candy.className = 'pinata-candy';
                candy.textContent = candies[Math.floor(Math.random() * candies.length)];
                candy.style.left = `${x}px`;
                candy.style.top = `${y}px`;
                candy.style.fontSize = `${1 + Math.random() * 1.5}rem`;

                // Random direction
                const angle = (i / 12) * Math.PI * 2;
                const velocity = 50 + Math.random() * 100;
                const tx = Math.cos(angle) * velocity;
                const ty = Math.sin(angle) * velocity;

                candy.style.setProperty('--tx', `${tx}px`);
                candy.style.setProperty('--ty', `${ty}px`);

                document.body.appendChild(candy);

                // Animate
                candy.animate([
                    { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                    { transform: `translate(${tx}px, ${ty + 200}px) scale(0.5) rotate(720deg)`, opacity: 0 }
                ], {
                    duration: 1500,
                    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                });

                setTimeout(() => candy.remove(), 1500);
            }
        });
    });
}
