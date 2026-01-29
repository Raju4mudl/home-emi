# 🏠 Home Loan EMI Calculator

A comprehensive and feature-rich home loan EMI calculator built with React and Vite. Calculate your monthly EMI, track rate changes, manage disbursements, plan part payments, and visualize your complete loan amortization schedule.

🌐 **Live Demo:** [https://home-emi.web.app](https://home-emi.web.app)

## ✨ Features

### Core Functionality
- **EMI Calculation** - Accurate monthly EMI calculation with customizable loan parameters
- **Amortization Schedule** - Complete month-by-month breakdown of principal and interest
- **Interactive Charts** - Visual representation of payment breakdown over time
- **Summary Cards** - Quick overview of total interest, principal, and payable amount

### Advanced Features
- **📦 Multiple Disbursements** - Handle construction loans with staggered disbursements
  - Progressive EMI recalculation with each disbursement
  - Optional manual pre-EMI entry
  - Accurate tenure-based EMI computation
  
- **📈 Interest Rate Changes** - Track and apply rate changes throughout loan tenure
  - EMI adjustment or tenure adjustment options
  - Automatic recalculation of remaining schedule
  
- **💰 Part Payments** - Plan lump sum payments to reduce loan burden
  - One-time part payments
  - **Recurring annual payments** - Set it once, auto-applies every year
  
- **💾 Data Persistence** - Automatic save to browser localStorage
  - Never lose your entered data
  - Persists across page reloads
  
- **📄 PDF Export** - Download complete loan report
  - All input details
  - Full amortization schedule
  - Summary and charts included
  
- **📧 Contact Form** - Direct messaging via EmailJS integration
- **🗑️ Clear All Data** - Reset everything with confirmation

## 🚀 Getting Started

### Prerequisites
- Node.js 20.19+ or 22.12+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Raju4mudl/home-loan-emi-calculator.git

# Navigate to project directory
cd home-loan-emi-calculator

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🛠️ Tech Stack

- **React** - UI library
- **Vite** - Build tool and dev server
- **html2pdf.js** - PDF generation
- **EmailJS** - Contact form integration
- **CSS Variables** - Theme and styling

## 📱 Usage

1. **Enter Loan Details**: Home value, down payment, interest rate, and tenure
2. **Add Disbursements** (optional): For construction loans with multiple disbursements
3. **Track Rate Changes** (optional): Add any interest rate changes over loan period
4. **Plan Part Payments** (optional): Add one-time or recurring annual part payments
5. **Export PDF**: Download complete report with all details

## 🎨 Features Showcase

- **Progressive EMI Model**: EMI recalculates immediately after each disbursement
- **Smart Rate Processing**: Rate changes processed before disbursements in same month
- **Recurring Payments**: Annual part payments auto-apply without manual entry
- **Auto-Save**: All data persists in browser localStorage

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Developer

**Raju Gorai**
- LinkedIn: [https://www.linkedin.com/in/raju-gorai/](https://www.linkedin.com/in/raju-gorai/)
- Email: mythoughtraju@gmail.com

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

© 2026 Home Loan EMI Calculator. Developed with ❤️ by Raju Gorai
