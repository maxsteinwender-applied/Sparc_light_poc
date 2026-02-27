<script setup lang="ts">
import MainLayout from '~/components/MainLayout.vue'

const quickCards = [
  { title: 'Dynamisierung', pill: '3 % jährlich' },
  { title: 'VL-Sparen', pill: '40 EUR monatlich' },
  { title: 'Deka-AbräumSparen', pill: '80 EUR monatlich' },
  { title: 'Starteinlage', pill: '+2.000 EUR einmalig' },
]

const legendItems = [
  { key: 'A', label: 'Deka-FondsSparplan', color: '#003745' },
  { key: 'B', label: 'Dynamisierung', color: '#1A6B80' },
  { key: 'C', label: 'VL-Sparen', color: '#99B8C0' },
  { key: 'D', label: 'Deka-AbräumSparen', color: '#CDDBDF' },
  { key: 'E', label: 'Starteinlage', color: '#071C21' },
]

</script>

<template>
  <div class="min-h-screen bg-[#F5F9FA] text-[#003745]">
    <header class="sticky top-0 z-50 border-b border-[#D3E0E5] bg-white">
      <div class="mx-auto flex h-[72px] w-full max-w-[1280px] items-center justify-between px-4 md:px-10">
        <img src="/images/brand/deka/Logo.svg" alt="Deka" class="h-8 w-auto md:h-9">
        <nav class="hidden items-center gap-8 text-[15px] text-[#2E5C69] md:flex">
          <a href="#" class="hover:underline">Privatkunden</a>
          <a href="#" class="hover:underline">Unser Angebot</a>
          <a href="#" class="hover:underline">Wertpapiersparen</a>
        </nav>
        <button type="button" class="inline-flex items-center gap-1 text-sm font-semibold text-[#003745]">
          <span class="material-symbols-outlined text-[20px]" aria-hidden="true">menu</span>
        </button>
      </div>
    </header>

    <main>
      <section class="bg-white">
        <div class="mx-auto w-full max-w-[1280px] px-4 py-10 md:px-10 md:py-12">
          <div class="grid gap-8 lg:grid-cols-[minmax(0,564px)_minmax(0,564px)] lg:gap-10">
            <div>
              <h2 class="text-[32px] leading-[1.2] tracking-[0.25px] md:text-[40px]">Übersicht der Deka-Lösungen zum Sparen</h2>
              <p class="mt-4 max-w-[540px] text-[18px] leading-[1.4] text-[#1F6275] md:text-[20px]">
                Aktivieren Sie für sich interessante Produkte und finden Sie Ihre Sparlösung.
              </p>

              <article class="mt-8 rounded-[4px] bg-[#F4EFE4] p-6">
                <div class="flex items-center gap-3 text-lg">
                  <span class="inline-flex h-8 w-10 items-center justify-end rounded-full bg-[#1A6B80] p-[2px]">
                    <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-[14px] text-[#003745]">✓</span>
                  </span>
                  <span>Deka-FondsSparplan</span>
                </div>

                <h3 class="mt-7 text-[24px] leading-[1.18] md:text-[24px]">Wie viel können Sie monatlich in jedem Fall fürs Sparen zur Seite legen?</h3>
                <p class="mt-4 text-[18px] leading-[1.35] md:text-[20px]">Deka-FondsSparplan ist mit aktiv Fonds und ETFs möglich</p>

                <div class="mt-8 border-b border-[#BFD2D8] pb-2">
                  <div class="flex gap-10 text-base md:text-[20px]">
                    <button type="button" class="relative pb-2 font-semibold text-[#003745]">
                      Auswahl
                      <span class="absolute bottom-[-11px] left-0 h-[2px] w-full bg-[#EE0000]" />
                    </button>
                    <button type="button" class="pb-2 text-[#003745]">Individueller Betrag</button>
                  </div>
                </div>

                <p class="mt-4 text-base md:text-[20px]">Monatlicher Sparbetrag</p>
                <div class="mt-4 flex items-center gap-4">
                  <button type="button" class="inline-flex h-10 w-10 items-center justify-center bg-[#003745] text-white">−</button>
                  <div class="flex-1">
                    <div class="h-4 rounded-full bg-[#D9E6EB] p-[5px]">
                      <div class="relative h-full rounded-full bg-[#00556C]">
                        <span class="absolute right-[-12px] top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#00556C]" />
                      </div>
                    </div>
                    <div class="mt-3 grid grid-cols-4 text-[16px] text-[#0B3D4C] md:text-[16px]">
                      <span>25 EUR</span>
                      <span>100 EUR</span>
                      <span>250 EUR</span>
                      <span>500 EUR</span>
                    </div>
                  </div>
                  <button type="button" class="inline-flex h-10 w-10 items-center justify-center bg-[#003745] text-white">+</button>
                </div>

                <button type="button" class="mt-8 inline-flex items-center gap-1 text-sm text-[#0043B4] underline underline-offset-4 md:text-base">
                  Weitere Details einblenden
                  <span class="material-symbols-outlined text-[20px]" aria-hidden="true">expand_more</span>
                </button>
              </article>

              <div class="mt-4 space-y-3 md:mt-6 md:space-y-4">
                <article
                  v-for="card in quickCards"
                  :key="card.title"
                  class="rounded-[4px] border border-[#C9D9E0] bg-[#F5F9FA] px-5 py-5 md:px-6 md:py-6"
                >
                  <div class="flex items-center justify-between gap-4">
                    <div class="flex items-center gap-3">
                      <span class="inline-flex h-8 w-10 items-center justify-end rounded-full bg-[#1A6B80] p-[2px]">
                        <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-[14px] text-[#003745]">✓</span>
                      </span>
                      <p class="text-[20px] md:text-[20px]">{{ card.title }}</p>
                    </div>
                    <div class="flex items-center gap-3">
                      <span class="rounded-full bg-[#E6EEF0] px-3 py-1 text-xs font-semibold text-[#1A6B80] md:text-sm">{{ card.pill }}</span>
                      <span class="material-symbols-outlined text-[24px] text-[#003745]" aria-hidden="true">expand_more</span>
                    </div>
                  </div>
                </article>
              </div>
            </div>

            <div>
              <h2 class="text-[32px] leading-[1.2] tracking-[0.25px] md:text-[40px]">So könnte sich Ihr Vermögen entwickeln</h2>
              <div class="mt-6 grid gap-4 sm:grid-cols-2 md:mt-7">
                <div class="border-r border-[#C4D4DA] pr-4">
                  <p class="text-base md:text-[18px]">Ergebnis nach 30 Jahren</p>
                  <p class="mt-2 text-[32px] md:text-[40px]">231.000 EUR</p>
                  <p class="mt-2 text-base font-semibold text-[#277A6B] md:text-[20px]">+225,8% | +128.710 EUR</p>
                </div>
                <div>
                  <p class="text-base md:text-[18px]">Vergleichswert</p>
                  <p class="mt-2 text-[32px] md:text-[40px]">102.290 EUR</p>
                </div>
              </div>

              <div class="mt-6 h-[320px] rounded-[4px] border border-[#D3E0E5] bg-gradient-to-tr from-[#0B5D72] via-[#BFD4DB] to-[#E5EEF2] md:h-[420px]">
                <div class="flex h-full items-end justify-around px-6 pb-4">
                  <div class="h-[12%] w-[12%] rounded-t bg-[#D5E3E8]" />
                  <div class="h-[18%] w-[12%] rounded-t bg-[#AFC8D0]" />
                  <div class="h-[34%] w-[12%] rounded-t bg-[#89AEB8]" />
                  <div class="h-[56%] w-[12%] rounded-t bg-[#5E8D99]" />
                </div>
              </div>

              <div class="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs md:text-sm">
                <span v-for="item in legendItems" :key="item.key" class="inline-flex items-center gap-2">
                  <span class="inline-block h-2.5 w-2.5" :style="{ backgroundColor: item.color }" />
                  <span class="font-semibold">{{ item.key }}</span>
                  <span>{{ item.label }}</span>
                </span>
              </div>

              <p class="mt-5 text-xs leading-relaxed text-[#003745] md:text-sm">
                Bei dieser Grafik und dem dazugehörigen Rechenbeispiel handelt es sich um eine Veranschaulichung der
                Funktionsweisen von Deka-FondsSparplan, Dynamisierung, VL-Sparen, Deka-AbräumSparen und Starteinlage.
                Bitte beachten Sie: Die angezeigte Wertentwicklung ist nur beispielhaft und kein verlässlicher
                Indikator für die künftige Wertentwicklung.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-white py-14 md:py-20">
        <div class="w-full px-4 md:px-10">
          <MainLayout :show-prototype-ticker="false" :fill-viewport="false" />
        </div>
      </section>

      <section class="bg-[#F5F9FA] px-4 py-12 md:px-10 md:py-20">
        <div class="mx-auto w-full max-w-[696px]">
          <p class="inline-flex rounded-full bg-[#055366] px-3 py-1 text-sm font-bold text-white">Persönliche Beratung</p>
          <h2 class="mt-4 text-[32px] leading-[1.2] tracking-[0.25px] md:text-[40px]">
            Jetzt Deka-FondsSparplan in Ihrer Sparkasse abschließen!
          </h2>
          <p class="mt-5 text-[18px] leading-[1.35] text-[#1A6B80] md:text-[20px]">
            So einfach geht's! Geben Sie Ihre Postleitzahl bzw. Ort oder Bankleitzahl ein und starten Sie die Suche.
          </p>

          <div class="mt-8 grid grid-cols-[42px_1fr_auto] items-stretch">
            <div class="flex items-center justify-center bg-[#EE0000] text-white">S</div>
            <div class="flex items-center border border-[#003745] bg-transparent px-4 text-[#003745]">
              <span class="text-base md:text-base">60598</span>
              <button type="button" class="ml-auto text-[#003745]">
                <span class="material-symbols-outlined text-[20px]" aria-hidden="true">close</span>
              </button>
            </div>
            <button type="button" class="inline-flex items-center gap-1 bg-[#EE0000] px-4 text-white md:px-6">
              <span class="text-sm font-semibold md:text-base">Sparkasse suchen</span>
              <span class="material-symbols-outlined text-[18px]" aria-hidden="true">search</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
