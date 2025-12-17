<Button
  onClick={async () => {
    const res = await fetch("/api/checkout", { method: "POST" });
    const data = await res.json();
    window.location.href = data.url;
  }}
  className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-lg font-semibold"
>
  Pay $5 & Continue
</Button>
