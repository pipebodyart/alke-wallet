# 💼 Alke Wallet

Billetera digital desarrollada como **Evaluación Integradora del Módulo 2 — Fundamentos del desarrollo Front-end**.

Aplicación web responsive que permite a los usuarios iniciar sesión, administrar su saldo, realizar depósitos y retiros, enviar dinero a contactos y revisar su historial de transacciones.

---

## 🛠️ Tecnologías utilizadas

- **HTML5** — estructura semántica
- **CSS3** — estilos personalizados y paleta fintech
- **JavaScript (ES6)** — lógica e interactividad
- **Bootstrap 5** — diseño responsive y componentes (navbar, modales, cards, pills)
- **jQuery 3 + jQuery UI** — manipulación del DOM, animaciones y autocompletar de contactos
- **localStorage** — persistencia de datos (sesión, saldo, transacciones y contactos)

---

## 📂 Estructura del proyecto

```
alke-wallet/
├── index.html          # Punto de entrada (redirige según sesión)
├── login.html          # Inicio de sesión
├── menu.html           # Menú principal + saldo + accesos rápidos
├── deposit.html        # Depósitos y retiros
├── sendmoney.html      # Envío de dinero + agenda de contactos
├── transactions.html   # Historial de transacciones con filtros
├── css/
│   └── styles.css      # Estilos personalizados
└── js/
    ├── data.js         # Capa de datos compartida (localStorage)
    ├── login.js        # Lógica de login
    ├── menu.js         # Lógica del menú
    ├── deposit.js      # Lógica de depósito/retiro
    ├── sendmoney.js    # Lógica de envío + contactos
    └── transactions.js # Lógica del historial
```

---

## 🚀 Cómo ejecutar

1. Clona o descarga el repositorio.
2. Abre `index.html` en tu navegador (doble clic), o usa una extensión como **Live Server** en VS Code.

> No requiere servidor ni instalación: todo corre en el navegador.

---

## 🔑 Credenciales de prueba

| Campo  | Valor              |
|--------|--------------------|
| Correo | `usuario@alke.com` |
| Clave  | `alke1234`         |

---

## ✨ Funcionalidades

- ✅ **Login** con validación de credenciales y campos.
- ✅ **Menú principal** con saldo animado y últimos movimientos.
- ✅ **Depósitos y retiros** con validación de fondos.
- ✅ **Envío de dinero** con simulación de transferencia.
- ✅ **Agenda de contactos** con autocompletar (jQuery UI) y alta vía modal.
- ✅ **Historial de transacciones** con resumen, filtros y formato de moneda CLP.
- ✅ **Diseño responsive** adaptable a móvil, tablet y escritorio.
- ✅ **Persistencia** de datos entre sesiones con `localStorage`.

> 💡 Para reiniciar los datos de demostración, abre la consola del navegador y ejecuta: `AlkeData.reset()`

---

## 👤 Autor

Felipe Farías — Proyecto, 2026.
