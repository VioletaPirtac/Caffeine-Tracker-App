# Caffeine Intake Tracker (simple)

This is a minimal static web app that tracks caffeine intake for three coffee beverages:
- Espresso — 60 mg per shot
- Americano — 150 mg
- Cappuccino — 80 mg

Features:
- Click buttons to add a drink's caffeine amount to the total.
- Visual progress bar showing progress toward the recommended daily limit of 400 mg.
- Message changes color/state as you approach or exceed the limit.
- RESET button clears the tracked total (stored in localStorage).

Daily history and calendar view:
- The app saves daily totals in localStorage and shows a simple month calendar below the tracker.
- Click a date in the calendar to view or log drinks for that day. Each day's total is saved separately.
- Use the ◀ and ▶ buttons to navigate months.

How to run (quick):

Using Python 3 (recommended):

```powershell
cd "c:\Users\Bruger\Desktop\Violeta\AU_Technology Based Business Development Engineering (Winter Intake)\03_Sem2\Digi\helloworld"
python -m http.server 8000
```

Then open http://localhost:8000 in your browser.

Or simply open `index.html` in a browser (some browsers restrict localStorage when using file://; use a local server if you see issues).
