/* ==========================================================================
   MM PROPERTIES - MORTGAGE & INVESTMENT ROI CALCULATOR ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const priceSlider = document.getElementById('calc-prop-price');
  const downPaymentSlider = document.getElementById('calc-down-percent');
  const rateSlider = document.getElementById('calc-interest-rate');
  const termSlider = document.getElementById('calc-loan-term');

  const priceValDisplay = document.getElementById('calc-prop-price-val');
  const downValDisplay = document.getElementById('calc-down-percent-val');
  const rateValDisplay = document.getElementById('calc-interest-rate-val');
  const termValDisplay = document.getElementById('calc-loan-term-val');

  const monthlyOutput = document.getElementById('calc-monthly-payment');
  const principalOutput = document.getElementById('calc-total-principal');
  const interestOutput = document.getElementById('calc-total-interest');
  const roiOutput = document.getElementById('calc-est-appreciation');

  if (!priceSlider || !downPaymentSlider || !rateSlider || !termSlider) return;

  function formatCurrency(amount) {
    const currencySelect = document.getElementById('currency-selector');
    const currency = currencySelect ? currencySelect.value : 'INR';

    let symbol = '₹';
    let rate = 1;

    if (currency === 'USD') {
      symbol = '$';
      rate = 0.012;
    } else if (currency === 'AED') {
      symbol = 'AED ';
      rate = 0.044;
    } else if (currency === 'SGD') {
      symbol = 'S$';
      rate = 0.016;
    }

    const converted = amount * rate;
    return symbol + Math.round(converted).toLocaleString('en-IN');
  }

  function updateMortgageCalculation() {
    const propertyPrice = parseFloat(priceSlider.value);
    const downPercent = parseFloat(downPaymentSlider.value);
    const annualInterestRate = parseFloat(rateSlider.value);
    const loanTermYears = parseInt(termSlider.value, 10);

    // Update Slider text badges
    priceValDisplay.textContent = formatCurrency(propertyPrice);
    downValDisplay.textContent = `${downPercent}% (${formatCurrency((propertyPrice * downPercent) / 100)})`;
    rateValDisplay.textContent = `${annualInterestRate.toFixed(1)}%`;
    termValDisplay.textContent = `${loanTermYears} Years`;

    const downPaymentAmount = (propertyPrice * downPercent) / 100;
    const loanPrincipal = propertyPrice - downPaymentAmount;
    const monthlyRate = annualInterestRate / 100 / 12;
    const totalPayments = loanTermYears * 12;

    let monthlyPayment = 0;
    if (annualInterestRate === 0) {
      monthlyPayment = loanPrincipal / totalPayments;
    } else {
      monthlyPayment =
        (loanPrincipal *
          (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
        (Math.pow(1 + monthlyRate, totalPayments) - 1);
    }

    const totalPaid = monthlyPayment * totalPayments;
    const totalInterest = totalPaid - loanPrincipal;
    // Estimated luxury capital appreciation at ~6.8% CAGR over loan period
    const estimatedAppreciation = propertyPrice * Math.pow(1 + 0.068, 5) - propertyPrice;

    // Display updates
    if (monthlyOutput) monthlyOutput.textContent = formatCurrency(monthlyPayment) + ' /mo';
    if (principalOutput) principalOutput.textContent = formatCurrency(loanPrincipal);
    if (interestOutput) interestOutput.textContent = formatCurrency(totalInterest);
    if (roiOutput) roiOutput.textContent = '+' + formatCurrency(estimatedAppreciation) + ' (5-Yr Est.)';
  }

  // Bind Listeners
  [priceSlider, downPaymentSlider, rateSlider, termSlider].forEach((slider) => {
    slider.addEventListener('input', updateMortgageCalculation);
  });

  // Re-calculate when global currency selector changes
  const currencySelect = document.getElementById('currency-selector');
  if (currencySelect) {
    currencySelect.addEventListener('change', updateMortgageCalculation);
  }

  // Initial calculation
  updateMortgageCalculation();
});
