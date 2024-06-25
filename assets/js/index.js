import { L as Lenis, S as ScrollTrigger, g as gsapWithCSS, a as Swiper, N as Navigation, P as Pagination, A as Autoplay, f as freeMode, I as IMask, b as axios } from "./vendor.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const style = "";
const lenis = new Lenis();
lenis.on("scroll", (e) => {
  console.log(e);
});
lenis.on("scroll", ScrollTrigger.update);
gsapWithCSS.ticker.add((time) => {
  lenis.raf(time * 1e3);
});
gsapWithCSS.ticker.lagSmoothing(0);
gsapWithCSS.registerPlugin(ScrollTrigger);
function initTricksWords() {
  var spanWord = document.getElementsByClassName("span-lines");
  for (var i = 0; i < spanWord.length; i++) {
    var wordWrap = spanWord.item(i);
    wordWrap.innerHTML = wordWrap.innerHTML.replace(
      /(^|<\/?[^>]+>|\s+)([^\s<]+)/g,
      '$1<span class="span-line"><span class="span-line-inner">$2</span></span>'
    );
  }
}
function initTricksWordsSolo() {
  var spanWord = document.getElementsByClassName("line-animate");
  for (var i = 0; i < spanWord.length; i++) {
    var wordWrap = spanWord.item(i);
    wordWrap.innerHTML = wordWrap.innerHTML.replace(
      /(^|<\/?[^>]+>|\s+)([^\s<]+)/g,
      '$1<span class="line"><span class="line-inner">$2</span></span>'
    );
  }
}
initTricksWords();
initTricksWordsSolo();
const tl = gsapWithCSS.timeline({ paused: true });
const animateOpenNav = () => {
  tl.fromTo(
    "#js-modal-menu",
    { autoAlpha: 0 },
    {
      duration: 0.1,
      autoAlpha: 1,
      delay: 0
    }
  );
};
const openNav = () => {
  animateOpenNav();
  const navBtn = document.getElementById("menu-toggle-btn");
  const headerMenu = document.getElementById("header__menu");
  const headerTel = document.getElementById("header__tel");
  const header = document.querySelector(".header");
  navBtn.addEventListener("click", function(e) {
    document.body.classList.toggle("_lock");
    navBtn.classList.toggle("active");
    headerMenu.classList.toggle("active");
    headerTel.classList.toggle("active");
    header.classList.toggle("active");
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
  const serviceItems = document.querySelectorAll(".service__item");
  serviceItems.forEach((serviceItem) => {
    const btnMain = serviceItem.querySelector(".btn-main");
    if (!btnMain) {
      console.error("Кнопка btn-main не найдена.");
      return;
    }
    if (width <= 1030) {
      serviceItem.appendChild(btnMain);
    } else {
      const serviceBox = serviceItem.querySelector(".service__box");
      if (serviceBox && !serviceBox.contains(btnMain)) {
        serviceBox.appendChild(btnMain);
      }
    }
  });
}
window.addEventListener("DOMContentLoaded", relocateButtons);
window.addEventListener("resize", relocateButtons);
new Swiper(".shorts__swiper", {
  loop: false,
  centeredSlides: false,
  modules: [Navigation, Pagination],
  navigation: {
    nextEl: ".about-next",
    prevEl: ".about-prev"
  },
  breakpoints: {
    1: {
      slidesPerView: 1.2,
      centeredSlides: false,
      spaceBetween: 10
    },
    720: {
      slidesPerView: 2,
      spaceBetween: 10
    },
    968: {
      slidesPerView: 2,
      centeredSlides: false,
      spaceBetween: 30
    },
    1150: {
      slidesPerView: 4,
      spaceBetween: 30,
      centeredSlides: false
    }
  }
});
const shorts = document.querySelectorAll(".shorts-slide");
let currentVideo = null;
let currentPlayButton = null;
shorts.forEach(function(slide) {
  const videoblock = slide.querySelector(".shorts-block__video");
  const video = slide.querySelector(".shorts-block-video");
  const playButton = slide.querySelector(".shorts-block__btn");
  playButton.addEventListener("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleVideoPlayback(video, playButton);
  });
  videoblock.addEventListener("click", function(e) {
    e.preventDefault();
    toggleVideoPlayback(video, playButton);
  });
  video.addEventListener("fullscreenchange", function() {
    if (isVideoInFullscreen(video)) {
      video.classList.add("active");
      video.classList.add("top-layer");
    } else {
      video.classList.remove("active");
      video.classList.remove("top-layer");
    }
  });
  function isVideoInFullscreen(videoElement) {
    return document.fullscreenElement === videoElement || document.webkitFullscreenElement === videoElement || document.mozFullScreenElement === videoElement;
  }
  function toggleVideoPlayback(video2, playButton2) {
    if (currentVideo && currentVideo !== video2) {
      currentVideo.pause();
      currentVideo.controls = false;
      currentVideo.classList.remove("active");
      currentVideo.classList.remove("top-layer");
      if (currentPlayButton) {
        currentPlayButton.classList.remove("active");
      }
    }
    currentVideo = video2;
    currentPlayButton = playButton2;
    if (video2.paused) {
      video2.play();
      video2.controls = true;
      if (!isVideoInFullscreen(video2)) {
        video2.classList.add("active");
        video2.classList.remove("top-layer");
      } else {
        video2.classList.add("top-layer");
      }
      playButton2.classList.add("active");
    } else {
      video2.pause();
      if (!isVideoInFullscreen(video2)) {
        video2.classList.remove("active");
        video2.classList.remove("top-layer");
      }
      playButton2.classList.remove("active");
    }
  }
});
new Swiper(".clients-swiper", {
  slidesPerView: 5,
  spaceBetween: 5,
  loopedSlides: 12,
  loop: true,
  modules: [Autoplay, freeMode],
  speed: 8e3,
  freeMode: {
    enabled: false,
    momentumBounce: true,
    freeModeMomentumRatio: 1222
  },
  autoplay: {
    delay: 0,
    disableOnInteraction: false
  }
});
const observer = new IntersectionObserver((entries, observer2) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      gsapWithCSS.to(entry.target, {
        y: "-2%",
        duration: 0.45
        // ease: "power1.in",
      });
      observer2.unobserve(entry.target);
    }
  });
});
const targetElements = document.querySelectorAll(".span-line-inner");
targetElements.forEach((targetElement) => {
  observer.observe(targetElement);
});
function observeElements(elements, delay) {
  const observer2 = new IntersectionObserver((entries, observer3) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        gsapWithCSS.from(entry.target, {
          y: "2em",
          opacity: 0,
          duration: 0.5,
          delay
        });
        observer3.unobserve(entry.target);
      }
    });
  });
  elements.forEach((targetElement) => {
    observer2.observe(targetElement);
  });
}
const targetElementsDownUpAnima = document.querySelectorAll(".anima");
observeElements(targetElementsDownUpAnima, 0.2);
const targetElementsDownUpAnima03 = document.querySelectorAll(".anima-03");
observeElements(targetElementsDownUpAnima03, 0.3);
const targetElementsDownUpAnima04 = document.querySelectorAll(".anima-04");
observeElements(targetElementsDownUpAnima04, 0.4);
const targetElementsDownUpAnima05 = document.querySelectorAll(".anima-05");
observeElements(targetElementsDownUpAnima05, 0.5);
const observerLineAnima = new IntersectionObserver((entries, observer2) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.setProperty("--width", "100%");
      observer2.unobserve(entry.target);
    }
  });
});
const targetElementsLineAnima = document.querySelectorAll(".animaLine");
targetElementsLineAnima.forEach((targetElement) => {
  observerLineAnima.observe(targetElement);
});
const targetElementsLineTest = document.querySelectorAll(".section-line");
targetElementsLineTest.forEach((targetElement) => {
  observerLineAnima.observe(targetElement);
});
const targetElementsLineFooter = document.querySelectorAll(".footer-line");
targetElementsLineFooter.forEach((targetElement) => {
  observerLineAnima.observe(targetElement);
});
gsapWithCSS.utils.toArray(".image-parallax").forEach((container) => {
  const img = container.querySelector("img");
  const tl2 = gsapWithCSS.timeline({
    scrollTrigger: {
      trigger: container,
      scrub: true,
      pin: false
    }
  });
  tl2.fromTo(
    img,
    {
      yPercent: -15,
      ease: "none"
    },
    {
      yPercent: 15,
      ease: "none"
    }
  );
});
gsapWithCSS.utils.toArray(".about-parallax").forEach((container) => {
  const img = container.querySelector("img");
  const tl2 = gsapWithCSS.timeline({
    scrollTrigger: {
      trigger: container,
      scrub: true,
      pin: false
    }
  });
  tl2.fromTo(
    img,
    {
      yPercent: -10,
      ease: "none"
    },
    {
      yPercent: 40,
      ease: "none"
    }
  );
});
gsapWithCSS.utils.toArray(".equipment-parallax").forEach((container) => {
  const img = container.querySelector("img");
  const tl2 = gsapWithCSS.timeline({
    scrollTrigger: {
      trigger: container,
      scrub: true,
      pin: false
    }
  });
  tl2.fromTo(
    img,
    {
      yPercent: -10,
      ease: "none"
    },
    {
      yPercent: 15,
      ease: "none"
    }
  );
});
const modalMainBody = document.querySelector(".modal-main__body");
const modalMainButtons = document.querySelectorAll(".js-open-modal-main");
const modalMainContent = document.querySelector(".modal-main__content");
const modalMainClose = document.querySelector(".modal-main__close");
const errorBlock = document.querySelectorAll(".js-error");
if (modalMainButtons) {
  modalMainButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      document.body.classList.add("_lock");
      modalMainBody.classList.add("_active");
      modalMainContent.classList.add("_active");
    });
  });
}
if (modalMainClose) {
  console.log(errorBlock);
  modalMainClose.addEventListener("click", (e) => {
    document.body.classList.remove("_lock");
    modalMainBody.classList.remove("_active");
    modalMainContent.classList.remove("_active");
    errorBlock.forEach((item) => {
      item.classList.remove("_active");
    });
  });
}
const sucesBody = document.querySelector(".suces__body");
const sucesContent = document.querySelector(".suces__content");
const sucesClose = document.querySelector(".suces__close");
function sucesOpen() {
  sucesBody.classList.add("_active");
  sucesContent.classList.add("_active");
  document.body.classList.add("_lock");
}
function sucesCloseHandler() {
  sucesBody.classList.remove("_active");
  sucesContent.classList.remove("_active");
  document.body.classList.remove("_lock");
}
if (sucesClose) {
  sucesClose.addEventListener("click", sucesCloseHandler);
}
document.addEventListener("click", function(e) {
  const isClickInsideSuces = sucesContent.contains(e.target) || e.target === sucesClose;
  if (!isClickInsideSuces) {
    sucesCloseHandler();
  }
});
let phones = document.querySelectorAll('[data-mask="phone"]');
phones.forEach(function(element) {
  new IMask(element, {
    mask: "+{7}(000)000-00-00"
  });
});
function validatePhone(phone) {
  const cleanedPhone = phone.replace(/\D/g, "");
  console.log(new String(cleanedPhone).length);
  console.log(cleanedPhone.length === 11, "partial");
  if (cleanedPhone.length === 11) {
    return true;
  } else {
    return false;
  }
}
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
function validateText(text) {
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
  switch (dataType) {
    case "phone":
      res = validatePhone(input.value);
      break;
    case "text":
      res = validateText(input.value);
      break;
    case "email":
      res = validateEmail(input.value);
      break;
  }
  console.log(input, res, dataType);
  return res;
};
let forms = document.querySelectorAll(".js-form");
console.log(forms);
forms.forEach((form) => {
  let formButton = form.querySelector(".js-form-submit");
  console.log(formButton);
  if (formButton) {
    formButton.addEventListener("click", (e) => {
      e.preventDefault();
      formButton.disabled = true;
      const inputs = form.querySelectorAll("input, textarea");
      const method = form.method;
      const action = form.action;
      let isValidated = true;
      let formData = [];
      inputs.forEach((input) => {
        formData.push({
          name: input.name,
          value: input.value,
          isValidate: validate(input)
        });
      });
      formData.forEach((item) => {
        const input = form.querySelector(`[name="${item.name}"]`);
        const wrapper = input.parentNode;
        const errorBlock2 = wrapper.querySelector(".js-error");
        if (!item.isValidate) {
          isValidated = false;
          errorBlock2.classList.add("_active");
          wrapper.classList.add("_active");
        } else {
          errorBlock2.classList.remove("_active");
          wrapper.classList.remove("_active");
        }
      });
      if (!isValidated) {
        formButton.disabled = false;
        return false;
      }
      axios({
        method,
        url: action,
        data: formData
      }).then((response) => {
        sucesOpen();
        console.log("success");
        formButton.disabled = false;
        document.body.classList.remove("_lock");
        modalMainBody.classList.remove("_active");
        modalMainContent.classList.remove("_active");
        errorBlock.forEach((item) => {
          item.classList.remove("_active");
        });
        inputs.forEach((input) => {
          input.value = "";
        });
      }).catch((error) => {
        console.error(error);
        sucesOpen();
        document.body.classList.remove("_lock");
        modalMainBody.classList.remove("_active");
        modalMainContent.classList.remove("_active");
        errorBlock.forEach((item) => {
          item.classList.remove("_active");
        });
        formButton.disabled = false;
        inputs.forEach((input) => {
          input.value = "";
        });
      });
    });
  }
});
const menuLinks = document.querySelectorAll("[data-goto]");
if (menuLinks.length > 0) {
  let onMenuLinkClick = function(e) {
    const menuLink = e.target;
    if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
      const gotoBlock = document.querySelector(menuLink.dataset.goto);
      console.log(gotoBlock);
      const gotoBlockValue = gotoBlock.getBoundingClientRect().top + window.scrollY;
      console.log(gotoBlockValue);
      window.scrollTo({
        top: gotoBlockValue,
        behavior: "smooth"
      });
      e.preventDefault(e);
    }
  };
  menuLinks.forEach((menuLink) => {
    menuLink.addEventListener("click", onMenuLinkClick);
  });
}
