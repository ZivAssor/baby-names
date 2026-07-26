import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <h1 className="text-3xl font-bold">העמוד לא נמצא</h1>
      <p className="text-gray-600">
        אולי השם שחיפשתם לא קיים בנתוני הלמ״ס, או שהקישור שגוי.
      </p>
      <Link
        href="/names"
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        לעיון בכל השמות
      </Link>
    </div>
  );
}
