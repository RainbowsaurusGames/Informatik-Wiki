// assets/js/layout.js – Zentrale Navigation, Footer (CC-Lizenz & Impressum) & Cookie-Consent

const wikiNavigation = {
    se: [
        { id: "se_02_anforderungsanalyse.html", label: "LA 02" },
        { id: "se_03_vorgehensmodelle.html", label: "LA 03" },
        { id: "se_04_saas.html", label: "LA 04" },
        { id: "se_05_linux_systeme.html", label: "LA 05" }
    ],
    java: [
        { id: "java_04_eclipse_ide.html", label: "LA 04" },
        { id: "java_05_aufbau.html", label: "LA 05" },
        { id: "java_06_grundlagen.html", label: "LA 06 (Theorie)" },
        { id: "java_06_2_aufgaben.html", label: "LA 06 (Aufgaben)" },
        { id: "java_07_kontrollstrukturen.html", label: "LA 07" },
        { id: "java_09_klassen_methoden.html", label: "LA 09" }
    ]
};

document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;
    const fileName = path.split("/").pop() || "index.html";
    const isSubFolder = path.includes("/programmierung/") || path.includes("/software_engineering/");
    const rootPrefix = isSubFolder ? "../" : "./";

    // 1. TOP-BAR AUF UNTERSEITEN AUTOMATISCH AKTUALISIEREN
    const topBar = document.querySelector("div.bg-slate-950.no-print");
    if (topBar && isSubFolder) {
        const isJava = path.includes("/programmierung/") || fileName.startsWith("java_");
        const isLinux = fileName.includes("linux");
        const accentColor = isJava ? "text-java-400" : (isLinux ? "text-linux-400" : "text-sky-400");
        const modulName = isJava ? "Programmierung:" : "Software Engineering:";
        const items = isJava ? wikiNavigation.java : wikiNavigation.se;

        let linksHTML = items.map(item => {
            const isActive = (fileName === item.id);
            const activeClass = isActive ? "text-white font-bold underline underline-offset-4" : "hover:text-white transition";
            return `<a href="${item.id}" class="${activeClass}">${item.label}</a>`;
        }).join("\n        ");

        topBar.innerHTML = `
            <a href="${rootPrefix}index.html" class="font-bold ${accentColor} hover:text-white transition flex items-center gap-1">🏠 Dashboard</a>
            <span class="text-slate-600">|</span>
            <span class="font-bold ${accentColor}">${modulName}</span>
            ${linksHTML}
            <span class="ml-auto flex items-center gap-4 text-[11px]">
                <a href="${rootPrefix}impressum.html" class="text-slate-400 hover:text-white transition">⚖️ Impressum &amp; Datenschutz</a>
            </span>
        `;
    }

    // 2. FOOTER AUF ALLEN SEITEN MIT CC-LIZENZ & IMPRESSUM ERGÄNZEN
    const footer = document.querySelector("footer");
    if (footer) {
        const licenseFooterHTML = `
            <div class="max-w-6xl mx-auto px-4 pt-4 mt-4 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center justify-center sm:justify-between gap-3 text-[11px] text-slate-500 no-print">
                <div>
                    Lizenziert unter <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.de" target="_blank" rel="noopener noreferrer" class="font-bold underline hover:text-sky-500">CC BY-SA 4.0</a> • Erstellt von <strong>Rainbowsaurus Games</strong> (<a href="${rootPrefix}LICENSE.txt" class="underline hover:text-sky-500">Lizenztext</a>)
                </div>
                <div class="flex flex-wrap items-center gap-4 font-semibold">
                    <a href="${rootPrefix}impressum.html" class="hover:text-sky-500 transition">⚖️ Impressum &amp; Datenschutz</a>
                    <span>•</span>
                    <button onclick="openWikiCookieBanner()" class="hover:text-sky-500 transition cursor-pointer">🍪 Cookie-Einstellungen</button>
                    <span>•</span>
                    <a href="https://rainbowsaurus.games" target="_blank" rel="noopener noreferrer" class="hover:text-sky-500 transition">🦖 rainbowsaurus.games</a>
                </div>
            </div>
        `;
        footer.insertAdjacentHTML("beforeend", licenseFooterHTML);
    }

    // 3. YOUTUBE 2-KLICK / CONSENT-PRÜFUNG (FÜR LA 05)
    initYouTubeConsentEmbeds();

    // 4. COOKIE-BANNER ANZEIGEN, FALLS NOCH KEINE AUSWAHL GETROFFEN WURDE
    if (!localStorage.getItem("wikiCookieConsent")) {
        renderWikiCookieBanner(rootPrefix);
    }
});

