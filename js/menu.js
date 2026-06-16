/* ============================================================
   Alke Wallet - Lógica del Menú principal
   ============================================================ */

$(function () {
  AlkeData.requireSession(); // protege la página

  const user = AlkeData.getUser();
  $("#userName").text(user.name.split(" ")[0]);
  $("#userEmail").text(user.email);

  // Animación del saldo (cuenta progresiva con jQuery)
  animateBalance(AlkeData.getBalance());

  renderRecent();

  // Cerrar sesión
  $("#logoutBtn").on("click", function () {
    AlkeData.logout();
    window.location.href = "login.html";
  });

  function animateBalance(target) {
    $({ value: 0 }).animate(
      { value: target },
      {
        duration: 900,
        easing: "swing",
        step: function () {
          $("#balanceAmount").text(AlkeData.formatCLP(Math.round(this.value)));
        },
        complete: function () {
          $("#balanceAmount").text(AlkeData.formatCLP(target));
        },
      }
    );
  }

  function renderRecent() {
    const tx = AlkeData.getTransactions().slice(-4).reverse();
    const $list = $("#recentList").empty();

    if (!tx.length) {
      $list.append('<p class="text-muted mb-0">Aún no hay movimientos.</p>');
      return;
    }

    tx.forEach((t) => {
      const isIn = t.type === "deposit" || t.type === "receive";
      const sign = isIn ? "+" : "−";
      const meta = txMeta(t.type);
      $list.append(`
        <div class="list-group-item d-flex justify-content-between align-items-center px-0">
          <div class="d-flex align-items-center">
            <div class="action-icon ${meta.bg} me-3" style="width:42px;height:42px;font-size:1.1rem;">
              <i class="bi ${meta.icon}"></i>
            </div>
            <div>
              <div class="fw-semibold">${meta.label}</div>
              <small class="text-muted">${t.description || meta.label} · ${AlkeData.formatDate(t.date)}</small>
            </div>
          </div>
          <span class="${isIn ? "amount-in" : "amount-out"}">${sign} ${AlkeData.formatCLP(t.amount)}</span>
        </div>
      `);
    });
  }

  function txMeta(type) {
    switch (type) {
      case "deposit":  return { label: "Depósito", icon: "bi-cash-coin", bg: "bg-soft-accent" };
      case "receive":  return { label: "Recepción", icon: "bi-arrow-down-circle", bg: "bg-soft-accent" };
      case "send":     return { label: "Envío", icon: "bi-send", bg: "bg-soft-primary" };
      case "withdraw": return { label: "Retiro", icon: "bi-cash-stack", bg: "bg-soft-danger" };
      default:         return { label: "Movimiento", icon: "bi-circle", bg: "bg-soft-info" };
    }
  }
});
