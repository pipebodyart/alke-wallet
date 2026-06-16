/* ============================================================
   Alke Wallet - Lógica de Enviar dinero
   - Autocompletar de contactos (jQuery UI)
   - Agregar nuevo contacto (modal Bootstrap)
   - Simular transferencia + actualización de saldo
   ============================================================ */

$(function () {
  AlkeData.requireSession();

  $("#logoutBtn").on("click", function () {
    AlkeData.logout();
    window.location.href = "login.html";
  });

  refreshBalance();
  renderContacts();
  initAutocomplete();

  /* ---------- Autocompletar de contactos ---------- */
  function initAutocomplete() {
    const source = AlkeData.getContacts().map((c) => ({
      label: `${c.name} (${c.email})`,
      value: c.name,
    }));
    $("#contactSearch").autocomplete({
      source: source,
      minLength: 1,
      select: function () {
        $("#contactSearch").removeClass("is-invalid");
      },
    });
  }

  /* ---------- Render de la lista de contactos ---------- */
  function renderContacts() {
    const contacts = AlkeData.getContacts();
    const $list = $("#contactsList").empty();

    if (!contacts.length) {
      $list.append('<p class="text-muted mb-0">No tienes contactos agendados.</p>');
      return;
    }

    contacts.forEach((c) => {
      const initials = c.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
      const $item = $(`
        <div class="list-group-item d-flex align-items-center px-0" style="cursor:pointer;">
          <div class="action-icon bg-soft-primary me-3" style="width:42px;height:42px;font-size:0.95rem;">${initials}</div>
          <div class="flex-grow-1">
            <div class="fw-semibold">${c.name}</div>
            <small class="text-muted">${c.email}</small>
          </div>
          <i class="bi bi-send text-muted"></i>
        </div>
      `);
      // Al hacer clic en un contacto, se carga en el buscador
      $item.on("click", function () {
        $("#contactSearch").val(c.name).removeClass("is-invalid");
        $("#sendAmount").focus();
      });
      $list.append($item);
    });
  }

  /* ---------- Enviar transferencia ---------- */
  $("#sendForm").on("submit", function (e) {
    e.preventDefault();
    hideAlert();

    const contact = $("#contactSearch").val().trim();
    const amount = parseInt($("#sendAmount").val(), 10);
    const description = $("#sendDescription").val().trim();

    let valid = true;
    if (!contact) {
      $("#contactSearch").addClass("is-invalid");
      valid = false;
    }
    if (!amount || amount <= 0) {
      $("#sendAmount").addClass("is-invalid");
      valid = false;
    } else {
      $("#sendAmount").removeClass("is-invalid");
    }
    if (!valid) return;

    // Validar fondos suficientes
    if (amount > AlkeData.getBalance()) {
      showAlert("danger", '<i class="bi bi-exclamation-triangle me-1"></i> Fondos insuficientes para esta transferencia.');
      return;
    }

    // Registrar la transacción (descuenta del saldo)
    AlkeData.addTransaction({
      type: "send",
      amount,
      description: description || "Transferencia",
      contact,
    });

    showAlert("success", `<i class="bi bi-check-circle me-1"></i> Enviaste ${AlkeData.formatCLP(amount)} a <strong>${contact}</strong>.`);
    this.reset();
    refreshBalance(true);
  });

  /* ---------- Agregar nuevo contacto ---------- */
  $("#contactForm").on("submit", function (e) {
    e.preventDefault();
    const name = $("#contactName").val().trim();
    const email = $("#contactEmail").val().trim();

    let valid = true;
    if (!name) {
      $("#contactName").addClass("is-invalid");
      valid = false;
    } else {
      $("#contactName").removeClass("is-invalid");
    }
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      $("#contactEmail").addClass("is-invalid");
      valid = false;
    } else {
      $("#contactEmail").removeClass("is-invalid");
    }
    if (!valid) return;

    AlkeData.addContact({ name, email });

    // Refrescar lista y autocompletar
    renderContacts();
    initAutocomplete();

    // Cerrar el modal y limpiar
    bootstrap.Modal.getInstance(document.getElementById("contactModal")).hide();
    this.reset();

    showAlert("success", `<i class="bi bi-person-check me-1"></i> Contacto <strong>${name}</strong> agregado a tu agenda.`);
  });

  /* ---------- Helpers ---------- */
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
    $("#sendAlert")
      .removeClass("d-none alert-success alert-danger")
      .addClass(`alert-${type}`)
      .html(html);
  }

  function hideAlert() {
    $("#sendAlert").addClass("d-none");
  }
});
