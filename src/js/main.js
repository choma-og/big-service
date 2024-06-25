import Swiper, { Navigation, Pagination, EffectFade, Autoplay, FreeMode } from 'swiper';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/swiper-bundle.css';
import '@/styles/style.scss';
import axios from 'axios';
import IMask from 'imask';
import { data } from 'browserslist';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/owl.carousel.min.js';
import 'animate.css';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from 'lenis'

const lenis = new Lenis()

lenis.on('scroll', (e) => {
  console.log(e)
})

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time)=>{
  lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)

gsap.registerPlugin(ScrollTrigger);

function initTricksWords() {
  var spanWord = document.getElementsByClassName('span-lines');
  for (var i = 0; i < spanWord.length; i++) {
    var wordWrap = spanWord.item(i);
    wordWrap.innerHTML = wordWrap.innerHTML.replace(
      /(^|<\/?[^>]+>|\s+)([^\s<]+)/g,
      '$1<span class="span-line"><span class="span-line-inner">$2</span></span>',
    );
  }
}

function initTricksWordsSolo() {
  var spanWord = document.getElementsByClassName('line-animate');
  for (var i = 0; i < spanWord.length; i++) {
    var wordWrap = spanWord.item(i);
    wordWrap.innerHTML = wordWrap.innerHTML.replace(
      /(^|<\/?[^>]+>|\s+)([^\s<]+)/g,
      '$1<span class="line"><span class="line-inner">$2</span></span>',
    );
  }
}

initTricksWords();
initTricksWordsSolo();

const tl = gsap.timeline({ paused: true });

const animateOpenNav = () => {
  tl.fromTo(
    "#js-modal-menu",
    { autoAlpha: 0 },
    {
      duration: 0.1,
      autoAlpha: 1,
      delay: 0,
    }
  );
};

const openNav = () => {
  animateOpenNav();
  const navBtn = document.getElementById("menu-toggle-btn");
  const headerMenu = document.getElementById("header__menu");
  const headerTel = document.getElementById("header__tel");
  const header = document.querySelector(".header");
  navBtn.addEventListener("click", function (e) {
    document.body.classList.toggle("_lock"); 
    navBtn.classList.toggle("active");
    headerMenu.classList.toggle("active");
    headerTel.classList.toggle("active");
    header.classList.toggle("active")
    toggleMenuText();
    if (navBtn.classList.contains("active")) {
      tl.play();
    } else {
      tl.reverse();
    }
  });

  function toggleMenuText() {
    var menuText = navBtn.querySelector("span");

    if (menuText.textContent === "Меню") {
      menuText.textContent = "Закрыть";
    } else {
      menuText.textContent = "Меню";
    }
  }
};

openNav();

function relocateButtons() {
  const width = window.innerWidth;
  const serviceItems = document.querySelectorAll('.service__item');
  
  serviceItems.forEach(serviceItem => {
    const btnMain = serviceItem.querySelector('.btn-main');

    // Проверка на существование кнопки
    if (!btnMain) {
      console.error("Кнопка btn-main не найдена.");
      return;
    }

    if (width <= 1030) {
      serviceItem.appendChild(btnMain);
    } else {
      const serviceBox = serviceItem.querySelector('.service__box');
      if (serviceBox && !serviceBox.contains(btnMain)) {
        serviceBox.appendChild(btnMain);
      }
    }
  });
}

// Выполнить проверку при загрузке страницы
window.addEventListener('DOMContentLoaded', relocateButtons);

// Выполнить проверку при изменении размера окна
window.addEventListener('resize', relocateButtons);

new Swiper('.shorts__swiper', {
  loop: false,
  centeredSlides: false,
  modules: [Navigation, Pagination],
  navigation: {
    nextEl: '.about-next',
    prevEl: '.about-prev',
  },
  breakpoints: {
    1: {
      slidesPerView: 1.2,
      centeredSlides: false,
      spaceBetween: 10,
    },
    720: {
      slidesPerView: 2,
      spaceBetween: 10,
    },
    968: {
      slidesPerView: 2,
      centeredSlides: false,
      spaceBetween: 30,
    },
    1150: {
      slidesPerView: 4,
      spaceBetween: 30,
      centeredSlides: false,
    },
  },
});








// Получаем все слайды Swiper
const shorts = document.querySelectorAll('.shorts-slide');

