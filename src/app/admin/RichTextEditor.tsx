"use client";
import { useEffect, useRef } from "react";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: number;
};

export default function RichTextEditor({ value, onChange, placeholder = "İçerik", className = "", minHeight = 120 }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.innerHTML !== value) {
      el.innerHTML = value || "";
    }
  }, [value]);

  function exec(cmd: string, arg?: string) {
    document.execCommand(cmd, false, arg);
    handleInput();
  }

  function handleInput() {
    const el = ref.current;
    if (!el) return;
    onChange(el.innerHTML);
  }

  function addLink() {
    const url = window.prompt("Bağlantı URL'si:");
    if (url) exec("createLink", url);
  }

  function clearFormatting() {
    exec("removeFormat");
  }

  return (
    <div className={className}>
      <div className="mb-2 flex flex-wrap gap-2">
        <button type="button" onClick={() => exec("bold")} className="rounded border px-2 py-1 text-sm">B</button>
        <button type="button" onClick={() => exec("italic")} className="rounded border px-2 py-1 text-sm">I</button>
        <button type="button" onClick={() => exec("underline")} className="rounded border px-2 py-1 text-sm">U</button>
        <button type="button" onClick={() => exec("insertUnorderedList")} className="rounded border px-2 py-1 text-sm">• Liste</button>
        <button type="button" onClick={() => exec("insertOrderedList")} className="rounded border px-2 py-1 text-sm">1. Liste</button>
        <button type="button" onClick={() => exec("formatBlock", "H2")} className="rounded border px-2 py-1 text-sm">H2</button>
        <button type="button" onClick={() => exec("formatBlock", "H3")} className="rounded border px-2 py-1 text-sm">H3</button>
        <button type="button" onClick={addLink} className="rounded border px-2 py-1 text-sm">Bağlantı</button>
        <button type="button" onClick={clearFormatting} className="rounded border px-2 py-1 text-sm">Temizle</button>
      </div>
      <div
        ref={ref}
        role="textbox"
        aria-label={placeholder}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="min-h-[120px] w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
        style={{ minHeight }}
        data-placeholder={placeholder}
      />
    </div>
  );
}


