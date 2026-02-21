

## Remove duplicate warning icons in the timeline

The warning boxes at 11:00 and 13:30 currently show two warning symbols: a `⚠️` emoji embedded in the translation text AND an `AlertTriangle` Lucide icon rendered by the component. The fix is to remove the emoji from the translation strings, keeping only the component icon.

### Changes

**1. `src/i18n/locales/es.json`**
- `step2Warning`: Remove leading `⚠️ ` from the string
- `step4Warning`: Remove leading `⚠️ ` from the string

**2. `src/i18n/locales/en.json`**
- `step2Warning`: Remove leading `⚠️ `
- `step4Warning`: Remove leading `⚠️ `

**3. `src/i18n/locales/it.json`**
- `step2Warning`: Remove leading `⚠️ `
- `step4Warning`: Remove leading `⚠️ `

### Technical details
- 3 files, 2 string edits each (6 total micro-edits)
- No component changes needed -- the `AlertTriangle` icon in `WeddingSection.tsx` already provides the visual warning indicator
