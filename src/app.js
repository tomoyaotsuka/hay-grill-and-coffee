const $window = $(window);
const $mcs = $('.mCustomScrollbar');
const $idxContentItem = $('[class^=idx-Content_Item]');

let scrollLeft = 0;
let offset = [];
let flag = [];


$idxContentItem.each((i, elm) => {
  offset[i] = $(elm).offset();
  flag[i] = false;
  $(elm).find('.visual').prepend('<div class="curtain"></div>');
});

$mcs.mCustomScrollbar({
  callbacks: {
    whileScrolling: function(e) {
      scrollLeft = Math.abs(this.mcs.left);
      entryAnimation();
      parallaxAnimation();
    }
  }
});



window.addEventListener('load', () => {
  $mcs.mCustomScrollbar({
    axis: 'x',
    horizontalScroll: true,
    scrollInertia: 100,
    contentTouchScroll: 50,
    documentTouchScroll: true,
    advanced: {
      updateOnContentResize: true
    }
  });

  // entryAnimation(true);
  parallaxAnimation();

  // var map;
  // google.maps.event.addDomListener(window, 'load', init);
  // function init() {
  //   map = new google.maps.Map(document.getElementById('map'), {
  //     center: {lat: -34.397, lng: 150.644},
  //     zoom: 8
  //   });
  // }
});


function entryAnimation(onLoad) {
  $idxContentItem.each((i, elm) => {
    if (offset[i].left < scrollLeft + $window.width() + ($idxContentItem.width()/4) && !flag[i]) {
      TweenLite.to($(elm).find('.curtain'), 1.44, { x: '100%', ease: Power4.easeIn, delay: onLoad ? i * 0.4 : 0 });
      flag[i] = true;
    }
  });
}

function parallaxAnimation() {
  $idxContentItem.each((i, elm) => {
    if (offset[i].left < scrollLeft + $window.width() && offset[i].left + $(elm).width() > scrollLeft) {
      const value = scrollLeft + $window.width() - offset[i].left;
      const scale = $(elm).width() / 100;
      const s = $(elm).height() / 100;
      TweenLite.to($(elm).find('.visual img'), 0, { x: -value/50 * scale });
      TweenLite.to($(elm), 0, { x: - value / (scale + s) });
    }
  });
}



/**
 *
 *
 */

const $opening       = $('#opening');
const $loadStatus    = $('#loadStatus');
const $loadStatusTxt = $('#loadStatusTxt');
const $loadStatusBar = $('#loadStatusBar');
const $loadStatusNum = $('#loadStatusNum');

let manifest = [
  { id: 'img-20161211', src: './img/img-20161211.jpg' },
  { id: 'img-20161126', src: './img/img-20161126.jpg' },
  { id: 'img-20161106', src: './img/img-20161106.jpg' },
  { id: 'img-20161102', src: './img/img-20161102.jpg' },
  { id: 'img-20161026', src: './img/img-20161026.jpg' },
  { id: 'img-20160919', src: './img/img-20160919.jpg' },
  { id: 'img-20160722', src: './img/img-20160722.jpg' },
  { id: 'img-20160704', src: './img/img-20160704.jpg' },
  { id: 'img-20160531', src: './img/img-20160531.jpg' },
  { id: 'date-20161211', src: './img/date-20161211.png' },
  { id: 'date-20161126', src: './img/date-20161126.png' },
  { id: 'date-20161102', src: './img/date-20161102.png' },
  { id: 'date-20160919', src: './img/date-20160919.png' },
  { id: 'date-20160722', src: './img/date-20160722.png' },
  { id: 'date-20160704', src: './img/date-20160704.png' }
];

const manifestLength = Object.keys(manifest).length;

const queue = new createjs.LoadQueue(true);
queue.loadManifest(manifest, true);
queue.setMaxConnections(1);
queue.on('fileload', handleFileLoad);
queue.on('progress', handleProgress);
queue.on('complete', handleComplete);

function handleFileLoad(event) {
  // $('#' + event.item.id).append(event.result);
  // const result = event.result;
  // document.getElementById(event.item.id).innerHTML = result;
}

function handleProgress(event) {
  $loadStatusNum.html(Math.ceil(queue.progress * 100) + "%");
  TweenLite.to($loadStatusBar, 0.3, { width: queue.progress * 100 + "%", ease: Power4.easeOut });
  // console.log("Progress:", queue.progress, event.progress);
}

function handleComplete(event) {
  Object.keys(manifest).forEach(function(key) {
    const target = this[key]['id'];
    const value = queue.getResult(target);
    value.width /= 2;
    value.height /= 2;
    $('#'+target).append(value);
  }, manifest)

  TweenLite.to($loadStatusTxt, 0.2, { autoAlpha: 0,
    onComplete: function() {
      $loadStatusTxt.html("Finished.");
      TweenLite.to($loadStatusTxt, 0.2, { autoAlpha: 1 })
    }
  });

  const tl = new TimelineLite({ delay: 0.5 });
  tl.set($loadStatusBar, { left: 0, x: 0 })
    .to($loadStatusBar, 1, { width: 0, ease: Power4.easeIn })
    .add("end")
    .to($opening, 1, { width: 0, ease: Power4.easeIn, delay: -0.3 }, "end")
    .to($loadStatus, 1, { autoAlpha: 0, delay: -0.5, onComplete: function() {
      entryAnimation(true);
    } }, "end");
}





/**
 *
 *
 */

const ua = navigator.userAgent.toLowerCase();
const isiPhone = (ua.indexOf('iphone') > -1);
const isiPad = (ua.indexOf('ipad') > -1);
const isAndroid = (ua.indexOf('android') > -1) && (ua.indexOf('mobile') > -1);
const isAndroidTablet = (ua.indexOf('android') > -1) && (ua.indexOf('mobile') == -1);

if (isiPhone || isiPad || isAndroid || isAndroidTablet) {

}
else {
  $('#mapLink').attr({ href: 'https://goo.gl/maps/n1yZ9QKy4E32', target: '_blank' });
}
