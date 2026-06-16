/* ============================================================
   Alke Wallet - Lógica de Depósito y Retiro
   Evento "Realizar depósito" + manejo de saldo
   ============================================================ */

$(function () {
  AlkeData.requireSession();

  let currentOp = "deposit"; // operación activa: deposit | withdraw

  $("#logoutBtn").on("click", function () {
    AlkeData.logout();
    window.location.href = "login.html";
  });

  refreshBalance();

  // Si llega con #retiro en la URL, abrir la pestaña de retiro
  if (window.location.hash === "#retiro") switchOp("withdraw");

  // Cambio de pestaña Depositar / Retirar
  $("#opTabs .nav-link").on("click", function () {
    switchOp($(this).data("op"));
  });

  // Montos rápidos (suman al campo)
  $(".quick-amount").on("click", function () {
    const current = parseInt($("#amount").val(), 10) || 0;
    $("#amount").val(current + $(this).data("val")).trigger("focus");
  });

  // Envío del formulario
  $("#depositForm").on("submit", function (e) {
    e.preventDefault();
    hideAlert();

    const amount = parseInt($("#amount").val(), 10);
    const description = $("#description").val().trim();

    // Validación de monto
    if (!amount || amount <= 0) {
      $("#amount").addClass("is-invalid");
      return;
    }
    $("#amount").removeClass("is-invalid");

    // En retiro, validar fondos suficientes
    if (currentOp === "withdraw" && amount > AlkeData.getBalance()) {
      showAlert("danger", '<i class="bi bi-exclamation-triangle me-1"></i> Fondos insuficientes para realizar el retiro.');
      return;
    }

    // Registrar la transacción (actualiza el saldo internamente)
    AlkeData.addTransaction({
      type: currentOp,
      amount,
      description: description || (currentOp === "deposit" ? "Depósito" : "Retiro"),
    });

    const verb = currentOp === "deposit" ? "depositado" : "retirado";
    showAlert("success", `<i class="bi bi-check-circle me-1"></i> Has ${verb} ${AlkeData.formatCLP(amount)} con éxito.`);

    // Resetear formulario y refrescar saldo con animación
    this.reset();
    refreshBalance(true);
  });

  /* ---------- Helpers ---------- */
  function switchOp(op) {
    currentOp = op;
    $("#opTabs .nav-link").removeClass("active");
    $(`#opTabs .nav-link[data-op="${op}"]`).addClass("active");

    const isDeposit = op === "deposit";
    $("#amountLabel").text(isDeposit ? "Monto a depositar (CLP)" : "Monto a retirar (CLP)");
    $("#submitBtn")
      .text(isDeposit ? "Realizar depósito" : "Realizar retiro")
      .toggleClass("btn-alke", isDeposit)
      .toggleClass("btn-accent", false);
    hideAlert();
  }

  function refreshBalance(animate) {
    const balance = AlkeData.getBalance();
    if (animate) {
      $({ value: 0 }).animate(
        { value: balance },
        {
          duration: 700,
          step: function () {
            $("#balanceAmount").text(AlkeData.formatCLP(Math.round(this.value)));
          },
          complete: function () {
            $("#balanceAmount").text(AlkeData.formatCLP(balance));
          },
        }
      );
    } else {
      $("#balanceAmount").text(AlkeData.formatCLP(balance));
    }
  }

  function showAlert(type, html) {
    $("#opAlert")
      .removeClass("d-none alert-success alert-danger")
      .addClass(`alert-${type}`)
      .html(html);
  }

  function hideAlert() {
    $("#opAlert").addClass("d-none");
  }
});