// Переменная для отслеживания текущего активного видео
let currentVideo = null;
let currentPlayButton = null; // Добавляем переменную для текущей кнопки воспроизведения

// Перебираем каждый слайд
shorts.forEach(function(slide) {
  // Находим элементы в текущем слайде
  const videoblock = slide.querySelector('.shorts-block__video');
  const video = slide.querySelector('.shorts-block-video');
  const playButton = slide.querySelector('.shorts-block__btn');

  // Добавляем обработчик события клика на кнопку воспроизведения
  playButton.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation(); // Остановить распространение события, чтобы не сработал клик на .shorts-block__video

    toggleVideoPlayback(video, playButton);
  });

  // Добавляем обработчик события клика на область видео
  videoblock.addEventListener('click', function(e) {
    e.preventDefault();

    toggleVideoPlayback(video, playButton);
  });

  // Добавляем обработчик события изменения полноэкранного режима для видео
  video.addEventListener('fullscreenchange', function() {
    if (isVideoInFullscreen(video)) {
      video.classList.add('active'); // Добавляем класс active при переходе в полноэкранный режим
      video.classList.add('top-layer'); // Добавляем класс top-layer при переходе в полноэкранный режим
    } else {
      video.classList.remove('active'); // Убираем класс active при выходе из полноэкранного режима
      video.classList.remove('top-layer'); // Убираем класс top-layer при выходе из полноэкранного режима
    }
  });

  // Функция для проверки, находится ли видео в полноэкранном режиме
  function isVideoInFullscreen(videoElement) {
    return (
      document.fullscreenElement === videoElement ||
      document.webkitFullscreenElement === videoElement ||
      document.mozFullScreenElement === videoElement
    );
  }

  // Функция для включения/выключения воспроизведения видео
  function toggleVideoPlayback(video, playButton) {
    if (currentVideo && currentVideo !== video) {
      currentVideo.pause();
      currentVideo.controls = false;
      currentVideo.classList.remove('active'); // Убираем класс active у предыдущего видео
      currentVideo.classList.remove('top-layer'); // Убираем класс top-layer у предыдущего видео
      if (currentPlayButton) {
        currentPlayButton.classList.remove('active');
      }
    }

    currentVideo = video;
    currentPlayButton = playButton; // Устанавливаем текущую кнопку воспроизведения

    if (video.paused) {
      video.play();
      video.controls = true;
      if (!isVideoInFullscreen(video)) {
        video.classList.add('active'); // Добавляем класс active при включении видео, если не в полноэкранном режиме
        video.classList.remove('top-layer'); // Убираем класс top-layer при включении видео, если не в полноэкранном режиме
      } else {
        video.classList.add('top-layer'); // Добавляем класс top-layer при включении видео в полноэкранном режиме
      }
      playButton.classList.add('active');
    } else {
      video.pause();
      if (!isVideoInFullscreen(video)) {
        video.classList.remove('active'); // Убираем класс active при паузе видео, если не в полноэкранном режиме
        video.classList.remove('top-layer'); // Убираем класс top-layer при паузе видео, если не в полноэкранном режиме
      }
      playButton.classList.remove('active');
    }
  }
});








/*=============== CLIENTS SLIDER ===============*/
var clientsSwiper = new Swiper(".clients-swiper", {
  slidesPerView: 5,
  spaceBetween: 5,
  loopedSlides: 12,
  loop: true,
  modules: [Autoplay, FreeMode],
  speed: 8000,
  freeMode: {
    enabled: false,
    momentumBounce: true,
    freeModeMomentumRatio: 1222,
  },
  autoplay: {
      delay: 0,
      disableOnInteraction: false,
  },
  });
  const screenWidthX = window.innerWidth;

//   TITLE ANIMATE SPAN LINES
// Создаём новый экземпляр IntersectionObserver
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    // Если элемент в видимой области
    if (entry.isIntersecting) {
      // Создаём анимацию с GSAP для текущего элемента
      gsap.to(entry.target, {
        y: '-2%',
        duration: 0.45,
        // ease: "power1.in",
      });
      // Отключаем наблюдение для этого элемента
      observer.unobserve(entry.target);
    }
  });
});

// Получаем все элементы с классом .span-line-inner
const targetElements = document.querySelectorAll('.span-line-inner');

