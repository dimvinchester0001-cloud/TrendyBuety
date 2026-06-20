/* ============================================
   TRENDY BEAUTY SALON — PREMIUM ROSE GOLD
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ========== ЭЛЕМЕНТЫ ==========
  const header = document.getElementById('header');
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const scrollTopBtn = document.getElementById('scrollTop');
  const leadForm = document.getElementById('leadForm');
  const langToggle = document.getElementById('langToggle');
  const faqItems = document.querySelectorAll('.faq__item');

  // ========== BURGER MENU (МОБИЛЬНОЕ МЕНЮ) ==========
  if (burger && nav) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      nav.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });

    // Закрытие меню при клике на ссылку
    const navLinks = nav.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('active');
        nav.classList.remove('active');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  // ========== ИЗМЕНЕНИЕ ШАПКИ ПРИ СКРОЛЛЕ ==========
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Тень на шапке
    if (header) {
      if (scrollY > 50) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    }

    // Кнопка "Наверх"
    if (scrollTopBtn) {
      if (scrollY > 700) {
        scrollTopBtn.classList.add('scroll-top--visible');
      } else {
        scrollTopBtn.classList.remove('scroll-top--visible');
      }
    }
  });

  // ========== КНОПКА "НАВЕРХ" ==========
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ========== FAQ (АККОРДЕОН) ==========
  faqItems.forEach(item => {
    const question = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');
    const icon = item.querySelector('.faq__icon');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('faq__item--open');

      // Закрываем все
      faqItems.forEach(el => {
        el.classList.remove('faq__item--open');
        const elIcon = el.querySelector('.faq__icon');
        if (elIcon) {
          elIcon.classList.remove('fa-rotate');
        }
      });

      // Открываем текущий (если был закрыт)
      if (!isOpen) {
        item.classList.add('faq__item--open');
        if (icon) {
          icon.classList.add('fa-rotate');
        }
      }
    });
  });

  // ========== ОТПРАВКА ФОРМЫ ==========
  if (leadForm) {
    leadForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Простая валидация телефона (Кыргызстан)
      const phoneInput = this.querySelector('input[type="tel"]');
      const phoneValue = phoneInput.value.replace(/\D/g, '');

      if (phoneValue.length < 9) {
        showNotification('Пожалуйста, введите корректный номер телефона', 'error');
        phoneInput.focus();
        return;
      }

      // Имитация отправки
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';

      setTimeout(() => {
        // Успех
        showNotification('Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.', 'success');
        this.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        // Здесь можно добавить реальную отправку через fetch/axios на сервер
        // fetch('/api/leads', { method: 'POST', body: new FormData(this) });
      }, 1500);
    });
  }
  // ========== ПЕРЕКЛЮЧЕНИЕ ЯЗЫКА (ДЕМО) ==========
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const spans = langToggle.querySelectorAll('span');
      if (spans.length >= 2) {
        // Меняем местами активный язык
        const temp = spans[0].textContent;
        spans[0].textContent = spans[1].textContent;
        spans[1].textContent = temp;

        // Визуальное выделение
        spans[0].style.fontWeight = '700';
        spans[1].style.fontWeight = '400';
      }

      showNotification('Тил алмаштырылды / Язык переключён (демо)', 'info');
    });
  }

  // ========== ПЛАВНЫЙ СКРОЛЛ ДЛЯ ЯКОРНЫХ ССЫЛОК (фолбэк) ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ========== УВЕДОМЛЕНИЯ (TOAST) ==========
  function showNotification(message, type = 'info') {
    // Удаляем старое уведомление, если есть
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = toast toast--${type};
    toast.innerHTML = 
      <span>${message}</span>
      <button class="toast__close">&times;</button>;

    document.body.appendChild(toast);

    // Анимация появления
    setTimeout(() => {
      toast.classList.add('toast--show');
    }, 10);

    // Закрытие по кнопке
    const closeBtn = toast.querySelector('.toast__close');
    closeBtn.addEventListener('click', () => {
      hideToast(toast);
    });

    // Авто-скрытие через 4 секунды
    setTimeout(() => {
      hideToast(toast);
    }, 4000);
  }

  function hideToast(toast) {
    toast.classList.remove('toast--show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 300);
  }

  // ========== АНИМАЦИЯ ПОЯВЛЕНИЯ ЭЛЕМЕНТОВ ПРИ СКРОЛЛЕ ==========
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate--visible');
        observer.unobserve(entry.target); // Анимируем только один раз
      }
    });
  }, observerOptions);

  // Элементы, которые будем анимировать
  const animatableElements = document.querySelectorAll(
    '.service-card, .why-card, .review-card, .galleryitem, .faqitem, .aboutimage-wrapper, .abouttext'
  );

  animatableElements.forEach(el => {
    el.classList.add('animate--hidden');
    observer.observe(el);
  });

  console.log('✨ Trendy Beauty Salon — скрипты загружены и готовы к работе.');
});