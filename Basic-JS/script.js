'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Smooth scrolling

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function(e){
    // window.scrollTo({
    //     top: 0,
    //     behavior: 'smooth'
    // });

   const s1coords = section1.getBoundingClientRect();
//    console.log(s1coords);

//    console.log(e.target.getBoundingClientRect());

//    console.log('Current scroll (X/Y)', window.pageXOffset, pageYOffset);

//    console.log('height/width of viewport', document.documentElement.clientHeight,document.documentElement.clientWidth)

   //scrolling
   //    window.scrollTo(s1coords.left + window.pageXOffset,s1coords.top + window.pageYOffset);

   //Old school
//    window.scrollTo({
//        left :s1coords.left + window.pageXOffset,
//        top: s1coords.top + window.pageYOffset,
//        behavior: 'smooth'
//     });

    //Modern way
    section1.scrollIntoView({behavior: 'smooth'})
});

///////////////////////////////////////
// Page Navigation


// document.querySelectorAll('.nav__link').forEach(function(el){
//     el.addEventListener('click', function(e){
//         e.preventDefault();
//         console.log('link');
//         const id = this.getAttribute('href');
//         console.log(id);
//         document.querySelector(id).scrollIntoView({
//             behavior: "smooth"
//         })
//     })
// })

// 1. Add event listener to common parent Element
// 2. Determine what element originate the event

document.querySelector('.nav__links').addEventListener('click',function (e){
    e.preventDefault();

    if(e.target.classList.contains('nav__link')){
        const id = e.target.getAttribute('href');
        document.querySelector(id).scrollIntoView({
            behavior: "smooth"
        })
    }
});

///////////////////////////////////////
// Tab content

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function(e){
    const clicked = e.target.closest('.operations__tab');
    // console.log(clicked);

    //Gaurd clause
    if(!clicked) return;

    //Remove active classes
    tabs.forEach((t) => t.classList.remove('operations__tab--active'));
    tabsContent.forEach((c) => c.classList.remove('operations__content--active'));

    //Active tab
    clicked.classList.add('operations__tab--active');

    //Active content area
    // console.log(clicked.dataset.tab);
    document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');

});


///////////////////////////////////////
// Menu fade animation


const nav = document.querySelector('.nav');

const handleHover = function(e, opacity){
    if(e.target.classList.contains('nav__link')){
        const link = e.target;
        const siblings = link.closest('.nav').querySelectorAll('.nav__link');
        const logo = link.closest('.nav').querySelector('img');

        siblings.forEach(el => {
            if(el !== link) el.style.opacity = opacity;
        });
        logo.style.opacity = opacity;
    }
}

nav.addEventListener('mouseover', function(e){
    handleHover(e ,0.5);
});
nav.addEventListener('mouseout',function(e){
    handleHover(e ,1);
});


///////////////////////////////////////
// Sticky navigation

const initialCoords = section1.getBoundingClientRect();
// console.log("initail coords",initialCoords);

window.addEventListener('scroll', function(){
    // console.log(window.scrollY);

    if(window.scrollY > initialCoords.top) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
});

////////////////////////////////////////////////////////
////// Sticky navigation: Intersection Observer API

// 1. Solution
// const obsCallback = function (entries,observer){
//     entries.forEach(entry => {
//         console.log(entry);
//     });
// };

// const obsOptions = {
//     root: null,
//     threshold: [0, 0.2]
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);


// 2. Solution
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;


const stickyNav = function(entries){
    const [entry] = entries;
    // console.log(entry);

    if(!entry.isIntersecting) nav.classList.add('sticky')
    else nav.classList.remove('sticky')
}