// YouTube-Videos freischalten, wenn Consent == 'all'
function initYouTubeConsentEmbeds() {
    const ytWrapper = document.getElementById("yt-schaltjahr-wrapper");
    if (!ytWrapper) return;

    const consent = localStorage.getItem("wikiCookieConsent");
    if (consent === "all") {
        loadYouTubeSchaltjahrIframe();
    }
}

window.loadYouTubeSchaltjahrIframe = function(saveConsent = false) {
    if (saveConsent) {
        localStorage.setItem("wikiCookieConsent", "all");
        const banner = document.getElementById("wikiCookieBanner");
        if (banner) banner.remove();
    }
    const ytWrapper = document.getElementById("yt-schaltjahr-wrapper");
    if (!ytWrapper) return;

    ytWrapper.innerHTML = `
        <iframe 
            class="w-full h-full"
            src="https://www.youtube-nocookie.com/embed/5qdhqLqqZFQ?rel=0" 
            title="TV Total Klassiker: Was machen Sachen (Schaltjahr)" 
            frameborder="0" 
            referrerpolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen>
        </iframe>
    `;
};

// Cookie-Banner erstellen & anzeigen
window.openWikiCookieBanner = function() {
    const isSubFolder = window.location.pathname.includes("/programmierung/") || window.location.pathname.includes("/software_engineering/");
    renderWikiCookieBanner(isSubFolder ? "../" : "./");
};

function renderWikiCookieBanner(rootPrefix) {
    const existing = document.getElementById("wikiCookieBanner");
    if (existing) existing.remove();

    const banner = document.createElement("div");
    banner.id = "wikiCookieBanner";
    banner.className = "no-print fixed bottom-4 left-4 right-4 z-50 max-w-4xl mx-auto bg-slate-900/95 backdrop-blur-md text-white p-5 rounded-2xl shadow-2xl border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4";
    banner.innerHTML = `
        <div class="space-y-1 text-xs sm:text-sm text-slate-300">
            <div class="font-extrabold text-white text-sm sm:text-base flex items-center gap-2">
                <span>🍪 Datenschutz &amp; Lokale Speicherung im IHK-Wiki</span>
            </div>
            <p class="leading-relaxed">
                Dieses Wiki nutzt den lokalen Browser-Speicher (<code>localStorage</code>) für deinen optionalen Spitznamen auf dem Dashboard sowie für diese Einstellung. Wenn du <strong>„Alle akzeptieren“</strong> wählst, werden außerdem eingebettete Lernvideos von <strong>YouTube (im erweiterten Datenschutzmodus)</strong> direkt geladen. Details findest du im <a href="${rootPrefix}impressum.html" class="text-sky-400 underline hover:text-sky-300">Impressum &amp; Datenschutz</a>.
            </p>
        </div>
        <div class="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0 w-full md:w-auto justify-end">
            <button onclick="setWikiCookieConsent('essential')" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-bold transition cursor-pointer">
                🛡️ Nur Notwendige
            </button>
            <button onclick="setWikiCookieConsent('all')" class="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-extrabold transition shadow-md cursor-pointer">
                ✅ Alle akzeptieren (inkl. YouTube)
            </button>
        </div>
    `;
    document.body.appendChild(banner);
}

window.setWikiCookieConsent = function(level) {
    localStorage.setItem("wikiCookieConsent", level);
    const banner = document.getElementById("wikiCookieBanner");
    if (banner) banner.remove();

    if (level === "all") {
        initYouTubeConsentEmbeds();
    }
};