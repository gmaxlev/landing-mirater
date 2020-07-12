/* 
  Глобальные контрольные точки медиазпросов
*/
window._breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200
};

$(document).ready(function() {
  new WOW().init();

  /**
   * Слайдер
   */
  (function() {
    // кол-во слайдов
    var countSlides = $(".gallery__slide").length;
    // активный слайд
    var activeSlide = 0;
    // аниманция
    var isAnimate = false;
    // галерея
    var DOMGallery = $(".gallery");
    // активный слайд
    var DOMActiveSlide = DOMGallery.find(".gallery__slide_show");

    // форматирование числа
    function numberSLide(num) {
      if (num / 10 < 1) {
        num = "0" + num;
      }
      return num;
    }
    // изменить слайд
    function changeSlide(id) {
      if (isAnimate || id + 1 > countSlides || id + 1 <= 0) return;
      isAnimate = true;
      activeSlide = id;
      DOMActiveSlide.removeClass("gallery__slide_show").addClass(
        "gallery__slide_hide"
      );
      setTimeout(function() {
        DOMActiveSlide.removeClass("gallery__slide_hide");
        DOMActiveSlide = DOMGallery.find(".gallery__slide").eq(activeSlide);
        DOMActiveSlide.addClass("gallery__slide_show");
        setTimeout(function() {
          isAnimate = false;
        }, 1000);
        $("#gallery-active-number").text(numberSLide(activeSlide + 1));
      }, 1000);
    }
    $("#gallery-next").on("click", function() {
      changeSlide(activeSlide + 1);
    });
    $("#gallery-prev").on("click", function() {
      changeSlide(activeSlide - 1);
    });
    $("#gallery-total-number").text(numberSLide(countSlides));
    $("#gallery-active-number").text(numberSLide(activeSlide + 1));
    window.changeSlide = changeSlide;
  })();

  /**
   * Модальные окна
   */
  (function() {
    window.modalIsOpen = false;

    $("[data-modal]").on("click", function(e) {
      e.preventDefault();
      var id = $(this).attr("data-modal");
      openModal(id);
    });

    $(".modal-window__close").on("click", function(e) {
      e.preventDefault();
      var id = $(this)
        .closest(".modal")
        .attr("id");
      closeModal(id);
    });

    $(".modal").on("click", function(e) {
      var modal = $(e.target);
      if (modal.hasClass("modal")) {
        var id = modal.attr("id");
        closeModal(id);
      }
    });

    function openModal(id) {
      if (modalIsOpen) return;
      modalIsOpen = true;
      $("body, html").css("overflow", "hidden");
      $("#" + id).addClass("modal_show");
    }

    function closeModal(id) {
      var modal = $("#" + id);
      modal.removeClass("modal_show").addClass("modal_hide");
      setTimeout(function() {
        modalIsOpen = false;
        $("body, html").css("overflow", "auto");
        modal.removeClass("modal_hide");
      }, 1000);
    }
    window.openModal = openModal;
    window.closeModal = closeModal;
  })();

  /**
   * Окна
   */
  (function() {
    /**
     * Сообщение об ошибке в форме
     */
    (function() {
      function showError(error, element) {
        if (
          $(element)
            .parent()
            .find(".input-error").length !== 0
        )
          return false;
        if ($(element).attr("name") == "name") {
          message = "Введите имя";
        } else if ($(element).attr("name") == "phone") {
          message = "Введите номер телефона";
        } else if ($(element).attr("name") == "email") {
          message = "Введите e-mail";
        }
        $(element)
          .parent()
          .prepend("<div class='input-error'>" + message + "</div>");
        return true;
      }
      window.showError = showError;
    })();

    /**
     * Маска для номера телефона
     */
    (function() {
      $(".phone-mask").mask("+38 (000) 000 00 00", {
        placeholder: "+38 (___) ___ __ __"
      });
    })();

    /**
     * Форма
     */
    (function() {
      $(".form-modal-1").each(function() {
        $(this)
          .submit(function(e) {
            e.preventDefault();
          })
          .validate({
            rules: {
              name: {
                required: {
                  depends: function() {
                    $(this).val($.trim($(this).val()));
                    return true;
                  }
                }
              },
              phone: {
                required: {
                  depends: function() {
                    $(this).val($.trim($(this).val()));
                    return true;
                  }
                },
                minlength: 10
              },
              email: {
                required: {
                  depends: function() {
                    $(this).val($.trim($(this).val()));
                    return true;
                  }
                },
                email: true
              }
            },
            success: function(label, element) {
              $(element)
                .parent()
                .find(".input-error")
                .remove();
              return true;
            },
            errorPlacement: showError,
            submitHandler: function(form) {
              $.ajax({
                url: "send.php",
                type: "POST",
                data: {
                  form: $(form).attr("name"),
                  name: $(form)
                    .find('input[name ="name"]')
                    .val(),
                  phone: $(form)
                    .find('input[name ="phone"]')
                    .val(),
                  email: $(form)
                    .find('input[name ="email"]')
                    .val()
                },
                success: function() {
                  $(form)
                    .find(".input-text, .textarea")
                    .prop("disabled", true)
                    .val("");
                  $(form)
                    .find(".button")
                    .prop("disabled", true);
                  $(form)
                    .siblings(".form-send-success")
                    .addClass("form-send-success_show");
                  setTimeout(function() {
                    var id = $(form)
                      .closest(".modal")
                      .attr("id");
                    closeModal(id);
                  }, 2000);
                },
                error: function() {
                  $(form)
                    .siblings(".form-send-error")
                    .slideDown(500);
                }
              });
            }
          });
      });
    })();
  })();
});
