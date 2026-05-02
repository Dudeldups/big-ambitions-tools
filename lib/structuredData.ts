export function getStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Big Ambitions Tools",
    url: "https://big-ambitions-tools.com",
    applicationCategory: "GameApplication",
    operatingSystem: "Web",
    description:
      "Fan-made tools for Big Ambitions to plan factories, manage logistics and browse game data.",
    author: {
      "@type": "Person",
      name: "Dudeldups",
      sameAs: ["https://github.com/Dudeldups"],
    },
  };
}
