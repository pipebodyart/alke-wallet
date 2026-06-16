/* ============================================================
   Alke Wallet - Lógica de la pantalla de Login
   Validación de credenciales con jQuery + Bootstrap
   ============================================================ */

$(function () {
  // Si ya hay sesión activa, ir directo al menú
  if (AlkeData.isLoggedIn()) {
    window.location.href = "menu.html";
    return;
  }

  const $form = $("#loginForm");
  const $error = $("#loginError");

  // "Recordarme": si hay un correo guardado, se precarga al abrir el login
  const rememberedEmail = localStorage.getItem("alke_remember");
  if (rememberedEmail) {
    $("#email").val(rememberedEmail);
    $("#remember").prop("checked", true);
    $("#password").focus();
  }

  // Mostrar / ocultar contraseña
  $("#togglePass").on("click", function () {
    const $pass = $("#password");
    const isPass = $pass.attr("type") === "password";
    $pass.attr("type", isPass ? "text" : "password");
    $(this).find("i").toggleClass("bi-eye bi-eye-slash");
  });

  $form.on("submit", function (e) {
    e.preventDefault();
    $error.addClass("d-none").text("");

    const email = $("#email").val().trim();
    const password = $("#password").val();

    // Validación básica de campos
    let valid = true;
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      $("#email").addClass("is-invalid");
      valid = false;
    } else {
      $("#email").removeClass("is-invalid");
    }

    if (!password) {
      $("#password").addClass("is-invalid");
      valid = false;
    } else {
      $("#password").removeClass("is-invalid");
    }

    if (!valid) return;

    // Guardar o limpiar el correo según la casilla "Recordarme"
    if ($("#remember").is(":checked")) {
      localStorage.setItem("alke_remember", email);
    } else {
      localStorage.removeItem("alke_remember");
    }

    // Validación de credenciales
    if (AlkeData.login(email, password)) {
      // Pequeña transición antes de redirigir
      $form.find("button[type=submit]").prop("disabled", true).text("Ingresando…");
      setTimeout(() => (window.location.href = "menu.html"), 500);
    } else {
      $error
        .removeClass("d-none")
        .html('<i class="bi bi-exclamation-triangle me-1"></i> Correo o contraseña incorrectos.');
      $("#password").val("").focus();
    }
  });
});
