import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import "./styles.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const features = {
  question: {
    icon: "◌",
    label: "Ask a question",
    caption: "Clear answers for curious minds",
    styles: [
      ["brief", "Brief answer"],
      ["detailed", "Detailed explanation"],
      ["teacher", "Teacher style"],
    ],
    placeholder: "What would you like to understand?",
  },
  summarize: {
    icon: "≡",
    label: "Summarize",
    caption: "Turn long text into key ideas",
    styles: [
      ["paragraph", "One paragraph"],
      ["bullets", "Bullet points"],
      ["eli5", "Explain simply"],
    ],
    placeholder: "Paste an article, notes, or any text to summarize...",
  },
  creative: {
    icon: "✦",
    label: "Create",
    caption: "Bring an idea to life",
    styles: [
      ["story", "Short story"],
      ["poem", "Poem"],
      ["sci_fi", "Science fiction"],
    ],
    placeholder: "Describe an idea, mood, character, or world...",
  },
  study: {
    icon: "⌁",
    label: "Study advice",
    caption: "Make a plan that sticks",
    styles: [
      ["motivational", "Motivational"],
      ["mentor", "Professional mentor"],
      ["step_by_step", "Step-by-step plan"],
    ],
    placeholder: "Tell me what you are studying and where you feel stuck...",
  },
};

