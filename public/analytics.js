const ANALYTICS_ID = 'G-G8PFNGW36G';

window.dataLayer = window.dataLayer || [];
window.gtag = function gtag() {
  window.dataLayer.push(arguments);
};

window.gtag('js', new Date());
window.gtag('config', ANALYTICS_ID, { anonymize_ip: true });

const analyticsScript = document.createElement('script');
analyticsScript.async = true;
analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ANALYTICS_ID)}`;
analyticsScript.setAttribute('data-analytics-id', ANALYTICS_ID);
document.head.appendChild(analyticsScript);
