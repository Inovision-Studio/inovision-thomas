import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';

function ContactForm() {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const successRef = useRef(null);
  useEffect(() => {
    if (status === "ok" && successRef.current) {
      successRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  }, [status]);
  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("submitting");
    setError("");
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json?.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("ok");
      try {
        form.reset();
      } catch {
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }
  if (status === "ok") {
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ref: successRef,
        className: "iv-contact-success",
        role: "status",
        "aria-live": "polite",
        children: [
          /* @__PURE__ */ jsx("div", { className: "iv-contact-success-check", "aria-hidden": "true", children: "✓" }),
          /* @__PURE__ */ jsx("h3", { children: "Message received." }),
          /* @__PURE__ */ jsx("p", { children: "Thanks for reaching out. We'll reply personally within one business day — usually within a few hours." }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "iv-contact-success-btn",
              onClick: () => setStatus("idle"),
              children: "Send another note"
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs("form", { className: "iv-form", onSubmit, noValidate: true, children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "cf-name", children: "Name" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          id: "cf-name",
          name: "name",
          type: "text",
          required: true,
          maxLength: 120,
          autoComplete: "name"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "cf-email", children: "Email" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          id: "cf-email",
          name: "email",
          type: "email",
          required: true,
          maxLength: 200,
          autoComplete: "email"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "cf-subject", children: "Subject" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          id: "cf-subject",
          name: "subject",
          type: "text",
          maxLength: 200,
          placeholder: "Vape shop site, smoke shop, $500 launch, etc."
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "cf-body", children: "Tell us about your project" }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          id: "cf-body",
          name: "body",
          required: true,
          maxLength: 4e3,
          placeholder: "A few sentences about your brand, audience, and what you need."
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        name: "website",
        tabIndex: -1,
        autoComplete: "off",
        style: { position: "absolute", left: "-9999px", opacity: 0 },
        "aria-hidden": "true"
      }
    ),
    /* @__PURE__ */ jsx("button", { type: "submit", disabled: status === "submitting", children: status === "submitting" ? "Sending…" : "Send Inquiry" }),
    status === "error" && /* @__PURE__ */ jsx("div", { className: "iv-form-error", role: "alert", children: error })
  ] });
}

export { ContactForm as C };
