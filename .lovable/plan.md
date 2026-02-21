
## Update "Our Story" welcome text

The current text in the "Nuestra Historia" section ends with:
> "...celebrarlo con toda la gente que nos ha acompañado durante este tiempo?"

The new ending should be:
> "...celebrarlo rodeados de las personas que más queremos y que han formado parte de nuestro camino?"

### Changes required

**1. Spanish (`src/i18n/locales/es.json`)**
- Update `sections.ourstory.description` replacing the last sentence with the new text provided.

**2. English (`src/i18n/locales/en.json`)**
- Update the English translation to match the new meaning: "...surrounded by the people we love most and who have been part of our journey?"

**3. Italian (`src/i18n/locales/it.json`)**
- Update the Italian translation similarly: "...circondati dalle persone che amiamo di piu e che hanno fatto parte del nostro cammino?"

### Technical details
- Only 3 translation files need a single string value change each.
- No component or layout changes required.
