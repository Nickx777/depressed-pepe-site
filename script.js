const reveals = document.querySelectorAll(".reveal");

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

const proofButton = document.getElementById("proof-btn");
const moodInput = document.getElementById("mood-input");
const proofOutput = document.getElementById("proof-output");

const toHex = (buffer) =>
  Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

const generateProof = async () => {
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

proofButton.addEventListener("click", generateProof);
moodInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    generateProof();
  }
});