// // Наблюдаем за каждым из них
targetElements.forEach((targetElement) => {
  observer.observe(targetElement);
});

function observeElements(elements, delay) {
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        gsap.from(entry.target, {
          y: '2em',
          opacity: 0,
          duration: 0.5,
          delay: delay,
        });
        observer.unobserve(entry.target);
      }
    });
  });

  elements.forEach((targetElement) => {
    observer.observe(targetElement);
  });
}

const targetElementsDownUpAnima = document.querySelectorAll('.anima');
observeElements(targetElementsDownUpAnima, 0.2);

const targetElementsDownUpAnima03 = document.querySelectorAll('.anima-03');
observeElements(targetElementsDownUpAnima03, 0.3);

const targetElementsDownUpAnima04 = document.querySelectorAll('.anima-04');
observeElements(targetElementsDownUpAnima04, 0.4);

const targetElementsDownUpAnima05 = document.querySelectorAll('.anima-05');
observeElements(targetElementsDownUpAnima05, 0.5);

// // TEST LINE ANIMA
const observerLineAnima = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    // Если элемент в видимой области
    if (entry.isIntersecting) {
      // Создаём анимацию с GSAP для текущего элемента
      entry.target.style.setProperty('--width', '100%');
      // Отключаем наблюдение для этого элемента
      observer.unobserve(entry.target);
    }
  });
});

// // Получаем все элементы с классом .span-line-inner
const targetElementsLineAnima = document.querySelectorAll('.animaLine');
targetElementsLineAnima.forEach((targetElement) => {
  observerLineAnima.observe(targetElement);
});

const targetElementsLineTest = document.querySelectorAll('.section-line');
targetElementsLineTest.forEach((targetElement) => {
  observerLineAnima.observe(targetElement);
});
const targetElementsLineFooter = document.querySelectorAll('.footer-line');
targetElementsLineFooter.forEach((targetElement) => {
  observerLineAnima.observe(targetElement);
});

gsap.utils.toArray('.image-parallax').forEach((container) => {
  const img = container.querySelector('img');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      scrub: true,
      pin: false,
    },
  });

  tl.fromTo(
    img,
    {
      yPercent: -15,
      ease: 'none',
    },
    {
      yPercent: 15,
      ease: 'none',
    },
  );
});

gsap.utils.toArray('.about-parallax').forEach((container) => {
  const img = container.querySelector('img');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      scrub: true,
      pin: false,
    },
  });

  tl.fromTo(
    img,
    {
      yPercent: -10,
      ease: 'none',
    },
    {
      yPercent: 40,
      ease: 'none',
    },
  );
});
gsap.utils.toArray('.equipment-parallax').forEach((container) => {
  const img = container.querySelector('img');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      scrub: true,
      pin: false,
    },
  });

  tl.fromTo(
    img,
    {
      yPercent: -10,
      ease: 'none',
    },
    {
      yPercent: 15,
      ease: 'none',
    },
  );
});

// MODAL MAIN
const modalMainBody = document.querySelector('.modal-main__body');
const modalMainButtons = document.querySelectorAll('.js-open-modal-main');
const modalMainContent = document.querySelector('.modal-main__content');
const modalMainClose = document.querySelector('.modal-main__close');
const errorBlock = document.querySelectorAll('.js-error');
if (modalMainButtons) {
  modalMainButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      document.body.classList.add('_lock');
      modalMainBody.classList.add('_active');
      modalMainContent.classList.add('_active');
    });
  });
}
if (modalMainClose) {
  console.log(errorBlock);
  modalMainClose.addEventListener('click', (e) => {
    document.body.classList.remove('_lock');
    modalMainBody.classList.remove('_active');
    modalMainContent.classList.remove('_active');
    errorBlock.forEach((item) => {
      item.classList.remove('_active');
    });
  });
}


// SUCCES
const sucesBody = document.querySelector('.suces__body');
const sucesContent = document.querySelector('.suces__content');
const sucesClose = document.querySelector('.suces__close');

function sucesOpen() {
  sucesBody.classList.add('_active');
  sucesContent.classList.add('_active');
  document.body.classList.add('_lock');
}

function sucesCloseHandler() {
  sucesBody.classList.remove("_active");
  sucesContent.classList.remove('_active');
  document.body.classList.remove('_lock');
}

