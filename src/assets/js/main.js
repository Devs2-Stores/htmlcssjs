if (document.getElementById("copyResult")) {
  document.getElementById("copyResult").addEventListener("click", (event) => {
    const resultText = document.getElementById("textResult").value;
    if (resultText) {
      navigator.clipboard.writeText(resultText).then(() => {
        event.target.innerText = "Copied!";
        setTimeout(() => {
          event.target.innerText = "Copy Result";
        }, 2000);
      });
    }
    else {
      event.target.innerText = "Nothing to copy!";
      setTimeout(() => {
        event.target.innerText = "Copy Result";
      }, 2000);
    }
  });
}

if (document.getElementById("clearAll")) {
  document.getElementById("clearAll").addEventListener("click", (event) => {
    const inputText = document.getElementById("textInput").value;
    const resultText = document.getElementById("textResult").value;
    if (inputText || resultText) {
      document.getElementById("textInput").value = "";
      document.getElementById("textResult").value = "";
      document.getElementById("textInput").focus();
      event.target.innerText = "Cleared!";
      setTimeout(() => {
        event.target.innerText = "Clear All";
      }, 2000);
    }
    else {
      event.target.innerText = "Nothing to clear!";
      setTimeout(() => {
        event.target.innerText = "Clear All";
      }, 2000);
    }
  });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/public/service-worker.js')
      .then(function (registration) {
        console.log('ServiceWorker registered: ', registration.scope);
      }, function (err) {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}