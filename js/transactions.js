/* ============================================================
   Alke Wallet - Lógica del Historial de transacciones
   Visualización, resumen y filtros con jQuery
   ============================================================ */

$(function () {
  AlkeData.requireSession();

  $("#logoutBtn").on("click", function () {
    AlkeData.logout();
    window.location.href = "login.html";
  });

  let currentFilter = "all";

  renderSummary();
  renderTable(currentFilter);

  // Filtros
  $(".filter-btn").on("click", function () {
    $(".filter-btn").removeClass("active");
    $(this).addClass("active");
    currentFilter = $(this).data("filter");
    renderTable(currentFilter);
  });

  /* ---------- Resumen ---------- */
  function renderSummary() {
    const tx = AlkeData.getTransactions();
    let totalIn = 0;
    let totalOut = 0;

    tx.forEach((t) => {
      if (t.type === "deposit" || t.type === "receive") totalIn += t.amount;
      else totalOut += t.amount;
    });

    $("#sumBalance").text(AlkeData.formatCLP(AlkeData.getBalance()));
    $("#sumIn").text("+ " + AlkeData.formatCLP(totalIn));
    $("#sumOut").text("− " + AlkeData.formatCLP(totalOut));
    $("#sumCount").text(tx.length);
  }

  /* ---------- Tabla ---------- */
  function renderTable(filter) {
    let tx = AlkeData.getTransactions().slice().reverse(); // más recientes primero
    if (filter !== "all") tx = tx.filter((t) => t.type === filter);

    const $body = $("#txTableBody").empty();

    if (!tx.length) {
      $("#emptyMsg").removeClass("d-none");
      return;
    }
    $("#emptyMsg").addClass("d-none");

    tx.forEach((t) => {
      const isIn = t.type === "deposit" || t.type === "receive";
      const sign = isIn ? "+" : "−";
      const meta = txMeta(t.type);
      const $row = $(`
        <tr style="display:none;">
          <td>
            <span class="tx-badge ${isIn ? "tx-in" : "tx-out"}">
              <i class="bi ${meta.icon} me-1"></i>${meta.label}
            </span>
          </td>
          <td>${t.description || meta.label}</td>
          <td>${t.contact || "<span class='text-muted'>—</span>"}</td>
          <td class="text-muted small">${AlkeData.formatDate(t.date)}</td>
          <td class="text-end ${isIn ? "amount-in" : "amount-out"}">${sign} ${AlkeData.formatCLP(t.amount)}</td>
        </tr>
      `);
      $body.append($row);
      $row.fadeIn(250); // animación de aparición con jQuery
    });
  }

  function txMeta(type) {
    switch (type) {
      case "deposit":  return { label: "Depósito", icon: "bi-cash-coin" };
      case "receive":  return { label: "Recepción", icon: "bi-arrow-down-circle" };
      case "send":     return { label: "Envío", icon: "bi-send" };
      case "withdraw": return { label: "Retiro", icon: "bi-cash-stack" };
      default:         return { label: "Movimiento", icon: "bi-circle" };
    }
  }
});
