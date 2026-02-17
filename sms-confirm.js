const otpInput = document.getElementById('otp-input');
const codeDigits = document.querySelectorAll('.confirm__code-digit');
const codeContainer = document.querySelector('.confirm__code-input');

if ('OTPCredential' in window) {
  const ac = new AbortController();

  navigator.credentials.get({
    otp: { transport: ['sms'] },
    signal: ac.signal
  })
    .then(otp => {
      if (otp && otp.code) {
        console.log('Получен код через Web OTP:', otp.code);
        otpInput.value = otp.code.substring(0, 4);
        updateDigits();
        checkCodeComplete();
      }
    })
    .catch(err => {
      if (err.name !== 'AbortError') {
        console.error('Web OTP error:', err);
      }
    });

  setTimeout(() => {
    ac.abort();
  }, 60000);
}

function updateDigits() {
  const code = otpInput.value.replace(/\D/g, '').substring(0, 4);

  codeDigits.forEach((digit, index) => {
    if (code[index]) {
      digit.setAttribute('data-value', code[index]);
    } else {
      digit.removeAttribute('data-value');
    }

    digit.classList.remove('focused');
  });

  if (code.length < 4) {
    codeDigits[code.length].classList.add('focused');
  }
}

otpInput.addEventListener('input', (e) => {
  const value = e.target.value.replace(/\D/g, '');
  e.target.value = value.substring(0, 4);

  updateDigits();
  codeContainer.classList.remove('error');
  checkCodeComplete();
});

otpInput.addEventListener('paste', (e) => {
  e.preventDefault();
  const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');

  if (pastedData) {
    otpInput.value = pastedData.substring(0, 4);
    updateDigits();
    codeContainer.classList.remove('error');
    checkCodeComplete();
  }
});

otpInput.addEventListener('keydown', (e) => {
  if (e.key === 'Backspace' && otpInput.value.length === 0) {
    e.preventDefault();
  }
});

codeContainer.addEventListener('click', () => {
  otpInput.focus();
});

function checkCodeComplete() {
  const code = otpInput.value.replace(/\D/g, '');

  if (code.length === 4) {
    submitCode(code);
  }
}

function submitCode(code) {
  console.log('Отправка кода:', code);
}

window.addEventListener('DOMContentLoaded', () => {
  otpInput.focus();
  updateDigits();
});
