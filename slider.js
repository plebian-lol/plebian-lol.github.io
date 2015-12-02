            $(document).ready(function()
            {
              $('#fullpage').fullpage(
              {});
            });
            (function(global, factory)
            {
              {
                factory(jQuery, global, global.document, global.Math);
              }
            })(typeof window !== 'undefined' ? window : this, function($, window, document, Math, undefined)
            {
              'use strict';
              var ACTIVE = 'active';
              var ACTIVE_SEL = '.' + ACTIVE;
              var SECTION_DEFAULT_SEL = '.section';
              var SECTION = 'fp-section';
              var SECTION_SEL = '.' + SECTION;
              var SECTION_ACTIVE_SEL = SECTION_SEL + ACTIVE_SEL;
              var SLIDE_DEFAULT_SEL = '.slide';
              var SLIDE = 'fp-slide';
              var SLIDE_SEL = '.' + SLIDE;
              var SLIDE_ACTIVE_SEL = SLIDE_SEL + ACTIVE_SEL;
              var SLIDES_WRAPPER = 'fp-slides';
              var SLIDES_WRAPPER_SEL = '.' + SLIDES_WRAPPER;
              var SLIDES_CONTAINER = 'fp-slidesContainer';
              var SLIDES_CONTAINER_SEL = '.' + SLIDES_CONTAINER;
              var SLIDES_NAV = 'fp-slidesNav';
              var SLIDES_NAV_SEL = '.' + SLIDES_NAV;
              var SLIDES_ARROW = 'fp-controlArrow';
              var SLIDES_ARROW_SEL = '.' + SLIDES_ARROW;
              var SLIDES_PREV = 'fp-prev';
              var SLIDES_PREV_SEL = '.' + SLIDES_PREV;
              var SLIDES_ARROW_PREV = SLIDES_ARROW + ' ' + SLIDES_PREV;
              var SLIDES_ARROW_PREV_SEL = SLIDES_ARROW_SEL + SLIDES_PREV_SEL;
              var SLIDES_NEXT = 'fp-next';
              var SLIDES_NEXT_SEL = '.' + SLIDES_NEXT;
              var SLIDES_ARROW_NEXT = SLIDES_ARROW + ' ' + SLIDES_NEXT;
              var SLIDES_ARROW_NEXT_SEL = SLIDES_ARROW_SEL + SLIDES_NEXT_SEL;
              $.fn.fullpage = function(options)
              {
                var FP = $.fn.fullpage;
                options = $.extend(
                {
                  controlArrows: true,
                  controlArrowColor: '#fff',
                  sectionSelector: SECTION_DEFAULT_SEL,
                  slideSelector: SLIDE_DEFAULT_SEL,
                }, options);
                FP.moveSlideRight = function()
                {
                  moveSlide('next');
                };
                FP.moveSlideLeft = function()
                {
                  moveSlide('prev');
                };
                var slideMoving = false;
                var isResizing = false;
                var isScrollAllowed = {};
                isScrollAllowed.m = {
                  'up': true,
                  'down': true,
                  'left': true,
                  'right': true
                };
                isScrollAllowed.k = $.extend(true,
                {}, isScrollAllowed.m);
                var originals = $.extend(true,
                {}, options);
                $(options.sectionSelector).each(function()
                {
                  $(this).addClass(SECTION);
                });
                $(options.slideSelector).each(function()
                {
                  $(this).addClass(SLIDE);
                });
                $(SECTION_SEL).each(function(index)
                {
                  var that = $(this);
                  var slides = $(this).find(SLIDE_SEL);
                  var numSlides = slides.length;
                  if (!index && $(SECTION_ACTIVE_SEL).length === 0)
                  {
                    $(this).addClass(ACTIVE);
                  }
                  if (numSlides > 0)
                  {
                    var sliderWidth = numSlides * 100;
                    var slideWidth = 100 / numSlides;
                    slides.wrapAll('<div class="' + SLIDES_CONTAINER + '" />');
                    slides.parent().wrap('<div class="' + SLIDES_WRAPPER + '" />');
                    $(this).find(SLIDES_CONTAINER_SEL).css('width', sliderWidth + '%');
                    if (numSlides > 1)
                    {
                      if (options.controlArrows)
                      {
                        createSlideArrows($(this));
                      }

                    }
                    slides.each(function(index)
                    {
                      $(this).css('width', slideWidth + '%');
 
                    });
                    var startingSlide = that.find(SLIDE_ACTIVE_SEL);
                    if (!startingSlide.length)
                    {
                      slides.eq(0).addClass(ACTIVE);
                    }
                    else
                    {
                      silentLandscapeScroll(startingSlide);
                    }
                  }
                })

                function createSlideArrows(section)
                {
                  section.find(SLIDES_WRAPPER_SEL).after('<div class="' + SLIDES_ARROW_PREV + '"></div><div class="' + SLIDES_ARROW_NEXT + '"></div>');
                  if (options.controlArrowColor != '#fff')
                  {
                    section.find(SLIDES_ARROW_NEXT_SEL).css('border-color', 'transparent transparent transparent ' + options.controlArrowColor);
                    section.find(SLIDES_ARROW_PREV_SEL).css('border-color', 'transparent ' + options.controlArrowColor + ' transparent transparent');
                  }
                  if (!options.loopHorizontal)
                  {
                    section.find(SLIDES_ARROW_PREV_SEL).hide();
                  }
                }

                function moveSlide(direction)
                {
                  var activeSection = $(SECTION_ACTIVE_SEL);
                  var slides = activeSection.find(SLIDES_WRAPPER_SEL);
                  var numSlides = slides.find(SLIDE_SEL).length;
                  if (!slides.length || slideMoving || numSlides < 2)
                  {
                    return;
                  }
                  var currentSlide = slides.find(SLIDE_ACTIVE_SEL);
                  var destiny = null;
                  if (direction === 'prev')
                  {
                    destiny = currentSlide.prev(SLIDE_SEL);
                  }
                  else
                  {
                    destiny = currentSlide.next(SLIDE_SEL);
                  }
                  if (!destiny.length)
                  {
                    if (!options.loopHorizontal) return;
                    if (direction === 'prev')
                    {
                      destiny = currentSlide.siblings(':last');
                    }
                    else
                    {
                      destiny = currentSlide.siblings(':first');
                    }
                  }
                  slideMoving = true;
                  landscapeScroll(slides, destiny);
                }
                $(SECTION_SEL).on('click touchstart', SLIDES_ARROW_SEL, function()
                {
                  if ($(this).hasClass(SLIDES_PREV))
                  {
                    if (isScrollAllowed.m.left)
                    {
                      FP.moveSlideLeft();
                    }
                  }
                  else
                  {
                    if (isScrollAllowed.m.right)
                    {
                      FP.moveSlideRight();
                    }
                  }
                });

                function landscapeScroll(slides, destiny)
                {
                  var destinyPos = destiny.position();
                  var slideIndex = destiny.index();
                  var section = slides.closest(SECTION_SEL);
                  var slidesNav = section.find(SLIDES_NAV_SEL);
                  destiny.addClass(ACTIVE).siblings().removeClass(ACTIVE);
                  if (!options.loopHorizontal && options.controlArrows)
                  {
                    section.find(SLIDES_ARROW_PREV_SEL).toggle(slideIndex !== 0);
                    section.find(SLIDES_ARROW_NEXT_SEL).toggle(!destiny.is(':last-child'));
                  }
                  var afterSlideLoads = function()
                  {
                    slideMoving = false;
                  };
                  {
                    slides.animate(
                    {
                      scrollLeft: Math.round(destinyPos.left)
                    }, options.scrollingSpeed, options.easing, function()
                    {
                      afterSlideLoads();
                    });
                  }
                  slidesNav.find(ACTIVE_SEL).removeClass(ACTIVE);
                  slidesNav.find('li').eq(slideIndex).find('a').addClass(ACTIVE);
                }

                function silentLandscapeScroll(activeSlide, noCallbacks)
                {
                  FP.setScrollingSpeed(0, 'internal');
                  if (typeof noCallbacks !== 'undefined')
                  {
                    isResizing = true;
                  }
                  landscapeScroll(activeSlide.closest(SLIDES_WRAPPER_SEL), activeSlide);
                  if (typeof noCallbacks !== 'undefined')
                  {
                    isResizing = false;
                  }
                  FP.setScrollingSpeed(originals.scrollingSpeed, 'internal');
                }
              };
            });