// Close sucesContent when sucesClose is clicked
if (sucesClose) {
  sucesClose.addEventListener("click", sucesCloseHandler);
}

// Close sucesContent when clicked outside sucesBody
document.addEventListener("click", function (e) {
  const isClickInsideSuces = sucesContent.contains(e.target) || e.target === sucesClose;
  
  if (!isClickInsideSuces) {
    sucesCloseHandler();
  }
});

/*=============== INPUT MASK ===============*/
// Найти все элементы с атрибутом data-mask="phone"
let phones = document.querySelectorAll('[data-mask="phone"]');

// Применить маску к каждому найденному элементу
phones.forEach(function(element) {
  new IMask(element, {
    mask: '+{7}(000)000-00-00'
  });
});


/*=============== AXIOS ===============*/
function validatePhone(phone)  {
  const cleanedPhone = phone.replace(/\D/g, "");
  console.log(new String(cleanedPhone).length)
  console.log(cleanedPhone.length === 11, "partial")

  if(cleanedPhone.length === 11) {
    return true; 
  } else {
    return false;
  }
}
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateText(text)  {
  const trimmedText = text.trim();

    if (trimmedText.length >= 2) {
    return true;
  } else {
    return false;
  }
}
const validate = (input) => {
  const dataType = input.getAttribute("data-type");
  let res = true;

  switch(dataType) {
      case "phone": 
      res = validatePhone(input.value)
      break;
      case "text": 
      res = validateText(input.value)
      break;
      case "email":
      res = validateEmail(input.value);
      break;
  }
  console.log(input, res, dataType)
  return res;
}

let forms = document.querySelectorAll('.js-form');
console.log(forms)
forms.forEach((form) => {
  let formButton = form.querySelector(".js-form-submit");
	console.log(formButton)
	if(formButton) {
		formButton.addEventListener("click", (e) => {
		e.preventDefault();
		formButton.disabled = true;
		const inputs = form.querySelectorAll("input, textarea");
		const method = form.method;
		const action = form.action;
		let isValidated = true;
		let formData = [];

		inputs.forEach(input => {
      formData.push({
        name: input.name,
        value: input.value,
        isValidate: validate(input),
      })  
  })

	formData.forEach(item => {
    const input = form.querySelector(`[name="${item.name}"]`);
    const wrapper = input.parentNode;
    const errorBlock = wrapper.querySelector('.js-error');

    if(!item.isValidate) {
        isValidated = false;
        errorBlock.classList.add("_active")
        wrapper.classList.add("_active")
    } else {
        errorBlock.classList.remove("_active");
        wrapper.classList.remove("_active")
    }
  })

	if(!isValidated) {
    formButton.disabled = false;
    return false;
  }

	axios({
		method,
		url: action,
		data: formData,
}).then((response) => {
  sucesOpen();
		console.log("success");
		formButton.disabled = false;
      // Очистка полей ввода
      document.body.classList.remove('_lock');
      modalMainBody.classList.remove('_active');
      modalMainContent.classList.remove('_active');
      errorBlock.forEach((item) => {
        item.classList.remove('_active');
      });
    inputs.forEach(input => {
      input.value = "";
    });
}).catch((error) => {
		console.error(error);
    sucesOpen();
    document.body.classList.remove('_lock');
    modalMainBody.classList.remove('_active');
    modalMainContent.classList.remove('_active');
    errorBlock.forEach((item) => {
      item.classList.remove('_active');
    });
		formButton.disabled = false;
    inputs.forEach(input => {
      input.value = "";
    });
	});
})
	}
})

// ПРОКРУТКА
const menuLinks = document.querySelectorAll('[data-goto]');
if(menuLinks.length > 0) {
  menuLinks.forEach(menuLink => {
    menuLink.addEventListener("click", onMenuLinkClick)
   
  });

  function onMenuLinkClick (e) {
    const menuLink = e.target;
    if(menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
      const gotoBlock = document.querySelector(menuLink.dataset.goto);
      console.log(gotoBlock)
      const gotoBlockValue = gotoBlock.getBoundingClientRect().top + window.scrollY ;
      console.log(gotoBlockValue)
      window.scrollTo({
        top:gotoBlockValue,
        behavior: "smooth"
      });
      e.preventDefault(e)
    }
  }
}