const headerObserver = new IntersectionObserver(stickyNav ,{
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`
});

headerObserver.observe(header);


////////////////////////////////////////////////////////
////// Reveal sections

const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
    const [entry] = entries;
    // console.log(entry);

    //Guard
    if(!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver( revealSection , {
    root: null,
    threshold: 0.15
});


allSections.forEach( function (section){
    sectionObserver.observe(section);
    // section.classList.add('section--hidden');
});


////////////////////////////////////////////////////////
////// Lazy loading images

const imgTargets = document.querySelectorAll('img[data-src]');
console.log(imgTargets);

const loadImg  = function(entries, observer) {
    const [entry] = entries;

    //Guard
    if(!entry.isIntersecting) return;

    //Replace src with data-src
    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener('load', function(){
        entry.target.classList.remove('lazy-img');
    });

    observer.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0,
    rootMargin: '200px'
});

imgTargets.forEach(img => imgObserver.observe(img));


 ////////////////////////////////////////////////////////
////// Slider

let curSlide = 0;

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');


const maxSlides = slides.length;

// slides.forEach((s,i) => (s.style.transform =`translateX(${100 * i}%)`));
//0%,100%,200%,300%........

const goToSlide = function(slide) {
    slides.forEach((s,i) => (s.style.transform =`translateX(${100 * (i - slide)}%)`));
}

goToSlide(0);

//Next slide
const nextSlide = function(){
    if(curSlide === maxSlides - 1) {
        curSlide = 0;
    }else {
        curSlide++;
    }

    goToSlide(curSlide);
}

//Previous Slide
const prevSlide = function(){
    if(curSlide === 0){
        curSlide = maxSlides -1;
    }else{
        curSlide--;
    }
    goToSlide(curSlide);

}
btnRight.addEventListener('click',nextSlide);
btnLeft.addEventListener('click',prevSlide);

//curSlide =1: -100%,0,100%,200%














// ----------------------------------------------------------- //

/////////////////////////////////////////////////////////////////
//////// Selecting ,creating and deleting elements

//selecting elements

console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

// const header = document.querySelector('.header');
// const allSections = document.querySelectorAll('.section');
// console.log(allSections);


document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);

// console.log(document.getElementsByClassName('btn'));

//Creating and inserting elements

// .insertAdjacentHTML
const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'We use cookies for imporved functionality and anlytics';
message.innerHTML = 'We use cookies for imporved functionality and anlytics. <button class="btn btn-cookie">Got it</button>';

// header.prepend(message);
header.append(message);
// header.append(message.cloneNode(true));

// header.before(message);
// header.after(message);


//Delete the element
document.querySelector('.btn-cookie').addEventListener('click', function(){
   message.remove();
   //old way of removing
//    message.parentElement.removeChild(message)
})



/////////////////////////////////////////////////////////////////
//////// style attributes and classes

//styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.color);
console.log(message.style.backgroundColor)

console.log(getComputedStyle(message).color); // to get the style from css
console.log(getComputedStyle(message).height);

// message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

const setHeight = Number.parseFloat(getComputedStyle(message).height) + 30 + 'px';
message.style.height = setHeight;
console.log(setHeight)

//css variables
// document.documentElement.style.setProperty('--color-primary', 'orangered');

//Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.className); //Its calssed className not class

logo.alt = 'Brand logo';

//Non-standard
console.log(logo.designer);
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'bankist');

console.log(logo.src);
console.log(logo.getAttribute('src'));

const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));

//Data attributes
console.log(logo.dataset.versionNumber);

//classes

logo.classList.add('a'); //and we can pass multiple class name also logo.classList.add('a','b');
logo.classList.remove('a');
logo.classList.toggle('a');
logo.classList.contains('a');


/////////////////////////////////////////////////////////////////
//////// Type of events and event handlers

// const h1 = document.querySelector('h1');

// //New way
// // h1.addEventListener('mouseenter', function(e){
// //     alert("Hello ")
// // });

// const alertH1 = function(e){
//     alert("Hello")
// };

// h1.addEventListener('mouseenter',alertH1);

// setTimeout(()=> h1.removeEventListener('mouseenter', alertH1),3000)



//old school
// h1.onmouseenter = function (e) {
//     alert("onMouse enter: Hello")
// }


/////////////////////////////////////////////////////////////////
//////// Event propogation: Bubbling and Capturing



/////////////////////////////////////////////////////////////////
//////// Event propogation in practice

//rgb(255,255,255)
// const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor =  () => `rgb(${randomInt(0,255)},${randomInt(0,255)},${randomInt(0,255)})`;
// console.log(randomColor(0,255));

// document.querySelector('.nav__link').addEventListener('click', function(e){
//     this.style.backgroundColor = randomColor();
//     console.log("links", e.target, e.currentTarget);
//     console.log(e.currentTarget === true);

//     //Stop propogation
//     // e.stopPropagation(); //In practice its not a good idea to do this
// });

// document.querySelector('.nav__links').addEventListener('click', function(e){
//     this.style.backgroundColor = randomColor();
//     console.log("container", e.target, e.currentTarget)
// });

// document.querySelector('.nav').addEventListener('click', function(e){
//     this.style.backgroundColor = randomColor();
//     console.log("nav", e.target, e.currentTarget)
// });

//Capturing -> use true as by default its false
// document.querySelector('.nav').addEventListener('click', function(e){
//     this.style.backgroundColor = randomColor();
//     console.log("nav", e.target, e.currentTarget)
// }, true);


/////////////////////////////////////////////////////////////////
//////// DOM traversing

// const h1 = document.querySelector('h1');

// //Going downwards: child
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);

// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

// //Going upwards: parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest('.header').style.background = 'var(--gradient-secondary)';
// h1.closest('h1').style.background = 'var(--gradient-primary)';


// //Going sideways: siblings
// // we can only access the direct siblings (previous and next)

// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling); //need to check
// console.log(h1.nextSibling); //need to check

// console.log(h1.parentElement.children);

// [...h1.parentElement.children].forEach(function(el){
//     if( el !== h1) el.style.transform = 'scale(0.5)';
// });


/////////////////////////////////////////////////////////////////
//////// Lifecycle : DOM Events

//Fired as soon as HTML is parsed and DOM tree is built
// document.addEventListener("DOMContentLoaded", function(e){
//     console.log('HTML parsed and DOM tree built!', e);
// });

// //Once everything get loaded text image css etc...
// window.addEventListener('load',function(e){
//     console.log('Page fully loaded', e);
// });

// //Ask before user leave the website (don't use it) -> (its use case -> user filling the form,writing a blog post)
// window.addEventListener('beforeunload', function(e){
//     e.preventDefault();
//     console.log(e);
//     e.returnValue = '';
// });


/////////////////////////////////////////////////////////////////
//////// Efficient script loading: defer and async






/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
//////// OOP with Javascript

////////////////////////////////////////////////////////
////// Constructor functions and the new operator

// const Person = function(firstName, birthYear){

//     //Insance properties
//     this.firstName = firstName;
//     this.birthYear = birthYear;
// };

// const jonas = new Person('Jonas', 1991);
// console.log(jonas);

//1. New {} is created
//2. function is called, this = {}
//3. {} linked to prototype
//4. function automatically return {}

// const matilda = new Person('Matilda', 2017);
// const jack = new Person('Jack', 1975);
// console.log(matilda, jack);

// console.log(jonas instanceof Person);


////////////////////////////////////////////////////////
////// Prototypes


////////////////////////////////////////////////////////
// Coding Challenge #1


// Your tasks:
// 1. Use a constructor function to implement a 'Car'. A car has a 'make' and a
// 'speed' property. The 'speed' property is the current speed of the car in
// km/h
// 2. Implement an 'accelerate' method that will increase the car's speed by 10,
// and log the new speed to the console
// 3. Implement a 'brake' method that will decrease the car's speed by 5, and log
// the new speed to the console
// 4. Create 2 'Car' objects and experiment with calling 'accelerate' and
// 'brake' multiple times on each of them
// Test data:
// § Data car 1: 'BMW' going at 120 km/h
// § Data car 2: 'Mercedes' going at 95 km/h

// const Car = function(make,speed){
//   this.make = make;
//   this.speed = speed;
// };

// Car.prototype.accelerate = function(){
//     this.speed += 10;
//     console.log(this.speed);
// }

// Car.prototype.break = function (){
//     this.speed -= 5;
//     console.log(this.speed)
// }
// const bmw = new Car('BMW', 120);
// const mercedes = new Car('Mercedes', 95);

// bmw.accelerate();
// bmw.accelerate();
// bmw.break();
// bmw.accelerate();


//class expression
// const PersonCl = class {}

//class declaration
// class PersonCl {
//     constructor(firstName,birthYear){
//         this.firstName = firstName;
//         this.birthYear = birthYear;
//     }
//     calcAge(){
//         console.log(2037 - this.birthYear);
//     }
//     greet(){
//         console.log(`Hey ${this.firstName}`);
//     }
// }

// const jessica = new PersonCl('Jessica',1997);
// console.log(jessica);
// jessica.calcAge();

// console.log(jessica.__proto__ === PersonCl.prototype);


// PersonCl.prototype.greet = function(){
//     console.log(`Hey ${this.firstName}`);
// }
// jessica.greet();

// 1. Classes are NOT hoisted
// 2. Class are first-class citizes
// 3. Classes are executed in strict mode


//Getters and setters

// const account = {
//     owner : 'Jonas',
//     movements : [200, 530, 120, 300],

//     get latest(){
//         return this.movements.slice(-1).pop();
//     },

//     set latest (mov){
//         this.movements.push(mov)
//     }
// }


// console.log(account.latest);

// account.latest = 50;
// console.log(account.movements);



////////////////////////////////////////////////////////
// Coding Challenge #2

// Your tasks:
// 1. Re-create Challenge #1, but this time using an ES6 class (call it 'CarCl')
// 2. Add a getter called 'speedUS' which returns the current speed in mi/h (divide
// by 1.6)
// 3. Add a setter called 'speedUS' which sets the current speed in mi/h (but
// converts it to km/h before storing the value, by multiplying the input by 1.6)
// 4. Create a new car and experiment with the 'accelerate' and 'brake'
// methods, and with the getter and setter.
// Test data:
// § Data car 1: 'Ford' going at 120 km/h



// class CarCl {
//   constructor(make,speed){
//   this.make = make;
//   this.speed = speed;
// };

// accelerate(){
//     this.speed += 10;
//     console.log(this.speed);
// }

// break(){
//     this.speed -= 5;
//     console.log(this.speed)
// }

// get speedUs(){
//    return this.speed /1.6
// }
// set speedUs(speed){
//     this.speed = speed * 1.6;
// }
// };

// const ford = new CarCl("Ford", 120);
// console.log(ford.speedUs);
// ford.accelerate();
// ford.accelerate();
// ford.break();
// ford.speedUs =50;
// console.log(ford);


// const bmw = new Car('BMW', 120);
// const mercedes = new Car('Mercedes', 95);


//////////////////////////////////////////////////////////////////
//// Inheritance between classes: Constructor functions

const Person = function (firstName,birthYear) {
    this.firstName = firstName;
    this.birthYear = birthYear;
};

Person.prototype.calcAge = function(){
    console.log(2037 - this.birthYear);
};



const Student = function (firstName, birthYear, course) {
    Person.call(this, firstName,birthYear);
    this.course =course;
}

//Linking prototype
Student.prototype = Object.create(Person.prototype);

Student.prototype.introduce = function(){
    console.log(`My name ${this.firstName} and I study ${this.course}`);
}

const mike = new Student('Mike', 1994, 'Information technology');
mike.introduce();
mike.calcAge();



////////////////////////////////////////////////////////
// Coding Challenge #3

// Your tasks:
// 1. Use a constructor function to implement an Electric Car (called 'EV') as a child
// "class" of 'Car'. Besides a make and current speed, the 'EV' also has the
// current battery charge in % ('charge' property)
// 2. Implement a 'chargeBattery' method which takes an argument
// 'chargeTo' and sets the battery charge to 'chargeTo'
// 3. Implement an 'accelerate' method that will increase the car's speed by 20,
// and decrease the charge by 1%. Then log a message like this: 'Tesla going at 140
// km/h, with a charge of 22%'
// 4. Create an electric car object and experiment with calling 'accelerate',
// 'brake' and 'chargeBattery' (charge to 90%). Notice what happens when
// you 'accelerate'! Hint: Review the definiton of polymorphism 😉
// Test data:
// § Data car 1: 'Tesla' going at 120 km/h, with a charge of 23%

// const Car = function(make,speed){
//   this.make = make;
//   this.speed = speed;
// };

// Car.prototype.accelerate = function(){
//     this.speed += 10;
//     console.log(this.speed);
// }

// Car.prototype.break = function (){
//     this.speed -= 5;
//     console.log(this.speed)
// }

// const EV = function (make,speed,charge){
//     Car.call(this, make,speed);
//     this.charge = charge;
// }

// EV.prototype = Object.create(Car.prototype);

// EV.prototype.chargeBattery = function(chargeTo) {
//     this.charge = chargeTo;
// }
// EV.prototype.accelerate = function(){
//     this.speed += 20;
//     this.charge--;
//     console.log(`${this.make} is going at ${this.speed} km/h, with a charge of ${this.charge}`)
// }

// const tesla = new EV('Tesla', 120, 23);
// tesla.chargeBattery(90);
// console.log(tesla);
// tesla.break();
// tesla.accelerate();

// const bmw = new Car('BMW', 120);
// const mercedes = new Car('Mercedes', 95);

// bmw.accelerate();
// bmw.accelerate();
// bmw.break();
// bmw.accelerate();



////////////////////////////////////////////////////////
// Inheritance between classes: ES6 classes

