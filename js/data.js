/* ============================================================
   Alke Wallet - Capa de datos compartida
   Maneja la persistencia en localStorage: usuario, sesión,
   saldo, transacciones y contactos.
   ============================================================ */

const AlkeData = (() => {
  // Claves usadas en localStorage
  const KEYS = {
    user: "alke_user",
    session: "alke_session",
    balance: "alke_balance",
    transactions: "alke_transactions",
    contacts: "alke_contacts",
  };

  // Usuario de demostración (credenciales de prueba)
  const DEMO_USER = {
    name: "Felipe Farías",
    email: "usuario@alke.com",
    password: "alke1234",
  };

  /* ---------- Inicialización / Seed de datos ---------- */
  function seed() {
    // El usuario demo es autoritativo desde el código: se sincroniza
    // en cada carga para que cambios de nombre/correo se reflejen
    // aunque ya exista un valor antiguo guardado en localStorage.
    localStorage.setItem(KEYS.user, JSON.stringify(DEMO_USER));
    if (localStorage.getItem(KEYS.balance) === null) {
      localStorage.setItem(KEYS.balance, "1250000"); // saldo inicial CLP
    }
    if (!localStorage.getItem(KEYS.contacts)) {
      const contacts = [
        { id: 1, name: "María González", email: "maria@correo.com" },
        { id: 2, name: "Juan Pérez", email: "juan@correo.com" },
        { id: 3, name: "Camila Rojas", email: "camila@correo.com" },
        { id: 4, name: "Diego Muñoz", email: "diego@correo.com" },
      ];
      localStorage.setItem(KEYS.contacts, JSON.stringify(contacts));
    }
    if (!localStorage.getItem(KEYS.transactions)) {
      const tx = [
        { id: 1, type: "deposit", amount: 500000, description: "Depósito inicial", contact: null, date: "2026-06-01T10:15:00" },
        { id: 2, type: "send", amount: 75000, description: "Pago arriendo", contact: "María González", date: "2026-06-03T14:30:00" },
        { id: 3, type: "receive", amount: 120000, description: "Reembolso", contact: "Juan Pérez", date: "2026-06-07T09:05:00" },
        { id: 4, type: "withdraw", amount: 40000, description: "Retiro cajero", contact: null, date: "2026-06-10T18:45:00" },
      ];
      localStorage.setItem(KEYS.transactions, JSON.stringify(tx));
    }
  }

  /* ---------- Sesión ---------- */
  function login(email, password) {
    const user = getUser();
    if (user && email.trim().toLowerCase() === user.email.toLowerCase() && password === user.password) {
      localStorage.setItem(KEYS.session, "true");
      return true;
    }
    return false;
  }

  function logout() {
    localStorage.removeItem(KEYS.session);
  }

  function isLoggedIn() {
    return localStorage.getItem(KEYS.session) === "true";
  }

  // Protege una página: si no hay sesión, redirige al login
  function requireSession() {
    if (!isLoggedIn()) {
      window.location.href = "login.html";
    }
  }

  /* ---------- Usuario ---------- */
  function getUser() {
    return JSON.parse(localStorage.getItem(KEYS.user));
  }

  /* ---------- Saldo ---------- */
  function getBalance() {
    return parseInt(localStorage.getItem(KEYS.balance), 10) || 0;
  }

  function setBalance(value) {
    localStorage.setItem(KEYS.balance, String(Math.round(value)));
  }

  /* ---------- Transacciones ---------- */
  function getTransactions() {
    return JSON.parse(localStorage.getItem(KEYS.transactions)) || [];
  }

  function addTransaction({ type, amount, description, contact = null }) {
    const tx = getTransactions();
    const newTx = {
      id: tx.length ? Math.max(...tx.map((t) => t.id)) + 1 : 1,
      type,
      amount: Math.round(amount),
      description: description || "",
      contact,
      date: new Date().toISOString(),
    };
    tx.push(newTx);
    localStorage.setItem(KEYS.transactions, JSON.stringify(tx));

    // Actualiza el saldo según el tipo de movimiento
    let balance = getBalance();
    if (type === "deposit" || type === "receive") balance += newTx.amount;
    else balance -= newTx.amount; // withdraw / send
    setBalance(balance);

    return newTx;
  }

  /* ---------- Contactos ---------- */
  function getContacts() {
    return JSON.parse(localStorage.getItem(KEYS.contacts)) || [];
  }

  function addContact({ name, email }) {
    const contacts = getContacts();
    const newContact = {
      id: contacts.length ? Math.max(...contacts.map((c) => c.id)) + 1 : 1,
      name,
      email,
    };
    contacts.push(newContact);
    localStorage.setItem(KEYS.contacts, JSON.stringify(contacts));
    return newContact;
  }

  /* ---------- Utilidades de formato ---------- */
  function formatCLP(value) {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(value);
  }

  function formatDate(isoString) {
    const d = new Date(isoString);
    return d.toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Reinicia todos los datos a su estado original (útil para demos)
  function reset() {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
    seed();
  }

  // Ejecuta el seed apenas se carga el script
  seed();

  // Rellena automáticamente cualquier elemento del HTML que use
  // data-alke="name" | "firstname" | "email" con los datos del usuario.
  // Así el nombre (Felipe) aparece en todas las páginas sin código extra.
  function fillUserPlaceholders() {
    const user = getUser();
    if (!user) return;
    document.querySelectorAll('[data-alke="name"]').forEach((el) => (el.textContent = user.name));
    document.querySelectorAll('[data-alke="firstname"]').forEach((el) => (el.textContent = user.name.split(" ")[0]));
    document.querySelectorAll('[data-alke="email"]').forEach((el) => (el.textContent = user.email));
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fillUserPlaceholders);
  } else {
    fillUserPlaceholders();
  }

  return {
    DEMO_USER,
    login,
    logout,
    isLoggedIn,
    requireSession,
    getUser,
    getBalance,
    setBalance,
    getTransactions,
    addTransaction,
    getContacts,
    addContact,
    formatCLP,
    formatDate,
    reset,
  };
})();
