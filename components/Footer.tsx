export function Footer() {
  return (
    <footer className="border-t border-tft-border bg-tft-surface px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center lg:text-left">
        <h2 className="text-lg font-bold text-tft-text">Tutor For Test</h2>
        <p className="mt-2 text-sm text-tft-muted">
          Learn from students who have already mastered your unit.
        </p>
        <p className="mt-5 text-xs leading-relaxed text-tft-muted">
          Frontend demonstration only. Tutor verification, bookings, messaging,
          ratings, and payments are simulated.
        </p>
        <p className="mt-2 text-xs leading-relaxed text-tft-muted">
          Tutors must not complete assessed work for students.
        </p>
      </div>
    </footer>
  );
}
