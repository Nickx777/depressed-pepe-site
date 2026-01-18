const reveals = document.querySelectorAll(".reveal");

if (reveals.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  reveals.forEach((el) => observer.observe(el));
}

const proofButton = document.getElementById("proof-btn");
const moodInput = document.getElementById("mood-input");
const proofOutput = document.getElementById("proof-output");

const toHex = (buffer) =>
  Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

const generateProof = async () => {
  if (!moodInput || !proofOutput) return;
  const mood = moodInput.value.trim();
  if (!mood) {
    proofOutput.textContent = "please enter a mood first";
    return;
  }
  proofOutput.textContent = "generating...";
  const data = new TextEncoder().encode(mood);
  const digest = await crypto.subtle.digest("SHA-256", data);
  proofOutput.textContent = `zk-tear:${toHex(digest)}`;
};

if (proofButton) {
  proofButton.addEventListener("click", generateProof);
}

if (moodInput) {
  moodInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      generateProof();
    }
  });
}

const copyButtons = document.querySelectorAll("[data-copy]");

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.getAttribute("data-copy");
    if (!value) return;
    await navigator.clipboard.writeText(value);
    const original = button.textContent;
    button.textContent = "Copied";
    setTimeout(() => {
      button.textContent = original;
    }, 1200);
  });
});
