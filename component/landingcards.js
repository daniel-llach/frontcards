// landingcards
(function( $ ){
  "use strict"
  var scripts = document.getElementsByTagName("script");
  var urlBase = scripts[scripts.length-1].src;
  urlBase = urlBase.replace('landingcards_es5.js', '');
  urlBase = urlBase.replace('landingcards.js', '');

  // some glocal vars
  let cards;
  let settings;
  let card_index = 0;
  let element_index = 0;
  let form_index = 0;

  // Public methods
  let api = {
    init : function(options) {
      const $el = $(this);
      $el.attr('class','landingcards');
      methods.getCards($el, options);
    },
    destroy: function(){
      // const $el = $(this);
      // $el.empty();
      // $el.removeClass('landingcards');
    }
  }

  // Private methods
  let methods = {
    getCards: function($el, options){
      let jsonUri = './' + options.data;
      // get cards data
      $.getJSON(jsonUri, function(json) {
        cards = json.cards
        settings = json.settings
        methods.initCards($el, options)
        methods.settings($el, options)
      });

    },
    initCards: function($el, options){
      // get card elements
      cards.forEach(function(card){
        methods.setCard($el, card, options)
      })
      // reset card count
      card_index = 0;
    },
    setCard: function($el, card){
      // get card template
      let cardTmpl = _.template('<div class="card" data-id="<%- id %>"></div>');

      console.info("new card");
      let card_id = 'card-' + card_index;
      $el.append( cardTmpl({id: card_id}) );
      card_index += 1;

      // set card elements
      let elements = _.keys(card);
      methods.setElements($el, card, elements, card_id);
    },
    setElements: function($el, card, elements, card_id){
      // get element template
      let $card = $el.find('.card[data-id="' + card_id + '"]');
      let eleTmpl;

      // reset element counter
      element_index = 0;

      for(let value of elements){
        // paint element with id
        let element_id = 'element-' + element_index;
        let elementTmpl = _.template('<div class="element" data-id="<%- id %>"></div>');
        $card.append( elementTmpl({id: element_id }) );

        let $element = $card.find('.element[data-id="' + element_id + '"]');

        switch(value) {
          case "form":
            eleTmpl = methods.getTemplate('form_inputs.html');
            let action = card.settings.action;
            let form_name = 'form_' + form_index;
            $element.append('<form name="' + form_name + '" action="#"></form>')
            card[value].forEach(function(field){
              eleTmpl.then((res) => {
                $element.find('form').append( res({
                  type: field.type,
                  name: field.name,
                  text: field.text,
                  required: field.required
                }) );
                $element.addClass('form');
              }).then(() => {
                if(field.type == "submit"){
                  events.startForm(form_name, card.settings);
                }
              })
            })
            form_index += 1;
            break;
          case 'slide':
            eleTmpl = methods.getTemplate('slide.html');
            eleTmpl.then((res) => {
              if($card){
                $element.append( res({
                  hideNav: card[value].hideNav,
                  direction: card[value].direction,
                  urlBase: urlBase
                }) ).addClass('slide');
              }
            }).then(() => {
              console.log("card[value].data: ", card[value].data);
              // get data cards to show in slide
              let $slidebox = $element.find('.slide_box .content');

              $slidebox.landingcards({
                data: card[value].data
              });

              // start slide events
              events.startSlide($element, card);
            })
            break;
          case 'background':
            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ){
              $card.css({"background":"url(" + card[value].file_mobile + ") no-repeat center center fixed"});
            }else{
              $card.css({"background":"url(" + card[value].file + ") no-repeat center center fixed"});
            }
            $card.css({"-webkit-background-size":"cover"});
            $card.css({"-moz-background-size":"cover"});
            $card.css({"-o-background-size":"cover"});
            $card.css({"background-size":"cover"});
            $element.remove();
            break;
          case 'topnav':
            eleTmpl = methods.getTemplate('topnav.html');
            eleTmpl.then((res) => {
              if($card){
                $element.append( res({
                  type: card[value].type,
                  urlBase: urlBase
                }) ).addClass('topnav');
              }
            }).then(() => {
              events.startTopnav($element, card);
            })
            break;
          case 'img':
            eleTmpl = methods.getTemplate('img.html');
            eleTmpl.then((res) => {
              if($card){
                $element.append( res({
                  file: card[value].file,
                  size: card[value].size,
                  url: card[value].url,
                }) ).addClass('image');
              }
            })
            break;
          case 'video':
            eleTmpl = methods.getTemplate('video.html');
            eleTmpl.then((res) => {
              if($card){
                $element.append( res({
                  origin: card[value].origin,
                  title: card[value].title,
                  file: card[value].file,
                  poster: card[value].poster,
                  poster_mobile: card[value].poster_mobile
                }) ).addClass('video');
              }
            }).then(() => {
              // start events with this video element
              switch(card[value].origin){
                case 'vimeo':
                  events.startVideoVimeo($element);
                  break;
                case 'youtube':
                  console.info("TODO: support youtube video");
                  break;
                default:
                  console.error("specified video origin - local, vimeo or youtube");
              }
            })
            break;
          case 'description':
            eleTmpl = methods.getTemplate('description.html');
            eleTmpl.then((res) => {
              if($card){
                $element.append( res({
                  type: card[value].type,
                  text: card[value].text
                }) ).addClass('description');
              }
            })
            break;
          case 'title':
            eleTmpl = methods.getTemplate('title.html');
            eleTmpl.then((res) => {
              if($card){
                $element.append( res({
                  type: card[value].type,
                  text: card[value].text
                }) ).addClass('title');
              }
            })
            break;
          case 'accordeon':
            eleTmpl = methods.getTemplate('accordeon.html');
            eleTmpl.then((res) => {
              if($card){
                $element.append( res({
                  title: card[value].title
                }) ).addClass('accordeon');
              }
            }).then(() => {
              // get data cards to show in accordeon
              let $accobox = $element.find('.accordeon-box .content');
              $accobox.landingcards({
                data: card[value].data
              });
              // start events with this video element
              events.startAccordeon($element);
            })
            break;
          case 'footer':
            eleTmpl = methods.getTemplate('footer.html');
            eleTmpl.then((res) => {
              if($card){
                $element.append( res({
                  logo: card[value].logo,
                  address_img: card[value].address_img,
                  address: card[value].address,
                  phone_img: card[value].phone_img,
                  phone: card[value].phone,
                  email_img: card[value].email_img,
                  email: card[value].email
                }) ).addClass('footer');
              }
            });
            break;
          case 'mockup':
            $element.append('<div class="mockups_container"></div>');
            let $container = $element.find('.mockups_container');
            $container.mockups({
              type: card[value].type,
              img: card[value].file,
              adjust: false,
              reflection: true
            });
            break;
          default:
            console.error('card element not exist please change ' + value + ' by img, video, description, title, accordeon or footer');
            break;
        }
        // add 1 to next element in current card
        element_index += 1;

        // evaluate card template considering the type and order of elements that has
        methods.cardTemplateRules(card, $card, elements);
      }

    },
    cardTemplateRules: function(card, $card, elements){
      let elementsArray = elements.toString();
      switch(elementsArray) {
        case "img":
          $card.attr('data-tmpl', 'image-main');
          break;
        case "video":
          $card.attr('data-tmpl', 'video-main');
          break;
        case "description":
          $card.attr('data-tmpl', 'description-main');
          break;
        case "title":
          $card.attr('data-tmpl', 'title-news');
          break;
        case "accordeon":
          $card.attr('data-tmpl', 'accordeon-main');
          break;
        case "title,description,mockup":
          $card.attr('data-tmpl', 'title-description-mockup');
          break;
        case "img,title,description":
          $card.attr('data-tmpl', 'img-title-description');
          break;
        case "img,title,description,background":
          $card.attr('data-tmpl', 'img-title-description-background');
          break;
        case "title,description":
          $card.attr('data-tmpl', 'title-description');
          break;
        case "footer":
          $card.attr('data-tmpl', 'footer');
          break;
      }
    },
    settings: function($el, options){
      methods.cardsTemplate($el);
    },
    cardsTemplate: function($el){
      $el.attr('data-template', settings.template)
    },
    getTemplate: function(name){
      return new Promise(function(resolve, reject){
          $.get(urlBase + "templates/" + name, function( result ) {
            resolve(_.template(result));
          }).fail(function() {
            reject('no template');
          });
        }
      );
    },
    getFormData: function($form){
      return new Promise(function(resolve, reject){

        // get user data
        let data_obj = {};
        let $form_inputs = $form.find('input');
        $form_inputs.each(function(){
          let $item = $(this);
          let item_type = $item.attr("type");
          let item_name = $item.attr("name");
          let item_val = $item.val();

          if(item_type != "submit"){
            data_obj[item_name] = item_val;
            console.log("data_obj: ", data_obj);
          }
        })
        resolve(data_obj);
      })
    },
    validateForm: function($form, data, validate){
      return new Promise(function(resolve, reject){
        $.ajax({
          data: data,
          type: "POST",
          dataType: "json",
          url: validate,
        }).done(function( result, textStatus, jqXHR ) {
          if(result){
            result.forEach(function(item){
              switch(item.type){
                case "error":
                  let item_name = item.name;
                  let item_value = item.value;
                  events.inputTooltip($form, item_name, item_value);
                  break;
                case "success":
                  resolve();
                  break;
                default:
                  console.error(item.type + ' is not supported, Please add in form elements.')
                  break;
              }
            })
          }
        }).fail(function( jqXHR, textStatus, errorThrown ) {
          if ( console && console.log ) {
            console.log( "La solicitud a fallado: " +  textStatus);
            console.log( "jqXHR: " +  errorThrown);
          }
        });
      })

    },
    actionForm: function($form, data, action, type){
      return new Promise(function(resolve, reject){
        $.ajax({
          data: data,
          type: "POST",
          dataType: "html",
          url: action,
        }).done(function( result, textStatus, jqXHR ) {
          resolve(result);
        }).fail(function( jqXHR, textStatus, errorThrown ) {
          reject(textStatus);
        });
      })

    }
  }

  // Events
  let events = {
    startForm: function(form_name, settings){
      let $form = $('[name="' + form_name + '"]');
      let type = settings.type;
      let validate = settings.validate;
      let action = settings.action;

      switch(type){
        case "php":
          // let $submit = $form.find('[type="submit"]');
          $form.submit(function(event){
            event.preventDefault();
            // get user data
            let get_data = methods.getFormData($form);
            get_data.then((data) => {

              // has validate rules?
              if(validate){
                // validate with json ajax
                let valid = methods.validateForm($form, data, validate);
                valid.then(() => {
                  // performs the action
                  let act = methods.actionForm($form, data, action, 'post');
                  act.then((result) => {
                    // next slide
                    $(event.target).closest(".slide").find(".next").click()
                  })
                });
              }else{
                // no validate, just performs the action
                let act = methods.actionForm($form, data, action, 'post');
                act.then((result) => {
                  $(event.target).closest(".slide").find(".next").click()
                })
              }
            });
          });
          break;
        default:
          console.error("the " + type + " type form is not supported yet.");
          break;
      }
    },
    inputTooltip: function($form, item_name, item_value){
      let $input_name = $form.find('[name="' + item_name + '"]');
      $input_name.after('<div class="input_tooltip"><div class="message">' + item_value + '</div><div class="close">x</div></div>');
      events.startInputTooltip($input_name);
    },
    startInputTooltip: function($input_name){
      $input_name.on({
        focus: function(event){
          $(this).parent().find('.close').click();
        }
      });
      $input_name.parent().find('.input_tooltip .close').click(function(event){
        $(this).parent().remove();
      });
    },
    startSlide: function($element, card){
      let data = card["slide"].data;
      let current = 0;
      let $nextBtn = $element.find('.next');
      let $prevBtn = $element.find('.prev');

      $prevBtn.click(function(){
        events.slidePrev($element, current, card);
        current -= 1;
      });
      $nextBtn.click(function(){
        events.slideNext($element, current, card);
        current += 1;
      });
    },
    slidePrev: function($element, current, card){
      $element.find('.card').fadeOut(600);
      $element.find('[data-id="card-' + parseInt(current - 1) + '"]').delay(800).fadeIn();
      events.checkNav($element, current-1, card);
    },
    slideNext: function($element, current, card){
      $element.find('.card').fadeOut(600);
      $element.find('[data-id="card-' + parseInt(current + 1) + '"]').delay(800).fadeIn();
      events.checkNav($element, current+1, card);
    },
    checkNav: function($element, current, card){
      let hideNav = card["slide"].hideNav;
      let $nextBtn = $element.find('.next');
      let $prevBtn = $element.find('.prev');
      let totalCards = parseInt( $element.find('.card').size() - 1 );

      if(current == 0){
        $prevBtn.addClass('hide');
        if(!hideNav){
          $nextBtn.addClass('hide');
          $nextBtn.removeClass('hide');
        }else{
          $nextBtn.addClass('hide');
        }
      }else if(current == totalCards){
        $prevBtn.removeClass('hide');
        $nextBtn.addClass('hide');
      }else{
        $prevBtn.removeClass('hide');
        if(!hideNav){
          $nextBtn.removeClass('hide');
        }else{
          $nextBtn.addClass('hide');
        }
      }
    },
    startTopnav: function($element, card){
      let type = card['topnav'].type;
      let legend = card['topnav'].legend;
      let url = card['topnav'].url;
      switch(type){
        case 'prev':
          // put prev title into topnav and link
          $element.find('.legend_left').html(legend);
          $element.find('a').attr('href', url);
          break;
        default:
          console.error('type not support!')
          break;
      }
    },
    startAccordeon: function($element){
      let $title = $element.find('.accordeon-title');
      let $box = $element.find('.accordeon-box');
      let $arrow = $title.find('.toggle-arrow');
      $title.click(function(){
        $box.toggleClass('hide');
        // events.changeAccordeonArrow($title, $box);
        $arrow.toggleClass('close');
      });
    },
    startVideoVimeo: function($element){
      let poster = $element.find('.video-poster');
      poster.click(function(){
        events.showVideoVimeo($element);
      })
    },
    showVideoVimeo: function($element){
      let iframe = $element.find('.video-modal iframe');
      let player = new Vimeo.Player(iframe);

      player.ready().then(function(){

        // show modal
        $element.find('.video-modal').show();

        // play video
        player.play();

        let back = $element.find('.back');
        back.click(function(){
          $element.find('.video-modal').hide();
          player.pause()
        })

      })



    }
  };

  // jquery component stuff
  $.fn.landingcards = function(methodOrOptions) {
      if ( api[methodOrOptions] ) {
          return api[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ))
      } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
          // Default to "init"
          return api.init.apply( this, arguments )
      } else {
          $.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.landingcards' )
      }
  };


})( jQuery )