function App() {
  const [functionName, setFunctionName] = useState("question");
  const [style, setStyle] = useState("brief");
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const selected = useMemo(() => features[functionName], [functionName]);

  useEffect(() => {
    try {
      const savedFeedback = window.localStorage.getItem("assistant-feedback");
      if (savedFeedback) {
        setFeedback(savedFeedback);
      }
    } catch (storageError) {
      console.warn("Unable to read feedback from local storage", storageError);
    }
  }, []);

  useEffect(() => {
    try {
      if (feedback) {
        window.localStorage.setItem("assistant-feedback", feedback);
      } else {
        window.localStorage.removeItem("assistant-feedback");
      }
    } catch (storageError) {
      console.warn("Unable to save feedback", storageError);
    }
  }, [feedback]);

  function selectFeature(key) {
    setFunctionName(key);
    setStyle(features[key].styles[0][0]);
    setError("");
  }

  async function generate(event) {
    event.preventDefault();
    if (!input.trim()) return setError("Add some text first — then I can help.");

    setLoading(true);
    setError("");
    setResponse("");
    setFeedback(null);

    try {
      const { data } = await axios.post(`${API_URL}/generate`, {
        function: functionName,
        prompt_style: style,
        user_input: input,
      });
      setResponse(data.response);
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          "Unable to connect to the assistant. Is the backend running?"
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyResponse() {
    await navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  function clearAll() {
    setInput("");
    setResponse("");
    setError("");
    setFeedback(null);
  }

  function handleFeedback(choice) {
    setFeedback(choice);
  }

  return (
    <main className="min-h-screen bg-[#f8f3e8] text-[#264437] selection:bg-[#b9d9b6]">
      <nav className="border-b border-[#d9e3cc] bg-[#fcf8ef]/90 px-5 py-4 backdrop-blur md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#39704e] text-xl font-bold text-[#fffaf0] shadow-sm">
              A
            </span>
            <span className="font-sans text-base font-semibold tracking-tight text-[#264437]">
              AI{" "}
              <span className="font-normal text-[#67806c]">ASSISTANT</span>
            </span>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-5 pb-16 pt-14 md:px-10 md:pt-20">
        <div className="mb-11 max-w-3xl">
          <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#5d8467]">
            A quieter way to think
          </p>
          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-[#244034] md:text-6xl">
            A helpful second mind,
            <br />
            <span className="italic text-[#4d7b57]">without the clutter.</span>
          </h1>
          <p className="mt-5 max-w-xl font-sans text-base leading-7 text-[#63766a] md:text-lg">
            Choose a task, set the tone, and shape an answer that feels useful from the first draft.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[255px_1fr]">
          <aside className="rounded-2xl border border-[#dce6d2] bg-[#f0f5e9] p-3 shadow-[0_18px_45px_rgba(80,105,72,0.08)]">
            <p className="px-3 pb-2 pt-1 font-sans text-xs font-semibold uppercase tracking-wider text-[#79907c]">
              Your workspace
            </p>

            {Object.entries(features).map(([key, item]) => (
              <button
                key={key}
                type="button"
                onClick={() => selectFeature(key)}
                className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                  functionName === key
                    ? "bg-[#3f7653] text-[#fffaf0] shadow-md shadow-[#66836b]/25"
                    : "text-[#3e5c49] hover:bg-[#e2edda]"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>
                  <span className="block font-sans text-sm font-semibold">
                    {item.label}
                  </span>
                  <span
                    className={`block font-sans text-xs ${
                      functionName === key ? "text-[#e5f0dc]" : "text-[#78907c]"
                    }`}
                  >
                    {item.caption}
                  </span>
                </span>
              </button>
            ))}
          </aside>

          <section className="rounded-2xl border border-[#e2dccd] bg-[#fffdf7] p-5 shadow-[0_18px_45px_rgba(90,77,48,0.08)] md:p-7">
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-2xl font-bold text-[#294536]">
                  {selected.label}
                </h2>
                <p className="mt-1 font-sans text-sm text-[#768074]">
                  Pick an approach, then tell me what you need.
                </p>
              </div>

              <button
                type="button"
                onClick={clearAll}
                className="self-start font-sans text-sm text-[#718071] transition hover:text-[#315f42] sm:self-auto"
              >
                Clear workspace
              </button>
            </div>

            <form onSubmit={generate}>
              <div className="mb-5 flex flex-wrap gap-2">
                {selected.styles.map(([key, label]) => (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setStyle(key)}
                    className={`rounded-full border px-4 py-2 font-sans text-sm transition ${
                      style === key
                        ? "border-[#74a87c] bg-[#e7f1e0] text-[#315e40]"
                        : "border-[#ddd9cc] text-[#66756a] hover:border-[#9ab79a] hover:text-[#3d6549]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <label
                className="mb-2 block font-sans text-sm font-medium text-[#4d6053]"
                htmlFor="prompt"
              >
                What’s on your mind?
              </label>

              <textarea
                id="prompt"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                maxLength={12000}
                rows="8"
                placeholder={selected.placeholder}
                className="w-full resize-y rounded-xl border border-[#dedacf] bg-[#fdfaf2] p-4 font-sans leading-6 text-[#32483a] outline-none placeholder:text-[#9ba397] focus:border-[#75a479] focus:ring-2 focus:ring-[#b9d9b6]/50"
              />

              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="font-sans text-xs text-[#899488]">
                  {input.length.toLocaleString()} / 12,000
                </span>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#3f7653] px-5 py-3 font-sans text-sm font-semibold text-[#fffdf7] shadow-lg shadow-[#789779]/25 transition hover:bg-[#326343] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading && <span className="spinner" />}
                  {loading ? "Thinking…" : "Create response"}
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </form>

            {error && (
              <div
                role="alert"
                className="mt-5 rounded-xl border border-[#e5bfb7] bg-[#fff0eb] px-4 py-3 font-sans text-sm text-[#9a4438]"
              >
                {error}
              </div>
            )}

            {(response || loading) && (
              <div className="mt-7 overflow-hidden rounded-xl border border-[#dce4d3] bg-[#f5f8ef]">
                <div className="flex items-center justify-between border-b border-[#dce4d3] px-5 py-3">
                  <span className="font-sans text-sm font-semibold text-[#3c5945]">
                    Your response
                  </span>
                  {response && (
                    <button
                      type="button"
                      onClick={copyResponse}
                      className="font-sans text-xs font-medium text-[#3d7650] hover:text-[#204d30]"
                    >
                      {copied ? "Copied" : "Copy response"}
                    </button>
                  )}
                </div>

                <div className="whitespace-pre-wrap px-5 py-5 font-sans text-sm leading-7 text-[#455c4b]">
                  {loading ? (
                    <span className="inline-flex items-center gap-2 text-[#718071]">
                      <span className="spinner" />
                      Putting this together…
                    </span>
                  ) : (
                    response
                  )}
                </div>

                {response && (
                  <div className="border-t border-[#dce4d3] px-5 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-sans text-sm text-[#647165]">
                        {feedback === "helpful"
                          ? "That means a lot — thanks for telling me."
                          : feedback === "needs-work"
                          ? "Thanks for the note — I’ll keep refining."
                          : "How did this feel to you?"}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleFeedback("helpful")}
                        aria-pressed={feedback === "helpful"}
                        className={`rounded-full px-3 py-2 font-sans text-sm transition ${
                          feedback === "helpful"
                            ? "bg-[#3f7653] text-[#fffdf7]"
                            : "bg-white text-[#3b5a42] hover:bg-[#e8f0e1]"
                        }`}
                      >
                        😊 Yes — that helped
                      </button>

                      <button
                        type="button"
                        onClick={() => handleFeedback("needs-work")}
                        aria-pressed={feedback === "needs-work"}
                        className={`rounded-full px-3 py-2 font-sans text-sm transition ${
                          feedback === "needs-work"
                            ? "bg-[#6f6b5a] text-[#fffdf7]"
                            : "bg-white text-[#5f5748] hover:bg-[#f2e9d8]"
                        }`}
                      >
                        🫶 Needs a better draft
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </section>

      <footer className="border-t border-[#dedecf] px-5 py-6 text-center font-sans text-xs text-[#768276]">
        AI ASSISTANT · A focused AI workspace · Feedback stays in your local SQLite database.
      </footer>
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);