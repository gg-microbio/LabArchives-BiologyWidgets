my_widget_script = {
  init: function (mode, json_data) {
    this.parent_class.init(mode, json_data);

    if (mode === "view" || mode === "view_dev") {
      $("#code_input").hide();
      $("#code_text").prop("disabled", true);
      $("#code_lang").prop("disabled", true);
    } else {
      $("#code_input").show();
      $("#code_text").prop("disabled", false);
      $("#code_lang").prop("disabled", false);
    }

    $.getScript(
      "//cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js",
      function () {
        if (window.hljs) {
          hljs.configure({ languages: ["bash", "r"] });
          my_widget_script.render_code();
        }
      }
    );

    if (mode === "edit" || mode === "edit_dev") {
      $("#code_text").on("input", function () {
        my_widget_script.render_code();
      });
      $("#code_lang").on("change", function () {
        my_widget_script.render_code();
      });
    } else {
      my_widget_script.render_code();
    }

    window.onresize = my_widget_script.resize;
    my_widget_script.resize();
  },

  to_json: function () {
    return this.parent_class.to_json();
  },

  from_json: function (json_data) {
    this.parent_class.from_json(json_data);
    my_widget_script.render_code();
  },

  test_data: function () {
    return this.parent_class.test_data();
  },

  is_valid: function (b_suppress_message) {
    $("#errorMsg").html("");
    
    var code_text = $("#code_text").val().replace(/^\s+|\s+$/g, "");

    var errors = this.parent_class.is_valid(b_suppress_message) || [];

    if (!code_text) {
      if (!b_suppress_message) {
        $("#errorMsg").html(
          '<span style="color:red;">Please paste some code before saving.</span>'
        );
      }
      errors.push($("#code_text")[0]);
    }

    return errors;
  },

  is_edited: function () {
    return this.parent_class.is_edited();
  },

  reset_edited: function () {
    return this.parent_class.reset_edited();
  },

  render_code: function () {
    var code_text = $("#code_text").val() || "";
    var code_lang = $("#code_lang").val() || "bash";

    var escaped = $("<div/>").text(code_text).html();

    var html =
      '<div class="code-container">' +
        '<pre><code class="language-' + code_lang + '">' +
        escaped +
        "</code></pre>" +
      "</div>";

    $("#code_display").html(html);

    if (window.hljs) {
      $("#code_display pre code").each(function (i, block) {
        hljs.highlightElement(block);
      });
    }

    my_widget_script.parent_class.resize_container();
  },

  resize: function () {
    var width = window.innerWidth;
    $(".code-container").width(width * 0.95);
    my_widget_script.parent_class.resize_container();
  }
};
